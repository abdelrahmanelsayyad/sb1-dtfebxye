'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ExternalLink, MessageCircle, Heart, Share2, Calendar } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';

interface Mention {
  id: string;
  platform: 'twitter' | 'instagram' | 'reddit' | 'facebook';
  content: string;
  author: string;
  timestamp: Date;
  engagement?: {
    likes?: number;
    comments?: number;
    shares?: number;
  };
  url?: string;
  hashtags?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export function MentionsFeed() {
  const { currentCampaignResults } = useAppStore();

  const mentions: Mention[] = currentCampaignResults?.mentions || [];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return '𝕏';
      case 'instagram':
        return '📷';
      case 'facebook':
        return '👥';
      case 'reddit':
        return '🤖';
      default:
        return '🌐';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return 'bg-black text-white';
      case 'instagram':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'facebook':
        return 'bg-blue-600 text-white';
      case 'reddit':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'neutral':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (mentions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>Recent Mentions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[200px]">
            <div className="text-center text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No mentions yet</p>
              <p className="text-sm">Run a social listening campaign to see mentions</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>Recent Mentions</span>
            </div>
            <Badge variant="secondary">
              {mentions.length} mentions
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mentions.slice(0, 10).map((mention, index) => (
            <motion.div
              key={mention.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="text-sm">
                    {mention.author.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-sm">{mention.author}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getPlatformColor(mention.platform)}`}
                    >
                      {getPlatformIcon(mention.platform)} {mention.platform}
                    </Badge>
                    {mention.sentiment && (
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getSentimentColor(mention.sentiment)}`}
                      >
                        {mention.sentiment}
                      </Badge>
                    )}
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(mention.timestamp)}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    {truncateContent(mention.content)}
                  </p>
                  
                  {mention.hashtags && mention.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {mention.hashtags.slice(0, 3).map((hashtag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          #{hashtag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      {mention.engagement?.likes !== undefined && (
                        <div className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>{mention.engagement.likes}</span>
                        </div>
                      )}
                      {mention.engagement?.comments !== undefined && (
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>{mention.engagement.comments}</span>
                        </div>
                      )}
                      {mention.engagement?.shares !== undefined && (
                        <div className="flex items-center space-x-1">
                          <Share2 className="w-3 h-3" />
                          <span>{mention.engagement.shares}</span>
                        </div>
                      )}
                    </div>
                    
                    {mention.url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => window.open(mention.url, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {mentions.length > 10 && (
            <div className="text-center pt-4">
              <Button variant="outline" size="sm">
                View all {mentions.length} mentions
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}