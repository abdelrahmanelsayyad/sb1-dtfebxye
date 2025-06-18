'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { KPICards } from '@/components/dashboard/kpi-cards';
import { MentionsFeed } from '@/components/dashboard/mentions-feed';
import { MentionVolumeChart } from '@/components/dashboard/charts/mention-volume-chart';
import { PlatformDistribution } from '@/components/dashboard/charts/platform-distribution';
import { CompetitorComparison } from '@/components/dashboard/competitor-comparison';

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Social Listening Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Real-time insights across all your monitored brands and products
        </p>
      </motion.div>

      {/* KPI Cards */}
      <KPICards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Mentions Feed */}
        <div className="lg:col-span-1">
          <MentionsFeed />
        </div>

        {/* Center Column - Charts */}
        <div className="lg:col-span-1 space-y-6">
          <MentionVolumeChart />
          <PlatformDistribution />
        </div>

        {/* Right Column - Analysis */}
        <div className="lg:col-span-1">
          <CompetitorComparison />
        </div>
      </div>
    </div>
  );
}