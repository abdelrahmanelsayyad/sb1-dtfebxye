'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Plus, 
  X, 
  Search, 
  Globe,
  Target,
  Zap,
  Eye,
  Calendar,
  Hash,
  AtSign,
  MapPin,
  Languages,
  Smartphone,
  Building,
  Sparkles,
  FileText,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppStore } from '@/lib/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ReactMarkdown from 'react-markdown';

const steps = [
  { id: 1, title: 'Brand Details', icon: Building, description: 'Basic information about your brand' },
  { id: 2, title: 'Keywords & Hashtags', icon: Hash, description: 'What to track across platforms' },
  { id: 3, title: 'Social Platforms', icon: Smartphone, description: 'Where to listen for mentions' },
  { id: 4, title: 'Geographic & Language', icon: Globe, description: 'Target regions and languages' },
  { id: 5, title: 'Review & Launch', icon: Zap, description: 'Finalize your campaign' },
  { id: 6, title: 'Results & Reports', icon: FileText, description: 'View your campaign results' }
];

const platforms = [
  { id: 'twitter', name: 'Twitter/X', icon: '𝕏', color: 'bg-black', popular: true },
  { id: 'instagram', name: 'Instagram', icon: '📷', color: 'bg-pink-500', popular: true },
  { id: 'facebook', name: 'Facebook', icon: '👥', color: 'bg-blue-600', popular: true },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'bg-blue-700', popular: true },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'bg-black', popular: true },
  { id: 'youtube', name: 'YouTube', icon: '📺', color: 'bg-red-500', popular: true },
  { id: 'reddit', name: 'Reddit', icon: '🤖', color: 'bg-orange-500', popular: false },
  { id: 'news', name: 'News Sites', icon: '📰', color: 'bg-gray-600', popular: false },
  { id: 'blogs', name: 'Blogs', icon: '✍️', color: 'bg-purple-500', popular: false },
  { id: 'forums', name: 'Forums', icon: '💬', color: 'bg-green-500', popular: false }
];

const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'Spain', 'Italy', 'Netherlands', 'Brazil', 'Mexico', 'Japan',
  'South Korea', 'India', 'Singapore', 'UAE', 'South Africa', 'Saudi Arabia', 'Egypt'
];

const languages = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
  'Dutch', 'Japanese', 'Korean', 'Chinese (Simplified)', 'Chinese (Traditional)', 
  'Arabic', 'Hindi', 'Russian'
];

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Retail', 'Food & Beverage', 
  'Fashion', 'Automotive', 'Travel', 'Entertainment', 'Education', 
  'Real Estate', 'Sports', 'Beauty', 'Gaming', 'Telecommunications', 'Other'
];

