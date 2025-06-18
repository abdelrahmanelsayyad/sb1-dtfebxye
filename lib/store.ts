import { create } from 'zustand';
import { Brand, Mention, Product, Alert, TeamMember } from './types';
import { sampleBrands, sampleMentions, sampleProducts, sampleAlerts, sampleTeamMembers } from './sample-data';

interface AppState {
  // Auth
  isAuthenticated: boolean;
  user: any;
  
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
  alerts: Alert[];
  teamMembers: TeamMember[];
  
  // Filters
  dateRange: { start: Date; end: Date };
  selectedPlatforms: string[];
  sentimentFilter: 'all' | 'positive' | 'neutral' | 'negative';
  
  // Actions
  setAuthenticated: (value: boolean) => void;
  setUser: (user: any) => void;
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
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  isAuthenticated: true, // Set to true for demo
  user: {
    id: '1',
    name: 'Alex Thompson',
    email: 'alex@agency.com',
    role: 'admin',
    company: 'Social Insights Agency',
    avatar: '👨‍💼'
  },
  
  sidebarCollapsed: false,
  darkMode: false,
  currentPage: 'dashboard',
  selectedBrand: '1',
  selectedProduct: '1',
  
  brands: sampleBrands,
  mentions: sampleMentions,
  products: sampleProducts,
  alerts: sampleAlerts,
  teamMembers: sampleTeamMembers,
  
  dateRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date()
  },
  selectedPlatforms: [],
  sentimentFilter: 'all',
  
  // Actions
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setUser: (user) => set({ user }),
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
}));