'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { KPICards } from '@/components/dashboard/kpi-cards';
import { MentionsFeed } from '@/components/dashboard/mentions-feed';
import { MentionVolumeChart } from '@/components/dashboard/charts/mention-volume-chart';
import { PlatformDistribution } from '@/components/dashboard/charts/platform-distribution';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import { Plus, TrendingUp, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export function Dashboard() {
  const { 
    campaigns, 
    currentCampaign, 
    currentCampaignResults, 
    setCurrentCampaign,
    setCurrentCampaignResults 
  } = useAppStore();

  // Load the most recent campaign results if available
  useEffect(() => {
    if (campaigns.length > 0 && !currentCampaign) {
      const mostRecentCampaign = campaigns.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )[0];
      setCurrentCampaign(mostRecentCampaign);
    }
  }, [campaigns, currentCampaign, setCurrentCampaign]);

  const handleCampaignChange = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    setCurrentCampaign(campaign || null);
    
    // For now, we'll need to load campaign results from localStorage or API
    // This would typically be done by fetching the campaign results
    const savedResults = localStorage.getItem(`campaign_results_${campaignId}`);
    if (savedResults) {
      try {
        setCurrentCampaignResults(JSON.parse(savedResults));
      } catch (error) {
        console.error('Error parsing saved campaign results:', error);
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Social Listening Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Insights across all your tracked brands and products
        </p>
      </motion.div>

      {/* Campaign Selection */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="max-w-xs">
            <Select 
              value={currentCampaign?.id || ''} 
              onValueChange={handleCampaignChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Campaign" />
              </SelectTrigger>
              <SelectContent>
                {campaigns.map((campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {currentCampaign && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Last updated: {new Date(currentCampaign.updatedAt).toLocaleDateString()}
            </div>
          )}
        </div>
        
        <Link href="/social-listening">
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Campaign</span>
          </Button>
        </Link>
      </div>

      {/* No Campaign State */}
      {campaigns.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="flex items-center justify-center h-[200px]">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create your first social listening campaign to start monitoring mentions
                </p>
                <Link href="/social-listening">
                  <Button className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Create Campaign</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* No Results State */}
      {campaigns.length > 0 && (!currentCampaignResults || currentCampaignResults.totalMentions === 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="flex items-center justify-center h-[200px]">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No data available</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {currentCampaign 
                    ? `Run the "${currentCampaign.name}" campaign to see results`
                    : 'Select a campaign to view its results'
                  }
                </p>
                {currentCampaign && (
                  <Link href="/social-listening">
                    <Button variant="outline">
                      Run Campaign
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* KPI Cards */}
      <KPICards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Mentions Feed */}
        <div className="lg:col-span-1">
          <MentionsFeed />
        </div>

        {/* Right Columns - Charts */}
        <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MentionVolumeChart />
          </div>
          <div className="lg:col-span-1">
            <PlatformDistribution />
          </div>
        </div>
      </div>
    </div>
  );
}
