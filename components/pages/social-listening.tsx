'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Play, 
  FileText, 
  TrendingUp, 
  Settings,
  Plus,
  Download,
  Eye,
  Trash2,
  Calendar,
  Hash,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppStore } from '@/lib/store';

const platforms = [
  { id: 'twitter', name: 'Twitter/X', icon: '𝕏', color: 'bg-black' },
  { id: 'instagram', name: 'Instagram', icon: '📷', color: 'bg-pink-500' },
  { id: 'reddit', name: 'Reddit', icon: '🤖', color: 'bg-orange-500' },
  { id: 'facebook', name: 'Facebook', icon: '👥', color: 'bg-blue-600' },
];

export function SocialListening() {
  const { 
    campaigns, 
    currentCampaign, 
    isScraping, 
    scrapingProgress,
    createCampaign, 
    setCurrentCampaign,
    setScrapingStatus 
  } = useAppStore();

  const [campaignForm, setCampaignForm] = useState({
    name: '',
    keywords: '',
    selectedPlatforms: ['twitter'],
    settings: {
      resultsCount: 200,
      timeWindow: 30,
      maxPosts: 50,
      maxComments: 10
    }
  });

  const [activeTab, setActiveTab] = useState('campaigns');

  const handleCreateCampaign = () => {
    if (!campaignForm.name || !campaignForm.keywords) return;

    const keywords = campaignForm.keywords.split(',').map(k => k.trim()).filter(k => k);
    
    createCampaign({
      name: campaignForm.name,
      keywords,
      platforms: campaignForm.selectedPlatforms,
      status: 'draft',
      settings: campaignForm.settings
    });

    // Reset form
    setCampaignForm({
      name: '',
      keywords: '',
      selectedPlatforms: ['twitter'],
      settings: {
        resultsCount: 200,
        timeWindow: 30,
        maxPosts: 50,
        maxComments: 10
      }
    });
  };

  const handleRunCampaign = async (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) return;

    setScrapingStatus(true, 0);
    setCurrentCampaign(campaign);

    try {
      const response = await fetch('/api/social-listening', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: campaign.name,
          keywords: campaign.keywords,
          platforms: campaign.platforms,
          settings: campaign.settings,
          generateReport: true
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to run campaign');
      }

      const result = await response.json();
      console.log('Campaign result:', result);
      
      // Save results to localStorage for dashboard access
      if (result.success && result.data) {
        localStorage.setItem(`campaign_results_${campaignId}`, JSON.stringify(result.data));
        
        // Update the store with current campaign results
        const { setCurrentCampaignResults } = useAppStore.getState();
        setCurrentCampaignResults(result.data);
        
        // Update campaign status to completed
        const { updateCampaign } = useAppStore.getState();
        updateCampaign(campaignId, { 
          status: 'completed'
        });
      }
      
    } catch (error) {
      console.error('Campaign execution error:', error);
      
      // Update campaign status to failed
      const { updateCampaign } = useAppStore.getState();
      updateCampaign(campaignId, { 
        status: 'failed'
      });
    } finally {
      setScrapingStatus(false, 0);
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
          Social Listening
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor your brand mentions across social media platforms
        </p>
      </motion.div>

      {/* Progress Bar for Scraping */}
      {isScraping && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Running campaign: {currentCampaign?.name}</p>
                  <Progress value={scrapingProgress} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          {/* Create New Campaign */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Create New Campaign</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Campaign Name</Label>
                  <Input
                    id="campaign-name"
                    placeholder="e.g., Brand Monitoring Q4"
                    value={campaignForm.name}
                    onChange={(e) => setCampaignForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                  <Input
                    id="keywords"
                    placeholder="e.g., brand name, product, hashtag"
                    value={campaignForm.keywords}
                    onChange={(e) => setCampaignForm(prev => ({ ...prev, keywords: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Platforms</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {platforms.map((platform) => (
                    <div key={platform.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={platform.id}
                        checked={campaignForm.selectedPlatforms.includes(platform.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setCampaignForm(prev => ({
                              ...prev,
                              selectedPlatforms: [...prev.selectedPlatforms, platform.id]
                            }));
                          } else {
                            setCampaignForm(prev => ({
                              ...prev,
                              selectedPlatforms: prev.selectedPlatforms.filter(p => p !== platform.id)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={platform.id} className="text-sm">{platform.name}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="results-count">Results Count</Label>
                  <Input
                    id="results-count"
                    type="number"
                    value={campaignForm.settings.resultsCount}
                    onChange={(e) => setCampaignForm(prev => ({
                      ...prev,
                      settings: { ...prev.settings, resultsCount: parseInt(e.target.value) }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time-window">Time Window (days)</Label>
                  <Input
                    id="time-window"
                    type="number"
                    value={campaignForm.settings.timeWindow}
                    onChange={(e) => setCampaignForm(prev => ({
                      ...prev,
                      settings: { ...prev.settings, timeWindow: parseInt(e.target.value) }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-posts">Max Posts</Label>
                  <Input
                    id="max-posts"
                    type="number"
                    value={campaignForm.settings.maxPosts}
                    onChange={(e) => setCampaignForm(prev => ({
                      ...prev,
                      settings: { ...prev.settings, maxPosts: parseInt(e.target.value) }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-comments">Max Comments</Label>
                  <Input
                    id="max-comments"
                    type="number"
                    value={campaignForm.settings.maxComments}
                    onChange={(e) => setCampaignForm(prev => ({
                      ...prev,
                      settings: { ...prev.settings, maxComments: parseInt(e.target.value) }
                    }))}
                  />
                </div>
              </div>

              <Button 
                onClick={handleCreateCampaign}
                disabled={!campaignForm.name || !campaignForm.keywords}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </CardContent>
          </Card>

          {/* Campaigns List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Your Campaigns ({campaigns.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {campaigns.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No campaigns yet. Create your first campaign to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <motion.div
                      key={campaign.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{campaign.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <span className="flex items-center space-x-1">
                              <Hash className="w-4 h-4" />
                              <span>{campaign.keywords.length} keywords</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{campaign.platforms.length} platforms</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(campaign.createdAt).toLocaleDateString()}</span>
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            {campaign.platforms.map((platform) => {
                              const platformInfo = platforms.find(p => p.id === platform);
                              return (
                                <Badge key={platform} variant="secondary" className="text-xs">
                                  {platformInfo?.name || platform}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={campaign.status === 'completed' ? 'default' : 'secondary'}
                          >
                            {campaign.status}
                          </Badge>
                          <Button
                            size="sm"
                            onClick={() => handleRunCampaign(campaign.id)}
                            disabled={isScraping}
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Run
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Generated Reports</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No reports generated yet. Run a campaign to generate reports.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 