import { NextRequest, NextResponse } from 'next/server';
import { ApifyService } from '@/lib/apify-service';
import { LLMService } from '@/lib/llm-service';
import { CONFIG, getPlatformTimeout } from '@/lib/config';

// Configure timeout for the entire request
const REQUEST_TIMEOUT = 300000; // 5 minutes

// Mock mode for testing without external APIs
const MOCK_MODE = process.env.NODE_ENV === 'development' && process.env.MOCK_APIS === 'true';

export async function POST(request: NextRequest) {
  console.log('Social listening API called');
  
  try {
    // Create a timeout promise for the entire request
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout - social listening took too long')), CONFIG.REQUEST_TIMEOUT);
    });

    // Race between the actual processing and timeout
    const result = await Promise.race([
      processSocialListeningRequest(request),
      timeoutPromise
    ]);
    
    return result;
  } catch (error) {
    console.error('Social listening API error:', error);
    
    if (error instanceof Error && error.message.includes('timeout')) {
      return NextResponse.json(
        { 
          error: 'Request timeout - social listening took too long. Try reducing the number of platforms or posts to scrape.',
          details: error.message
        },
        { status: 408 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function processSocialListeningRequest(request: NextRequest) {
  console.log('Processing social listening request...');
  
  let body;
  try {
    body = await request.json();
    console.log('Request body parsed successfully:', JSON.stringify(body).substring(0, 200) + '...');
  } catch (error) {
    console.error('Failed to parse request body:', error);
    return NextResponse.json(
      { error: 'Invalid JSON in request body', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
  
  const { 
    name, 
    keywords, 
    platforms, 
    settings = {},
    generateReport = true,
    socialHandles = {},
    mockMode = MOCK_MODE,
    industry,
    brandKeywords,
    productKeywords,
    excludeKeywords
  } = body;

  if (!name || !keywords || !platforms) {
    return NextResponse.json(
      { error: 'Missing required fields: name, keywords, platforms' },
      { status: 400 }
    );
  }

  // Create campaign ID
  const campaignId = `campaign_${Date.now()}`;
  
  // Collect data from all platforms
  const allMentions: any[] = [];
  const errors: string[] = [];

  console.log(`Starting social listening campaign: ${name}`);
  console.log(`Platforms: ${platforms.join(', ')}`);
  console.log(`Keywords: ${keywords.join(', ')}`);
  console.log(`Mock mode: ${mockMode}`);

  if (mockMode) {
    // Generate mock data for testing
    console.log('Using mock mode - generating test data');
    allMentions.push(...generateMockMentions(keywords, platforms, settings));
  } else {
    // Process platforms with individual timeout handling
    const platformPromises: Promise<{ mentions: any[]; error: string | null }>[] = [];

    // Twitter/X scraping
    if (platforms.includes('twitter')) {
      const query = keywords[0] || '';
      if (query.trim()) {
        platformPromises.push(
          scrapePlatform('twitter', async () => {
            const truncatedQuery = query.substring(0, 30);
            console.log(`Twitter query: "${query}" -> truncated to "${truncatedQuery}" (${truncatedQuery.length} chars)`);
            
            return await ApifyService.scrapeTwitterPosts({
              keywords: [truncatedQuery],
              twitterResultsLimit: settings.twitterResultsLimit || settings.resultsCount || 200,
              timeRangeMonths: settings.timeRangeMonths,
              timeWindow: settings.timeWindow || 30,
              socialHandles
            });
          })
        );
      } else {
        console.log('Skipping Twitter scraping - no valid query provided');
      }
    }

    // Instagram scraping
    if (platforms.includes('instagram')) {
      const hasValidKeywords = keywords.some((k: string) => k.trim());
      const hasInstagramHandle = socialHandles?.instagram;
      
      if (hasValidKeywords || hasInstagramHandle) {
        platformPromises.push(
          scrapePlatform('instagram', async () => {
            return await ApifyService.scrapeInstagramPosts({
              keywords,
              instagramResultsLimit: settings.instagramResultsLimit || settings.maxPosts || 200,
              timeRangeMonths: settings.timeRangeMonths,
              socialHandles
            });
          })
        );
      } else {
        console.log('Skipping Instagram scraping - no valid keywords or Instagram handle provided');
      }
    }

    // Reddit scraping
    if (platforms.includes('reddit')) {
      const hasValidKeywords = keywords.some((k: string) => k.trim());
      
      if (hasValidKeywords) {
        platformPromises.push(
          scrapePlatform('reddit', async () => {
            return await ApifyService.scrapeRedditPosts({
              keywords,
              redditResultsLimit: settings.redditResultsLimit || settings.maxPosts || 200,
              maxComments: settings.maxComments || 50,
              socialHandles
            });
          })
        );
      } else {
        console.log('Skipping Reddit scraping - no valid keywords provided');
      }
    }

    // TikTok scraping
    if (platforms.includes('tiktok')) {
      const hasTikTokHandle = socialHandles?.tiktok;
      
      if (hasTikTokHandle) {
        platformPromises.push(
          scrapePlatform('tiktok', async () => {
            return await ApifyService.scrapeTikTokPosts({
              keywords,
              tiktokResultsLimit: settings.tiktokResultsLimit || settings.maxPosts || 200,
              socialHandles
            });
          })
        );
      } else {
        console.log('Skipping TikTok scraping - no TikTok handle provided');
      }
    }

    // Facebook scraping
    if (platforms.includes('facebook')) {
      const hasFacebookHandle = socialHandles?.facebook;
      
      if (hasFacebookHandle) {
        platformPromises.push(
          scrapePlatform('facebook', async () => {
            return await ApifyService.scrapeFacebookPosts({
              keywords,
              facebookResultsLimit: settings.facebookResultsLimit || settings.maxPosts || 200,
              socialHandles
            });
          })
        );
      } else {
        console.log('Skipping Facebook scraping - no Facebook handle provided');
      }
    }

    // Wait for all platform scraping to complete
    const platformResults = await Promise.allSettled(platformPromises);
    
    // Process results
    platformResults.forEach((result, index) => {
      const platform = platforms[index];
      if (result.status === 'fulfilled') {
        const { mentions, error } = result.value;
        if (error) {
          errors.push(`${platform}: ${error}`);
        } else {
          allMentions.push(...mentions);
          console.log(`${platform}: Successfully scraped ${mentions.length} mentions`);
        }
      } else {
        errors.push(`${platform}: ${result.reason instanceof Error ? result.reason.message : 'Unknown error'}`);
      }
    });
  }

  console.log(`Total mentions collected: ${allMentions.length}`);
  console.log(`Errors encountered: ${errors.length}`);

  // Enhance mentions with LLM analysis if we have mentions
  let enhancedMentions = allMentions;
  if (allMentions.length > 0 && !mockMode) {
    try {
      console.log('Enhancing mentions with LLM analysis...');
      const campaignContext = {
        brandName: name,
        industry: industry,
        brandKeywords: brandKeywords,
        productKeywords: productKeywords,
        excludeKeywords: excludeKeywords,
      };
      enhancedMentions = await LLMService.enhanceMentions(allMentions, campaignContext);
      console.log(`Enhanced ${enhancedMentions.length} mentions`);
    } catch (error) {
      console.error('Error enhancing mentions:', error);
      console.log('Continuing with original mentions and adding error info');
      // If enhancement fails, add error info to each mention
      enhancedMentions = allMentions.map(mention => ({
        ...mention,
        sentiment: null,
        sentimentScore: null,
        keyTopics: [],
        insights: 'LLM analysis service failed.',
        error: true,
      }));
    }
  }

  // Process collected data for reporting
  const processedData = processMentionsData(enhancedMentions, keywords);

  // Generate LLM reports if requested
  let reports = null;
  if (generateReport) {
    try {
      if (mockMode) {
        // Generate mock reports for testing
        reports = generateMockReports(processedData);
        console.log('Mock reports generated successfully');
      } else {
        // Always generate reports, even with empty data
        reports = await LLMService.generateComprehensiveReport(processedData);
        console.log('Reports generated successfully:', Object.keys(reports));
      }
    } catch (error) {
      console.error('Report generation error:', error);
      errors.push(`Report Generation: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Generate fallback reports even if LLM fails
      try {
        reports = generateMockReports(processedData);
        console.log('Fallback reports generated successfully');
      } catch (fallbackError) {
        console.error('Fallback report generation also failed:', fallbackError);
      }
    }
  }

  return NextResponse.json({
    success: true,
    campaignId,
    data: {
      totalMentions: enhancedMentions.length,
      mentions: enhancedMentions,
      processedData,
      reports,
      errors: errors.length > 0 ? errors : undefined
    }
  });
}

// Helper function to scrape a platform with timeout and error handling
async function scrapePlatform(platformName: string, scraperFunction: () => Promise<any[]>) {
  const platformTimeout = getPlatformTimeout(platformName);
  
  try {
    console.log(`Starting ${platformName} scraping...`);
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`${platformName} scraping timeout`)), platformTimeout);
    });
    
    const mentions = await Promise.race([
      scraperFunction(),
      timeoutPromise
    ]);
    
    console.log(`${platformName} scraping completed successfully`);
    return { mentions, error: null };
  } catch (error) {
    console.error(`${platformName} scraping failed:`, error);
    return { 
      mentions: [], 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

function processMentionsData(mentions: any[], keywords: string[]) {
  // Format mentions to ensure content is properly extracted for reports
  const formattedMentions = mentions.map(mention => {
    let content = mention.content || '';
    let author = mention.author || '';
    
    // Only format content if it's missing or empty
    if (!content || content === 'No content available') {
      // Handle different platform data structures
      if (mention.platform === 'facebook' || mention.platform === 'tiktok') {
        const postDesc = mention.postDescription || '';
        const commentText = mention.commentText || '';
        
        // Create more readable content format
        if (postDesc && commentText) {
          content = `Post: ${postDesc}\n\nComment: ${commentText}`;
        } else if (commentText) {
          content = commentText;
        } else if (postDesc) {
          content = postDesc;
        } else {
          content = 'No content available';
        }
        
        author = mention.commentAuthor || 'Unknown';
      } else if (mention.platform === 'instagram') {
        const postCaption = mention.postCaption || '';
        const commentText = mention.commentText || '';
        
        // Create more readable content format for Instagram
        if (postCaption && commentText) {
          content = `Post: ${postCaption}\n\nComment: ${commentText}`;
        } else if (commentText) {
          content = commentText;
        } else if (postCaption) {
          content = postCaption;
        } else {
          content = 'No content available';
        }
        
        author = mention.commentAuthor || mention.ownerUsername || 'Unknown';
      } else {
        content = mention.content || mention.text || mention.postText || '';
        author = mention.author || mention.user || 'Unknown';
      }
    }
    
    // Ensure author is set
    if (!author) {
      author = mention.author || mention.user || mention.commentAuthor || mention.ownerUsername || 'Unknown';
    }
    
    return {
      ...mention,
      content: content,
      author: author,
      // Ensure sentiment is available for reports
      sentiment: mention.sentiment || 'neutral',
      sentimentScore: mention.sentimentScore || 0.5
    };
  });

  // Calculate platform distribution
  const platformCounts = formattedMentions.reduce((acc, mention) => {
    const platform = mention.platform || 'unknown';
    acc[platform] = (acc[platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const platforms = Object.entries(platformCounts).map(([platform, count]) => ({
    platform,
    count: count as number
  }));

  // Calculate sentiment distribution
  const sentimentCounts = formattedMentions.reduce((acc, mention) => {
    // Treat null or undefined sentiment (due to error) as neutral for summary,
    // but the individual mention will still show the error.
    const sentiment = mention.sentiment || 'neutral'; 
    acc[sentiment] = (acc[sentiment] || 0) + 1;
    return acc;
  }, { positive: 0, negative: 0, neutral: 0 });

  // Extract hashtags
  const hashtagCounts = formattedMentions.reduce((acc, mention) => {
    const hashtags = mention.hashtags || [];
    hashtags.forEach((hashtag: string) => {
      acc[hashtag] = (acc[hashtag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const hashtags = Object.entries(hashtagCounts)
    .map(([hashtag, count]) => ({ hashtag, count: count as number }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  return {
    mentions: formattedMentions,
    totalMentions: formattedMentions.length,
    platforms,
    sentiment: sentimentCounts,
    hashtags,
    timeRange: 'Last 30 days', // This should be configurable
    keywords
  };
}

// Helper function to generate mock data for testing
function generateMockMentions(keywords: string[], platforms: string[], settings: any) {
  const mentions = [];
  const maxPosts = Math.min(settings.maxPosts || 10, 20);
  
  for (let i = 0; i < maxPosts; i++) {
    const platform = platforms[i % platforms.length];
    const keyword = keywords[i % keywords.length];
    
    mentions.push({
      platform,
      content: `This is a mock ${platform} post about ${keyword}. Great content! #${keyword} #test`,
      author: `user${i + 1}`,
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      url: `https://${platform}.com/post/${i + 1}`,
      engagement: {
        likes: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 20),
        shares: Math.floor(Math.random() * 10)
      },
      sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
      sentimentScore: Math.random(),
      hashtags: [keyword, 'test', 'mock'],
      keyTopics: [keyword, 'social media', 'testing'],
      engagementQuality: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      insights: `Mock insight about ${keyword}`
    });
  }
  
  return mentions;
}

// Helper function to generate mock reports
function generateMockReports(data: any) {
  return {
    summary: `## Social Media Listening Report: "${data.keywords.join(', ')}" Analysis

**Time Range:** ${data.timeRange}

### Executive Summary
This is a mock report generated for testing purposes. The system collected ${data.totalMentions} mentions across ${data.platforms.length} platforms.

### Key Findings
- Mock finding 1: ${data.keywords[0]} is trending
- Mock finding 2: Positive sentiment is ${data.sentiment.positive > data.sentiment.negative ? 'dominant' : 'lower than negative'}
- Mock finding 3: Platform distribution shows varied engagement

### Platform Performance
${data.platforms.map((p: any) => `- ${p.platform}: ${p.count} mentions`).join('\n')}

### Sentiment Overview
- Positive: ${data.sentiment.positive}
- Negative: ${data.sentiment.negative}
- Neutral: ${data.sentiment.neutral}`,

    sentiment: `## Sentiment Analysis Report

This is a mock sentiment analysis report for testing purposes.

### Overall Sentiment
- Positive mentions: ${data.sentiment.positive}
- Negative mentions: ${data.sentiment.negative}
- Neutral mentions: ${data.sentiment.neutral}

### Key Insights
- Mock sentiment insight 1
- Mock sentiment insight 2
- Mock sentiment insight 3`,

    trends: `## Trends Analysis Report

This is a mock trends report for testing purposes.

### Emerging Topics
- Mock trend 1: ${data.keywords[0]} discussions
- Mock trend 2: Platform-specific patterns
- Mock trend 3: Temporal analysis

### Key Trends
- Mock trend analysis 1
- Mock trend analysis 2
- Mock trend analysis 3`,

    recommendations: `## Recommendations Report

This is a mock recommendations report for testing purposes.

### Immediate Actions
- Mock action 1: Monitor ${data.keywords[0]} mentions
- Mock action 2: Engage with positive sentiment
- Mock action 3: Address negative feedback

### Strategic Recommendations
- Mock strategy 1: Content optimization
- Mock strategy 2: Platform-specific approach
- Mock strategy 3: Long-term planning`
  };
} 