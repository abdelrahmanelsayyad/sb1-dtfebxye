export type Platform = 'twitter' | 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'youtube' | 'reddit' | 'news';

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  verified: boolean;
  followers: number;
  userType: 'influencer' | 'customer' | 'media' | 'general';
}

export interface Mention {
  id: string;
  platform: Platform;
  user: User;
  content: string;
  sentiment: number; // 0-1 scale
  sentimentLabel: 'positive' | 'neutral' | 'negative';
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    views?: number;
  };
  timestamp: string;
  location?: string;
  keywords: string[];
  url: string;
  reach?: number;
}

export interface Brand {
  id: string;
  name: string;
  company: string;
  logo: string;
  industry: string;
  keywords: string[];
  hashtags: string[];
  socialHandles: Record<Platform, string>;
  targetCountries: string[];
  languages: string[];
  status: 'active' | 'paused' | 'setup_required';
  totalMentions: number;
  sentiment: number;
  weeklyChange: number;
  lastUpdate: string;
}

export interface Product {
  id: string;
  name: string;
  brandId: string;
  category: string;
  keywords: string[];
  launchDate: string;
  priceRange: { min: number; max: number };
  targetAudience: string[];
  features: string[];
  images: string[];
  metrics: {
    totalMentions: number;
    sentiment: number;
    shareOfVoice: number;
    engagementRate: number;
  };
}


export interface Report {
  id: string;
  name: string;
  type: 'executive_summary' | 'brand_health' | 'campaign_performance' | 'crisis_management' | 'customer_insights' | 'product_launch';
  brandId: string;
  dateRange: {
    start: string;
    end: string;
  };
  status: 'generating' | 'ready' | 'scheduled';
  scheduledFor?: string;
  recipients: string[];
  format: 'pdf' | 'powerpoint' | 'excel';
  createdAt: string;
}



export interface KPICard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  sparklineData: number[];
  color: string;
}

export interface ChartData {
  date: string;
  total: number;
  positive: number;
  neutral: number;
  negative: number;
  [key: string]: any;
}

export interface GeoData {
  country: string;
  mentions: number;
  sentiment: number;
  coordinates: [number, number];
}

export interface PlatformData {
  platform: Platform;
  mentions: number;
  engagement: number;
  sentiment: number;
  color: string;
}