export function CampaignSetup() {
  const { createCampaign, setCurrentPage } = useAppStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignResults, setCampaignResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({
    // Brand Details
    brandName: '',
    companyName: '',
    industry: '',
    website: '',
    description: '',
    
    // Keywords & Hashtags
    brandKeywords: [],
    productKeywords: [],
    hashtags: [],
    excludeKeywords: [],
    
    // Social Platforms
    selectedPlatforms: ['twitter', 'instagram', 'facebook'],
    socialHandles: {},
    
    // Geographic & Language
    targetCountries: ['United States'],
    languages: ['English'],
    
    
    sentimentTracking: true,
    influencerTracking: true,
    historicalData: '30days'
  });

  const [tempInputs, setTempInputs] = useState<Record<string, string>>({
    brandKeywords: '',
    productKeywords: '',
    hashtags: '',
    excludeKeywords: ''
  });

  const updateTempInput = (field: string, value: string) => {
    setTempInputs(prev => ({ ...prev, [field]: value }));
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addToArray = (field: string, value: string) => {
    const arr = formData[field] as string[];
    if (value.trim() && !arr.includes(value.trim())) {
      updateFormData(field, [...arr, value.trim()]);
    }
  };

  const removeFromArray = (field: string, value: string) => {
    const arr = formData[field] as string[];
    updateFormData(field, arr.filter((item: string) => item !== value));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStep5Valid = () => {
    return (
      formData.brandName.trim() !== '' &&
      formData.industry.trim() !== '' &&
      (formData.brandKeywords.length + formData.productKeywords.length + formData.hashtags.length) > 0
    );
  };

  const launchCampaign = async () => {
    console.log('Launching social listening campaign with data:', formData);
    setIsLoading(true);
    setError(null);
    setCurrentStep(6);

    try {
      // Create campaign in store
      const campaignData = {
        name: formData.brandName || 'Social Listening Campaign',
        keywords: [...formData.brandKeywords, ...formData.productKeywords, ...formData.hashtags],
        platforms: formData.selectedPlatforms,
        status: 'running' as const,
        settings: {
          resultsCount: 500,
          timeWindow: 30,
          maxPosts: 200,
          maxComments: 50
        }
      };

      // Add to store
      createCampaign(campaignData);

      // Call social listening API
      const res = await fetch('/api/social-listening', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: campaignData.name,
          keywords: campaignData.keywords,
          platforms: campaignData.platforms,
          settings: campaignData.settings,
          generateReport: true,
          socialHandles: formData.socialHandles
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
      }

      const result = await res.json();
      console.log('Social listening campaign result:', result);
      
      setCampaignResults(result.data);
      // Store results in global store for dashboard access
      useAppStore.getState().setCurrentCampaignResults(result.data);

    } catch (error) {
      console.error('Error launching social listening campaign:', error);
      setError(error instanceof Error ? error.message : 'Failed to launch campaign');
    } finally {
      setIsLoading(false);
    }
  };

  const progress = (currentStep / steps.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Building className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Tell us about your brand
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Basic information to get started with your social listening campaign
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="brandName">Brand Name *</Label>
                <Input
                  id="brandName"
                  placeholder="e.g., TechCorp Pro"
                  value={formData.brandName}
                  onChange={(e) => updateFormData('brandName', e.target.value)}
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="e.g., TechCorp Inc."
                  value={formData.companyName}
                  onChange={(e) => updateFormData('companyName', e.target.value)}
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Select value={formData.industry} onValueChange={(value) => updateFormData('industry', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry: string) => (
                      <SelectItem key={industry} value={industry.toLowerCase()}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="https://yourwebsite.com"
                  value={formData.website}
                  onChange={(e) => updateFormData('website', e.target.value)}
                  className="h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Brand Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of your brand, products, or services..."
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Hash className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Keywords & Hashtags
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Define what to track across social media platforms
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Brand Keywords */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Brand Keywords</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add brand keyword..."
                      value={tempInputs.brandKeywords}
                      onChange={(e) => updateTempInput('brandKeywords', e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addToArray('brandKeywords', tempInputs.brandKeywords);
                          updateTempInput('brandKeywords', '');
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        addToArray('brandKeywords', tempInputs.brandKeywords);
                        updateTempInput('brandKeywords', '');
                      }}
                      size="sm"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.brandKeywords.map((keyword: string, index: number) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>{keyword}</span>
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => removeFromArray('brandKeywords', keyword)}
                        />
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Product Keywords */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Product Keywords</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add product keyword..."
                      value={tempInputs.productKeywords}
                      onChange={(e) => updateTempInput('productKeywords', e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addToArray('productKeywords', tempInputs.productKeywords);
                          updateTempInput('productKeywords', '');
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        addToArray('productKeywords', tempInputs.productKeywords);
                        updateTempInput('productKeywords', '');
                      }}
                      size="sm"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.productKeywords.map((keyword: string, index: number) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>{keyword}</span>
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => removeFromArray('productKeywords', keyword)}
                        />
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Hashtags */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Hash className="w-5 h-5" />
                    <span>Hashtags</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add hashtag (without #)..."
                      value={tempInputs.hashtags}
                      onChange={(e) => updateTempInput('hashtags', e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addToArray('hashtags', tempInputs.hashtags.replace('#', ''));
                          updateTempInput('hashtags', '');
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        addToArray('hashtags', tempInputs.hashtags.replace('#', ''));
                        updateTempInput('hashtags', '');
                      }}
                      size="sm"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.hashtags.map((hashtag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>#{hashtag}</span>
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => removeFromArray('hashtags', hashtag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Exclude Keywords */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <X className="w-5 h-5" />
                    <span>Exclude Keywords</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add keyword to exclude..."
                      value={tempInputs.excludeKeywords}
                      onChange={(e) => updateTempInput('excludeKeywords', e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addToArray('excludeKeywords', tempInputs.excludeKeywords);
                          updateTempInput('excludeKeywords', '');
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        addToArray('excludeKeywords', tempInputs.excludeKeywords);
                        updateTempInput('excludeKeywords', '');
                      }}
                      size="sm"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.excludeKeywords.map((keyword: string, index: number) => (
                      <Badge key={index} variant="destructive" className="flex items-center space-x-1">
                        <span>{keyword}</span>
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => removeFromArray('excludeKeywords', keyword)}
                        />
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Smartphone className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Social Platforms
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Choose which platforms to track for mentions
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Popular Platforms</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {platforms.filter(p => p.popular).map((platform: any) => (
                  <Card 
                    key={platform.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      formData.selectedPlatforms.includes(platform.id) 
                        ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => {
                      const platforms = formData.selectedPlatforms.includes(platform.id)
                        ? formData.selectedPlatforms.filter((p: string) => p !== platform.id)
                        : [...formData.selectedPlatforms, platform.id];
                      updateFormData('selectedPlatforms', platforms);
                    }}
                  >
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 rounded-full ${platform.color} flex items-center justify-center text-white text-xl mx-auto mb-2`}>
                        {platform.icon}
                      </div>
                      <p className="font-medium text-sm">{platform.name}</p>
                      {formData.selectedPlatforms.includes(platform.id) && (
                        <Check className="w-5 h-5 text-blue-600 mx-auto mt-2" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Additional Platforms</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {platforms.filter(p => !p.popular).map((platform: any) => (
                  <Card 
                    key={platform.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      formData.selectedPlatforms.includes(platform.id) 
                        ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => {
                      const platforms = formData.selectedPlatforms.includes(platform.id)
                        ? formData.selectedPlatforms.filter((p: string) => p !== platform.id)
                        : [...formData.selectedPlatforms, platform.id];
                      updateFormData('selectedPlatforms', platforms);
                    }}
                  >
                    <CardContent className="p-3 text-center">
                      <div className={`w-10 h-10 rounded-full ${platform.color} flex items-center justify-center text-white text-lg mx-auto mb-2`}>
                        {platform.icon}
                      </div>
                      <p className="font-medium text-xs">{platform.name}</p>
                      {formData.selectedPlatforms.includes(platform.id) && (
                        <Check className="w-4 h-4 text-blue-600 mx-auto mt-1" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Social Handles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AtSign className="w-5 h-5" />
                    <span>Your Social Handles</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.selectedPlatforms.map((platformId: string) => {
                    const platform = platforms.find(p => p.id === platformId);
                    return (
                      <div key={platformId} className="space-y-2">
                        <Label htmlFor={platformId}>{platform?.name} Handle</Label>
                        <Input
                          id={platformId}
                          placeholder={`@your${platformId}handle`}
                          value={formData.socialHandles[platformId] || ''}
                          onChange={(e) => updateFormData('socialHandles', {
                            ...formData.socialHandles,
                            [platformId]: e.target.value
                          })}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Globe className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Geographic & Language Settings
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Define your target regions and languages for tracking
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Target Countries */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Target Countries</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                    {countries.map((country: string) => (
                      <div key={country} className="flex items-center space-x-2">
                        <Checkbox
                          id={country}
                          checked={formData.targetCountries.includes(country)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateFormData('targetCountries', [...formData.targetCountries, country]);
                            } else {
                              updateFormData('targetCountries', formData.targetCountries.filter((c: string) => c !== country));
                            }
                          }}
                        />
                        <Label htmlFor={country} className="text-sm">{country}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Languages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Languages className="w-5 h-5" />
                    <span>Languages</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                    {languages.map((language: string) => (
                      <div key={language} className="flex items-center space-x-2">
                        <Checkbox
                          id={language}
                          checked={formData.languages.includes(language)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateFormData('languages', [...formData.languages, language]);
                            } else {
                              updateFormData('languages', formData.languages.filter((l: string) => l !== language));
                            }
                          }}
                        />
                        <Label htmlFor={language} className="text-sm">{language}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Selected Summary */}
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                      Selected Countries ({formData.targetCountries.length})
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {formData.targetCountries.slice(0, 5).map((country: string) => (
                        <Badge key={country} variant="secondary" className="text-xs">
                          {country}
                        </Badge>
                      ))}
                      {formData.targetCountries.length > 5 && (
                        <Badge variant="secondary" className="text-xs">
                          +{formData.targetCountries.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                      Selected Languages ({formData.languages.length})
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {formData.languages.slice(0, 5).map((language: string) => (
                        <Badge key={language} variant="secondary" className="text-xs">
                          {language}
                        </Badge>
                      ))}
                      {formData.languages.length > 5 && (
                        <Badge variant="secondary" className="text-xs">
                          +{formData.languages.length - 5}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Zap className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Review & Launch Campaign
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Review your settings and launch your social listening campaign
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Brand Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="w-5 h-5" />
                    <span>Brand Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Brand Name:</span>
                    <span className="font-medium">{formData.brandName || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Industry:</span>
                    <span className="font-medium capitalize">{formData.industry || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Keywords:</span>
                    <span className="font-medium">{formData.brandKeywords.length + formData.productKeywords.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Hashtags:</span>
                    <span className="font-medium">{formData.hashtags.length}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Platform Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Smartphone className="w-5 h-5" />
                    <span>Platforms & Coverage</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Platforms:</span>
                    <span className="font-medium">{formData.selectedPlatforms.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Countries:</span>
                    <span className="font-medium">{formData.targetCountries.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Languages:</span>
                    <span className="font-medium">{formData.languages.length}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Keywords Preview */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Hash className="w-5 h-5" />
                    <span>Keywords</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Brand Keywords</h4>
                      <div className="flex flex-wrap gap-1">
                        {formData.brandKeywords.slice(0, 5).map((keyword: string) => (
                          <Badge key={keyword} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                        {formData.brandKeywords.length > 5 && (
                          <Badge variant="secondary" className="text-xs">
                            +{formData.brandKeywords.length - 5}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Product Keywords</h4>
                      <div className="flex flex-wrap gap-1">
                        {formData.productKeywords.slice(0, 5).map((keyword: string) => (
                          <Badge key={keyword} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                        {formData.productKeywords.length > 5 && (
                          <Badge variant="secondary" className="text-xs">
                            +{formData.productKeywords.length - 5}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Hashtags</h4>
                      <div className="flex flex-wrap gap-1">
                        {formData.hashtags.slice(0, 5).map((hashtag: string) => (
                          <Badge key={hashtag} variant="secondary" className="text-xs">
                            #{hashtag}
                          </Badge>
                        ))}
                        {formData.hashtags.length > 5 && (
                          <Badge variant="secondary" className="text-xs">
                            +{formData.hashtags.length - 5}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Launch Card */}
              <Card className="lg:col-span-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-6 text-center">
                  <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Ready to Launch!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Your social listening campaign is configured and ready to start analysing mentions across all selected platforms.
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Target className="w-4 h-4" />
                      <span>Smart analytics</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <FileText className="w-4 h-4" />
                      <span>Full report generation</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <FileText className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Campaign Results
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Your social listening campaign has been completed successfully!
              </p>
            </div>

            {campaignResults ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Results Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5" />
                      <span>Results Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Mentions:</span>
                      <span className="font-medium">{campaignResults.totalMentions || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Platforms Scraped:</span>
                      <span className="font-medium">{campaignResults.processedData?.platforms?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Reports Generated:</span>
                      <span className="font-medium">{campaignResults.reports ? Object.keys(campaignResults.reports).length : 0}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Platform Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Smartphone className="w-5 h-5" />
                      <span>Platform Distribution</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {campaignResults.processedData?.platforms?.length > 0 ? (
                      campaignResults.processedData.platforms.map((platform: any) => (
                        <div key={platform.platform} className="flex justify-between items-center py-2">
                          <span className="capitalize">{platform.platform}</span>
                          <Badge variant="secondary">{platform.count} mentions</Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No platform data available</p>
                    )}
                  </CardContent>
                </Card>

                {/* Scraping Errors */}
                {campaignResults.errors && campaignResults.errors.length > 0 && (
                  <Card className="lg:col-span-2 border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-orange-800 dark:text-orange-200">
                        <div className="w-5 h-5">⚠️</div>
                        <span>Scraping Issues</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1 text-sm text-orange-700 dark:text-orange-300">
                        {campaignResults.errors.map((error: string, index: number) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Generated Reports */}
                {campaignResults.reports && (
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="w-5 h-5" />
                        <span>Generated Reports</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(campaignResults.reports).map(([type, report]: [string, any]) => (
                          <Card key={type} className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium capitalize">{type} Report</h4>
                              <Badge variant="outline">AI Generated</Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {typeof report === 'string' ? report.substring(0, 150) : report.content?.substring(0, 150) || 'No preview available'}...
                            </p>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="w-full"
                              onClick={() => {
                                const reportContent = typeof report === 'string' ? report : report.content || '';
                                console.log('Opening report:', { type, reportType: typeof report, contentLength: reportContent.length });
                                setSelectedReport({ type, content: reportContent });
                                setIsReportModalOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Full Report
                            </Button>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <Card className="lg:col-span-2">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center space-x-4">
                      <Button
                        onClick={() => setCurrentPage('dashboard')}
                        className="flex items-center space-x-2"
                      >
                        <TrendingUp className="w-4 h-4" />
                        <span>Go to Dashboard</span>
                      </Button>
                      <Button
                        onClick={() => setCurrentPage('reports')}
                        variant="outline"
                        className="flex items-center space-x-2"
                      >
                        <FileText className="w-4 h-4" />
                        <span>View All Reports</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading campaign results...</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {selectedReport && (
        <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
          <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="capitalize">{selectedReport.type} Report</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto p-4">
              {selectedReport.content ? (
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{selectedReport.content}</ReactMarkdown>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No content available for this report.</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Create Social Listening Campaign
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Set up comprehensive tracking for your brand across all social platforms
            </p>
          </motion.div>

          {/* Progress Bar */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Step {currentStep} of {steps.length}
              </span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Progress Bar for Scraping */}
          {isLoading && (
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
                      <p className="text-sm font-medium">Running campaign: {formData.brandName || 'Social Listening Campaign'}</p>
                      <Progress value={progress} className="mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 text-red-600">⚠️</div>
                    <p className="text-red-800 dark:text-red-200 font-medium">Error: {error}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step Indicators */}
          <div className="flex items-center justify-center space-x-2 mb-8 overflow-x-auto pb-2">
            {steps.map((step: any, index: number) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div
                  key={step.id}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : isCompleted 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <StepIcon className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium hidden sm:inline">
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardContent className="p-8">
              {renderStepContent()}
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between max-w-6xl mx-auto mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <div className="flex items-center space-x-4">
            {currentStep < steps.length ? (
              <Button
                onClick={nextStep}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={launchCampaign}
                disabled={isLoading || !isStep5Valid()}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Launching Campaign...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Launch Campaign</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}