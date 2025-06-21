# Custom Result Limits and Time Range Guide

## Overview
The social listening application now supports custom result limits for each platform and configurable time ranges for data collection.

## Platform-Specific Result Limits

### Allowed Ranges (1-200 for each platform):
- **Twitter**: `twitterResultsLimit` - 1 to 200 posts
- **Instagram**: `instagramResultsLimit` - 1 to 200 posts
- **Reddit**: `redditResultsLimit` - 1 to 200 posts
- **Facebook**: `facebookResultsLimit` - 1 to 200 comments
- **TikTok**: `tiktokResultsLimit` - 1 to 200 comments

### Time Range Options
- **`timeRangeMonths`**: 1, 2, or 3 months
- **Twitter**: Automatically converts to days (30 days per month)
- **Instagram**: Uses "1 month", "2 months", "3 months" format

## Usage Examples

### Basic Configuration
```json
{
  "name": "Basic Test",
  "keywords": ["Vodafone"],
  "platforms": ["twitter", "instagram"],
  "settings": {
    "twitterResultsLimit": 50,
    "instagramResultsLimit": 75,
    "timeRangeMonths": 2
  }
}
```

### Advanced Configuration
```json
{
  "name": "Advanced Test",
  "keywords": ["Vodafone Egypt"],
  "platforms": ["twitter", "instagram", "facebook", "tiktok", "reddit"],
  "settings": {
    "twitterResultsLimit": 100,
    "instagramResultsLimit": 80,
    "facebookResultsLimit": 120,
    "tiktokResultsLimit": 60,
    "redditResultsLimit": 90,
    "timeRangeMonths": 3,
    "maxComments": 25
  },
  "socialHandles": {
    "twitter": "VodafoneEgypt",
    "instagram": "vodafoneegypt",
    "facebook": "Vodafone.Egypt",
    "tiktok": "vodafoneegypt"
  }
}
```

## Platform-Specific Details

### Twitter (scraper_one~x-posts-search)
- **Result Limit**: `twitterResultsLimit` (1-200)
- **Time Range**: `timeRangeMonths` converts to days (30 days per month)
- **Example**: 2 months = 60 days

### Instagram (apify~instagram-scraper)
- **Result Limit**: `instagramResultsLimit` (1-200)
- **Time Range**: `timeRangeMonths` converts to "1 month", "2 months", "3 months"
- **Example**: 2 months = "2 months"

### Reddit (trudax~reddit-scraper-lite)
- **Result Limit**: `redditResultsLimit` (1-200)
- **Time Range**: Fixed to "month" (Reddit API limitation)
- **Comments**: `maxComments` for comment depth

### Facebook (tri_angle~social-media-sentiment-analysis-tool)
- **Result Limit**: `facebookResultsLimit` (1-200)
- **Data**: Comments from Facebook posts
- **Time Range**: Not applicable (scrapes recent posts)

### TikTok (tri_angle~social-media-sentiment-analysis-tool)
- **Result Limit**: `tiktokResultsLimit` (1-200)
- **Data**: Comments from TikTok videos
- **Time Range**: Not applicable (scrapes recent videos)

## Fallback Behavior

If platform-specific limits are not provided, the system falls back to:
1. `settings.maxPosts` or `settings.resultsCount`
2. Default platform limits (200)
3. Minimum of 1 result

## Best Practices

1. **Start Small**: Begin with lower limits (20-50) for testing
2. **Monitor Performance**: Higher limits may increase processing time
3. **Balance Coverage**: Use different limits based on platform importance
4. **Time Sensitivity**: Use shorter time ranges for trending topics

## Error Handling

- Limits are automatically capped at 200 per platform
- Invalid time ranges default to 1 month
- Missing limits use platform defaults
- Graceful degradation if scraping fails 