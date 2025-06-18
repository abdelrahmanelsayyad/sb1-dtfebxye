'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { MainLayout } from '@/components/layout/main-layout';
import { Dashboard } from '@/components/pages/dashboard';
import { ProductIntelligence } from '@/components/pages/product-intelligence';
import { BrandMonitoring } from '@/components/pages/brand-monitoring';
import { CampaignSetup } from '@/components/pages/campaign-setup';

const pageComponents = {
  dashboard: Dashboard,
  monitoring: BrandMonitoring,
  products: ProductIntelligence,
  setup: CampaignSetup,
  reports: () => <div className="p-6"><h1 className="text-2xl font-bold">Reports</h1></div>,
  settings: () => <div className="p-6"><h1 className="text-2xl font-bold">Settings - Coming Soon</h1></div>,
};

export default function Home() {
  const { currentPage } = useAppStore();
  const PageComponent = pageComponents[currentPage as keyof typeof pageComponents] || Dashboard;

  return (
    <MainLayout>
      <PageComponent />
    </MainLayout>
  );
}