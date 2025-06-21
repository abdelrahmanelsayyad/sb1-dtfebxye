import { CONFIG } from './config';

const OPENROUTER_API_KEY = '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';

export interface LLMConfig {
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface SocialListeningData {
  mentions: any[];
  totalMentions: number;
  platforms: { platform: string; count: number }[];
  sentiment: { positive: number; negative: number; neutral: number };
  hashtags: { hashtag: string; count: number }[];
  timeRange: string;
  keywords: string[];
}

export interface CampaignContext {
  brandName?: string;
  industry?: string;
  brandKeywords?: string[];
  productKeywords?: string[];
  excludeKeywords?: string[];
}

// Helper function to create a timeout promise
function createLLMTimeoutPromise(timeoutMs: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`LLM request timeout after ${timeoutMs}ms`)), timeoutMs);
  });
}

export class LLMService {
  static async generateReport(data: SocialListeningData, reportType: string, config: LLMConfig = {}) {
    const prompt = this.buildPrompt(data, reportType);
    
    try {
      console.log(`Generating ${reportType} report with Google Gemini 2.5 Flash...`);
      
      const response = await Promise.race([
        fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://sociallisten.app',
            'X-Title': 'SocialListen',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: 'You are a social media listening expert. Analyze social media data and provide insightful, actionable reports. Be concise, professional, and data-driven.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: config.maxTokens || CONFIG.LLM_MAX_TOKENS,
            temperature: config.temperature || CONFIG.LLM_TEMPERATURE,
          }),
        }),
        createLLMTimeoutPromise(CONFIG.LLM_TIMEOUT)
      ]);

      if (!response.ok) {
        throw new Error(`LLM API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const content = result.choices?.[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content received from LLM');
      }

      console.log(`${reportType} report generated successfully`);
      return content;
    } catch (error) {
      console.error(`Error generating ${reportType} report:`, error);
      throw error;
    }
  }

  private static buildPrompt(data: SocialListeningData, reportType: string): string {
    // Filter and prepare sample mentions for better analysis
    const sampleMentions = this.selectDiverseSampleMentions(data.mentions);

    const baseContext = `
Social Media Listening Data Analysis:

Time Range: ${data.timeRange}
Keywords Tracked: ${data.keywords.join(', ')}
Total Mentions: ${data.totalMentions}

Platform Distribution:
${data.platforms.map(p => `- ${p.platform}: ${p.count} mentions`).join('\n')}

Sentiment Distribution:
- Positive: ${data.sentiment.positive}
- Negative: ${data.sentiment.negative}
- Neutral: ${data.sentiment.neutral}

Top Hashtags:
${data.hashtags.slice(0, 10).map(h => `- #${h.hashtag}: ${h.count} mentions`).join('\n')}

Sample Mentions (${sampleMentions.length} diverse examples):
${sampleMentions.map(m => {
  const content = m.content || m.text || 'No content';
  const sentiment = m.sentiment || 'unknown';
  const sentimentScore = m.sentimentScore || 'N/A';
  const author = m.author || m.user || 'Unknown';
  const platform = m.platform || 'unknown';
  
  // Show more content but still truncate very long ones
  const displayContent = content.length > 200 ? content.substring(0, 200) + '...' : content;
  
  return `- ${platform} (${sentiment}, score: ${sentimentScore}): "${displayContent}" by ${author}`;
}).join('\n')}
`;

    switch (reportType) {
      case 'summary':
        return `${baseContext}

Please provide a comprehensive summary report including:
1. Executive Summary (2-3 sentences)
2. Key Findings (3-5 bullet points)
3. Platform Performance Analysis
4. Sentiment Overview
5. Notable Mentions or Trends

Format the response as a professional report with clear sections.`;

      case 'sentiment':
        return `${baseContext}

Please provide a detailed sentiment analysis report including:
1. Overall Sentiment Score and Breakdown
2. Positive Sentiment Analysis (what people like)
3. Negative Sentiment Analysis (pain points, complaints)
4. Neutral Sentiment Context
5. Sentiment Trends by Platform
6. Key Sentiment Drivers

Focus on actionable insights from sentiment data.`;

      case 'trends':
        return `${baseContext}

Please identify and analyze trends in the data including:
1. Emerging Topics or Themes
2. Viral Content or High-Engagement Posts
3. Temporal Patterns (time-based trends)
4. Platform-Specific Trends
5. Hashtag and Keyword Evolution
6. Influencer or High-Impact Accounts

Identify what's trending and why.`;

      case 'recommendations':
        return `${baseContext}

Based on this social media data, please provide actionable recommendations:
1. Immediate Actions (next 24-48 hours)
2. Content Strategy Recommendations
3. Engagement Opportunities
4. Crisis Management (if negative sentiment detected)
5. Platform-Specific Strategies
6. Long-term Strategic Recommendations

Focus on practical, actionable advice.`;

      default:
        return `${baseContext}

Please provide a general analysis of this social media data.`;
    }
  }

  private static selectDiverseSampleMentions(mentions: any[]): any[] {
    // Filter out very long official responses and empty content
    const filteredMentions = mentions.filter(m => {
      const content = m.content || m.text || '';
      return content.length < 500 && content.length > 10;
    });

    if (filteredMentions.length === 0) {
      return mentions.slice(0, 5); // Fallback to original mentions
    }

    // Try to get a diverse sample with different sentiments
    const positive = filteredMentions.filter(m => m.sentiment === 'positive').slice(0, 2);
    const negative = filteredMentions.filter(m => m.sentiment === 'negative').slice(0, 2);
    const neutral = filteredMentions.filter(m => m.sentiment === 'neutral').slice(0, 2);
    const unknown = filteredMentions.filter(m => !m.sentiment || m.sentiment === 'unknown').slice(0, 2);

    // Combine and limit to 8 total
    const diverseSample = [...positive, ...negative, ...neutral, ...unknown].slice(0, 8);
    
    // If we don't have enough diverse samples, fill with remaining mentions
    if (diverseSample.length < 8) {
      const remaining = filteredMentions.filter(m => !diverseSample.includes(m)).slice(0, 8 - diverseSample.length);
      diverseSample.push(...remaining);
    }

    return diverseSample;
  }

  private static parseLLMResponse(response: any, reportType: string) {
    const content = response.choices?.[0]?.message?.content || '';
    
    // Extract insights from the response
    const insights = this.extractInsights(content);
    
    return {
      content,
      insights,
      type: reportType,
      generatedAt: new Date(),
      model: response.model || 'unknown'
    };
  }

  private static extractInsights(content: string): string[] {
    // Simple extraction of bullet points and key insights
    const lines = content.split('\n');
    const insights: string[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*')) {
        insights.push(trimmed.substring(1).trim());
      } else if (trimmed.match(/^\d+\./)) {
        insights.push(trimmed.replace(/^\d+\.\s*/, ''));
      }
    }
    
    return insights.slice(0, 10); // Limit to 10 insights
  }

  // Generate multiple report types at once
  static async generateComprehensiveReport(data: SocialListeningData) {
    const reportTypes = ['summary', 'sentiment', 'trends', 'recommendations'] as const;
    const reports: Record<string, any> = {};
    
    for (const type of reportTypes) {
      try {
        console.log(`Starting ${type} report generation...`);
        reports[type] = await this.generateReport(data, type);
        console.log(`${type} report completed successfully`);
      } catch (error) {
        console.error(`Failed to generate ${type} report:`, error);
        // Generate a fallback report
        reports[type] = {
          content: this.buildFallbackContent(data, type),
          insights: [],
          type,
          generatedAt: new Date(),
          model: 'fallback',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
    
    return reports;
  }

  private static normalizeMention(mention: any): { id: string; content: string; author: string, platform: string } {
    const platform = mention.platform || mention.targetPlatform || 'unknown';
    
    switch (platform) {
      case 'facebook':
      case 'tiktok':
        const postDesc = mention.postDescription || '';
        const commentText = mention.commentText || '';
        
        // Create more readable content format
        let content = '';
        if (postDesc && commentText) {
          content = `Post: ${postDesc}\n\nComment: ${commentText}`;
        } else if (commentText) {
          content = commentText;
        } else if (postDesc) {
          content = postDesc;
        } else {
          content = 'No content available';
        }
        
        const author = mention.commentAuthor || 'Unknown';
        const id = mention.postUrl || mention.commentTimestamp || String(Date.now());
        
        return {
          id: id,
          content: content,
          author: author,
          platform: platform
        };
      case 'instagram':
        const postCaption = mention.postCaption || '';
        const instagramCommentText = mention.commentText || '';
        
        // Create more readable content format for Instagram
        let instagramContent = '';
        if (postCaption && instagramCommentText) {
          instagramContent = `Post: ${postCaption}\n\nComment: ${instagramCommentText}`;
        } else if (instagramCommentText) {
          instagramContent = instagramCommentText;
        } else if (postCaption) {
          instagramContent = postCaption;
        } else {
          instagramContent = 'No content available';
        }
        
        const instagramAuthor = mention.commentAuthor || mention.ownerUsername || 'Unknown';
        const instagramId = mention.postUrl || mention.commentId || String(Date.now());
        
        return {
          id: instagramId,
          content: instagramContent,
          author: instagramAuthor,
          platform: platform
        };
      case 'twitter':
        const twitterContent = mention.content || mention.text || mention.postText || 'No content available';
        return {
          id: mention.id || mention.url || mention.postUrl || String(Date.now()),
          content: twitterContent,
          author: mention.author || mention.user || 'Unknown',
          platform: platform
        };
      case 'reddit':
         const redditContent = mention.content || mention.text || mention.body || 'No content available';
         const redditTitle = mention.title || mention.postTitle || '';
         const fullRedditContent = redditTitle ? `Post: ${redditTitle}\n\n${redditContent}` : redditContent;
         
         return {
          id: mention.id || mention.url || mention.permalink || String(Date.now()),
          content: fullRedditContent,
          author: mention.author || mention.user || 'Unknown',
          platform: platform
        };
      default:
        const defaultContent = mention.content || mention.text || mention.postText || 'No content available';
        return {
          id: mention.id || mention.url || String(Date.now()),
          content: defaultContent,
          author: mention.author || mention.user || 'Unknown',
          platform: platform
        };
    }
  }

  private static buildFallbackContent(data: SocialListeningData, type: string): string {
    const baseInfo = `
# ${type.charAt(0).toUpperCase() + type.slice(1)} Report

**Campaign Overview:**
- Total Mentions: ${data.totalMentions}
- Time Range: ${data.timeRange}
- Keywords Tracked: ${data.keywords.join(', ')}

**Platform Distribution:**
${data.platforms.map(p => `- ${p.platform}: ${p.count} mentions`).join('\n')}

**Sentiment Breakdown:**
- Positive: ${data.sentiment.positive}
- Negative: ${data.sentiment.negative}
- Neutral: ${data.sentiment.neutral}
`;

    switch (type) {
      case 'summary':
        return `${baseInfo}

## Executive Summary
This is a fallback summary report generated due to LLM service issues. The campaign collected ${data.totalMentions} mentions across ${data.platforms.length} platforms.

## Key Findings
- Data collection completed successfully
- ${data.platforms.length} platforms monitored
- Sentiment distribution available
- Further analysis requires LLM service

## Next Steps
Please try again later or contact support if issues persist.`;

      case 'sentiment':
        return `${baseInfo}

## Sentiment Analysis
This is a fallback sentiment report. The data shows:
- ${data.sentiment.positive} positive mentions
- ${data.sentiment.negative} negative mentions  
- ${data.sentiment.neutral} neutral mentions

## Sentiment Ratio
- Positive: ${((data.sentiment.positive / data.totalMentions) * 100).toFixed(1)}%
- Negative: ${((data.sentiment.negative / data.totalMentions) * 100).toFixed(1)}%
- Neutral: ${((data.sentiment.neutral / data.totalMentions) * 100).toFixed(1)}%`;

      case 'trends':
        return `${baseInfo}

## Trend Analysis
This is a fallback trends report. Basic trend data:
- Top hashtags: ${data.hashtags.slice(0, 5).map(h => `#${h.hashtag}`).join(', ')}
- Platform activity: ${data.platforms.map(p => `${p.platform} (${p.count})`).join(', ')}

## Data Insights
- Most active platform: ${data.platforms.sort((a, b) => b.count - a.count)[0]?.platform}
- Total engagement tracked across all platforms`;

      case 'recommendations':
        return `${baseInfo}

## Recommendations
This is a fallback recommendations report based on basic metrics.

## Immediate Actions
- Monitor ${data.platforms.length} platforms for continued mentions
- Track sentiment changes over time
- Engage with high-engagement posts

## Strategic Recommendations
- Continue monitoring keywords: ${data.keywords.join(', ')}
- Focus on platforms with highest mention volume
- Address any negative sentiment promptly`;

      default:
        return `${baseInfo}

## Report
This is a fallback report generated due to LLM service issues. Basic campaign data is available above.`;
    }
  }

  // Enhance mentions with sentiment, key topics, etc.
  static async enhanceMentions(mentions: any[], context: CampaignContext) {
    if (!mentions || mentions.length === 0) {
      return [];
    }
    
    const batchSize = 20;
    const enhancedMentions = [];

    for (let i = 0; i < mentions.length; i += batchSize) {
      const batch = mentions.slice(i, i + batchSize);
      const processedBatch = await this.processMentionBatch(batch, context);
      enhancedMentions.push(...processedBatch);
    }
    
    return enhancedMentions;
  }

  private static async processMentionBatch(mentions: any[], context: CampaignContext) {
    const normalizedMentions = mentions.map(this.normalizeMention);
    
    const prompt = `
You are a social media analysis expert for the brand '${context.brandName || 'the user'}' in the '${context.industry || 'general'}' industry.

Your task is to analyze the following social media mentions. These mentions were collected based on the following criteria:
- Brand Keywords: [${(context.brandKeywords || []).join(', ')}]
- Product Keywords: [${(context.productKeywords || []).join(', ')}]
- Excluded Keywords: [${(context.excludeKeywords || []).join(', ')}]

For each mention, provide a JSON object with:
- "id": The original ID of the mention.
- "sentiment": "positive", "negative", or "neutral".
- "sentimentScore": A score from 0.0 (very negative) to 1.0 (very positive).
- "keyTopics": An array of 1-3 main topics discussed (e.g., ["customer service", "pricing"]).
- "engagementQuality": "high", "medium", or "low" based on potential impact.
- "insights": A brief, one-sentence insight or summary.

Critically evaluate the sentiment of each comment within the context of the post. Do not default to 'neutral' for short comments if a subtle positive or negative tone can be inferred.

Mentions:
${JSON.stringify(normalizedMentions, null, 2)}

Respond ONLY with a valid JSON array of objects, one for each mention. Do not include any other text or formatting.
`;

    try {
      const response = await Promise.race([
        fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://sociallisten.app',
            'X-Title': 'SocialListen',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: 'You are a social media analysis expert. Analyze the provided mentions and return a VALID JSON array with enhanced data. Each object must include: sentiment (positive/negative/neutral), sentimentScore (0-1), keyTopics (array of 3-5 topics), engagementQuality (low/medium/high), and insights (brief analysis). Return ONLY valid JSON without any markdown formatting, code blocks, or additional text. Ensure all JSON is properly closed with brackets and braces.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: 6000,
            temperature: 0.5,
          }),
        }),
        createLLMTimeoutPromise(CONFIG.LLM_TIMEOUT)
      ]);

      if (!response.ok) {
        throw new Error(`LLM API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const content = result.choices?.[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content received from LLM');
      }

      // Clean the response to remove markdown formatting
      let cleanedResponse = this.cleanLLMJsonResponse(content);
      
      // Try to parse the cleaned JSON
      try {
        // First, try to fix any common JSON issues before parsing
        const fixedJson = this.fixCommonJsonIssues(cleanedResponse);
        const enhancedData = JSON.parse(fixedJson);
        
        // Merge enhanced data with original mentions, preserving all original data
        const enhancedMentions = mentions.map((originalMention, index) => {
          const enhanced = enhancedData[index] || {};
          const normalized = this.normalizeMention(originalMention);
          
          return {
            ...originalMention, // Preserve ALL original data
            // Add enhanced fields
            sentiment: enhanced.sentiment || null,
            sentimentScore: enhanced.sentimentScore || null,
            keyTopics: enhanced.keyTopics || [],
            engagementQuality: enhanced.engagementQuality || 'low',
            insights: enhanced.insights || '',
            // Ensure content and author are properly set for reports
            content: normalized.content,
            author: normalized.author,
            platform: normalized.platform
          };
        });
        
        return enhancedMentions;
      } catch (parseError) {
        console.error('Error parsing LLM JSON even after fixing attempts:', parseError);
        
        // Final attempt: try to extract JSON from the response using regex
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          try {
            const extractedJson = JSON.parse(jsonMatch[0]);
            
            // Merge extracted data with original mentions
            const enhancedMentions = mentions.map((originalMention, index) => {
              const enhanced = extractedJson[index] || {};
              const normalized = this.normalizeMention(originalMention);
              
              return {
                ...originalMention, // Preserve ALL original data
                // Add enhanced fields
                sentiment: enhanced.sentiment || null,
                sentimentScore: enhanced.sentimentScore || null,
                keyTopics: enhanced.keyTopics || [],
                engagementQuality: enhanced.engagementQuality || 'low',
                insights: enhanced.insights || '',
                // Ensure content and author are properly set for reports
                content: normalized.content,
                author: normalized.author,
                platform: normalized.platform
              };
            });
            
            return enhancedMentions;
          } catch (extractError) {
            console.error('Failed to parse extracted JSON with regex:', extractError);
          }
        }
        
        // Fallback: return original mentions with error details
        console.log('Using fallback enhancement for', mentions.length, 'mentions due to parsing failure.');
        return mentions.map(mention => {
          const normalized = this.normalizeMention(mention);
          return {
            ...mention, // Preserve ALL original data
            sentiment: null,
            sentimentScore: null,
            keyTopics: [],
            engagementQuality: 'low',
            insights: 'Failed to parse LLM analysis response.',
            error: true,
            // Ensure content and author are properly set for reports
            content: normalized.content,
            author: normalized.author,
            platform: normalized.platform
          };
        });
      }
    } catch (error) {
      console.error('Error processing mention batch:', error);
      // Fallback: return original mentions with error details
      return mentions.map(mention => {
        const normalized = this.normalizeMention(mention);
        return {
          ...mention, // Preserve ALL original data
          sentiment: null,
          sentimentScore: null,
          keyTopics: [],
          engagementQuality: 'low',
          insights: `LLM API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          error: true,
          // Ensure content and author are properly set for reports
          content: normalized.content,
          author: normalized.author,
          platform: normalized.platform
        };
      });
    }
  }

  private static fixCommonJsonIssues(jsonString: string): string {
    let fixed = jsonString;
    
    // Fix truncated strings by finding the last complete object
    const lastCompleteObject = fixed.lastIndexOf('},');
    if (lastCompleteObject > 0) {
      fixed = fixed.substring(0, lastCompleteObject + 1) + ']';
    }
    
    // Fix missing closing brackets
    const openBrackets = (fixed.match(/\[/g) || []).length;
    const closeBrackets = (fixed.match(/\]/g) || []).length;
    const openBraces = (fixed.match(/\{/g) || []).length;
    const closeBraces = (fixed.match(/\}/g) || []).length;
    
    // Add missing closing brackets
    while (closeBrackets < openBrackets) {
      fixed += ']';
    }
    while (closeBraces < openBraces) {
      fixed += '}';
    }
    
    // Remove trailing commas before closing brackets/braces
    fixed = fixed.replace(/,(\s*[}\]])/g, '$1');
    
    return fixed;
  }

  private static cleanLLMJsonResponse(response: string): string {
    // Remove markdown code blocks more aggressively
    let cleaned = response;
    
    // Remove ```json at the beginning
    cleaned = cleaned.replace(/^```json\s*/i, '');
    
    // Remove ``` at the end
    cleaned = cleaned.replace(/\s*```\s*$/i, '');
    
    // Remove any remaining ```json or ``` markers
    cleaned = cleaned.replace(/```json\s*/gi, '');
    cleaned = cleaned.replace(/```\s*/gi, '');
    
    // Remove any remaining backticks
    cleaned = cleaned.replace(/`/g, '');
    
    // Trim whitespace and newlines
    cleaned = cleaned.trim();
    
    // If the response starts with a newline or whitespace, remove it
    cleaned = cleaned.replace(/^\s+/, '');
    
    // If the response ends with a newline or whitespace, remove it
    cleaned = cleaned.replace(/\s+$/, '');
    
    // Try to find JSON array or object start
    const jsonStart = cleaned.search(/[\[{]/);
    if (jsonStart > 0) {
      cleaned = cleaned.substring(jsonStart);
    }
    
    // Try to find JSON array or object end
    const jsonEnd = cleaned.lastIndexOf(']') > cleaned.lastIndexOf('}') 
      ? cleaned.lastIndexOf(']') 
      : cleaned.lastIndexOf('}');
    if (jsonEnd > 0 && jsonEnd < cleaned.length - 1) {
      cleaned = cleaned.substring(0, jsonEnd + 1);
    }
    
    return cleaned;
  }
} 