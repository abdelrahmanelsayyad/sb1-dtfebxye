// Configuration file for timeout and retry settings
export const CONFIG = {
  // API timeout settings - realistic timeouts for async calls
  API_TIMEOUT: 300000, // 5 minutes for general API calls
  FACEBOOK_TIMEOUT: 300000, // 5 minutes for Facebook
  REQUEST_TIMEOUT: 360000, // 6 minutes for entire request
  PLATFORM_TIMEOUT: 300000, // 5 minutes per platform
  
  // Retry settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 2000, // 2 seconds base delay
  RETRY_BACKOFF_MULTIPLIER: 1.5, // Exponential backoff multiplier
  
  // Rate limiting
  RATE_LIMIT_DELAY: 1000, // 1 second between requests
  
  // Async API settings
  POLL_INTERVAL: 5000, // 5 seconds between status checks
  MAX_POLL_ATTEMPTS: 60, // Maximum polling attempts (5 minutes)
  
  // Chunking settings
  CHUNK_SIZE: 50, // Default chunk size for large requests
  CHUNK_DELAY: 2000, // 2 seconds delay between chunks
  
  // Data limits
  MAX_POSTS_PER_PLATFORM: 200,
  MAX_COMMENTS_PER_POST: 50,
  MAX_RESULTS_COUNT: 200,
  
  // LLM settings (not affected by Apify limits)
  LLM_TIMEOUT: 60000, // 1 minute for LLM calls
  LLM_MAX_TOKENS: 2000,
  LLM_TEMPERATURE: 0.7,
  
  // Error handling
  GRACEFUL_DEGRADATION: true, // Continue with partial results if some platforms fail
  LOG_LEVEL: 'info' as 'debug' | 'info' | 'warn' | 'error'
};

// Helper function to get timeout for specific platform
export function getPlatformTimeout(platform: string): number {
  switch (platform.toLowerCase()) {
    case 'facebook':
      return CONFIG.FACEBOOK_TIMEOUT;
    case 'instagram':
      return CONFIG.API_TIMEOUT;
    case 'twitter':
      return CONFIG.API_TIMEOUT;
    case 'tiktok':
      return CONFIG.API_TIMEOUT;
    case 'reddit':
      return CONFIG.API_TIMEOUT;
    default:
      return CONFIG.API_TIMEOUT;
  }
}

// Helper function to calculate retry delay with exponential backoff
export function calculateRetryDelay(attempt: number): number {
  return CONFIG.RETRY_DELAY * Math.pow(CONFIG.RETRY_BACKOFF_MULTIPLIER, attempt - 1);
} 