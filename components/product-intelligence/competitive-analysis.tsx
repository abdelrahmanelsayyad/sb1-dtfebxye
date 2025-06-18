'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import { productIntelligenceData } from '@/lib/sample-data';
import { motion } from 'framer-motion';

const featureComparison = [
  { feature: '5G Support', yourProduct: 95, competitor1: 88, competitor2: 92 },
  { feature: 'Camera Quality', yourProduct: 89, competitor1: 91, competitor2: 85 },
  { feature: 'Battery Life', yourProduct: 67, competitor1: 74, competitor2: 82 },
  { feature: 'Design', yourProduct: 91, competitor1: 85, competitor2: 79 },
  { feature: 'Performance', yourProduct: 88, competitor1: 83, competitor2: 86 }
];

export function CompetitiveAnalysis() {
  const competitors = productIntelligenceData.competitorComparison;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="h-[500px]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-orange-600" />
            <span>Competitive Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Share of Voice Comparison */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center">
              <Trophy className="w-4 h-4 mr-1" />
              Share of Voice Comparison
            </h4>
            <div className="space-y-3">
              {competitors.map((competitor, index) => (
                <div key={competitor.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${index === 0 ? 'font-medium text-blue-600' : ''}`}>
                      {competitor.name} {index === 0 && '(You)'}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Badge variant={index === 0 ? 'default' : 'secondary'}>
                        {competitor.shareOfVoice}%
                      </Badge>
                      {index === 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  <Progress 
                    value={competitor.shareOfVoice} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Feature Comparison Matrix */}
          <div>
            <h4 className="text-sm font-medium mb-3">Feature Mention Comparison</h4>
            <div className="space-y-3">
              {featureComparison.map((feature) => (
                <div key={feature.feature}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{feature.feature}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-blue-600 font-medium">You: {feature.yourProduct}%</span>
                      <span className="text-xs text-gray-500">Avg: {((feature.competitor1 + feature.competitor2) / 2).toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <Progress value={feature.yourProduct} className="h-1" />
                    <Progress value={feature.competitor1} className="h-1 opacity-50" />
                    <Progress value={feature.competitor2} className="h-1 opacity-50" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Competitive Insights */}
          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              Key Insights
            </h4>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Leading in design and 5G mentions</li>
              <li>• Battery life feedback needs improvement</li>
              <li>• Camera quality competitive but can improve</li>
              <li>• Overall sentiment 8% higher than closest competitor</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}