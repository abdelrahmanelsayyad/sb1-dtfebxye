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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Test request parsing
    const testData = {
      receivedBody: body,
      parsedSuccessfully: true,
      timestamp: new Date().toISOString(),
      testMentions: [
        {
          platform: 'twitter',
          content: 'Test post from API',
          author: 'testuser',
          sentiment: 'neutral',
          timestamp: new Date().toISOString()
        }
      ]
    };

    return NextResponse.json({
      success: true,
      message: 'POST request processed successfully',
      data: testData
    });

  } catch (error) {
    console.error('POST test error:', error);
    return NextResponse.json(
      { 
        error: 'POST test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Test social listening simulation
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // Simulate social listening response
    const mockResponse = {
      success: true,
      campaignId: `campaign_${Date.now()}`,
      data: {
        totalMentions: 5,
        mentions: [
          {
            platform: 'twitter',
            content: 'Great product! #test',
            author: 'user1',
            timestamp: new Date().toISOString(),
            sentiment: 'positive',
            engagement: { likes: 10, comments: 2, shares: 1 }
          },
          {
            platform: 'instagram',
            content: 'Amazing service! #test',
            author: 'user2',
            timestamp: new Date().toISOString(),
            sentiment: 'positive',
            engagement: { likes: 15, comments: 3, shares: 2 }
          }
        ],
        processedData: {
          totalMentions: 5,
          platforms: [{ platform: 'twitter', count: 3 }, { platform: 'instagram', count: 2 }],
          sentiment: { positive: 4, negative: 0, neutral: 1 },
          hashtags: [{ hashtag: 'test', count: 5 }],
          timeRange: 'Last 7 days',
          keywords: body.keywords || ['test']
        },
        reports: {
          summary: '## Mock Summary Report\n\nThis is a test summary report.',
          sentiment: '## Mock Sentiment Report\n\nThis is a test sentiment report.',
          trends: '## Mock Trends Report\n\nThis is a test trends report.',
          recommendations: '## Mock Recommendations Report\n\nThis is a test recommendations report.'
        }
      }
    };

    return NextResponse.json(mockResponse);

  } catch (error) {
    console.error('Social listening simulation error:', error);
    return NextResponse.json(
      { 
        error: 'Social listening simulation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 