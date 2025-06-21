'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, TrendingUp, Users, Activity } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';

interface TwitterAnalytics {
  totalConversations: number;
  totalReplies: number;
  averageRepliesPerConversation: number;
  topConversations: Array<{
    conversationId: string;
    totalEngagement: number;
    replyCount: number;
    originalTweet: string;
  }>;
}

export function TwitterConversations() {
  const { currentCampaignResults } = useAppStore();
  
  const twitterAnalytics: TwitterAnalytics | undefined = currentCampaignResults?.processedData?.twitterAnalytics;

  if (!twitterAnalytics || twitterAnalytics.totalConversations === 0) {
    return null; // Don't show if no Twitter conversations
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="space-y-4"
    >
      {/* Twitter Conversation Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span>Twitter Conversations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {twitterAnalytics.totalConversations}
              </div>
              <div className="text-sm text-muted-foreground">Total Conversations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {twitterAnalytics.totalReplies}
              </div>
              <div className="text-sm text-muted-foreground">Total Replies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {twitterAnalytics.averageRepliesPerConversation.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Replies/Conversation</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Conversations */}
      {twitterAnalytics.topConversations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Top Conversations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {twitterAnalytics.topConversations.map((conversation, index) => (
                <motion.div
                  key={conversation.conversationId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">
                          {conversation.replyCount} replies
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                          {conversation.totalEngagement} engagement
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {conversation.originalTweet}
                      </p>
                      <div className="text-xs text-muted-foreground mt-1">
                        Conversation ID: {conversation.conversationId}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
} 