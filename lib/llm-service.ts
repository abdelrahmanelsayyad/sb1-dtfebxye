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

export class LLMService {
  static async generateReport(data: SocialListeningData, reportType: string, config: LLMConfig = {}) {
    const prompt = this.buildPrompt(data, reportType);
    
    try {
      console.log(`Generating ${reportType} report with Google Gemini 2.5 Flash...`);
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
          max_tokens: config.maxTokens || 2000,
          temperature: config.temperature || 0.7,
        }),
      });

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

Sample Mentions (first 5):
${data.mentions.slice(0, 5).map(m => `- ${m.platform || 'unknown'}: "${(m.content || m.text || 'No content').substring(0, 100)}..." by ${m.author || m.user || 'Unknown'}`).join('\n')}
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

  static async enhanceMentions(mentions: any[]) {
    // Batch process mentions for LLM token limits - reduced batch size to prevent JSON issues
    const batchSize = 5; // Reduced from 20 to 5
    const batches = [];
    for (let i = 0; i < mentions.length; i += batchSize) {
      batches.push(mentions.slice(i, i + batchSize));
    }
    const enhanced: any[] = [];
    for (const batch of batches) {
      try {
        const enhancedBatch = await this.processMentionBatch(batch);
        enhanced.push(...enhancedBatch);
      } catch (error) {
        console.error('Error processing mention batch:', error);
        // Fallback: return original mentions if enhancement fails
        enhanced.push(...batch);
      }
    }
    return enhanced;
  }

  private static async processMentionBatch(mentions: any[]) {
    try {
      // Call LLM API to enhance mentions
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
              content: `Analyze these social media mentions and return a VALID JSON array with enhanced data. Return ONLY the JSON array, no other text:\n\n${JSON.stringify(mentions, null, 2)}`
            }
          ],
          max_tokens: 6000,
          temperature: 0.5,
        }),
      });

      if (!response.ok) {
        throw new Error(`LLM API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const content = result.choices?.[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content received from LLM');
      }

      // Clean the response to remove markdown formatting
      const cleanedResponse = this.cleanLLMJsonResponse(content);
      
      console.log('Raw response length:', content.length);
      console.log('Cleaned response length:', cleanedResponse.length);
      
      // Try to parse the cleaned JSON
      try {
        const enhancedMentions = JSON.parse(cleanedResponse);
        console.log('Successfully parsed JSON, enhanced mentions:', enhancedMentions.length);
        return enhancedMentions;
      } catch (parseError) {
        console.error('Error parsing LLM JSON:', parseError);
        console.error('Raw response (first 500 chars):', content.substring(0, 500));
        console.error('Cleaned response (first 500 chars):', cleanedResponse.substring(0, 500));
        
        // Try to extract JSON from the response using regex
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          try {
            const extractedJson = JSON.parse(jsonMatch[0]);
            console.log('Successfully extracted JSON using regex, enhanced mentions:', extractedJson.length);
            return extractedJson;
          } catch (extractError) {
            console.error('Failed to parse extracted JSON:', extractError);
          }
        }
        
        // Try to fix common JSON issues
        try {
          const fixedJson = this.fixCommonJsonIssues(cleanedResponse);
          const enhancedMentions = JSON.parse(fixedJson);
          console.log('Successfully parsed fixed JSON, enhanced mentions:', enhancedMentions.length);
          return enhancedMentions;
        } catch (fixError) {
          console.error('Failed to parse fixed JSON:', fixError);
        }
        
        // Fallback: return original mentions with basic enhancement
        console.log('Using fallback enhancement for', mentions.length, 'mentions');
        return mentions.map(mention => ({
          ...mention,
          sentiment: 'neutral',
          sentimentScore: 0.5,
          keyTopics: ['general'],
          engagementQuality: 'low',
          insights: 'Unable to analyze due to parsing error'
        }));
      }
    } catch (error) {
      console.error('Error processing mention batch:', error);
      // Fallback: return original mentions with basic enhancement
      return mentions.map(mention => ({
        ...mention,
        sentiment: 'neutral',
        sentimentScore: 0.5,
        keyTopics: ['general'],
        engagementQuality: 'low',
        insights: 'Unable to analyze due to API error'
      }));
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