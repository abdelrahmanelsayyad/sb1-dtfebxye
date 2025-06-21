import { CONFIG, getPlatformTimeout, calculateRetryDelay } from './config';

const APIFY_API_TOKEN = 'apify_api_ZrZ68W91FaRzCHSFiVEOZWNdH5facG0eeFRQ';

export interface ApifyScraperConfig {
  query?: string;
  keywords?: string[];
  resultsCount?: number;
  timeWindow?: number;
  maxPosts?: number;
  maxComments?: number;
  platforms?: string[];
  // Platform-specific result limits
  twitterResultsLimit?: number; // 1-200
  instagramResultsLimit?: number; // 1-200
  redditResultsLimit?: number; // 1-200
  facebookResultsLimit?: number; // 1-200
  tiktokResultsLimit?: number; // 1-200
  // Time range in months
  timeRangeMonths?: number; // 1, 2, or 3 months
  socialHandles?: Record<string, string> & {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    reddit?: string;
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
      body: JSON.stringify(input)
    }
  );

  if (!runResponse.ok) {
    const errorData = await runResponse.json().catch(() => ({}));
    throw new Error(`Failed to start Apify run: ${runResponse.statusText} - ${JSON.stringify(errorData)}`);
  }

  const run = await runResponse.json();
  const runId = run.data.id;
  const datasetId = run.data.defaultDatasetId;
  
  console.log(`Apify run started with ID: ${runId} and Dataset ID: ${datasetId}`);

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
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_API_TOKEN}`
  );
  
  if (!datasetResponse.ok) {
    if (datasetResponse.status === 404) {
      console.log(`Dataset not found for run ${runId}, returning empty results`);
      return [];
    }
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
  const maxPosts = input.maxPosts || input.resultsCount || input.resultsLimit || 200;
  
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
      // Create chunk input based on actor type
      let chunkInput;
      
      if (actorId === 'apify~instagram-scraper') {
        // Instagram scraper
        chunkInput = {
          ...input,
          resultsLimit: chunk.end - chunk.start,
          offset: chunk.start
        };
      } else {
        // Default for other scrapers (Twitter, Reddit, etc.)
        chunkInput = {
          ...input,
          maxPosts: chunk.end - chunk.start,
          resultsCount: chunk.end - chunk.start,
          offset: chunk.start
        };
      }
      
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

export class ApifyService {
  // X (Twitter) Posts Search with async API
  static async scrapeTwitterPosts(config: ApifyScraperConfig) {
    const query = (config.keywords && config.keywords.length > 0) ? config.keywords[0] : '';
    
    if (!query || query.trim() === '') {
      console.warn('No query provided for Twitter scraping, skipping');
      return [];
    }
    
    const truncatedQuery = query.substring(0, 30); // Ensure 30 char limit
    
    // Use platform-specific limit or fallback to default
    const resultsLimit = Math.min(
      config.twitterResultsLimit || config.resultsCount || CONFIG.MAX_RESULTS_COUNT, 
      200
    );
    
    // Calculate time window based on months (30 days per month)
    const timeWindow = config.timeRangeMonths ? config.timeRangeMonths * 30 : (config.timeWindow || 30);
    
    const input = {
      query: truncatedQuery,
      resultsCount: resultsLimit,
      searchType: "latest",
      timeWindow: timeWindow
    };

    console.log('Starting Twitter scraping with config:', { 
      query: truncatedQuery, 
      resultsCount: input.resultsCount,
      timeWindow: input.timeWindow,
      timeRangeMonths: config.timeRangeMonths
    });

    try {
      const data = await makeChunkedApiCall(
        'scraper_one~x-posts-search',
        input,
        50 // Standard chunk size for Twitter
      );
      
      console.log('Twitter scraping successful, got data:', data);
      return this.processTwitterData(data);
    } catch (error) {
      console.error('Twitter scraping error:', error);
      
      // Provide specific error messages for Twitter scraping issues
      if (error instanceof Error) {
        if (error.message.includes('timed out')) {
          throw new Error(`Twitter scraping timed out. This can happen due to Twitter's rate limiting or Apify's 5-minute timeout limit. Try reducing resultsCount or try again later.`);
        } else if (error.message.includes('403') || error.message.includes('401')) {
          throw new Error(`Twitter scraping failed due to access restrictions. The query may be blocked or require authentication.`);
        } else if (error.message.includes('Apify run failed')) {
          throw new Error(`Apify service failed: ${error.message}. This may be due to Twitter's anti-scraping measures.`);
        }
      }
      
      throw error;
    }
  }

  // Instagram Scraper with async API
  static async scrapeInstagramPosts(config: ApifyScraperConfig) {
    console.log('Starting Instagram scraping with config:', config);
    const instagramHandle = config.socialHandles?.instagram;
    
    // Use platform-specific limit or fallback to default
    const resultsLimit = Math.min(
      config.instagramResultsLimit || config.maxPosts || CONFIG.MAX_POSTS_PER_PLATFORM, 
      200
    );
    
    // Calculate time range string based on months
    const timeRangeString = config.timeRangeMonths ? `${config.timeRangeMonths} month${config.timeRangeMonths > 1 ? 's' : ''}` : "1 month";
    
    if (instagramHandle) {
      // Profile scraping
      const input = {
        addParentData: false,
        directUrls: [`https://www.instagram.com/${instagramHandle.replace('@', '')}/`],
        enhanceUserSearchWithFacebookPage: false,
        isUserReelFeedURL: false,
        isUserTaggedFeedURL: false,
        onlyPostsNewerThan: timeRangeString,
        resultsLimit: resultsLimit,
        resultsType: "posts"
      };

      console.log('Instagram input for profile scraping:', { 
        ...input, 
        timeRangeMonths: config.timeRangeMonths,
        resultsLimit: input.resultsLimit
      });

      try {
        const data = await makeChunkedApiCall(
          'apify~instagram-scraper',
          input,
          40 // Smaller chunks for Instagram due to complexity
        );
        
        console.log('Instagram scraping successful, got data:', data);
        return this.processInstagramData(data);
      } catch (error) {
        console.error('Instagram scraping error:', error);
        
        // Provide specific error messages for Instagram scraping issues
        if (error instanceof Error) {
          if (error.message.includes('timed out')) {
            throw new Error(`Instagram scraping timed out. This can happen due to Instagram's rate limiting, the profile being too large, or Apify's 5-minute timeout limit. Try reducing maxPosts or try again later.`);
          } else if (error.message.includes('403') || error.message.includes('401')) {
            throw new Error(`Instagram scraping failed due to access restrictions. The Instagram profile may be private or require authentication.`);
          } else if (error.message.includes('404')) {
            throw new Error(`Instagram profile not found. Please check the Instagram handle: ${instagramHandle}`);
          } else if (error.message.includes('Failed to get dataset items')) {
            throw new Error(`Instagram scraping completed but no data was found. The profile may be private, have no posts, or the scraping was blocked.`);
          } else if (error.message.includes('Apify run failed')) {
            throw new Error(`Apify service failed: ${error.message}. This may be due to Instagram's anti-scraping measures.`);
          }
        }
        
        throw error;
      }
    } else {
      // Hashtag search
      const searchQuery = (config.keywords && config.keywords.length > 0) ? config.keywords[0] : '';
      
      if (!searchQuery || searchQuery.trim() === '') {
        console.warn('No search query provided for Instagram hashtag search, skipping');
        return [];
      }
      
      console.log('Scraping Instagram by hashtag/keyword:', searchQuery);
      const input = {
        addParentData: false,
        enhanceUserSearchWithFacebookPage: false,
        isUserReelFeedURL: false,
        isUserTaggedFeedURL: false,
        onlyPostsNewerThan: timeRangeString,
        resultsLimit: resultsLimit,
        resultsType: "posts",
        search: searchQuery,
        searchLimit: resultsLimit,
        searchType: "hashtag"
      };

      console.log('Instagram input for hashtag search:', { 
        ...input, 
        timeRangeMonths: config.timeRangeMonths,
        resultsLimit: input.resultsLimit
      });

      try {
        const data = await makeChunkedApiCall(
          'apify~instagram-scraper',
          input,
          40 // Smaller chunks for Instagram hashtag search
        );
        
        console.log('Instagram scraping successful, got data:', data);
        return this.processInstagramData(data);
      } catch (error) {
        console.error('Instagram scraping error:', error);
        
        // Provide specific error messages for Instagram hashtag search issues
        if (error instanceof Error) {
          if (error.message.includes('timed out')) {
            throw new Error(`Instagram hashtag search timed out. This can happen due to Instagram's rate limiting or Apify's 5-minute timeout limit. Try reducing maxPosts or try again later.`);
          } else if (error.message.includes('403') || error.message.includes('401')) {
            throw new Error(`Instagram hashtag search failed due to access restrictions. The hashtag may be blocked or require authentication.`);
          } else if (error.message.includes('Failed to get dataset items')) {
            throw new Error(`Instagram hashtag search completed but no data was found. The hashtag may not exist or have no recent posts.`);
          } else if (error.message.includes('Apify run failed')) {
            throw new Error(`Apify service failed: ${error.message}. This may be due to Instagram's anti-scraping measures.`);
          }
        }
        
        throw error;
      }
    }
  }

  // Reddit Scraper Lite with async API
  static async scrapeRedditPosts(config: ApifyScraperConfig) {
    // Use platform-specific limit or fallback to default
    const resultsLimit = Math.min(
      config.redditResultsLimit || config.resultsCount || CONFIG.MAX_RESULTS_COUNT, 
      200
    );
    
    const input = {
      debugMode: false,
      ignoreStartUrls: false,
      includeNSFW: false,
      maxComments: Math.min(config.maxComments || CONFIG.MAX_COMMENTS_PER_POST, CONFIG.MAX_COMMENTS_PER_POST),
      maxCommunitiesCount: 2,
      maxItems: resultsLimit,
      maxPostCount: resultsLimit,
      maxUserCount: 2,
      proxy: {
        useApifyProxy: true,
        apifyProxyGroups: ["RESIDENTIAL"]
      },
      scrollTimeout: 40,
      searchComments: true,
      searchCommunities: true,
      searchPosts: true,
      searchUsers: false,
      searches: config.keywords || [],
      skipComments: false,
      skipCommunity: false,
      skipUserPosts: false,
      sort: "relevance",
      time: "month"
    };

    console.log('Starting Reddit scraping with config:', { 
      keywords: config.keywords, 
      maxPosts: input.maxPostCount,
      resultsLimit: input.maxItems
    });

    try {
      const data = await makeChunkedApiCall(
        'trudax~reddit-scraper-lite',
        input,
        60 // Larger chunks for Reddit as it's generally faster
      );
      
      console.log('Reddit scraping successful, got data:', data);
      return this.processRedditData(data);
    } catch (error) {
      console.error('Reddit scraping error:', error);
      
      // Provide specific error messages for Reddit scraping issues
      if (error instanceof Error) {
        if (error.message.includes('timed out')) {
          throw new Error(`Reddit scraping timed out. This can happen due to Reddit's rate limiting or Apify's 5-minute timeout limit. Try reducing maxPosts or try again later.`);
        } else if (error.message.includes('403') || error.message.includes('401')) {
          throw new Error(`Reddit scraping failed due to access restrictions. The subreddit may be private or require authentication.`);
        } else if (error.message.includes('Apify run failed')) {
          throw new Error(`Apify service failed: ${error.message}. This may be due to Reddit's anti-scraping measures.`);
        }
      }
      
      throw error;
    }
  }

  // TikTok Comments Scraper with Social Media Sentiment Analysis Tool
  static async scrapeTikTokPosts(config: ApifyScraperConfig) {
    const tiktokHandle = config.socialHandles?.tiktok;
    
    if (!tiktokHandle) {
      console.warn('No TikTok handle provided, skipping TikTok scraping');
      return [];
    }
    
    // Extract profile name from handle (remove @ if present)
    const profileName = tiktokHandle.replace('@', '');
    
    // Use platform-specific limit or fallback to default
    const resultsLimit = Math.min(
      config.tiktokResultsLimit || config.maxPosts || CONFIG.MAX_POSTS_PER_PLATFORM, 
      200
    );
    
    // Social Media Sentiment Analysis Tool input for TikTok
    const input = {
      latestComments: 10, // Static value as requested
      latestPosts: resultsLimit,
      tiktokProfileName: profileName,
      scrapeFacebook: false,
      scrapeInstagram: false,
      scrapeTiktok: true,
      sentimentAnalysis: false // We'll handle sentiment analysis separately if needed
    };

    console.log('Starting TikTok comments scraping with config:', { 
      profileName, 
      latestComments: input.latestComments, 
      latestPosts: input.latestPosts,
      resultsLimit: resultsLimit
    });

    try {
      const data = await makeAsyncApiCall(
        'tri_angle~social-media-sentiment-analysis-tool',
        input,
        300000 // 5 minutes timeout
      );
      
      console.log('TikTok comments scraping successful, got data:', data);
      return this.processTikTokCommentsData(data);
    } catch (error) {
      console.error('TikTok comments scraping error:', error);
      
      // Provide specific error messages for TikTok comments scraping issues
      if (error instanceof Error) {
        if (error.message.includes('timed out')) {
          throw new Error(`TikTok comments scraping timed out. This can happen due to TikTok's rate limiting or the profile being too large. Try reducing latestComments/latestPosts or try again later.`);
        } else if (error.message.includes('403') || error.message.includes('401')) {
          throw new Error(`TikTok comments scraping failed due to access restrictions. The TikTok profile may be private or require authentication.`);
        } else if (error.message.includes('404')) {
          throw new Error(`TikTok profile not found. Please check the TikTok handle: ${tiktokHandle}`);
        } else if (error.message.includes('Apify run failed')) {
          throw new Error(`Apify service failed: ${error.message}. This may be due to TikTok's anti-scraping measures.`);
        }
      }
      
      throw error;
    }
  }

  // Facebook Comments Scraper with Social Media Sentiment Analysis Tool
  static async scrapeFacebookPosts(config: ApifyScraperConfig) {
    const facebookHandle = config.socialHandles?.facebook;
    
    if (!facebookHandle) {
      console.warn('No Facebook handle provided, skipping Facebook scraping');
      return [];
    }
    
    // Extract profile name from handle (remove @ if present)
    const profileName = facebookHandle.replace('@', '');
    
    // Use platform-specific limit or fallback to default
    const resultsLimit = Math.min(
      config.facebookResultsLimit || config.maxPosts || CONFIG.MAX_POSTS_PER_PLATFORM, 
      200
    );
    
    // Social Media Sentiment Analysis Tool input
    const input = {
      latestComments: 10, // Static value as requested
      latestPosts: resultsLimit,
      facebookProfileName: profileName,
      scrapeFacebook: true,
      scrapeInstagram: false,
      scrapeTiktok: false,
      sentimentAnalysis: false // We'll handle sentiment analysis separately if needed
    };

    console.log('Starting Facebook comments scraping with config:', { 
      profileName, 
      latestComments: input.latestComments, 
      latestPosts: input.latestPosts,
      resultsLimit: resultsLimit
    });

    try {
      const data = await makeAsyncApiCall(
        'tri_angle~social-media-sentiment-analysis-tool',
        input,
        300000 // 5 minutes timeout
      );
      
      console.log('Facebook comments scraping successful, got data:', data);
      return this.processFacebookCommentsData(data);
    } catch (error) {
      console.error('Facebook comments scraping error:', error);
      
      // Provide specific error messages for Facebook comments scraping issues
      if (error instanceof Error) {
        if (error.message.includes('timed out')) {
          throw new Error(`Facebook comments scraping timed out. This can happen due to Facebook's rate limiting or the profile being too large. Try reducing latestComments/latestPosts or try again later.`);
        } else if (error.message.includes('403') || error.message.includes('401')) {
          throw new Error(`Facebook comments scraping failed due to access restrictions. The Facebook profile may be private or require authentication.`);
        } else if (error.message.includes('404')) {
          throw new Error(`Facebook profile not found. Please check the Facebook handle: ${facebookHandle}`);
        } else if (error.message.includes('Apify run failed')) {
          throw new Error(`Apify service failed: ${error.message}. This may be due to Facebook's anti-scraping measures.`);
        }
      }
      
      throw error;
    }
  }

  // Data processing functions
  static processTwitterData(data: any[]) {
    return data.map(item => ({
      platform: 'twitter',
      content: item.postText || item.text || item.full_text || 'No content available',
      author: item.author?.name || item.author?.screenName || item.user?.name || 'Unknown',
      timestamp: item.timestamp || item.created_at || Date.now(),
      url: item.postUrl || item.url || '',
      engagement: {
        likes: item.favouriteCount || item.likeCount || 0,
        retweets: item.repostCount || item.retweetCount || 0,
        replies: item.replyCount || 0
      },
      sentiment: item.sentiment || 'neutral',
      sentimentScore: item.sentimentScore || 0.5,
      keyTopics: item.keyTopics || [],
      engagementQuality: item.engagementQuality || 'low',
      insights: item.insights || '',
      ...item // Keep original data
    }));
  }

  static processInstagramData(data: any[]) {
    const processedMentions = [];
    
    for (const post of data) {
      // Extract comments from the post
      const comments = post.latestComments || [];
      
      if (comments.length > 0) {
        // Create a separate mention for each comment
        for (const comment of comments) {
          processedMentions.push({
            platform: 'instagram',
            // Post information
            postId: post.id,
            postUrl: post.url,
            postCaption: post.caption || '',
            postTimestamp: post.timestamp,
            postType: post.type,
            postLikesCount: post.likesCount,
            postCommentsCount: post.commentsCount,
            // Comment information
            commentId: comment.id,
            commentText: comment.text,
            commentAuthor: comment.ownerUsername,
            commentTimestamp: comment.timestamp,
            commentLikesCount: comment.likesCount,
            commentRepliesCount: comment.repliesCount,
            // Additional metadata
            hashtags: post.hashtags || [],
            mentions: post.mentions || [],
            ownerUsername: post.ownerUsername,
            ownerFullName: post.ownerFullName
          });
        }
      } else {
        // If no comments, create a mention for the post itself
        processedMentions.push({
          platform: 'instagram',
          postId: post.id,
          postUrl: post.url,
          postCaption: post.caption || '',
          postTimestamp: post.timestamp,
          postType: post.type,
          postLikesCount: post.likesCount,
          postCommentsCount: post.commentsCount,
          commentId: null,
          commentText: null,
          commentAuthor: null,
          commentTimestamp: null,
          commentLikesCount: null,
          commentRepliesCount: null,
          hashtags: post.hashtags || [],
          mentions: post.mentions || [],
          ownerUsername: post.ownerUsername,
          ownerFullName: post.ownerFullName
        });
      }
    }
    
    return processedMentions;
  }

  static processRedditData(data: any[]) {
    return data.map(item => ({
      platform: 'reddit',
      content: item.text || item.body || item.title || 'No content available',
      author: item.author || item.user || 'Unknown',
      timestamp: item.timestamp || item.created_utc ? item.created_utc * 1000 : Date.now(),
      url: item.url || item.permalink ? `https://reddit.com${item.permalink}` : '',
      engagement: {
        upvotes: item.score || item.upvotes || 0,
        comments: item.num_comments || item.commentCount || 0
      },
      sentiment: item.sentiment || 'neutral',
      sentimentScore: item.sentimentScore || 0.5,
      keyTopics: item.keyTopics || [],
      engagementQuality: item.engagementQuality || 'low',
      insights: item.insights || '',
      ...item // Keep original data
    }));
  }

  static processTikTokCommentsData(data: any[]) {
    const processed = data.map(item => ({
      platform: 'tiktok', // Explicitly set platform instead of relying on targetPlatform
      profileName: item.profileName,
      profileUrl: item.profileUrl,
      postDescription: item.postDescription || item.videoDescription,
      postTimestamp: item.postTimestamp,
      commentText: item.commentText,
      commentAuthor: item.commentAuthor,
      postUrl: item.postUrl,
      commentTimestamp: item.commentTimestamp,
      commentLikesCount: item.commentLikesCount,
      repliesCount: item.repliesCount
    }));
    
    return processed;
  }

  static processFacebookCommentsData(data: any[]) {
    const processed = data.map(item => ({
      platform: 'facebook', // Explicitly set platform instead of relying on targetPlatform
      profileName: item.profileName,
      profileUrl: item.profileUrl,
      postDescription: item.postDescription,
      postTimestamp: item.postTimestamp,
      commentText: item.commentText,
      commentAuthor: item.commentAuthor,
      postUrl: item.postUrl,
      commentTimestamp: item.commentTimestamp,
      commentLikesCount: item.commentLikesCount,
      repliesCount: item.repliesCount
    }));
    
    return processed;
  }
}
