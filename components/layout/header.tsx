'use client';

import React from 'react';
import { Search, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';

const breadcrumbMap: Record<string, string> = {
  dashboard: 'Dashboard',
  monitoring: 'Brand Monitoring',
  products: 'Product Intelligence',
  setup: 'Campaign Setup',
  reports: 'Reports',
};

export function Header() {
  const { darkMode, setDarkMode, currentPage } = useAppStore();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Breadcrumb */}
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Dashboard / <span className="text-gray-900 dark:text-white font-medium">{breadcrumbMap[currentPage]}</span>
          </div>
        </div>

        {/* Center - Search */}
        {currentPage !== 'setup' && (
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search mentions, brands, or keywords..."
                className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>
          </div>
        )}

        {/* Right side - Actions */}
        <div className="flex items-center space-x-4">
          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}