'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush, ReferenceLine } from 'recharts';
import { TrendingUp, MessageSquare, Zap } from 'lucide-react';
import { productIntelligenceData } from '@/lib/sample-data';
import { motion } from 'framer-motion';

export function MentionVolumeTimeline() {
  const data = productIntelligenceData.mentionVolume;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="lg:col-span-2"
    >
      <Card className="h-[500px]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span>Mention Volume Timeline</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-green-600">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                Positive
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
                <div className="w-3 h-3 bg-gray-500 rounded-full mr-2" />
                Neutral
              </Button>
              <Button variant="ghost" size="sm" className="text-red-600">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                Negative
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Zap className="w-4 h-4" />
              <span>Peak: March 15 (Product Launch)</span>
            </div>
            <span>•</span>
            <span>Avg. Daily: 52 mentions</span>
            <span>•</span>
            <span>Growth: +45% vs last period</span>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="positive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="negative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="neutral" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6b7280" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#6b7280" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const total = payload.reduce((sum, item) => sum + (item.value || 0), 0);
                    return (
                      <div className="bg-white dark:bg-gray-800 p-4 border rounded-lg shadow-lg">
                        <p className="font-medium mb-2">{`Date: ${label}`}</p>
                        <p className="text-sm mb-2">{`Total Mentions: ${total}`}</p>
                        {payload.map((entry, index) => (
                          <p key={index} style={{ color: entry.color }} className="text-sm">
                            {`${entry.dataKey}: ${entry.value} (${((entry.value || 0) / total * 100).toFixed(1)}%)`}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="positive"
                stackId="1"
                stroke="#10b981"
                fill="url(#positive)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="neutral"
                stackId="1"
                stroke="#6b7280"
                fill="url(#neutral)"
                strokeWidth={1}
              />
              <Area
                type="monotone"
                dataKey="negative"
                stackId="1"
                stroke="#ef4444"
                fill="url(#negative)"
                strokeWidth={2}
              />
              <ReferenceLine x="03/15" stroke="#2563eb" strokeDasharray="5 5" />
              <Brush dataKey="date" height={30} stroke="#2563eb" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}