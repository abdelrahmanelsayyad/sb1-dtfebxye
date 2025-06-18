import { Brand, Mention, Product, Report, KPICard, ChartData, GeoData, PlatformData, Platform } from './types';
import { addDays, subDays, format, addHours } from 'date-fns';

// Generate sample brands
export const sampleBrands: Brand[] = [
  {
    id: '1',
    name: 'TechCorp Pro',
    company: 'TechCorp',
    logo: '🚀',
    industry: 'Technology',
    keywords: ['TechCorp', '@techcorp', '#techcorp', 'TechCorp Pro', 'TCorp'],
    hashtags: ['#techcorp', '#innovation', '#tech'],
    socialHandles: {
      twitter: '@techcorp',
      instagram: '@techcorp_official',
      facebook: 'TechCorpOfficial',
      linkedin: 'techcorp',
      tiktok: '@techcorp',
      youtube: 'TechCorpChannel',
      reddit: 'r/techcorp',
      news: ''
    },
    targetCountries: ['United States', 'Canada', 'United Kingdom', 'Germany', 'Australia'],
    languages: ['English', 'Spanish', 'French', 'German'],
    status: 'active',
    totalMentions: 2847,
    sentiment: 0.73,
    weeklyChange: 23,
    lastUpdate: new Date().toISOString()
  },
  {
    id: '2',
    name: 'EcoStyle',
    company: 'EcoStyle Fashion',
    logo: '🌿',
    industry: 'Fashion',
    keywords: ['EcoStyle', '@ecostyle', '#ecofashion', 'sustainable fashion'],
    hashtags: ['#ecofashion', '#sustainable', '#ecostyle'],
    socialHandles: {
      twitter: '@ecostyle',
      instagram: '@ecostyle_fashion',
      facebook: 'EcoStyleFashion',
      linkedin: 'ecostyle-fashion',
      tiktok: '@ecostyle',
      youtube: 'EcoStyleChannel',
      reddit: 'r/ecofashion',
      news: ''
    },
    targetCountries: ['United States', 'United Kingdom', 'Canada', 'Australia', 'Netherlands'],
    languages: ['English', 'Dutch', 'Spanish'],
    status: 'active',
    totalMentions: 1456,
    sentiment: 0.81,
    weeklyChange: 15,
    lastUpdate: new Date().toISOString()
  },
  {
    id: '3',
    name: 'FlavorCraft',
    company: 'FlavorCraft Foods',
    logo: '🍕',
    industry: 'Food & Beverage',
    keywords: ['FlavorCraft', '@flavorcraft', '#flavorcraft', 'artisan pizza'],
    hashtags: ['#flavorcraft', '#artisanpizza', '#foodie'],
    socialHandles: {
      twitter: '@flavorcraft',
      instagram: '@flavorcraft_foods',
      facebook: 'FlavorCraftFoods',
      linkedin: 'flavorcraft-foods',
      tiktok: '@flavorcraft',
      youtube: 'FlavorCraftChannel',
      reddit: 'r/pizza',
      news: ''
    },
    targetCountries: ['United States', 'Canada', 'United Kingdom'],
    languages: ['English', 'French'],
    status: 'active',
    totalMentions: 892,
    sentiment: 0.78,
    weeklyChange: -8,
    lastUpdate: new Date().toISOString()
  }
];

// Generate sample products
export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'TechCorp Pro X1',
    brandId: '1',
    category: 'Smartphone',
    keywords: ['Pro X1', 'X1', 'TechCorp X1', 'ProX1'],
    launchDate: '2024-01-15',
    priceRange: { min: 699, max: 1099 },
    targetAudience: ['Tech Enthusiasts', 'Professionals', 'Young Adults'],
    features: ['5G', 'AI Camera', '120Hz Display', 'Wireless Charging', 'Face ID'],
    images: ['https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg'],
    metrics: {
      totalMentions: 1547,
      sentiment: 0.76,
      shareOfVoice: 34,
      engagementRate: 4.2
    }
  },
  {
    id: '2',
    name: 'EcoStyle Summer Collection',
    brandId: '2',
    category: 'Clothing',
    keywords: ['Summer Collection', 'EcoStyle Summer', 'sustainable summer'],
    launchDate: '2024-03-01',
    priceRange: { min: 45, max: 120 },
    targetAudience: ['Environmentally Conscious', 'Fashion Forward', 'Millennials'],
    features: ['Organic Cotton', 'Recycled Materials', 'Carbon Neutral', 'Fair Trade'],
    images: ['https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg'],
    metrics: {
      totalMentions: 723,
      sentiment: 0.82,
      shareOfVoice: 28,
      engagementRate: 5.8
    }
  }
];

