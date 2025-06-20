import { NextRequest, NextResponse } from 'next/server';
import { ApifyService } from '@/lib/apify-service';
import { LLMService } from '@/lib/llm-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      keywords, 
      platforms, 
      settings = {},
      generateReport = true,
      socialHandles = {}
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
    const allMentions = [];
    const errors = [];

    // Twitter/X scraping
    if (platforms.includes('twitter')) {
      try {
        const query = keywords[0] || '';
        const truncatedQuery = query.substring(0, 30);
        console.log(`Twitter query: "${query}" -> truncated to "${truncatedQuery}" (${truncatedQuery.length} chars)`);
        
        const twitterData = await ApifyService.scrapeTwitterPosts({
          keywords: [truncatedQuery], // Use truncated query
          resultsCount: Math.min(settings.resultsCount || 500, 200),
          timeWindow: settings.timeWindow || 30,
          socialHandles
        });
        allMentions.push(...twitterData);
      } catch (error) {
        errors.push(`Twitter: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Instagram scraping
    if (platforms.includes('instagram')) {
      try {
        const instagramData = await ApifyService.scrapeInstagramPosts({
          keywords,
          maxPosts: settings.maxPosts || 200,
          resultsCount: Math.min(settings.resultsCount || 200, 200),
          socialHandles
        });
        allMentions.push(...instagramData);
      } catch (error) {
        errors.push(`Instagram: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Reddit scraping
    if (platforms.includes('reddit')) {
      try {
        const redditData = await ApifyService.scrapeRedditPosts({
          keywords,
          maxPosts: settings.maxPosts || 200,
          maxComments: settings.maxComments || 50,
          resultsCount: Math.min(settings.resultsCount || 200, 200),
          socialHandles
        });
        allMentions.push(...redditData);
      } catch (error) {
        errors.push(`Reddit: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Facebook scraping
    if (platforms.includes('facebook')) {
      try {
        const facebookData = await ApifyService.scrapeFacebookPosts({
          keywords,
          maxPosts: settings.maxPosts || 200,
          socialHandles
        });
        allMentions.push(...facebookData);
      } catch (error) {
        errors.push(`Facebook: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Process collected data
    const processedData = processMentionsData(allMentions, keywords);

    // Enhance mentions with LLM analysis if we have mentions
    let enhancedMentions = allMentions;
    if (allMentions.length > 0) {
      try {
        console.log('Enhancing mentions with LLM analysis...');
        enhancedMentions = await LLMService.enhanceMentions(allMentions);
        console.log(`Enhanced ${enhancedMentions.length} mentions`);
      } catch (error) {
        console.error('Error enhancing mentions:', error);
        console.log('Continuing with original mentions without LLM enhancement');
        // Continue with original mentions if enhancement fails
        enhancedMentions = allMentions.map(mention => ({
          ...mention,
          // Ensure basic formatting is still applied
          timestamp: new Date(mention.timestamp),
          url: mention.url || '',
          hashtags: mention.hashtags || [],
          sentiment: (mention as any).sentiment || 'neutral',
          sentimentScore: (mention as any).sentimentScore || 0.5
        }));
      }
    }

    // Generate LLM reports if requested
    let reports = null;
    if (generateReport) {
      try {
        // Always generate reports, even with empty data
        reports = await LLMService.generateComprehensiveReport(processedData);
        console.log('Reports generated successfully:', Object.keys(reports));
      } catch (error) {
        console.error('Report generation error:', error);
        errors.push(`Report Generation: ${error instanceof Error ? error.message : 'Unknown error'}`);
        
        // Generate fallback reports even if LLM fails
        try {
          reports = await LLMService.generateComprehensiveReport({
            mentions: [],
            totalMentions: 0,
            platforms: [],
            sentiment: { positive: 0, negative: 0, neutral: 0 },
            hashtags: [],
            timeRange: 'Last 30 days',
            keywords
          });
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

  } catch (error) {
    console.error('Social listening API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function processMentionsData(mentions: any[], keywords: string[]) {
  // Calculate platform distribution
  const platformCounts = mentions.reduce((acc, mention) => {
    acc[mention.platform] = (acc[mention.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const platforms = Object.entries(platformCounts).map(([platform, count]) => ({
    platform,
    count: count as number
  }));

  // Calculate sentiment distribution
  const sentimentCounts = mentions.reduce((acc, mention) => {
    const sentiment = mention.sentiment || 'neutral';
    acc[sentiment] = (acc[sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Extract hashtags
  const hashtagCounts = mentions.reduce((acc, mention) => {
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
    mentions,
    totalMentions: mentions.length,
    platforms,
    sentiment: {
      positive: sentimentCounts.positive || 0,
      negative: sentimentCounts.negative || 0,
      neutral: sentimentCounts.neutral || 0
    },
    hashtags,
    timeRange: 'Last 30 days', // This should be configurable
    keywords
  };
} 