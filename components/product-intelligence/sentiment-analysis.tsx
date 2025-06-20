'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Heart, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const sentimentData = [
  { name: 'Positive', value: 65, color: '#10b981', count: 2456 },
  { name: 'Neutral', value: 25, color: '#6b7280', count: 945 },
  { name: 'Negative', value: 10, color: '#ef4444', count: 378 }
];

const sentimentTrends = [
  { period: 'This Week', positive: 68, change: +3, trend: 'up' },
  { period: 'Last Week', positive: 65, change: -2, trend: 'down' },
  { period: 'This Month', positive: 67, change: +5, trend: 'up' }
];

export function SentimentAnalysis() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="h-[500px]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-pink-600" />
            <span>Sentiment Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sentiment Distribution Chart */}
          <div>
            <h4 className="text-sm font-medium mb-4">Overall Sentiment Distribution</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm">Percentage: {data.value}%</p>
                            <p className="text-sm">Mentions: {data.count.toLocaleString()}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sentiment Trends */}
          <div>
            <h4 className="text-sm font-medium mb-3">Sentiment Trends</h4>
            <div className="space-y-3">
              {sentimentTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{trend.period}</p>
                    <p className="text-xs text-gray-500">Positive sentiment</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">
                      {trend.positive}%
                    </Badge>
                    <div className={`flex items-center space-x-1 text-sm ${
                      trend.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trend.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>{Math.abs(trend.change)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Insights */}
          <div>
            <h4 className="text-sm font-medium mb-3">Key Insights</h4>
            <div className="space-y-2">
              <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded border-l-4 border-green-500">
                <p className="text-xs text-green-800 dark:text-green-200">
                  Sentiment improved by 5% this month
                </p>
              </div>
              <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded border-l-4 border-blue-500">
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  Instagram shows highest positive sentiment (82%)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}