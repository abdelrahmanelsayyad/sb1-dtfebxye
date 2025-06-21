# Scraper Template and Guidelines

## Updated Twitter Scraping System

### New Two-Part Twitter Scraper
The Twitter scraping has been updated to use a two-part system for better data collection:

#### Part 1: Tweet Collection
- **Actor ID**: `gentle_cloud~twitter-tweets-scraper`
- **Purpose**: Collects tweets from specific Twitter URLs/profiles
- **Input**:
  ```json
  {
    "result_count": "30",
    "since_date": "2025-01-15",
    "start_urls": [
      {
        "url": "https://twitter.com/VodafoneEgypt",
        "method": "GET"
      }
    ]
  }
  ```

#### Part 2: Reply Collection
- **Actor ID**: `kaitoeasyapi~twitter-reply`
- **Purpose**: Gets replies and conversation threads using Conversation IDs from Part 1
- **Input**:
  ```json
  {
    "conversation_ids": ["1846987139428634852"],
    "max_items_per_conversation": 20
  }
  ```

### Implementation Details
- **Method Name**: `scrapeTwitterWithReplies()`
- **Input Field**: `twitterUrls?: string[]` in `ApifyScraperConfig`
- **Date Calculation**: Based on `timeRangeMonths` (1, 2, or 3 months)
- **Chunking**: 50 posts per chunk for Part 1
- **Error Handling**: Platform-specific error messages

### Usage Example
```typescript
const config = {
  twitterUrls: ['https://twitter.com/VodafoneEgypt'],
  timeRangeMonths: 2,
  maxComments: 20
};

const results = await ApifyService.scrapeTwitterWithReplies(config);
```

## General Scraper Guidelines

### 1. Use Async API Pattern
All scrapers must use the async API pattern to avoid Apify's 5-minute timeout:

```typescript
// ✅ CORRECT - Async pattern
const data = await makeAsyncApiCall(actorId, input, timeout);

// ❌ WRONG - Sync pattern (causes timeouts)
const data = await apify.call(actorId, input);
```

### 2. Implement Chunking
For large datasets, implement chunking:

```typescript
const data = await makeChunkedApiCall(actorId, input, chunkSize);
```

### 3. Platform-Specific Error Handling
Each scraper should have platform-specific error messages:

```typescript
if (error.message.includes('timed out')) {
  throw new Error(`${platformName} scraping timed out. Try reducing maxPosts or try again later.`);
} else if (error.message.includes('403')) {
  throw new Error(`${platformName} scraping failed due to access restrictions.`);
}
```

### 4. Data Processing
Create standardized data processing functions:

```typescript
static processPlatformData(data: any[]) {
  return data.map(item => ({
    platform: 'platform_name',
    content: item.content || 'No content',
    author: item.author || 'Unknown',
    timestamp: item.timestamp || Date.now(),
    // ... other fields
  }));
}
```

### 5. Configuration Interface
Add platform-specific fields to `ApifyScraperConfig`:

```typescript
export interface ApifyScraperConfig {
  // ... existing fields
  platformResultsLimit?: number;
  platformSpecificField?: string;
}
```

## Testing Checklist

### Before Adding New Scraper
- [ ] Verify actor ID is correct
- [ ] Test input format with Apify console
- [ ] Check output data structure
- [ ] Implement async pattern
- [ ] Add chunking for large datasets
- [ ] Add platform-specific error handling
- [ ] Create data processing function
- [ ] Update configuration interface
- [ ] Test with real data
- [ ] Update documentation

### Error Handling Standards
- Timeout errors (5-minute limit)
- Access restriction errors (403/401)
- Not found errors (404)
- Apify service errors
- Platform-specific error context

### Performance Guidelines
- Use appropriate chunk sizes per platform
- Implement delays between chunks
- Handle partial failures gracefully
- Log progress for debugging
- Monitor API usage and costs

## Platform-Specific Notes

### Twitter (Updated)
- **Two-part system**: Tweets + Replies
- **URL-based**: Accepts Twitter profile/search URLs
- **Conversation tracking**: Full reply chains
- **Rich engagement data**: Likes, retweets, replies

### Instagram
- **Profile + Hashtag**: Dual scraping modes
- **Comments extraction**: Nested comment data
- **Media handling**: Images and videos
- **Rate limiting**: Strict anti-scraping measures

### Reddit
- **Multi-subreddit**: Search across communities
- **Comment threads**: Nested conversation data
- **Proxy support**: Residential proxies
- **NSFW filtering**: Content moderation

### Facebook
- **Profile scraping**: Page and group content
- **Comment extraction**: Community engagement
- **Privacy handling**: Private content detection
- **Rate limiting**: Strict access controls

### TikTok
- **Profile-based**: User content scraping
- **Comment analysis**: Community feedback
- **Video metadata**: Engagement metrics
- **Trend tracking**: Viral content detection 