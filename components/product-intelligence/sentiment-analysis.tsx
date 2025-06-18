'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { Heart, Frown, Meh, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const sentimentData: { name: string; value: number; color: string }[] = [];

const sentimentTrend: { date: string; score: number }[] = [];

const topSentimentDrivers: { type: 'positive' | 'negative'; keyword: string; count: number }[] = [];

export function SentimentAnalysis() {
  const overallScore = 0;

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
          {/* Overall Sentiment Score */}
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-green-600 mb-2">
              <span className="text-2xl font-bold text-white">{overallScore}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Overall Sentiment Score</p>
          </div>

          {/* Sentiment Breakdown */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {sentimentData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <Badge variant="secondary">{item.value}%</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Sentiment Trend */}
          <div>
            <h4 className="text-sm font-medium mb-2">30-Day Trend</h4>
            <ResponsiveContainer width="100%" height={60}>
              <LineChart data={sentimentTrend}>
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Sentiment Drivers */}
          <div>
            <h4 className="text-sm font-medium mb-3">Top Sentiment Drivers</h4>
            <div className="space-y-2">
              {topSentimentDrivers.map((driver, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {driver.type === 'positive' ? (
                      <Heart className="w-4 h-4 text-green-500" />
                    ) : (
                      <Frown className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm">{driver.keyword}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {driver.count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}