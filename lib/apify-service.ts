const APIFY_API_TOKEN = 'apify_api_ZrZ68W91FaRzCHSFiVEOZWNdH5facG0eeFRQ';

export interface ApifyScraperConfig {
  query?: string;
  keywords?: string[];
  resultsCount?: number;
  timeWindow?: number;
  maxPosts?: number;
  maxComments?: number;
  platforms?: string[];
  socialHandles?: Record<string, string>;
}

export class ApifyService {
  // X (Twitter) Posts Search
  static async scrapeTwitterPosts(config: ApifyScraperConfig) {
    // Use the first keyword as the query to avoid length limits.
    const query = (config.keywords && config.keywords.length > 0) ? config.keywords[0] : '';
    const truncatedQuery = query.substring(0, 30); // Ensure 30 char limit
    
    const input = {
      query: truncatedQuery,
      resultsCount: Math.min(config.resultsCount || 200, 200),
      searchType: "latest",
      timeWindow: config.timeWindow || 30
    };

    try {
      const response = await fetch(
        `https://api.apify.com/v2/acts/scraper_one~x-posts-search/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Twitter scraping failed: ${response.statusText} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log('Twitter scraping successful, got data:', data);
      return this.processTwitterData(data || []);
    } catch (error) {
      console.error('Twitter scraping error:', error);
      throw error;
    }
  }

  // Instagram Scraper
  static async scrapeInstagramPosts(config: ApifyScraperConfig) {
    console.log('Starting Instagram scraping with config:', config);
    const instagramHandle = config.socialHandles?.instagram;
    
    if (instagramHandle) {
      // Profile scraping
      const input = {
        addParentData: false,
        directUrls: [`https://www.instagram.com/${instagramHandle.replace('@', '')}/`],
        enhanceUserSearchWithFacebookPage: false,
        isUserReelFeedURL: false,
        isUserTaggedFeedURL: false,
        onlyPostsNewerThan: "1 month",
        resultsLimit: Math.min(config.maxPosts || 200, 200),
        resultsType: "posts"
      };

      console.log('Instagram input for profile scraping:', input);

      try {
        const response = await fetch(
          `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Instagram scraping failed: ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log('Instagram scraping successful, got data:', data);
        return this.processInstagramData(data || []);
      } catch (error) {
        console.error('Instagram scraping error:', error);
        throw error;
      }
    } else {
      // Hashtag search
      console.log('Scraping Instagram by hashtag/keyword:', config.keywords?.[0]);
      const input = {
        addParentData: false,
        enhanceUserSearchWithFacebookPage: false,
        isUserReelFeedURL: false,
        isUserTaggedFeedURL: false,
        onlyPostsNewerThan: "1 month",
        resultsLimit: Math.min(config.maxPosts || 200, 200),
        resultsType: "posts",
        search: (config.keywords && config.keywords.length > 0) ? config.keywords[0] : '',
        searchLimit: Math.min(config.maxPosts || 200, 200),
        searchType: "hashtag"
      };

      console.log('Instagram input for hashtag search:', input);

      try {
        const response = await fetch(
          `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Instagram scraping failed: ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log('Instagram scraping successful, got data:', data);
        return this.processInstagramData(data || []);
      } catch (error) {
        console.error('Instagram scraping error:', error);
        throw error;
      }
    }
  }

  // Reddit Scraper Lite
  static async scrapeRedditPosts(config: ApifyScraperConfig) {
    const input = {
      debugMode: false,
      ignoreStartUrls: false,
      includeNSFW: false,
      maxComments: Math.min(config.maxComments || 50, 50),
      maxCommunitiesCount: 2,
      maxItems: Math.min(config.resultsCount || 200, 200),
      maxPostCount: Math.min(config.maxPosts || 200, 200),
      maxUserCount: 2,
      proxy: {
        useApifyProxy: true,
        apifyProxyGroups: ["RESIDENTIAL"]
      },
      scrollTimeout: 40,
      searchComments: true,
      searchCommunities: true,
      searchPosts: true,
      searchUsers: false,
      searches: config.keywords || [],
      skipComments: false,
      skipCommunity: false,
      skipUserPosts: false,
      sort: "relevance",
      time: "month"
    };

    try {
      const response = await fetch(
        `https://api.apify.com/v2/acts/trudax~reddit-scraper-lite/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Reddit scraping failed with status ${response.status}: ${errorBody}`);
        throw new Error(`Reddit scraping failed: ${response.statusText}`);
      }

      const data = await response.json();
      return this.processRedditData(data);
    } catch (error) {
      console.error('Reddit scraping error:', error);
      throw error;
    }
  }

