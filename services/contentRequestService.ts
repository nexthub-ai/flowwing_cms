/**
 * Content Request Service
 * Handles client content requests (inbox)
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { ContentRequest, MediaItem } from '@/types';

export interface ContentRequestWithClient extends ContentRequest {
  client_name: string | null;
  client_email: string | null;
  content_type_name: string | null;
  content_type_icon: string | null;
}

export interface CreateContentRequestData {
  client_id: string;
  title: string;
  description?: string;
  content_type_id?: string;
  reference_urls?: string[];
  attachments?: MediaItem[];
  requested_date?: string;
  urgency?: 'low' | 'normal' | 'high' | 'urgent';
}

export interface UpdateContentRequestData {
  title?: string;
  description?: string;
  content_type_id?: string;
  reference_urls?: string[];
  attachments?: MediaItem[];
  requested_date?: string;
  urgency?: 'low' | 'normal' | 'high' | 'urgent';
  status?: 'pending' | 'accepted' | 'declined' | 'converted';
  admin_notes?: string;
  responded_by?: string;
  responded_at?: string;
  converted_to_content_id?: string;
}

export class ContentRequestService {
  /**
   * Get all content requests with client info
   */
  static async getAll(
    supabase: SupabaseClient,
    filters?: {
      status?: string;
      client_id?: string;
      urgency?: string;
    }
  ): Promise<ContentRequestWithClient[]> {
    let query = supabase
      .from('content_requests')
      .select(`
        *,
        clients!inner(name, email),
        content_types(name, icon)
      `)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.client_id) {
      query = query.eq('client_id', filters.client_id);
    }
    if (filters?.urgency) {
      query = query.eq('urgency', filters.urgency);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map((item: any) => ({
      ...item,
      client_name: item.clients?.name || null,
      client_email: item.clients?.email || null,
      content_type_name: item.content_types?.name || null,
      content_type_icon: item.content_types?.icon || null,
      clients: undefined,
      content_types: undefined,
    }));
  }

  /**
   * Get pending requests count
   */
  static async getPendingCount(supabase: SupabaseClient): Promise<number> {
    const { count, error } = await supabase
      .from('content_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (error) throw error;
    return count || 0;
  }

  /**
   * Get a single content request by ID
   */
  static async getById(
    supabase: SupabaseClient,
    id: string
  ): Promise<ContentRequestWithClient | null> {
    const { data, error } = await supabase
      .from('content_requests')
      .select(`
        *,
        clients!inner(name, email),
        content_types(name, icon)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return {
      ...data,
      client_name: data.clients?.name || null,
      client_email: data.clients?.email || null,
      content_type_name: data.content_types?.name || null,
      content_type_icon: data.content_types?.icon || null,
      clients: undefined,
      content_types: undefined,
    };
  }

  /**
   * Create a new content request
   */
  static async create(
    supabase: SupabaseClient,
    data: CreateContentRequestData
  ): Promise<ContentRequest> {
    const { data: request, error } = await supabase
      .from('content_requests')
      .insert({
        client_id: data.client_id,
        title: data.title,
        description: data.description || null,
        content_type_id: data.content_type_id || null,
        reference_urls: data.reference_urls || [],
        attachments: data.attachments || [],
        requested_date: data.requested_date || null,
        urgency: data.urgency || 'normal',
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return request;
  }

  /**
   * Update a content request
   */
  static async update(
    supabase: SupabaseClient,
    id: string,
    updates: UpdateContentRequestData
  ): Promise<ContentRequest> {
    const { data, error } = await supabase
      .from('content_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Accept a content request
   */
  static async accept(
    supabase: SupabaseClient,
    id: string,
    respondedBy: string
  ): Promise<ContentRequest> {
    return this.update(supabase, id, {
      status: 'accepted',
      responded_by: respondedBy,
      responded_at: new Date().toISOString(),
    });
  }

  /**
   * Decline a content request
   */
  static async decline(
    supabase: SupabaseClient,
    id: string,
    respondedBy: string,
    adminNotes?: string
  ): Promise<ContentRequest> {
    return this.update(supabase, id, {
      status: 'declined',
      responded_by: respondedBy,
      responded_at: new Date().toISOString(),
      admin_notes: adminNotes,
    });
  }

  /**
   * Convert request to content
   */
  static async convertToContent(
    supabase: SupabaseClient,
    requestId: string,
    contentId: string,
    respondedBy: string
  ): Promise<ContentRequest> {
    return this.update(supabase, requestId, {
      status: 'converted',
      converted_to_content_id: contentId,
      responded_by: respondedBy,
      responded_at: new Date().toISOString(),
    });
  }

  /**
   * Delete a content request
   */
  static async delete(supabase: SupabaseClient, id: string): Promise<void> {
    const { error } = await supabase
      .from('content_requests')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Get requests by client ID
   */
  static async getByClientId(
    supabase: SupabaseClient,
    clientId: string
  ): Promise<ContentRequestWithClient[]> {
    return this.getAll(supabase, { client_id: clientId });
  }
}
