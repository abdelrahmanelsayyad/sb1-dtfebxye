'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FunnelChart, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Users, Eye, ShoppingCart, Star, Heart } from 'lucide-react';
import { productIntelligenceData } from '@/lib/sample-data';
import { motion } from 'framer-motion';

const stageIcons = {
  Awareness: Eye,
  Consideration: Users,
  Purchase: ShoppingCart,
  Experience: Star,
  Advocacy: Heart
};

const stageColors = {
  Awareness: '#3b82f6',
  Consideration: '#8b5cf6',
  Purchase: '#10b981',
  Experience: '#f59e0b',
  Advocacy: '#ef4444'
};

export function CustomerJourney() {
  const journeyData = productIntelligenceData.customerJourney;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="h-[500px]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>Customer Journey Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Journey Funnel */}
          <div>
            <h4 className="text-sm font-medium mb-4">Customer Journey Funnel</h4>
            <div className="space-y-4">
              {journeyData.map((stage, index) => {
                const Icon = stageIcons[stage.stage as keyof typeof stageIcons];
                const conversionRate = index > 0 ? 
                  ((stage.mentions / journeyData[0].mentions) * 100).toFixed(1) : '100.0';
                const dropOff = index > 0 ? 
                  (((journeyData[index - 1].mentions - stage.mentions) / journeyData[index - 1].mentions) * 100).toFixed(1) : '0.0';

                return (
                  <div key={stage.stage} className="relative">
                    <div className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: stageColors[stage.stage as keyof typeof stageColors] }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{stage.stage}</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">
                              {stage.mentions} mentions
                            </Badge>
                            <Badge className="bg-blue-100 text-blue-800">
                              {conversionRate}%
                            </Badge>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${conversionRate}%`,
                              backgroundColor: stageColors[stage.stage as keyof typeof stageColors]
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    {index > 0 && (
                      <div className="absolute -top-2 right-4 text-xs text-red-600 bg-white dark:bg-gray-800 px-2 py-1 rounded border">
                        -{dropOff}% drop-off
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
}