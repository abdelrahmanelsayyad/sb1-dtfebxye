'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Grid, List, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppStore } from '@/lib/store';
import { formatDistanceToNow } from 'date-fns';

export function BrandMonitoring() {
  const { brands } = useAppStore();

  return (
    <div className="p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Brand Monitoring
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor and manage all your brands across social media platforms
        </p>
      </motion.div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add New Brand</span>
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search brands..."
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Grid className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Brand Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand, index) => (
          <motion.div
            key={brand.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl">
                      {brand.logo}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{brand.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{brand.company}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Analytics</DropdownMenuItem>
                      <DropdownMenuItem>Edit Settings</DropdownMenuItem>
                      <DropdownMenuItem>Pause Monitoring</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete Brand</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <Badge className={
                    brand.status === 'active' ? 'bg-green-100 text-green-800' :
                    brand.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {brand.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    Updated {formatDistanceToNow(new Date(brand.lastUpdate), { addSuffix: true })}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {brand.totalMentions.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Mentions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {(brand.sentiment * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-gray-500">Sentiment</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${brand.weeklyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {brand.weeklyChange >= 0 ? '+' : ''}{brand.weeklyChange}%
                    </p>
                    <p className="text-xs text-gray-500">Weekly</p>
                  </div>
                </div>

                {/* Platform Icons */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Monitoring:</span>
                    <div className="flex items-center space-x-1">
                      {Object.entries(brand.socialHandles).slice(0, 5).map(([platform, handle]) => (
                        handle && (
                          <div key={platform} className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <span className="text-xs">{platform[0].toUpperCase()}</span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}