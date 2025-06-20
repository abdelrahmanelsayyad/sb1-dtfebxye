import { create } from 'zustand';
import { Brand, Mention, Product, SocialListeningCampaign, ScrapedData, GeneratedReport } from './types';

interface AppState {

  
  // UI State
  sidebarCollapsed: boolean;
  darkMode: boolean;
  currentPage: string;
  selectedBrand: string | null;
  selectedProduct: string | null;
  
  // Data
  brands: Brand[];
  mentions: Mention[];
  products: Product[];

  
  // Filters
  dateRange: { start: Date; end: Date };
  selectedPlatforms: string[];
  sentimentFilter: 'all' | 'positive' | 'neutral' | 'negative';
  
  // Social Listening State
  campaigns: SocialListeningCampaign[];
  scrapedData: ScrapedData[];
  generatedReports: GeneratedReport[];
  currentCampaign: SocialListeningCampaign | null;
  currentCampaignResults: any | null;
  isScraping: boolean;
  scrapingProgress: number;
  
  // Actions

  setSidebarCollapsed: (collapsed: boolean) => void;
  setDarkMode: (darkMode: boolean) => void;
  setCurrentPage: (page: string) => void;
  setSelectedBrand: (brandId: string | null) => void;
  setSelectedProduct: (productId: string | null) => void;
  setDateRange: (range: { start: Date; end: Date }) => void;
  setSelectedPlatforms: (platforms: string[]) => void;
  setSentimentFilter: (filter: 'all' | 'positive' | 'neutral' | 'negative') => void;
  addBrand: (brand: Brand) => void;
  updateBrand: (brandId: string, updates: Partial<Brand>) => void;
  deleteBrand: (brandId: string) => void;
  addMention: (mention: Mention) => void;
  addProduct: (product: Product) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;

  // Social Listening Actions
  createCampaign: (campaign: Omit<SocialListeningCampaign, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCampaign: (id: string, updates: Partial<SocialListeningCampaign>) => void;
  deleteCampaign: (id: string) => void;
  setCurrentCampaign: (campaign: SocialListeningCampaign | null) => void;
  setCurrentCampaignResults: (results: any | null) => void;
  addScrapedData: (data: ScrapedData) => void;
  addGeneratedReport: (report: GeneratedReport) => void;
  setScrapingStatus: (isScraping: boolean, progress?: number) => void;
}

export const useAppStore = create<AppState>((set, get) => ({

  
  sidebarCollapsed: false,
  darkMode: false,
  currentPage: 'dashboard',
  selectedBrand: 'brand1',
  selectedProduct: null,

  brands: [],
  mentions: [],
  products: [],

  
  dateRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date()
  },
  selectedPlatforms: [],
  sentimentFilter: 'all',
  
  // Social Listening initial state
  campaigns: [],
  scrapedData: [],
  generatedReports: [],
  currentCampaign: null,
  currentCampaignResults: null,
  isScraping: false,
  scrapingProgress: 0,
  
  // Actions

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setDarkMode: (darkMode) => set({ darkMode }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setSelectedBrand: (brandId) => set({ selectedBrand: brandId }),
  setSelectedProduct: (productId) => set({ selectedProduct: productId }),
  setDateRange: (range) => set({ dateRange: range }),
  setSelectedPlatforms: (platforms) => set({ selectedPlatforms: platforms }),
  setSentimentFilter: (filter) => set({ sentimentFilter: filter }),
  
  addBrand: (brand) => set((state) => ({ brands: [...state.brands, brand] })),
  updateBrand: (brandId, updates) => set((state) => ({
    brands: state.brands.map(brand => 
      brand.id === brandId ? { ...brand, ...updates } : brand
    )
  })),
  deleteBrand: (brandId) => set((state) => ({
    brands: state.brands.filter(brand => brand.id !== brandId)
  })),
  
  addMention: (mention) => set((state) => ({ mentions: [mention, ...state.mentions] })),
  
  addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
  updateProduct: (productId, updates) => set((state) => ({
    products: state.products.map(product => 
      product.id === productId ? { ...product, ...updates } : product
    )
  })),
  deleteProduct: (productId) => set((state) => ({
    products: state.products.filter(product => product.id !== productId)
  })),

  // Social Listening Actions
  createCampaign: (campaign) => {
    const newCampaign: SocialListeningCampaign = {
      ...campaign,
      id: `campaign_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({
      campaigns: [...state.campaigns, newCampaign],
      currentCampaign: newCampaign,
    }));
  },

  updateCampaign: (id, updates) => {
    set((state) => ({
      campaigns: state.campaigns.map((campaign) =>
        campaign.id === id
          ? { ...campaign, ...updates, updatedAt: new Date() }
          : campaign
      ),
      currentCampaign: state.currentCampaign?.id === id
        ? { ...state.currentCampaign, ...updates, updatedAt: new Date() }
        : state.currentCampaign,
    }));
  },

  deleteCampaign: (id) => {
    set((state) => ({
      campaigns: state.campaigns.filter((campaign) => campaign.id !== id),
      currentCampaign: state.currentCampaign?.id === id ? null : state.currentCampaign,
    }));
  },

  setCurrentCampaign: (campaign) => set({ currentCampaign: campaign }),

  setCurrentCampaignResults: (results) => set({ currentCampaignResults: results }),

  addScrapedData: (data) => {
    set((state) => ({
      scrapedData: [...state.scrapedData, data],
    }));
  },

  addGeneratedReport: (report) => {
    set((state) => ({
      generatedReports: [...state.generatedReports, report],
    }));
  },

  setScrapingStatus: (isScraping, progress = 0) => {
    set({ isScraping, scrapingProgress: progress });
  },
}));