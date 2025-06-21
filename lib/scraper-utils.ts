import { CONFIG } from './config';

// Use the same API token as in apify-service.ts
const APIFY_API_TOKEN = 'apify_api_ZrZ68W91FaRzCHSFiVEOZWNdH5facG0eeFRQ';

// Utility function to create a new scraper with proper async handling
export function createScraper(
  platformName: string,
  actorId: string,
  defaultChunkSize: number = CONFIG.CHUNK_SIZE
) {
  return async function(config: any) {
    console.log(`Starting ${platformName} scraping with config:`, config);

    try {
      const data = await makeChunkedApiCall(
        actorId,
        config,
        defaultChunkSize
      );
      
      console.log(`${platformName} scraping successful, got data:`, data);
      return data;
    } catch (error) {
      console.error(`${platformName} scraping error:`, error);
      
      // Standard error handling for all platforms
      if (error instanceof Error) {
        if (error.message.includes('timed out')) {
          throw new Error(`${platformName} scraping timed out. This can happen due to rate limiting or Apify's 5-minute timeout limit. Try reducing maxPosts or try again later.`);
        } else if (error.message.includes('403') || error.message.includes('401')) {
          throw new Error(`${platformName} scraping failed due to access restrictions. The content may be private or require authentication.`);
        } else if (error.message.includes('404')) {
          throw new Error(`${platformName} content not found. Please check the provided identifier.`);
        } else if (error.message.includes('Apify run failed')) {
          throw new Error(`Apify service failed: ${error.message}. This may be due to anti-scraping measures.`);
        }
      }
      
      throw error;
    }
  };
}

// Utility function to create data processor
export function createDataProcessor(platformName: string) {
  return function(data: any[]) {
    return data.map(item => ({
      platform: platformName,
      content: item.text || item.content || item.description || item.postText || 'No content available',
      author: item.author || item.user || item.creator || item.ownerUsername || 'Unknown',
      timestamp: item.timestamp || item.created_at || item.date || item.created_time || Date.now(),
      url: item.url || item.link || item.permalink || item.postUrl || '',
      engagement: {
        likes: item.likes || item.likeCount || item.favouriteCount || 0,
        comments: item.comments || item.commentCount || item.replyCount || 0,
        shares: item.shares || item.shareCount || item.repostCount || 0
      },
      sentiment: item.sentiment || 'neutral',
      sentimentScore: item.sentimentScore || 0.5,
      keyTopics: item.keyTopics || [],
      engagementQuality: item.engagementQuality || 'low',
      insights: item.insights || '',
      ...item // Keep original data
    }));
  };
}

// Helper function to delay execution
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper function to make async API calls with polling
async function makeAsyncApiCall(
  actorId: string,
  input: any,
  maxWaitTime: number = 300000 // 5 minutes
): Promise<any[]> {
  console.log(`Starting async API call for actor: ${actorId}`);
  
  // 1. Start the run
  const runResponse = await fetch(
    `https://api.apify.com/v2/acts/${actorId}/runs?token=${APIFY_API_TOKEN}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input })
    }
  );

  if (!runResponse.ok) {
    const errorData = await runResponse.json().catch(() => ({}));
    throw new Error(`Failed to start Apify run: ${runResponse.statusText} - ${JSON.stringify(errorData)}`);
  }

  const run = await runResponse.json();
  const runId = run.data.id;
  
  console.log(`Apify run started with ID: ${runId}`);

  // 2. Poll for completion
  let completed = false;
  let attempts = 0;
  const maxAttempts = Math.floor(maxWaitTime / CONFIG.POLL_INTERVAL);
  
  while (!completed && attempts < maxAttempts) {
    await delay(CONFIG.POLL_INTERVAL);
    
    const statusResponse = await fetch(
      `https://api.apify.com/v2/acts/${actorId}/runs/${runId}?token=${APIFY_API_TOKEN}`
    );
    
    if (!statusResponse.ok) {
      throw new Error(`Failed to get run status: ${statusResponse.statusText}`);
    }
    
    const status = await statusResponse.json();
    console.log(`Run ${runId} status: ${status.data.status} (attempt ${attempts + 1}/${maxAttempts})`);
    
    if (status.data.status === 'SUCCEEDED') {
      completed = true;
    } else if (status.data.status === 'FAILED') {
      throw new Error(`Apify run failed: ${status.data.meta?.errorMessage || 'Unknown error'}`);
    } else if (status.data.status === 'ABORTED') {
      throw new Error('Apify run was aborted');
    }
    
    attempts++;
  }
  
  if (!completed) {
    throw new Error(`Apify run timed out after ${maxWaitTime / 1000} seconds`);
  }
  
  console.log(`Apify run ${runId} completed successfully`);

  // 3. Get results
  const datasetResponse = await fetch(
    `https://api.apify.com/v2/acts/${actorId}/runs/${runId}/dataset/items?token=${APIFY_API_TOKEN}`
  );
  
  if (!datasetResponse.ok) {
    throw new Error(`Failed to get dataset items: ${datasetResponse.statusText}`);
  }
  
  const data = await datasetResponse.json();
  console.log(`Retrieved ${data.length} items from dataset`);
  
  return data || [];
}

