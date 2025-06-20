'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function KPICards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Removed: {sampleKPIs.map((kpi, index) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {kpi.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {kpi.value}
                  </div>
                  <div className={`flex items-center text-sm mt-1 ${
                    kpi.trend === 'up' ? 'text-green-600' : 
                    kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {kpi.trend === 'up' && <TrendingUp className="w-4 h-4 mr-1" />}
                    {kpi.trend === 'down' && <TrendingDown className="w-4 h-4 mr-1" />}
                    {kpi.trend === 'neutral' && <Minus className="w-4 h-4 mr-1" />}
                    {kpi.change}
                  </div>
                </div>
                <div className="w-16 h-8">
                  <svg width="64" height="32" viewBox="0 0 64 32" className="text-gray-400">
                    <polyline
                      fill="none"
                      stroke={`var(--color-${kpi.color})`}
                      strokeWidth="2"
                      points={kpi.sparklineData.map((value, i) => 
                        `${(i / (kpi.sparklineData.length - 1)) * 64},${32 - (value / Math.max(...kpi.sparklineData)) * 32}`
                      ).join(' ')}
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))} */}
    </div>
  );
}