// Generate time series data
export const generateTimeSeriesData = (days: number = 30): ChartData[] => {
  const data: ChartData[] = [];
  const baseDate = subDays(new Date(), days);
  
  for (let i = 0; i < days; i++) {
    const date = addDays(baseDate, i);
    const total = Math.floor(Math.random() * 200) + 50;
    const positive = Math.floor(total * (0.4 + Math.random() * 0.3));
    const negative = Math.floor(total * (0.1 + Math.random() * 0.2));
    const neutral = total - positive - negative;
    
    data.push({
      date: format(date, 'MM/dd'),
      total,
      positive,
      neutral,
      negative,
      engagement: Math.floor(Math.random() * 1000) + 100,
      reach: Math.floor(Math.random() * 10000) + 1000
    });
  }
  
  return data;
};

// Sample mentions data
export const sampleMentions: Mention[] = [
  {
    id: '1',
    platform: 'twitter',
    user: {
      id: '1',
      name: 'Sarah Johnson',
      handle: '@sarahj_tech',
      avatar: '👩‍💻',
      verified: false,
      followers: 12500,
      userType: 'influencer'
    },
    content: 'Just got my new TechCorp Pro X1 and the camera quality is absolutely stunning! The AI features are game-changing. #techcorp #innovation',
    sentiment: 0.89,
    sentimentLabel: 'positive',
    engagement: { likes: 45, shares: 12, comments: 8 },
    timestamp: subDays(new Date(), 1).toISOString(),
    location: 'San Francisco, CA',
    keywords: ['TechCorp Pro X1', 'camera', 'AI'],
    url: 'https://twitter.com/sarahj_tech/status/123',
    reach: 12500
  },
  {
    id: '2',
    platform: 'instagram',
    user: {
      id: '2',
      name: 'Mike Rodriguez',
      handle: '@mike_reviews',
      avatar: '🎥',
      verified: true,
      followers: 85000,
      userType: 'influencer'
    },
    content: 'TechCorp Pro X1 review is live! Pros: Amazing display, great performance. Cons: Battery could be better. Overall solid device 8/10',
    sentiment: 0.65,
    sentimentLabel: 'positive',
    engagement: { likes: 234, shares: 45, comments: 67 },
    timestamp: subDays(new Date(), 2).toISOString(),
    location: 'Los Angeles, CA',
    keywords: ['TechCorp Pro X1', 'review', 'display', 'battery'],
    url: 'https://instagram.com/p/abc123',
    reach: 85000
  },
  {
    id: '3',
    platform: 'reddit',
    user: {
      id: '3',
      name: 'TechEnthusiast92',
      handle: 'u/TechEnthusiast92',
      avatar: '🤖',
      verified: false,
      followers: 1200,
      userType: 'customer'
    },
    content: 'Anyone else having issues with TechCorp Pro X1 overheating during gaming? Love the phone otherwise but this is concerning.',
    sentiment: 0.35,
    sentimentLabel: 'negative',
    engagement: { likes: 78, shares: 23, comments: 45 },
    timestamp: subDays(new Date(), 3).toISOString(),
    location: 'New York, NY',
    keywords: ['TechCorp Pro X1', 'overheating', 'gaming'],
    url: 'https://reddit.com/r/smartphones/comments/abc123',
    reach: 1200
  },
  {
    id: '4',
    platform: 'tiktok',
    user: {
      id: '4',
      name: 'Emma Style',
      handle: '@emmastyle',
      avatar: '✨',
      verified: true,
      followers: 150000,
      userType: 'influencer'
    },
    content: 'EcoStyle Summer Collection haul! These pieces are not only gorgeous but also sustainable. Fashion that makes a difference! #ecofashion #sustainable',
    sentiment: 0.92,
    sentimentLabel: 'positive',
    engagement: { likes: 5670, shares: 890, comments: 234, views: 45000 },
    timestamp: subDays(new Date(), 1).toISOString(),
    location: 'Toronto, Canada',
    keywords: ['EcoStyle', 'Summer Collection', 'sustainable'],
    url: 'https://tiktok.com/@emmastyle/video/123',
    reach: 150000
  }
];

