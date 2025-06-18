'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { sampleCompetitors } from '@/lib/sample-data';

export function CompetitorComparison() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Competitor Analysis</CardTitle>
            <Button variant="outline" size="sm">
              View Full Analysis
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Your Brand */}
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                  TC
                </div>
                <div>
                  <p className="font-medium">TechCorp Pro (You)</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Technology</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">2,847</p>
                  <p className="text-xs text-gray-500">Mentions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">78%</p>
                  <p className="text-xs text-gray-500">Sentiment</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">34%</p>
                  <p className="text-xs text-gray-500">Share</p>
                </div>
              </div>
            </div>

            {/* Competitors */}
            {sampleCompetitors.map((competitor, index) => (
              <div key={competitor.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center text-white font-bold">
                    {competitor.name.substring(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium">{competitor.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{competitor.industry}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-lg font-bold">{competitor.metrics.mentions.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Mentions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{(competitor.metrics.sentiment * 100).toFixed(0)}%</p>
                    <p className="text-xs text-gray-500">Sentiment</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{competitor.metrics.shareOfVoice}%</p>
                    <p className="text-xs text-gray-500">Share</p>
                  </div>
                  <div className="flex items-center">
                    {competitor.metrics.mentions > 2000 ? (
                      <TrendingUp className="w-4 h-4 text-red-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}