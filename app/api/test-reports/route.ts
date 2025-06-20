import { NextResponse } from 'next/server';
import { LLMService } from '@/lib/llm-service';

export async function GET() {
  try {
    // Test with empty data to see if reports are still generated
    const emptyData = {
      mentions: [],
      totalMentions: 0,
      platforms: [],
      sentiment: {
        positive: 0,
        negative: 0,
        neutral: 0
      },
      hashtags: [],
      timeRange: 'Last 7 days',
      keywords: ['test']
    };

    console.log('Testing report generation with empty data...');
    
    // Test comprehensive report generation with empty data
    const emptyReports = await LLMService.generateComprehensiveReport(emptyData);
    
    console.log('Empty data reports generated successfully');
    console.log('Empty data report types:', Object.keys(emptyReports));

    // Mock data to test report generation
    const mockData = {
      mentions: [
        {
          platform: 'twitter',
          content: 'Great product! Really loving the new features.',
          author: 'user1',
          sentiment: 'positive',
          timestamp: new Date(),
          url: 'https://twitter.com/user1/status/123',
          hashtags: ['product', 'features']
        },
        {
          platform: 'instagram',
          content: 'Amazing service, highly recommend!',
          author: 'user2',
          sentiment: 'positive',
          timestamp: new Date(),
          url: 'https://instagram.com/p/abc123',
          hashtags: ['service', 'recommend']
        },
        {
          platform: 'facebook',
          content: 'Not satisfied with the customer service.',
          author: 'user3',
          sentiment: 'negative',
          timestamp: new Date(),
          url: 'https://facebook.com/post/456',
          hashtags: ['customerservice']
        }
      ],
      totalMentions: 3,
      platforms: [
        { platform: 'twitter', count: 1 },
        { platform: 'instagram', count: 1 },
        { platform: 'facebook', count: 1 }
      ],
      sentiment: {
        positive: 2,
        negative: 1,
        neutral: 0
      },
      hashtags: [
        { hashtag: 'product', count: 1 },
        { hashtag: 'features', count: 1 },
        { hashtag: 'service', count: 1 },
        { hashtag: 'recommend', count: 1 },
        { hashtag: 'customerservice', count: 1 }
      ],
      timeRange: 'Last 7 days',
      keywords: ['test', 'product', 'service']
    };

    console.log('Testing comprehensive report generation with mock data...');
    
    // Test comprehensive report generation
    const reports = await LLMService.generateComprehensiveReport(mockData);
    
    console.log('Comprehensive reports generated successfully');
    console.log('Report types generated:', Object.keys(reports));
    
    return NextResponse.json({
      success: true,
      message: 'Report generation test completed successfully',
      emptyDataReports: emptyReports,
      emptyDataReportTypes: Object.keys(emptyReports),
      reports,
      reportTypes: Object.keys(reports),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Report generation test error:', error);
    return NextResponse.json(
      { 
        error: 'Report generation test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 