import { NextResponse } from 'next/server';
import { LLMService } from '@/lib/llm-service';

export async function GET() {
  try {
    // Simple test data
    const testData = {
      mentions: [
        {
          platform: 'twitter',
          content: 'Great product! Really loving the new features.',
          author: 'user1',
          sentiment: 'positive'
        }
      ],
      totalMentions: 1,
      platforms: [
        { platform: 'twitter', count: 1 }
      ],
      sentiment: {
        positive: 1,
        negative: 0,
        neutral: 0
      },
      hashtags: [
        { hashtag: 'test', count: 1 }
      ],
      timeRange: 'Last 7 days',
      keywords: ['test']
    };

    console.log('Testing LLM service with simple data...');
    
    // Test single report generation
    const summaryReport = await LLMService.generateReport(testData, 'summary');
    
    console.log('Summary report generated successfully');
    
    return NextResponse.json({
      success: true,
      message: 'LLM service working correctly',
      summaryReport,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('LLM test error:', error);
    return NextResponse.json(
      { 
        error: 'LLM service test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 