'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Eye, 
  BarChart3, 
  Users, 
  FileText, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Plus
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
  { id: 'monitoring', label: 'Brand Monitoring', icon: Eye, badge: '2.8k' },
  { id: 'products', label: 'Product Intelligence', icon: BarChart3, badge: null, highlight: true },
  { id: 'competitors', label: 'Competitors', icon: Users, badge: null },
  { id: 'reports', label: 'Reports', icon: FileText, badge: '3' },
  { id: 'settings', label: 'Settings', icon: Settings, badge: null }
];

export function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, currentPage, setCurrentPage } = useAppStore();

  return (
    <motion.div
      className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full`}
      initial={false}
      animate={{ width: sidebarCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900 dark:text-white">SocialListen</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Dashboard</p>
              </div>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-8 h-8 p-0"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Quick Setup Button */}
      <div className="p-2">
        <motion.div
          className="px-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="default"
            className="w-full justify-start h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
            onClick={() => setCurrentPage('setup')}
          >
            <Plus className="w-5 h-5 mr-3" />
            {!sidebarCollapsed && <span>New Campaign</span>}
          </Button>
        </motion.div>
      </div>

      <Separator />

      {/* Navigation */}
      <div className="flex-1 py-4 space-y-1">
        {navigationItems.map((item) => (
          <motion.div
            key={item.id}
            className="px-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant={currentPage === item.id ? 'default' : 'ghost'}
              className={`w-full justify-start h-12 ${
                currentPage === item.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              } ${item.highlight ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''}`}
              onClick={() => setCurrentPage(item.id)}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-2">
                      {item.badge}
                    </Badge>
                  )}
                  {item.highlight && (
                    <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      New
                    </Badge>
                  )}
                </>
              )}
            </Button>
          </motion.div>
        ))}
      </div>

      <Separator />
    </motion.div>
  );
}