// Sample KPI data
export const sampleKPIs: KPICard[] = [
  {
    title: 'Total Mentions',
    value: '2,847',
    change: '+23% vs last week',
    trend: 'up',
    sparklineData: [45, 52, 48, 61, 58, 67, 73],
    color: 'blue'
  },
  {
    title: 'Sentiment Score',
    value: '78',
    change: '+5% vs last week',
    trend: 'up',
    sparklineData: [65, 68, 71, 69, 74, 76, 78],
    color: 'green'
  },
  {
    title: 'Share of Voice',
    value: '34%',
    change: '+2% vs last week',
    trend: 'up',
    sparklineData: [28, 30, 32, 31, 33, 33, 34],
    color: 'purple'
  },
  {
    title: 'Engagement Rate',
    value: '4.2%',
    change: '-0.3% vs last week',
    trend: 'down',
    sparklineData: [4.8, 4.6, 4.5, 4.3, 4.1, 4.0, 4.2],
    color: 'orange'
  }
];

// Platform distribution data
export const platformData: PlatformData[] = [
  { platform: 'twitter', mentions: 1247, engagement: 3.2, sentiment: 0.72, color: '#1DA1F2' },
  { platform: 'instagram', mentions: 856, engagement: 5.8, sentiment: 0.79, color: '#E4405F' },
  { platform: 'facebook', mentions: 634, engagement: 2.1, sentiment: 0.71, color: '#1877F2' },
  { platform: 'tiktok', mentions: 423, engagement: 8.4, sentiment: 0.83, color: '#000000' },
  { platform: 'linkedin', mentions: 298, engagement: 1.9, sentiment: 0.68, color: '#0A66C2' },
  { platform: 'youtube', mentions: 187, engagement: 6.2, sentiment: 0.75, color: '#FF0000' },
  { platform: 'reddit', mentions: 156, engagement: 4.1, sentiment: 0.64, color: '#FF4500' }
];

// Geographic data
export const geoData: GeoData[] = [
  { country: 'United States', mentions: 1423, sentiment: 0.75, coordinates: [-95.7129, 37.0902] },
  { country: 'United Kingdom', mentions: 467, sentiment: 0.71, coordinates: [-0.1276, 51.5074] },
  { country: 'Canada', mentions: 389, sentiment: 0.78, coordinates: [-106.3468, 56.1304] },
  { country: 'Germany', mentions: 312, sentiment: 0.69, coordinates: [10.4515, 51.1657] },
  { country: 'Australia', mentions: 256, sentiment: 0.73, coordinates: [133.7751, -25.2744] },
  { country: 'France', mentions: 198, sentiment: 0.67, coordinates: [2.2137, 46.2276] },
  { country: 'Brazil', mentions: 167, sentiment: 0.81, coordinates: [-51.9253, -14.2350] },
  { country: 'Japan', mentions: 134, sentiment: 0.74, coordinates: [138.2529, 36.2048] },
  { country: 'India', mentions: 98, sentiment: 0.70, coordinates: [78.9629, 20.5937] },
  { country: 'Netherlands', mentions: 87, sentiment: 0.76, coordinates: [5.2913, 52.1326] }
];

// Chart data for Product Intelligence
export const productIntelligenceData = {
  mentionVolume: generateTimeSeriesData(30),
  sentimentTrend: generateTimeSeriesData(30).map(d => ({
    ...d,
    sentimentScore: 0.6 + Math.random() * 0.3
  })),
  featureAnalysis: [
    { feature: '5G Connectivity', mentions: 234, sentiment: 0.82, trend: 'up' },
    { feature: 'AI Camera', mentions: 189, sentiment: 0.78, trend: 'up' },
    { feature: '120Hz Display', mentions: 156, sentiment: 0.85, trend: 'up' },
    { feature: 'Battery Life', mentions: 143, sentiment: 0.45, trend: 'down' },
    { feature: 'Design', mentions: 128, sentiment: 0.73, trend: 'neutral' },
    { feature: 'Price', mentions: 98, sentiment: 0.52, trend: 'down' }
  ],
  customerJourney: [
    { stage: 'Awareness', mentions: 645, conversion: 100 },
    { stage: 'Consideration', mentions: 387, conversion: 60 },
    { stage: 'Purchase', mentions: 234, conversion: 36 },
    { stage: 'Experience', mentions: 189, conversion: 29 },
    { stage: 'Advocacy', mentions: 92, conversion: 14 }
  ]
};