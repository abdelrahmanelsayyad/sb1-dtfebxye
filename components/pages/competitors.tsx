'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Users, Plus } from 'lucide-react';
import { sampleCompetitors } from '@/lib/sample-data';

export function Competitors() {
  return (
    <div className="p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Competitor Analysis
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor and analyze your competitors across all social platforms
        </p>
      </motion.div>

      {/* Add Competitor Button */}
      <div className="mb-6">
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Competitor</span>
        </Button>
      </div>

      {/* Competitors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sampleCompetitors.map((competitor, index) => (
          <motion.div
            key={competitor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-700 rounded-lg flex items-center justify-center text-white font-bold">
                      {competitor.name.substring(0, 2)}
                    </div>
                    <div>
                      <CardTitle>{competitor.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{competitor.industry}</p>
                    </div>
                  </div>
                  <Badge variant="outline">Competitor</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {competitor.metrics.mentions.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Mentions</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {(competitor.metrics.sentiment * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-gray-500">Sentiment</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {competitor.metrics.shareOfVoice}%
                    </p>
                    <p className="text-xs text-gray-500">Share of Voice</p>
                  </div>
                </div>

                {/* Products */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Products</h4>
                  <div className="flex flex-wrap gap-2">
                    {competitor.products.map((product) => (
                      <Badge key={product} variant="secondary">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Keywords */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Monitored Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {competitor.keywords.slice(0, 3).map((keyword) => (
                      <Badge key={keyword} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                    {competitor.keywords.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{competitor.keywords.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    {competitor.metrics.mentions > 1500 ? (
                      <TrendingUp className="w-4 h-4 text-red-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-green-500" />
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {competitor.metrics.mentions > 1500 ? 'Trending up' : 'Stable'}
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    View Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Competitive Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Competitive Landscape Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Market Leader</h3>
                <p className="text-2xl font-bold text-blue-600 mt-2">TechCorp Pro</p>
                <p className="text-sm text-blue-600">34% Share of Voice</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">Best Sentiment</h3>
                <p className="text-2xl font-bold text-green-600 mt-2">TechCorp Pro</p>
                <p className="text-sm text-green-600">78% Positive</p>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200">Rising Competitor</h3>
                <p className="text-2xl font-bold text-orange-600 mt-2">InnovateX</p>
                <p className="text-sm text-orange-600">+15% Growth</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}