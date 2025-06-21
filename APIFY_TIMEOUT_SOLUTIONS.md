# Real Solutions for Apify's 5-Minute Timeout Problem

## The Real Problem

You're absolutely correct - simply setting longer timeouts does NOT solve Apify's hard-wired 5-minute timeout. This is a fundamental limitation of Apify's platform that requires different architectural approaches.

## Actual Solutions (Not Just Longer Timeouts)

### 1. **Use Asynchronous API Calls Instead of Sync**

**Current Problem**: We're using `run-sync-get-dataset-items` which has the 5-minute limit.

**Real Solution**: Switch to asynchronous execution:
```javascript
// Instead of: run-sync-get-dataset-items
// Use: run-sync (without -get-dataset-items) then poll for results
```

### 2. **Implement Chunking and Batching**

**Problem**: Large datasets exceed 5-minute limit.

**Solution**: Break requests into smaller chunks:
```javascript
// Instead of scraping 200 posts at once
// Scrape 50 posts in 4 separate requests
const chunks = [
  { start: 0, end: 50 },
  { start: 50, end: 100 },
  { start: 100, end: 150 },
  { start: 150, end: 200 }
];
```

### 3. **Use Apify's Dataset API for Large Data**

**Problem**: Sync API has limits.

**Solution**: Use dataset API for large datasets:
```javascript
// 1. Start the actor run
const run = await apify.call('actor-id', input);

// 2. Wait for completion
await apify.waitForFinish(run.id);

// 3. Get dataset items
const dataset = await apify.openDataset(run.defaultDatasetId);
const items = await dataset.getData();
```

### 4. **Implement Progressive Loading**

**Solution**: Load data progressively as it becomes available:
```javascript
// Start scraping
const runId = await startApifyRun();

// Poll for results every 30 seconds
const results = await pollForResults(runId, {
  interval: 30000,
  maxWait: 300000 // 5 minutes
});
```

### 5. **Use Webhook Notifications**

**Solution**: Set up webhooks to get notified when scraping completes:
```javascript
// Configure webhook in Apify
const input = {
  ...scrapingConfig,
  webhookUrl: 'https://your-app.com/webhook/apify-complete'
};
```

## Implementation Strategy

### Phase 1: Switch to Async API
```javascript
export class ApifyService {
  static async scrapeFacebookPostsAsync(config: ApifyScraperConfig) {
    // 1. Start the run
    const runResponse = await fetch(
      `https://api.apify.com/v2/acts/axesso_data~facebook-posts-scraper/runs?token=${APIFY_API_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: config })
      }
    );
    
    const run = await runResponse.json();
    const runId = run.data.id;
    
    // 2. Poll for completion
    let completed = false;
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes with 5-second intervals
    
    while (!completed && attempts < maxAttempts) {
      await delay(5000); // Wait 5 seconds
      
      const statusResponse = await fetch(
        `https://api.apify.com/v2/acts/axesso_data~facebook-posts-scraper/runs/${runId}?token=${APIFY_API_TOKEN}`
      );
      
      const status = await statusResponse.json();
      
      if (status.data.status === 'SUCCEEDED') {
        completed = true;
      } else if (status.data.status === 'FAILED') {
        throw new Error(`Apify run failed: ${status.data.meta}`);
      }
      
      attempts++;
    }
    
    if (!completed) {
      throw new Error('Apify run timed out after 5 minutes');
    }
    
    // 3. Get results
    const datasetResponse = await fetch(
      `https://api.apify.com/v2/acts/axesso_data~facebook-posts-scraper/runs/${runId}/dataset/items?token=${APIFY_API_TOKEN}`
    );
    
    const data = await datasetResponse.json();
    return this.processFacebookData(data || []);
  }
}
```

### Phase 2: Implement Chunking
```javascript
export class ApifyService {
  static async scrapeFacebookPostsChunked(config: ApifyScraperConfig) {
    const maxPosts = config.maxPosts || 200;
    const chunkSize = 50; // Smaller chunks to avoid timeout
    const chunks = [];
    
    // Create chunks
    for (let i = 0; i < maxPosts; i += chunkSize) {
      chunks.push({
        start: i,
        end: Math.min(i + chunkSize, maxPosts)
      });
    }
    
    const allResults = [];
    
    // Process chunks sequentially to avoid overwhelming Apify
    for (const chunk of chunks) {
      try {
        const chunkConfig = {
          ...config,
          maxPosts: chunk.end - chunk.start,
          offset: chunk.start
        };
        
        const chunkResults = await this.scrapeFacebookPostsAsync(chunkConfig);
        allResults.push(...chunkResults);
        
        // Add delay between chunks
        await delay(2000);
        
      } catch (error) {
        console.error(`Chunk ${chunk.start}-${chunk.end} failed:`, error);
        // Continue with other chunks
      }
    }
    
    return allResults;
  }
}
```

### Phase 3: Add Webhook Support
```javascript
export class ApifyService {
  static async scrapeFacebookPostsWithWebhook(config: ApifyScraperConfig) {
    // Set up webhook URL
    const webhookUrl = `${process.env.BASE_URL}/api/webhooks/apify-complete`;
    
    const input = {
      ...config,
      webhookUrl,
      webhookEventTypes: ['RUN.SUCCEEDED', 'RUN.FAILED']
    };
    
    // Start the run with webhook
    const runResponse = await fetch(
      `https://api.apify.com/v2/acts/axesso_data~facebook-posts-scraper/runs?token=${APIFY_API_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })
      }
    );
    
    const run = await runResponse.json();
    return run.data.id; // Return run ID for webhook processing
  }
}
```

## Required Changes to Current Code

### 1. Update API Routes
```javascript
// app/api/social-listening/route.ts
// Change from sync to async calls
const facebookData = await ApifyService.scrapeFacebookPostsAsync({
  keywords,
  maxPosts: settings.maxPosts || 200,
  socialHandles
});
```

### 2. Add Webhook Endpoint
```javascript
// app/api/webhooks/apify-complete/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  if (body.eventType === 'RUN.SUCCEEDED') {
    // Process completed run
    const runId = body.resource.id;
    const data = await getApifyResults(runId);
    // Store or process results
  }
  
  return NextResponse.json({ success: true });
}
```

### 3. Update Configuration
```javascript
// lib/config.ts
export const CONFIG = {
  // Remove the fake 10-minute timeouts
  API_TIMEOUT: 300000, // 5 minutes (realistic)
  FACEBOOK_TIMEOUT: 300000, // 5 minutes (realistic)
  
  // Add chunking settings
  CHUNK_SIZE: 50,
  CHUNK_DELAY: 2000,
  
  // Add async settings
  POLL_INTERVAL: 5000,
  MAX_POLL_ATTEMPTS: 60,
  
  // ... rest of config
};
```

## Why This Approach Works

1. **Async API**: Doesn't have the 5-minute sync limit
2. **Chunking**: Keeps individual requests small and fast
3. **Webhooks**: Real-time notifications when scraping completes
4. **Progressive Loading**: Get data as it becomes available
5. **Error Recovery**: Handle failures gracefully

## Implementation Priority

1. **Immediate**: Switch to async API calls
2. **Short-term**: Implement chunking for large datasets
3. **Medium-term**: Add webhook support for real-time updates
4. **Long-term**: Implement progressive loading UI

## Testing Strategy

1. **Test async API** with small datasets first
2. **Test chunking** with medium datasets (100-200 posts)
3. **Test webhooks** with real webhook endpoints
4. **Monitor performance** and adjust chunk sizes

This approach actually solves the 5-minute timeout problem instead of just working around it with longer timeouts. 