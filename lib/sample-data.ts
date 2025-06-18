import { Brand, Mention, KPICard, ChartData, PlatformData } from './types';

export const sampleBrands: Brand[] = [
  {
    id: 'brand1',
    name: 'Acme Corp',
    company: 'Acme Corp',
    logo: '',
    industry: 'Technology',
    keywords: ['acme', 'tech'],
    hashtags: ['acme', 'tech'],
    socialHandles: {
      twitter: '@acme',
      instagram: 'acme',
      facebook: 'acme',
      linkedin: 'acme',
      tiktok: 'acme',
      youtube: 'acme',
      reddit: 'acme',
      news: 'acme',
    },
    targetCountries: ['United States'],
    languages: ['English'],
    status: 'active',
    totalMentions: 1200,
    sentiment: 0.7,
    weeklyChange: 5,
    lastUpdate: new Date().toISOString(),
  },
  {
    id: 'brand2',
    name: 'Globex',
    company: 'Globex Corp',
    logo: '',
    industry: 'Finance',
    keywords: ['globex'],
    hashtags: ['globex'],
    socialHandles: {
      twitter: '@globex',
      instagram: 'globex',
      facebook: 'globex',
      linkedin: 'globex',
      tiktok: 'globex',
      youtube: 'globex',
      reddit: 'globex',
      news: 'globex',
    },
    targetCountries: ['United States'],
    languages: ['English'],
    status: 'active',
    totalMentions: 900,
    sentiment: 0.6,
    weeklyChange: -2,
    lastUpdate: new Date().toISOString(),
  },
];

export const sampleMentions: Mention[] = [
  {
    id: 'm1',
    brandId: 'brand1',
    platform: 'twitter',
    user: {
      id: 'u1',
      name: 'John Doe',
      handle: '@johndoe',
      avatar: 'JD',
      verified: false,
      followers: 200,
      userType: 'customer',
    },
    content: 'Love the new Acme product! #acme',
    sentiment: 0.8,
    sentimentLabel: 'positive',
    engagement: { likes: 10, shares: 2, comments: 1 },
    timestamp: new Date().toISOString(),
    location: 'USA',
    keywords: ['acme'],
    url: 'https://twitter.com',
    reach: 100,
  },
  {
    id: 'm2',
    brandId: 'brand1',
    platform: 'facebook',
    user: {
      id: 'u2',
      name: 'Jane Roe',
      handle: '@janeroe',
      avatar: 'JR',
      verified: true,
      followers: 500,
      userType: 'influencer',
    },
    content: 'Not impressed with Acme this year.',
    sentiment: 0.2,
    sentimentLabel: 'negative',
    engagement: { likes: 3, shares: 1, comments: 2 },
    timestamp: new Date().toISOString(),
    location: 'USA',
    keywords: ['acme'],
    url: 'https://facebook.com',
    reach: 200,
  },
  {
    id: 'm3',
    brandId: 'brand2',
    platform: 'twitter',
    user: {
      id: 'u3',
      name: 'Alice',
      handle: '@alice',
      avatar: 'A',
      verified: false,
      followers: 150,
      userType: 'customer',
    },
    content: 'Globex services are outstanding!',
    sentiment: 0.9,
    sentimentLabel: 'positive',
    engagement: { likes: 8, shares: 1, comments: 1 },
    timestamp: new Date().toISOString(),
    location: 'UK',
    keywords: ['globex'],
    url: 'https://twitter.com',
    reach: 120,
  },
];

export const platformData: Record<string, PlatformData[]> = {
  brand1: [
    { platform: 'twitter', mentions: 60, engagement: 70, sentiment: 0.7, color: '#1DA1F2' },
    { platform: 'facebook', mentions: 40, engagement: 30, sentiment: 0.6, color: '#1877F2' },
  ],
  brand2: [
    { platform: 'twitter', mentions: 50, engagement: 60, sentiment: 0.8, color: '#1DA1F2' },
    { platform: 'instagram', mentions: 30, engagement: 40, sentiment: 0.7, color: '#E4405F' },
  ],
};

export const sampleKPIs: KPICard[] = [
  { title: 'Total Mentions', value: '1.2k', change: '+5%', trend: 'up', sparklineData: [10,20,30,40], color: 'blue' },
  { title: 'Engagement', value: '300', change: '-3%', trend: 'down', sparklineData: [40,30,20,10], color: 'red' },
];

export const generateTimeSeriesData = (brandId: string, days: number = 30): ChartData[] => {
  const data: ChartData[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const base = brandId === 'brand1' ? 100 : 80;
    data.push({
      date: date.toISOString().split('T')[0],
      total: base + Math.round(Math.random() * 20),
      positive: Math.round(Math.random() * 40),
      neutral: Math.round(Math.random() * 30),
      negative: Math.round(Math.random() * 20),
    });
  }
  return data;
};
