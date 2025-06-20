import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test basic functionality
    const testData = {
      mentions: [
        {
          platform: 'twitter',
          content: 'Great product!',
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

    return NextResponse.json({
      success: true,
      message: 'Basic API functionality working',
      testData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Simple test error:', error);
    return NextResponse.json(
      { 
        error: 'Simple test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 