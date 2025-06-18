'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Smartphone, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { platformData } from '@/lib/sample-data';
import { motion } from 'framer-motion';

const platformPerformanceData = platformData.map(platform => ({
  name: platform.platform,
  mentions: platform.mentions,
  engagement: platform.engagement,
  sentiment: platform.sentiment * 100,
  color: platform.color,
}));

// Safeguards for empty datasets to prevent runtime errors
const topMentions = platformPerformanceData[0]?.mentions ?? 0;
const highestEngagement =
  platformPerformanceData.length > 0
    ? Math.max(...platformPerformanceData.map((p) => p.engagement))
    : 0;
const bestSentiment =
  platformPerformanceData.length > 0
    ? Math.max(...platformPerformanceData.map((p) => p.sentiment))
    : 0;

export function PlatformPerformance() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Allow the card to grow so the footer content isn't cut off */}
      <Card className="min-h-[500px]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-purple-600" />
            <span>Platform Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart 
              data={platformPerformanceData} 
              layout="horizontal"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={80}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
                        <p className="font-medium capitalize mb-2">{label}</p>
                        <p className="text-sm">Mentions: {data.mentions.toLocaleString()}</p>
                        <p className="text-sm">Avg. Engagement: {data.engagement}%</p>
                        <p className="text-sm">Sentiment: {data.sentiment.toFixed(0)}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="mentions" 
                fill="#8884d8"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          
        </CardContent>
      </Card>
    </motion.div>
  );
}
