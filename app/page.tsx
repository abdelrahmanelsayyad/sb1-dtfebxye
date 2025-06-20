'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { MainLayout } from '@/components/layout/main-layout';
import { Dashboard } from '@/components/pages/dashboard';
import { CampaignSetup } from '@/components/pages/campaign-setup';
import { Reports } from '@/components/pages/reports';

const pageComponents = {
  dashboard: Dashboard,
  setup: CampaignSetup,
  reports: Reports,
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