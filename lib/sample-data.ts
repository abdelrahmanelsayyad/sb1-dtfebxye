import { Brand, Mention, Product, KPICard, ChartData, GeoData, PlatformData } from './types';

// Sample brands with realistic data
export const sampleBrands: Brand[] = [
  {
    id: 'brand-1',
    name: 'TechFlow Pro',
    company: 'TechFlow Inc.',
    logo: 'TF',
    industry: 'technology',
    keywords: ['TechFlow', 'productivity', 'workflow', 'automation'],
    hashtags: ['techflow', 'productivity', 'workflow'],
    socialHandles: {
      twitter: '@techflowpro',
      instagram: '@techflow_official',
      facebook: 'TechFlowPro',
      linkedin: 'techflow-inc',
      tiktok: '@techflowapp',
      youtube: 'TechFlowChannel',
      reddit: 'u/techflowteam',
      news: ''
    },
    targetCountries: ['United States', 'Canada', 'United Kingdom'],
    languages: ['English'],
    status: 'active',
    totalMentions: 12847,
    sentiment: 0.78,
    weeklyChange: 15.3,
    lastUpdate: new Date().toISOString()
  },
  {
    id: 'brand-2',
    name: 'EcoLife',
    company: 'EcoLife Solutions',
    logo: 'EL',
    industry: 'sustainability',
    keywords: ['EcoLife', 'sustainable', 'eco-friendly', 'green'],
    hashtags: ['ecolife', 'sustainability', 'gogreen'],
    socialHandles: {
      twitter: '@ecolifesolutions',
      instagram: '@ecolife_green',
      facebook: 'EcoLifeSolutions',
      linkedin: 'ecolife-solutions',
      tiktok: '@ecolifegreen',
      youtube: 'EcoLifeChannel',
      reddit: 'u/ecolifeteam',
      news: ''
    },
    targetCountries: ['United States', 'Germany', 'Netherlands'],
    languages: ['English', 'German'],
    status: 'active',
    totalMentions: 8934,
    sentiment: 0.82,
    weeklyChange: -3.2,
    lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'brand-3',
    name: 'FitTracker',
    company: 'HealthTech Corp',
    logo: 'FT',
    industry: 'health',
    keywords: ['FitTracker', 'fitness', 'health', 'wellness'],
    hashtags: ['fittracker', 'fitness', 'health'],
    socialHandles: {
      twitter: '@fittracker_app',
      instagram: '@fittracker_official',
      facebook: 'FitTrackerApp',
      linkedin: 'healthtech-corp',
      tiktok: '@fittrackerapp',
      youtube: 'FitTrackerChannel',
      reddit: 'u/fittrackerteam',
      news: ''
    },
    targetCountries: ['United States', 'Canada', 'Australia'],
    languages: ['English'],
    status: 'paused',
    totalMentions: 15672,
    sentiment: 0.71,
    weeklyChange: 8.7,
    lastUpdate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

// Sample products
export const sampleProducts: Product[] = [
  {
    id: 'product-1',
    name: 'TechFlow Pro Suite',
    brandId: 'brand-1',
    category: 'Software',
    keywords: ['suite', 'professional', 'enterprise'],
    launchDate: '2024-01-15',
    priceRange: { min: 29, max: 199 },
    targetAudience: ['professionals', 'teams', 'enterprises'],
    features: ['automation', 'collaboration', 'analytics', 'integrations'],
    images: [],
    metrics: {
      totalMentions: 5432,
      sentiment: 0.79,
      shareOfVoice: 0.42,
      engagementRate: 0.067
    }
  },
  {
    id: 'product-2',
    name: 'EcoLife Home Kit',
    brandId: 'brand-2',
    category: 'Home & Garden',
    keywords: ['home', 'kit', 'starter', 'sustainable'],
    launchDate: '2023-11-20',
    priceRange: { min: 49, max: 149 },
    targetAudience: ['homeowners', 'eco-conscious', 'families'],
    features: ['solar panels', 'water filters', 'composting', 'energy monitoring'],
    images: [],
    metrics: {
      totalMentions: 3241,
      sentiment: 0.84,
      shareOfVoice: 0.36,
      engagementRate: 0.089
    }
  },
  {
    id: 'product-3',
    name: 'FitTracker Pro Watch',
    brandId: 'brand-3',
    category: 'Wearables',
    keywords: ['watch', 'wearable', 'fitness', 'tracking'],
    launchDate: '2024-03-01',
    priceRange: { min: 199, max: 399 },
    targetAudience: ['fitness enthusiasts', 'athletes', 'health-conscious'],
    features: ['heart rate', 'GPS', 'sleep tracking', 'workout modes'],
    images: [],
    metrics: {
      totalMentions: 7891,
      sentiment: 0.73,
      shareOfVoice: 0.51,
      engagementRate: 0.078
    }
  }
];

// Sample mentions with realistic social media content
export const sampleMentions: Mention[] = [
  {
    id: 'mention-1',
    platform: 'twitter',
    user: {
      id: 'user-1',
      name: 'Sarah Chen',
      handle: '@sarahc_tech',
      avatar: 'SC',
      verified: true,
      followers: 15420,
      userType: 'influencer'
    },
    content: 'Just tried @techflowpro and wow! The automation features are game-changing for my workflow. Finally found a tool that actually saves time instead of creating more work. #productivity #techflow',
    sentiment: 0.89,
    sentimentLabel: 'positive',
    engagement: {
      likes: 234,
      shares: 67,
      comments: 43,
      views: 5670
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    location: 'San Francisco, CA',
    keywords: ['techflowpro', 'automation', 'workflow'],
    url: 'https://twitter.com/sarahc_tech/status/123456789',
    reach: 15420
  },
  {
    id: 'mention-2',
    platform: 'instagram',
    user: {
      id: 'user-2',
      name: 'Mike Rodriguez',
      handle: '@mike_green_life',
      avatar: 'MR',
      verified: false,
      followers: 8930,
      userType: 'customer'
    },
    content: 'Week 3 with my @ecolife_green home kit and my energy bill is already down 30%! The solar panels are working better than expected. Highly recommend for anyone wanting to go green 🌱 #sustainability #ecolife',
    sentiment: 0.92,
    sentimentLabel: 'positive',
    engagement: {
      likes: 156,
      shares: 23,
      comments: 31
    },
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    location: 'Austin, TX',
    keywords: ['ecolife', 'solar', 'sustainable'],
    url: 'https://instagram.com/p/ABC123DEF',
    reach: 8930
  },
  {
    id: 'mention-3',
    platform: 'reddit',
    user: {
      id: 'user-3',
      name: 'FitnessGuru2024',
      handle: 'u/FitnessGuru2024',
      avatar: 'FG',
      verified: false,
      followers: 2340,
      userType: 'general'
    },
    content: 'Has anyone else had issues with the FitTracker Pro Watch battery life? Mine barely lasts a day with GPS on. For $300, I expected better. The heart rate monitoring is accurate though.',
    sentiment: 0.35,
    sentimentLabel: 'negative',
    engagement: {
      likes: 89,
      shares: 12,
      comments: 67
    },
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    keywords: ['fittracker', 'battery', 'GPS'],
    url: 'https://reddit.com/r/fitness/comments/abc123',
    reach: 2340
  },
  {
    id: 'mention-4',
    platform: 'linkedin',
    user: {
      id: 'user-4',
      name: 'Jennifer Walsh',
      handle: 'jennifer-walsh-cto',
      avatar: 'JW',
      verified: true,
      followers: 12500,
      userType: 'influencer'
    },
    content: 'After implementing TechFlow Pro across our engineering team, we\'ve seen a 40% reduction in manual tasks. The ROI is clear - this tool pays for itself within the first month. Great work @techflowpro team!',
    sentiment: 0.94,
    sentimentLabel: 'positive',
    engagement: {
      likes: 312,
      shares: 89,
      comments: 56
    },
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    location: 'New York, NY',
    keywords: ['techflow', 'ROI', 'engineering'],
    url: 'https://linkedin.com/posts/jennifer-walsh-cto_123456',
    reach: 12500
  },
  {
    id: 'mention-5',
    platform: 'tiktok',
    user: {
      id: 'user-5',
      name: 'EcoTips Daily',
      handle: '@ecotips_daily',
      avatar: 'ET',
      verified: true,
      followers: 45600,
      userType: 'influencer'
    },
    content: 'POV: You just got your EcoLife kit and you\'re about to save the planet one solar panel at a time ✨ This kit is actually amazing - link in bio! #ecolife #sustainability #solarpanels',
    sentiment: 0.87,
    sentimentLabel: 'positive',
    engagement: {
      likes: 1240,
      shares: 234,
      comments: 89,
      views: 23400
    },
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    keywords: ['ecolife', 'solar', 'sustainability'],
    url: 'https://tiktok.com/@ecotips_daily/video/123456789',
    reach: 45600
  },
  {
    id: 'mention-6',
    platform: 'youtube',
    user: {
      id: 'user-6',
      name: 'Tech Reviews Pro',
      handle: '@techreviewspro',
      avatar: 'TR',
      verified: true,
      followers: 89300,
      userType: 'media'
    },
    content: 'Full review of the FitTracker Pro Watch is now live! While the fitness tracking is solid, there are some concerns about build quality. Check out the full breakdown in my latest video.',
    sentiment: 0.58,
    sentimentLabel: 'neutral',
    engagement: {
      likes: 567,
      shares: 123,
      comments: 234,
      views: 12400
    },
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    keywords: ['fittracker', 'review', 'fitness'],
    url: 'https://youtube.com/watch?v=abc123def',
    reach: 89300
  }
];

// KPI Cards data
export const sampleKPIs: KPICard[] = [
  {
    title: 'Total Mentions',
    value: '37,453',
    change: '+12.5%',
    trend: 'up',
    sparklineData: [20, 25, 22, 30, 28, 35, 37],
    color: 'blue'
  },
  {
    title: 'Sentiment Score',
    value: '78%',
    change: '+3.2%',
    trend: 'up',
    sparklineData: [70, 72, 75, 73, 76, 78, 78],
    color: 'green'
  },
  {
    title: 'Engagement Rate',
    value: '6.8%',
    change: '-0.4%',
    trend: 'down',
    sparklineData: [7.2, 7.0, 6.9, 7.1, 6.8, 6.7, 6.8],
    color: 'purple'
  },
  {
    title: 'Reach',
    value: '2.4M',
    change: '+18.7%',
    trend: 'up',
    sparklineData: [1.8, 2.0, 2.1, 2.2, 2.3, 2.4, 2.4],
    color: 'orange'
  }
];

// Platform distribution data
export const platformData: PlatformData[] = [
  {
    platform: 'twitter',
    mentions: 12847,
    engagement: 4.2,
    sentiment: 0.76,
    color: '#1DA1F2'
  },
  {
    platform: 'instagram',
    mentions: 9234,
    engagement: 7.8,
    sentiment: 0.82,
    color: '#E4405F'
  },
  {
    platform: 'facebook',
    mentions: 7891,
    engagement: 3.1,
    sentiment: 0.71,
    color: '#1877F2'
  },
  {
    platform: 'linkedin',
    mentions: 4567,
    engagement: 5.9,
    sentiment: 0.84,
    color: '#0A66C2'
  },
  {
    platform: 'tiktok',
    mentions: 6789,
    engagement: 12.4,
    sentiment: 0.79,
    color: '#000000'
  },
  {
    platform: 'youtube',
    mentions: 3456,
    engagement: 8.7,
    sentiment: 0.68,
    color: '#FF0000'
  },
  {
    platform: 'reddit',
    mentions: 2134,
    engagement: 6.3,
    sentiment: 0.62,
    color: '#FF4500'
  }
];

// Geographic data
export const geoData: GeoData[] = [
  {
    country: 'United States',
    mentions: 18945,
    sentiment: 0.78,
    coordinates: [-95.7129, 37.0902]
  },
  {
    country: 'United Kingdom',
    mentions: 7234,
    sentiment: 0.82,
    coordinates: [-3.4360, 55.3781]
  },
  {
    country: 'Canada',
    mentions: 5678,
    sentiment: 0.85,
    coordinates: [-106.3468, 56.1304]
  },
  {
    country: 'Germany',
    mentions: 4321,
    sentiment: 0.74,
    coordinates: [10.4515, 51.1657]
  },
  {
    country: 'Australia',
    mentions: 3456,
    sentiment: 0.79,
    coordinates: [133.7751, -25.2744]
  },
  {
    country: 'France',
    mentions: 2987,
    sentiment: 0.71,
    coordinates: [2.2137, 46.2276]
  },
  {
    country: 'Netherlands',
    mentions: 2134,
    sentiment: 0.88,
    coordinates: [5.2913, 52.1326]
  },
  {
    country: 'Japan',
    mentions: 1876,
    sentiment: 0.73,
    coordinates: [138.2529, 36.2048]
  },
  {
    country: 'Brazil',
    mentions: 1654,
    sentiment: 0.69,
    coordinates: [-51.9253, -14.2350]
  },
  {
    country: 'India',
    mentions: 1432,
    sentiment: 0.76,
    coordinates: [78.9629, 20.5937]
  }
];

// Time series data generator
export const generateTimeSeriesData = (days: number = 30): ChartData[] => {
  const data: ChartData[] = [];
  const baseDate = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);
    
    // Generate realistic mention volumes with some randomness
    const baseVolume = 800 + Math.sin(i * 0.2) * 200; // Seasonal variation
    const randomFactor = 0.8 + Math.random() * 0.4; // ±20% randomness
    const total = Math.floor(baseVolume * randomFactor);
    
    // Distribute sentiment (roughly 60% positive, 25% neutral, 15% negative)
    const positive = Math.floor(total * (0.55 + Math.random() * 0.1));
    const negative = Math.floor(total * (0.10 + Math.random() * 0.1));
    const neutral = total - positive - negative;
    
    data.push({
      date: date.toISOString().split('T')[0],
      total,
      positive,
      neutral,
      negative
    });
  }
  
  return data;
};

// Product intelligence specific data
export const productIntelligenceData = {
  mentionVolume: generateTimeSeriesData(30),
  sentimentTrend: generateTimeSeriesData(30).map(item => ({
    ...item,
    sentimentScore: ((item.positive - item.negative) / item.total * 100).toFixed(1)
  })),
  featureAnalysis: [
    { feature: 'User Interface', mentions: 1234, sentiment: 0.82, trend: 'up' },
    { feature: 'Performance', mentions: 987, sentiment: 0.71, trend: 'down' },
    { feature: 'Battery Life', mentions: 856, sentiment: 0.45, trend: 'down' },
    { feature: 'Design', mentions: 743, sentiment: 0.89, trend: 'up' },
    { feature: 'Price', mentions: 654, sentiment: 0.62, trend: 'neutral' },
    { feature: 'Customer Support', mentions: 432, sentiment: 0.78, trend: 'up' }
  ],
  customerJourney: [
    { stage: 'Awareness', mentions: 5432, conversion: 100 },
    { stage: 'Consideration', mentions: 3456, conversion: 63.6 },
    { stage: 'Purchase', mentions: 1234, conversion: 22.7 },
    { stage: 'Experience', mentions: 987, conversion: 18.2 },
    { stage: 'Advocacy', mentions: 234, conversion: 4.3 }
  ]
};