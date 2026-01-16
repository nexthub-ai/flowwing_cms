/**
 * Content Service
 * CRUD operations for content management
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { BaseService } from './baseService';
import {
  Content,
  ContentFull,
  ContentFormData,
  ContentFilters,
  PaginationParams,
  PaginatedResponse,
  ContentComment,
  ContentCommentWithUser,
  ContentVersion,
} from '@/types';
import { ContentStatus, CONTENT_STATUS } from '@/constants/constants';

export class ContentService extends BaseService {
  // ============================================================================
  // CONTENT CRUD
  // ============================================================================

  /**
   * Get all content with filters and pagination
   */
  static async getContent(
    supabase: SupabaseClient,
    filters?: ContentFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<ContentFull>> {
    try {
      // Build base query
      let query = supabase
        .from('content_full')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters) {
        if (filters.status) {
          if (Array.isArray(filters.status)) {
            query = query.in('status', filters.status);
          } else {
            query = query.eq('status', filters.status);
          }
        }
        if (filters.client_id) {
          query = query.eq('client_id', filters.client_id);
        }
        if (filters.content_type_id) {
          query = query.eq('content_type_id', filters.content_type_id);
        }
        if (filters.assigned_to) {
          query = query.eq('assigned_to', filters.assigned_to);
        }
        if (filters.priority) {
          query = query.eq('priority', filters.priority);
        }
        if (filters.search) {
          query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }
        if (filters.date_from) {
          query = query.gte('created_at', filters.date_from);
        }
        if (filters.date_to) {
          query = query.lte('created_at', filters.date_to);
        }
      }

      // Apply sorting and pagination
      query = this.applySorting(query, pagination || {});
      query = this.applyPagination(query, pagination || {});

      const { data, error, count } = await query;

      if (error) throw error;

      return this.paginate(
        (data as ContentFull[]) || [],
        count || 0,
        pagination || {}
      );
    } catch (error) {
      this.handleError(error, 'ContentService.getContent');
    }
  }

  /**
   * Get content by ID
   */
  static async getContentById(
    supabase: SupabaseClient,
    id: string
  ): Promise<ContentFull | null> {
    try {
      const { data, error } = await supabase
        .from('content_full')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as ContentFull;
    } catch (error) {
      console.error('Failed to fetch content:', error);
      return null;
    }
  }

  /**
   * Get content by status (for kanban columns)
   */
  static async getContentByStatus(
    supabase: SupabaseClient,
    status: ContentStatus | ContentStatus[]
  ): Promise<ContentFull[]> {
    try {
      let query = supabase
        .from('content_full')
        .select('*');

      if (Array.isArray(status)) {
        query = query.in('status', status);
      } else {
        query = query.eq('status', status);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return (data as ContentFull[]) || [];
    } catch (error) {
      this.handleError(error, 'ContentService.getContentByStatus');
    }
  }

  /**
   * Get content assigned to a user
   */
  static async getAssignedContent(
    supabase: SupabaseClient,
    userId: string,
    filters?: ContentFilters
  ): Promise<ContentFull[]> {
    try {
      let query = supabase
        .from('content_full')
        .select('*')
        .or(`assigned_to.eq.${userId},assigned_editor.eq.${userId},assigned_designer.eq.${userId}`);

      if (filters?.status) {
        if (Array.isArray(filters.status)) {
          query = query.in('status', filters.status);
        } else {
          query = query.eq('status', filters.status);
        }
      }

      query = query.order('due_date', { ascending: true, nullsFirst: false });

      const { data, error } = await query;

      if (error) throw error;
      return (data as ContentFull[]) || [];
    } catch (error) {
      this.handleError(error, 'ContentService.getAssignedContent');
    }
  }

  /**
   * Get content for a client
   */
  static async getClientContent(
    supabase: SupabaseClient,
    clientId: string,
    filters?: ContentFilters
  ): Promise<ContentFull[]> {
    try {
      let query = supabase
        .from('content_full')
        .select('*')
        .eq('client_id', clientId);

      if (filters?.status) {
        if (Array.isArray(filters.status)) {
          query = query.in('status', filters.status);
        } else {
          query = query.eq('status', filters.status);
        }
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return (data as ContentFull[]) || [];
    } catch (error) {
      this.handleError(error, 'ContentService.getClientContent');
    }
  }

  /**
   * Create new content
   */
  static async createContent(
    supabase: SupabaseClient,
    data: ContentFormData,
    createdBy: string
  ): Promise<Content> {
    try {
      const { data: content, error } = await supabase
        .from('content')
        .insert({
          ...data,
          created_by: createdBy,
          status: CONTENT_STATUS.INBOX,
        })
        .select()
        .single();

      if (error) throw error;
      return content as Content;
    } catch (error) {
      this.handleError(error, 'ContentService.createContent');
    }
  }

  /**
   * Update content
   */
  static async updateContent(
    supabase: SupabaseClient,
    id: string,
    updates: Partial<ContentFormData>
  ): Promise<Content> {
    try {
      const { data, error } = await supabase
        .from('content')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Content;
    } catch (error) {
      this.handleError(error, 'ContentService.updateContent');
    }
  }

  /**
   * Update content status
   */
  static async updateStatus(
    supabase: SupabaseClient,
    id: string,
    status: ContentStatus
  ): Promise<Content> {
    try {
      const updates: Partial<Content> = { status };

      // Add timestamps for specific statuses
      if (status === CONTENT_STATUS.PUBLISHED) {
        updates.published_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('content')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Content;
    } catch (error) {
      this.handleError(error, 'ContentService.updateStatus');
    }
  }

  /**
   * Assign content to user
   */
  static async assignContent(
    supabase: SupabaseClient,
    id: string,
    assigneeId: string,
    role: 'primary' | 'editor' | 'designer' = 'primary'
  ): Promise<Content> {
    try {
      const updateField = role === 'primary'
        ? 'assigned_to'
        : role === 'editor'
        ? 'assigned_editor'
        : 'assigned_designer';

      const { data, error } = await supabase
        .from('content')
        .update({ [updateField]: assigneeId })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Content;
    } catch (error) {
      this.handleError(error, 'ContentService.assignContent');
    }
  }

  /**
   * Approve content
   */
  static async approveContent(
    supabase: SupabaseClient,
    id: string,
    approvedBy: string
  ): Promise<Content> {
    try {
      const { data, error } = await supabase
        .from('content')
        .update({
          status: CONTENT_STATUS.APPROVED,
          approved_by: approvedBy,
          approved_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Content;
    } catch (error) {
      this.handleError(error, 'ContentService.approveContent');
    }
  }

  /**
   * Request revision
   */
  static async requestRevision(
    supabase: SupabaseClient,
    id: string
  ): Promise<Content> {
    try {
      const { data, error } = await supabase
        .from('content')
        .update({
          status: CONTENT_STATUS.REVISION,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Content;
    } catch (error) {
      this.handleError(error, 'ContentService.requestRevision');
    }
  }

  /**
   * Schedule content
   */
  static async scheduleContent(
    supabase: SupabaseClient,
    id: string,
    scheduledAt: string
  ): Promise<Content> {
    try {
      const { data, error } = await supabase
        .from('content')
        .update({
          status: CONTENT_STATUS.SCHEDULED,
          scheduled_at: scheduledAt,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Content;
    } catch (error) {
      this.handleError(error, 'ContentService.scheduleContent');
    }
  }

  /**
   * Delete content
   */
  static async deleteContent(
    supabase: SupabaseClient,
    id: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      this.handleError(error, 'ContentService.deleteContent');
    }
  }

  // ============================================================================
  // COMMENTS
  // ============================================================================

  /**
   * Get comments for content
   */
  static async getComments(
    supabase: SupabaseClient,
    contentId: string
  ): Promise<ContentCommentWithUser[]> {
    try {
      const { data, error } = await supabase
        .from('content_comments')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('content_id', contentId)
        .is('parent_id', null)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Get replies for each comment
      const comments = (data || []).map((comment: any) => ({
        ...comment,
        user_name: comment.profiles?.full_name || 'Unknown',
        user_avatar: comment.profiles?.avatar_url,
        replies: [],
      }));

      // Fetch replies
      const { data: replies, error: repliesError } = await supabase
        .from('content_comments')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('content_id', contentId)
        .not('parent_id', 'is', null)
        .order('created_at', { ascending: true });

      if (repliesError) throw repliesError;

      // Attach replies to parent comments
      (replies || []).forEach((reply: any) => {
        const parent = comments.find((c: any) => c.id === reply.parent_id);
        if (parent) {
          parent.replies.push({
            ...reply,
            user_name: reply.profiles?.full_name || 'Unknown',
            user_avatar: reply.profiles?.avatar_url,
          });
        }
      });

      return comments as ContentCommentWithUser[];
    } catch (error) {
      this.handleError(error, 'ContentService.getComments');
    }
  }

  /**
   * Add comment
   */
  static async addComment(
    supabase: SupabaseClient,
    contentId: string,
    userId: string,
    comment: string,
    options?: {
      parentId?: string;
      mediaReference?: any;
      isApprovalAction?: boolean;
      approvalDecision?: string;
    }
  ): Promise<ContentComment> {
    try {
      const { data, error } = await supabase
        .from('content_comments')
        .insert({
          content_id: contentId,
          user_id: userId,
          comment,
          parent_id: options?.parentId || null,
          media_reference: options?.mediaReference || null,
          is_approval_action: options?.isApprovalAction || false,
          approval_decision: options?.approvalDecision || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as ContentComment;
    } catch (error) {
      this.handleError(error, 'ContentService.addComment');
    }
  }

  /**
   * Resolve comment
   */
  static async resolveComment(
    supabase: SupabaseClient,
    commentId: string,
    resolvedBy: string
  ): Promise<ContentComment> {
    try {
      const { data, error } = await supabase
        .from('content_comments')
        .update({
          is_resolved: true,
          resolved_by: resolvedBy,
          resolved_at: new Date().toISOString(),
        })
        .eq('id', commentId)
        .select()
        .single();

      if (error) throw error;
      return data as ContentComment;
    } catch (error) {
      this.handleError(error, 'ContentService.resolveComment');
    }
  }

  // ============================================================================
  // VERSIONS
  // ============================================================================

  /**
   * Get content versions
   */
  static async getVersions(
    supabase: SupabaseClient,
    contentId: string
  ): Promise<ContentVersion[]> {
    try {
      const { data, error } = await supabase
        .from('content_versions')
        .select('*')
        .eq('content_id', contentId)
        .order('version_number', { ascending: false });

      if (error) throw error;
      return (data as ContentVersion[]) || [];
    } catch (error) {
      this.handleError(error, 'ContentService.getVersions');
    }
  }

  // ============================================================================
  // CONTENT TYPES
  // ============================================================================

  /**
   * Get all content types from database
   */
  static async getContentTypes(
    supabase: SupabaseClient
  ): Promise<{ id: string; name: string; slug: string; icon: string; color: string; platform: string }[]> {
    try {
      const { data, error } = await supabase
        .from('content_types')
        .select('id, name, slug, icon, color, platform')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch content types:', error);
      return [];
    }
  }

  // ============================================================================
  // STATS
  // ============================================================================

  /**
   * Get content stats by status
   */
  static async getStats(
    supabase: SupabaseClient,
    clientId?: string
  ): Promise<Record<ContentStatus, number>> {
    try {
      let query = supabase
        .from('content')
        .select('status');

      if (clientId) {
        query = query.eq('client_id', clientId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Count by status
      const stats: Record<string, number> = {
        inbox: 0,
        ideation: 0,
        creating: 0,
        review: 0,
        revision: 0,
        approved: 0,
        scheduled: 0,
        published: 0,
      };

      (data || []).forEach((item: { status: string }) => {
        if (item.status in stats) {
          stats[item.status]++;
        }
      });

      return stats as Record<ContentStatus, number>;
    } catch (error) {
      this.handleError(error, 'ContentService.getStats');
    }
  }
}
