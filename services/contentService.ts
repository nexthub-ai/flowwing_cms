import { SupabaseClient } from '@supabase/supabase-js';
import { CONTENT_STATUS, ContentStatus, Platform } from '@/constants/constants';

/**
 * Content Post interface
 */
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

/**
 * Data for creating a new post
 */
export interface CreatePostData {
  user_id: string;
  title: string;
  content?: string;
  status?: ContentStatus;
  platform?: Platform;
  scheduled_at?: string;
  client_id?: string;
  media_urls?: string[];
  hashtags?: string[];
  notes?: string;
}

/**
 * Filters for querying content posts
 */
export interface ContentFilters {
  status?: ContentStatus;
  platform?: Platform;
  clientId?: string;
}

/**
 * Service for content operations
 * Follows clean architecture: Component → Service → Database
 */
export class ContentService {
  /**
   * Fetch content posts with optional filters
   */
  static async getContentPosts(
    supabase: SupabaseClient,
    filters?: ContentFilters
  ): Promise<ContentPost[]> {
    try {
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
      return (data as ContentPost[]) || [];
    } catch (error) {
      console.error('Failed to fetch content posts:', error);
      throw error;
    }
  }

  /**
   * Get a single content post by ID
   */
  static async getContentPostById(
    supabase: SupabaseClient,
    id: string
  ): Promise<ContentPost | null> {
    try {
      const { data, error } = await supabase
        .from('content_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as ContentPost;
    } catch (error) {
      console.error('Failed to fetch content post:', error);
      return null;
    }
  }

  /**
   * Create new content post
   */
  static async createContentPost(
    supabase: SupabaseClient,
    postData: CreatePostData
  ): Promise<ContentPost> {
    try {
      const { data, error } = await supabase
        .from('content_posts')
        .insert({
          ...postData,
          status: postData.status || CONTENT_STATUS.DRAFT,
        })
        .select()
        .single();

      if (error) throw error;
      return data as ContentPost;
    } catch (error) {
      console.error('Failed to create content post:', error);
      throw error;
    }
  }

  /**
   * Update existing content post
   */
  static async updateContentPost(
    supabase: SupabaseClient,
    id: string,
    updates: Partial<ContentPost>
  ): Promise<ContentPost> {
    try {
      const { data, error } = await supabase
        .from('content_posts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as ContentPost;
    } catch (error) {
      console.error('Failed to update content post:', error);
      throw error;
    }
  }

  /**
   * Delete content post
   */
  static async deleteContentPost(
    supabase: SupabaseClient,
    id: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('content_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete content post:', error);
      throw error;
    }
  }

  /**
   * Update post status
   */
  static async updatePostStatus(
    supabase: SupabaseClient,
    id: string,
    status: ContentStatus
  ): Promise<ContentPost> {
    return this.updateContentPost(supabase, id, { status });
  }
}