  // Facebook Scraper
  static async scrapeFacebookPosts(config: ApifyScraperConfig) {
    const facebookHandle = config.socialHandles?.facebook;
    
    // Facebook expects an object with an "input" property containing the array
    const input = {
      input: [
        {
          url: facebookHandle ? `https://www.facebook.com/${facebookHandle.replace('@', '')}` : '',
          maxPosts: Math.min(config.maxPosts || 200, 200)
        }
      ]
    };

    try {
      const response = await fetch(
        `https://api.apify.com/v2/acts/axesso_data~facebook-posts-scraper/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Facebook scraping failed: ${response.statusText} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log('Facebook scraping successful, got data:', data);
      return this.processFacebookData(data || []);
    } catch (error) {
      console.error('Facebook scraping error:', error);
      throw error;
    }
  }

  // Data processing functions
  static processTwitterData(data: any[]) {
    return data.map(item => ({
      platform: 'twitter',
      content: item.postText || item.text || item.full_text || 'No content available',
      author: item.author?.name || item.author?.screenName || item.user?.name || 'Unknown',
      timestamp: item.timestamp || item.created_at || Date.now(),
      url: item.postUrl || item.url || '',
      engagement: {
        likes: item.favouriteCount || item.likeCount || 0,
        retweets: item.repostCount || item.retweetCount || 0,
        replies: item.replyCount || 0
      },
      sentiment: item.sentiment || 'neutral',
      sentimentScore: item.sentimentScore || 0.5,
      keyTopics: item.keyTopics || [],
      engagementQuality: item.engagementQuality || 'low',
      insights: item.insights || '',
      ...item // Keep original data
    }));
  }

  static processInstagramData(data: any[]) {
    return data.map(item => ({
      platform: 'instagram',
      content: item.caption || item.text || item.description || 'No content available',
      author: item.ownerUsername || item.owner?.username || item.author?.username || 'Unknown',
      timestamp: item.timestamp || item.created_at || Date.now(),
      url: item.url || item.shortCode ? `https://www.instagram.com/p/${item.shortCode}/` : '',
      engagement: {
        likes: item.likesCount || item.likeCount || 0,
        comments: item.commentsCount || item.commentCount || 0
      },
      sentiment: item.sentiment || 'neutral',
      sentimentScore: item.sentimentScore || 0.5,
      keyTopics: item.keyTopics || [],
      engagementQuality: item.engagementQuality || 'low',
      insights: item.insights || '',
      ...item // Keep original data
    }));
  }

  static processRedditData(data: any[]) {
    return data.map(item => ({
      platform: 'reddit',
      content: item.text || item.body || item.title || 'No content available',
      author: item.author || item.user || 'Unknown',
      timestamp: item.timestamp || item.created_utc ? item.created_utc * 1000 : Date.now(),
      url: item.url || item.permalink ? `https://reddit.com${item.permalink}` : '',
      engagement: {
        upvotes: item.score || item.upvotes || 0,
        comments: item.num_comments || item.commentCount || 0
      },
      sentiment: item.sentiment || 'neutral',
      sentimentScore: item.sentimentScore || 0.5,
      keyTopics: item.keyTopics || [],
      engagementQuality: item.engagementQuality || 'low',
      insights: item.insights || '',
      ...item // Keep original data
    }));
  }

  static processFacebookData(data: any[]) {
    return data.map(item => ({
      platform: 'facebook',
      content: item.text || item.message || item.description || 'No content available',
      author: item.author || item.user || item.pageName || 'Unknown',
      timestamp: item.timestamp || item.created_time || Date.now(),
      url: item.url || item.permalink || '',
      engagement: {
        likes: item.likes || item.likeCount || 0,
        comments: item.comments || item.commentCount || 0,
        shares: item.shares || item.shareCount || 0
      },
      sentiment: item.sentiment || 'neutral',
      sentimentScore: item.sentimentScore || 0.5,
      keyTopics: item.keyTopics || [],
      engagementQuality: item.engagementQuality || 'low',
      insights: item.insights || '',
      ...item // Keep original data
    }));
  }
}
