'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, MapPin, Clock } from 'lucide-react';
import { geoData } from '@/lib/sample-data';
import { motion } from 'framer-motion';

export function GeographicDistribution() {
  const topCountries = geoData.slice(0, 8);
  const totalMentions = geoData.reduce((sum, country) => sum + country.mentions, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="h-[500px]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-green-600" />
            <span>Geographic Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* World Map Placeholder */}
          <div className="relative bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 rounded-lg p-6 h-48 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="text-center">
              <Globe className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Interactive World Map</p>
              <p className="text-xs text-gray-400">Heat map showing mention distribution</p>
            </div>
          </div>

          {/* Top Countries List */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              Top Countries by Mentions
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {topCountries.map((country, index) => {
                const percentage = (country.mentions / totalMentions * 100).toFixed(1);
                const sentimentColor = country.sentiment >= 0.75 ? 'text-green-600' : 
                                     country.sentiment >= 0.65 ? 'text-yellow-600' : 'text-red-600';
                
                return (
                  <div key={country.country} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{country.country}</p>
                        <p className="text-xs text-gray-500">{country.mentions.toLocaleString()} mentions ({percentage}%)</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`${sentimentColor} bg-transparent border-current`}>
                        {(country.sentiment * 100).toFixed(0)}% sentiment
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Time Zone Activity */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Peak Activity Hours (UTC)
            </h4>
            <div className="grid grid-cols-6 gap-2">
              {[
                { time: '00-04', activity: 'low' },
                { time: '04-08', activity: 'medium' },
                { time: '08-12', activity: 'high' },
                { time: '12-16', activity: 'high' },
                { time: '16-20', activity: 'medium' },
                { time: '20-24', activity: 'low' }
              ].map((slot) => (
                <div key={slot.time} className="text-center">
                  <div className={`w-full h-8 rounded mb-1 ${
                    slot.activity === 'high' ? 'bg-blue-500' :
                    slot.activity === 'medium' ? 'bg-blue-300' : 'bg-blue-100'
                  }`} />
                  <p className="text-xs text-gray-500">{slot.time}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}