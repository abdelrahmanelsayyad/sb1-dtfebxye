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
  FileText
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

const steps = [
  { id: 1, title: 'Brand Details', icon: Building, description: 'Basic information about your brand' },
  { id: 2, title: 'Keywords & Hashtags', icon: Hash, description: 'What to track across platforms' },
  { id: 3, title: 'Social Platforms', icon: Smartphone, description: 'Where to listen for mentions' },
  { id: 4, title: 'Geographic & Language', icon: Globe, description: 'Target regions and languages' },
  { id: 5, title: 'Review & Launch', icon: Zap, description: 'Finalize your campaign' }
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
  'South Korea', 'India', 'Singapore', 'UAE', 'South Africa', 'Saudi Arabia'
];

const languages = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
  'Dutch', 'Japanese', 'Korean', 'Chinese (Simplified)', 'Chinese (Traditional)', 
  'Arabic', 'Hindi', 'Russian'
];

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Retail', 'Food & Beverage', 
  'Fashion', 'Automotive', 'Travel', 'Entertainment', 'Education', 
  'Real Estate', 'Sports', 'Beauty', 'Gaming', 'Other'
];

export function CampaignSetup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
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

  const [tempInputs, setTempInputs] = useState({
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
    if (value.trim() && !formData[field].includes(value.trim())) {
      updateFormData(field, [...formData[field], value.trim()]);
    }
  };

  const removeFromArray = (field: string, value: string) => {
    updateFormData(field, formData[field].filter(item => item !== value));
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

  const WEBHOOK_URL = 'https://n8n.srv872107.hstgr.cloud/webhook/8d7fd1cb-4b17-409b-b890-73fb176a1673';

  const launchCampaign = async () => {
    console.log('Launching campaign with data:', formData);

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => null);
      console.log('n8n webhook response:', data);
    } catch (error) {
      console.error('Error sending data to n8n webhook:', error);
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
                    {industries.map((industry) => (
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
                    {formData.brandKeywords.map((keyword, index) => (
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
                    {formData.productKeywords.map((keyword, index) => (
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
                    {formData.hashtags.map((hashtag, index) => (
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
                    {formData.excludeKeywords.map((keyword, index) => (
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
                {platforms.filter(p => p.popular).map((platform) => (
                  <Card 
                    key={platform.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      formData.selectedPlatforms.includes(platform.id) 
                        ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => {
                      const platforms = formData.selectedPlatforms.includes(platform.id)
                        ? formData.selectedPlatforms.filter(p => p !== platform.id)
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
                {platforms.filter(p => !p.popular).map((platform) => (
                  <Card 
                    key={platform.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      formData.selectedPlatforms.includes(platform.id) 
                        ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => {
                      const platforms = formData.selectedPlatforms.includes(platform.id)
                        ? formData.selectedPlatforms.filter(p => p !== platform.id)
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
                  {formData.selectedPlatforms.map((platformId) => {
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
                    {countries.map((country) => (
                      <div key={country} className="flex items-center space-x-2">
                        <Checkbox
                          id={country}
                          checked={formData.targetCountries.includes(country)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateFormData('targetCountries', [...formData.targetCountries, country]);
                            } else {
                              updateFormData('targetCountries', formData.targetCountries.filter(c => c !== country));
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
                    {languages.map((language) => (
                      <div key={language} className="flex items-center space-x-2">
                        <Checkbox
                          id={language}
                          checked={formData.languages.includes(language)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateFormData('languages', [...formData.languages, language]);
                            } else {
                              updateFormData('languages', formData.languages.filter(l => l !== language));
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
                      {formData.targetCountries.slice(0, 5).map((country) => (
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
                      {formData.languages.slice(0, 5).map((language) => (
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
                        {formData.brandKeywords.slice(0, 5).map((keyword) => (
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
                        {formData.productKeywords.slice(0, 5).map((keyword) => (
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
                        {formData.hashtags.slice(0, 5).map((hashtag) => (
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

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
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

          {/* Step Indicators */}
          <div className="flex items-center justify-center space-x-2 mb-8 overflow-x-auto pb-2">
            {steps.map((step, index) => {
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
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              >
                <Zap className="w-5 h-5" />
                <span>Launch Campaign</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}