/**
 * Custom hook for content posts
 * Handles CRUD operations for content management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { QUERY_KEYS, CONTENT_STATUS, PLATFORMS, ContentStatus, Platform } from '@/constants';

export interface ContentPost {
  id: string;
  user_id: string;
  client_id: string | null;
  title: string;
  content: string | null;
  status: ContentStatus;
  platform: Platform | null;
  scheduled_at: string | null;
  published_at: string | null;
  media_urls: string[] | null;
  hashtags: string[] | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePostData {
  title: string;
  content?: string;
  status?: ContentStatus;
  platform?: Platform;
  scheduled_at?: string;
  media_urls?: string[];
  hashtags?: string[];
  notes?: string;
}

/**
 * Fetch content posts with optional filters
 */
export function useContentPosts(filters?: {
  status?: ContentStatus;
  platform?: Platform;
  clientId?: string;
}) {
  return useQuery({
    queryKey: [QUERY_KEYS.CONTENT_POSTS, filters],
    queryFn: async () => {
      let query = supabase
        .from('content_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.platform) {
        query = query.eq('platform', filters.platform);
      }

      if (filters?.clientId) {
        query = query.eq('client_id', filters.clientId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as ContentPost[];
    },
  });
}

/**
 * Create new content post
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postData: CreatePostData) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('content_posts')
        .insert({
          ...postData,
          user_id: userData.user.id,
          status: postData.status || CONTENT_STATUS.DRAFT,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONTENT_POSTS] });
    },
  });
}

/**
 * Update content post
 */
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<CreatePostData>;
    }) => {
      const { data, error } = await supabase
        .from('content_posts')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONTENT_POSTS] });
    },
  });
}

/**
 * Delete content post
 */
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('content_posts').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONTENT_POSTS] });
    },
  });
}