// Helper function to chunk large requests
async function makeChunkedApiCall(
  actorId: string,
  input: any,
  chunkSize: number = CONFIG.CHUNK_SIZE
): Promise<any[]> {
  const maxPosts = input.maxPosts || input.resultsCount || 200;
  
  if (maxPosts <= chunkSize) {
    // No chunking needed
    return await makeAsyncApiCall(actorId, input);
  }
  
  console.log(`Chunking request: ${maxPosts} posts into chunks of ${chunkSize}`);
  
  const chunks = [];
  for (let i = 0; i < maxPosts; i += chunkSize) {
    chunks.push({
      start: i,
      end: Math.min(i + chunkSize, maxPosts)
    });
  }
  
  const allResults = [];
  
  // Process chunks sequentially to avoid overwhelming Apify
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`Processing chunk ${i + 1}/${chunks.length}: ${chunk.start}-${chunk.end}`);
    
    try {
      const chunkInput = {
        ...input,
        maxPosts: chunk.end - chunk.start,
        offset: chunk.start
      };
      
      const chunkResults = await makeAsyncApiCall(actorId, chunkInput);
      allResults.push(...chunkResults);
      
      console.log(`Chunk ${i + 1} completed: ${chunkResults.length} items`);
      
      // Add delay between chunks to avoid rate limiting
      if (i < chunks.length - 1) {
        await delay(CONFIG.CHUNK_DELAY);
      }
      
    } catch (error) {
      console.error(`Chunk ${i + 1} failed:`, error);
      // Continue with other chunks instead of failing completely
    }
  }
  
  console.log(`Chunked request completed: ${allResults.length} total items`);
  return allResults;
}

// Example usage for new scrapers:
/*
// In apify-service.ts
import { createScraper, createDataProcessor } from './scraper-utils';

// Create YouTube scraper
const scrapeYouTube = createScraper('YouTube', 'actor-id~youtube-scraper', 30);
const processYouTubeData = createDataProcessor('youtube');

static async scrapeYouTubePosts(config: ApifyScraperConfig) {
  const youtubeHandle = config.socialHandles?.youtube;
  
  if (!youtubeHandle) {
    console.warn('No YouTube handle provided, skipping YouTube scraping');
    return [];
  }
  
  const input = {
    channelUrl: `https://www.youtube.com/${youtubeHandle}`,
    maxPosts: Math.min(config.maxPosts || CONFIG.MAX_POSTS_PER_PLATFORM, CONFIG.MAX_POSTS_PER_PLATFORM)
  };

  const data = await scrapeYouTube(input);
  return processYouTubeData(data);
}
*/ 