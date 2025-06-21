'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, MessageCircle, Users, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';

export function KPICards() {
  const { currentCampaignResults } = useAppStore();

  // Calculate KPIs from campaign results
  const totalMentions = currentCampaignResults?.totalMentions || 0;
  const mentions = currentCampaignResults?.mentions || [];
  const processedData = currentCampaignResults?.processedData;

  // Calculate sentiment breakdown
  const sentimentCounts = mentions.reduce((acc: any, mention: any) => {
    const sentiment = mention.sentiment || 'neutral';
    acc[sentiment] = (acc[sentiment] || 0) + 1;
    return acc;
  }, { positive: 0, negative: 0, neutral: 0 });

  // Calculate platform count
  const platformCount = processedData?.platforms?.length || 0;

  // Calculate engagement metrics
  const totalEngagement = mentions.reduce((sum: number, mention: any) => {
    const engagement = mention.engagement || {};
    return sum + (engagement.likes || 0) + (engagement.comments || 0) + (engagement.shares || 0);
  }, 0);

  const kpis = [
    {
      title: 'Total Mentions',
      value: totalMentions.toLocaleString(),
      change: `${totalMentions > 0 ? '+' : ''}${totalMentions}`,
      trend: totalMentions > 0 ? 'up' as const : 'neutral' as const,
      icon: MessageCircle,
      color: 'blue'
    },
    {
      title: 'Platforms Active',
      value: platformCount.toString(),
      change: `${platformCount} platforms`,
      trend: platformCount > 0 ? 'up' as const : 'neutral' as const,
      icon: Users,
      color: 'green'
    },
    {
      title: 'Positive Sentiment',
      value: sentimentCounts.positive.toString(),
      change: totalMentions > 0 ? `${((sentimentCounts.positive / totalMentions) * 100).toFixed(1)}%` : '0%',
      trend: sentimentCounts.positive > sentimentCounts.negative ? 'up' as const : 'neutral' as const,
      icon: ThumbsUp,
      color: 'green'
    },
    {
      title: 'Negative Sentiment',
      value: sentimentCounts.negative.toString(),
      change: totalMentions > 0 ? `${((sentimentCounts.negative / totalMentions) * 100).toFixed(1)}%` : '0%',
      trend: sentimentCounts.negative > 0 ? 'down' as const : 'neutral' as const,
      icon: ThumbsDown,
      color: 'red'
    }
  ];

  if (totalMentions === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                  <kpi.icon className="w-4 h-4 mr-2" />
                  {kpi.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {kpi.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      No data available
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                <kpi.icon className="w-4 h-4 mr-2" />
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
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}