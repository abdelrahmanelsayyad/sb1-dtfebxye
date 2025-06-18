'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { MainLayout } from '@/components/layout/main-layout';
import { Dashboard } from '@/components/pages/dashboard';
import { ProductIntelligence } from '@/components/pages/product-intelligence';
import { BrandMonitoring } from '@/components/pages/brand-monitoring';
import { Competitors } from '@/components/pages/competitors';

const pageComponents = {
  dashboard: Dashboard,
  monitoring: BrandMonitoring,
  products: ProductIntelligence,
  competitors: Competitors,
  reports: () => <div className="p-6"><h1 className="text-2xl font-bold">Reports - Coming Soon</h1></div>,
  alerts: () => <div className="p-6"><h1 className="text-2xl font-bold">Alerts - Coming Soon</h1></div>,
  integrations: () => <div className="p-6"><h1 className="text-2xl font-bold">Integrations - Coming Soon</h1></div>,
  team: () => <div className="p-6"><h1 className="text-2xl font-bold">Team Management - Coming Soon</h1></div>,
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