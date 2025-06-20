'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
} from 'recharts';
import { Download, TrendingUp } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';

interface ChartDataPoint {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
  total: number;
}

export function MentionVolumeChart() {
  const { currentCampaignResults } = useAppStore();

  // Generate timeline data from mentions
  const generateTimelineData = (): ChartDataPoint[] => {
    if (!currentCampaignResults?.mentions || currentCampaignResults.mentions.length === 0) {
      return [];
    }

    // Group mentions by date
    const mentionsByDate = currentCampaignResults.mentions.reduce((acc: any, mention: any) => {
      const date = new Date(mention.timestamp).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { positive: 0, neutral: 0, negative: 0, total: 0 };
      }
      
      const sentiment = mention.sentiment || 'neutral';
      acc[date][sentiment]++;
      acc[date].total++;
      
      return acc;
    }, {});

    // Convert to array and sort by date
    return Object.entries(mentionsByDate)
      .map(([date, counts]: [string, any]) => ({
        date,
        positive: counts.positive,
        neutral: counts.neutral,
        negative: counts.negative,
        total: counts.total
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const chartData = generateTimelineData();

  // If no data, show empty state
  if (chartData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="h-[400px]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span>Mention Volume Timeline</span>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[280px]">
            <div className="text-center text-muted-foreground">
              <p>No data available</p>
              <p className="text-sm">Run a social listening campaign to see mention volume</p>
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
      transition={{ delay: 0.2 }}
    >
      <Card className="h-[400px]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Mention Volume Timeline</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                7D
              </Button>
              <Button variant="outline" size="sm">
                30D
              </Button>
              <Button variant="default" size="sm">
                60D
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="positive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="negative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="neutral" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6b7280" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6b7280" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
                        <p className="font-medium mb-2">{`Date: ${label}`}</p>
                        {payload.map((entry, index) => (
                          <p key={index} style={{ color: entry.color }}>
                            {`${entry.dataKey}: ${entry.value}`}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area type="monotone" dataKey="positive" stackId="1" stroke="#10b981" fill="url(#positive)" />
              <Area type="monotone" dataKey="neutral" stackId="1" stroke="#6b7280" fill="url(#neutral)" />
              <Area type="monotone" dataKey="negative" stackId="1" stroke="#ef4444" fill="url(#negative)" />
              <Brush dataKey="date" height={30} stroke="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
