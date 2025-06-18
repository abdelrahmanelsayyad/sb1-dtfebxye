'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ProductSelector } from '@/components/product-intelligence/product-selector';
import { MentionVolumeTimeline } from '@/components/product-intelligence/mention-volume-timeline';
import { SentimentAnalysis } from '@/components/product-intelligence/sentiment-analysis';
import { PlatformPerformance } from '@/components/product-intelligence/platform-performance';
import { GeographicDistribution } from '@/components/product-intelligence/geographic-distribution';
import { CustomerJourney } from '@/components/product-intelligence/customer-journey';

export function ProductIntelligence() {
  return (
    <div className="p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Product Intelligence Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive analytics and insights for your product mentions and performance
        </p>
      </motion.div>

      {/* Product Selector */}
      <ProductSelector />

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Row 1: Primary Metrics */}
        <MentionVolumeTimeline />
        <SentimentAnalysis />

        {/* Row 2: Detailed Analytics */}
        <PlatformPerformance />
        <GeographicDistribution />
        <CustomerJourney />
      </div>
    </div>
  );
}