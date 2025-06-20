'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';

const COLORS = ['#1DA1F2', '#E4405F', '#1877F2', '#000000', '#0A66C2', '#FF0000', '#FF4500'];

interface PlatformData {
  platform: string;
  count: number;
}

export function PlatformDistribution() {
  const { currentCampaignResults } = useAppStore();
  
  // Get platform data from the current campaign results
  const chartData: PlatformData[] = currentCampaignResults?.processedData?.platforms || [];
  
  // If no data, show empty state
  if (chartData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="h-[400px]">
          <CardHeader>
            <CardTitle>Platform Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[280px]">
            <div className="text-center text-muted-foreground">
              <p>No data available</p>
              <p className="text-sm">Run a social listening campaign to see platform distribution</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Platform Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="count"
              >
                {chartData.map((entry: PlatformData, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as PlatformData;
                    const totalMentions = currentCampaignResults?.processedData?.totalMentions || 1;
                    return (
                      <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
                        <p className="font-medium capitalize">{data.platform}</p>
                        <p className="text-sm">Mentions: {data.count}</p>
                        <p className="text-sm">
                          Percentage: {((data.count / totalMentions) * 100).toFixed(1)}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}