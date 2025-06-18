import { Brand, Mention, Product, Competitor, KPICard, ChartData, GeoData, PlatformData } from './types';

// Empty placeholder datasets used during development. These will be populated via webhooks.
export const sampleBrands: Brand[] = [];
export const sampleProducts: Product[] = [];
export const sampleMentions: Mention[] = [];
export const sampleKPIs: KPICard[] = [];
export const platformData: PlatformData[] = [];
export const geoData: GeoData[] = [];
export const sampleCompetitors: Competitor[] = [];

export const generateTimeSeriesData = (days: number = 30): ChartData[] => [];

export const productIntelligenceData = {
  mentionVolume: [] as ChartData[],
  sentimentTrend: [] as ChartData[],
  competitorComparison: [] as { name: string; mentions: number; sentiment: number; shareOfVoice: number }[],
  featureAnalysis: [] as { feature: string; mentions: number; sentiment: number; trend: string }[],
  customerJourney: [] as { stage: string; mentions: number; conversion: number }[],
};
