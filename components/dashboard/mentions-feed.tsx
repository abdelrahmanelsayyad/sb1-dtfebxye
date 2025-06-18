'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Instagram, Facebook, MessageCircle, Heart, Share2, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore } from '@/lib/store';
import { formatDistanceToNow } from 'date-fns';

const platformIcons = {
  twitter: Twitter,
  instagram: Instagram,
  facebook: Facebook,
  linkedin: MessageCircle,
  tiktok: MessageCircle,
  youtube: MessageCircle,
  reddit: MessageCircle,
  news: MessageCircle,
};

const platformColors = {
  twitter: 'bg-blue-500',
  instagram: 'bg-pink-500',
  facebook: 'bg-blue-600',
  linkedin: 'bg-blue-700',
  tiktok: 'bg-black',
  youtube: 'bg-red-500',
  reddit: 'bg-orange-500',
  news: 'bg-gray-500',
};

export function MentionsFeed() {
  const { mentions } = useAppStore();
  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Real-time Mentions
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {mentions.map((mention, index) => {
              const PlatformIcon = platformIcons[mention.platform];
              const platformColor = platformColors[mention.platform];
              
              return (
                <motion.div
                  key={mention.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full ${platformColor} flex items-center justify-center`}>
                      <PlatformIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">{mention.user.avatar}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{mention.user.name}</span>
                        <span className="text-gray-500 text-sm">{mention.user.handle}</span>
                        {mention.user.verified && (
                          <Badge variant="secondary" className="text-xs">Verified</Badge>
                        )}
                        <div className={`w-2 h-2 rounded-full ${
                          mention.sentimentLabel === 'positive' ? 'bg-green-500' :
                          mention.sentimentLabel === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                        }`} />
                      </div>
                      
                      <p className="text-sm text-gray-900 dark:text-gray-100 mb-3 leading-relaxed">
                        {mention.content.split(' ').map((word, i) => 
                          mention.keywords.some(keyword => word.toLowerCase().includes(keyword.toLowerCase())) ? (
                            <span key={i} className="bg-blue-100 dark:bg-blue-900/30 px-1 rounded font-medium">
                              {word}
                            </span>
                          ) : (
                            <span key={i}>{word}</span>
                          )
                        )}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1 text-gray-500">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm">{mention.engagement.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-500">
                            <Share2 className="w-4 h-4" />
                            <span className="text-sm">{mention.engagement.shares}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-500">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm">{mention.engagement.comments}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(mention.timestamp), { addSuffix: true })}
                          </span>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}