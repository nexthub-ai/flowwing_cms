/**
 * Invitation Service
 * Handles inviting clients and creators via Supabase Auth
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { BaseService } from './baseService';

export type InvitationRole = 'client' | 'creator';
export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'cancelled';

export interface Invitation {
  id: string;
  email: string;
  role: InvitationRole;
  status: InvitationStatus;
  client_id: string | null;
  creator_name: string | null;
  creator_specialty: string | null;
  invited_by: string | null;
  message: string | null;
  token: string | null;
  expires_at: string;
  accepted_at: string | null;
  accepted_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface InviteClientParams {
  email: string;
  clientId: string;
  message?: string;
  invitedBy: string;
}

export interface InviteCreatorParams {
  email: string;
  name: string;
  specialty?: 'writer' | 'designer' | 'editor' | 'videographer';
  message?: string;
  invitedBy: string;
}

export class InvitationService extends BaseService {
  /**
   * Invite a client to join the platform
   * Creates invitation record and sends Supabase magic link
   */
  static async inviteClient(
    supabase: SupabaseClient,
    params: InviteClientParams
  ): Promise<{ invitation: Invitation; error?: string }> {
    try {
      // Check if invitation already exists and is pending
      const { data: existing } = await supabase
        .from('invitations')
        .select('*')
        .eq('email', params.email)
        .eq('status', 'pending')
        .single();

      if (existing) {
        return {
          invitation: existing,
          error: 'An invitation is already pending for this email',
        };
      }

      // Create invitation record
      const { data: invitation, error: insertError } = await supabase
        .from('invitations')
        .insert({
          email: params.email,
          role: 'client',
          client_id: params.clientId,
          invited_by: params.invitedBy,
          message: params.message,
          token: crypto.randomUUID(),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Send invitation via Supabase Auth
      // This uses the invite user by email which sends a magic link
      const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
        params.email,
        {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
          data: {
            invitation_id: invitation.id,
            role: 'client',
          },
        }
      );

      if (inviteError) {
        // If auth invite fails, still keep the invitation record
        console.error('Auth invite error:', inviteError);
        return {
          invitation,
          error: `Invitation created but email failed: ${inviteError.message}`,
        };
      }

      return { invitation };
    } catch (error) {
      console.error('[InvitationService.inviteClient] Error:', error);
      throw error;
    }
  }

  /**
   * Invite a creator/freelancer to join the platform
   */
  static async inviteCreator(
    supabase: SupabaseClient,
    params: InviteCreatorParams
  ): Promise<{ invitation: Invitation; error?: string }> {
    try {
      // Check if invitation already exists and is pending
      const { data: existing } = await supabase
        .from('invitations')
        .select('*')
        .eq('email', params.email)
        .eq('status', 'pending')
        .single();

      if (existing) {
        return {
          invitation: existing,
          error: 'An invitation is already pending for this email',
        };
      }

      // Create invitation record
      const { data: invitation, error: insertError } = await supabase
        .from('invitations')
        .insert({
          email: params.email,
          role: 'creator',
          creator_name: params.name,
          creator_specialty: params.specialty,
          invited_by: params.invitedBy,
          message: params.message,
          token: crypto.randomUUID(),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Send invitation via Supabase Auth
      const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
        params.email,
        {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/my-tasks`,
          data: {
            invitation_id: invitation.id,
            role: 'creator',
          },
        }
      );

      if (inviteError) {
        console.error('Auth invite error:', inviteError);
        return {
          invitation,
          error: `Invitation created but email failed: ${inviteError.message}`,
        };
      }

      return { invitation };
    } catch (error) {
      console.error('[InvitationService.inviteCreator] Error:', error);
      throw error;
    }
  }

  /**
   * Get all invitations
   */
  static async getInvitations(
    supabase: SupabaseClient,
    filters?: { role?: InvitationRole; status?: InvitationStatus }
  ): Promise<Invitation[]> {
    try {
      let query = supabase
        .from('invitations')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.role) {
        query = query.eq('role', filters.role);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[InvitationService.getInvitations] Error:', error);
      return [];
    }
  }

  /**
   * Resend invitation email
   */
  static async resendInvitation(
    supabase: SupabaseClient,
    invitationId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Get invitation
      const { data: invitation, error: fetchError } = await supabase
        .from('invitations')
        .select('*')
        .eq('id', invitationId)
        .single();

      if (fetchError || !invitation) {
        return { success: false, error: 'Invitation not found' };
      }

      if (invitation.status !== 'pending') {
        return { success: false, error: 'Invitation is no longer pending' };
      }

      // Update expiry
      await supabase
        .from('invitations')
        .update({
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('id', invitationId);

      // Resend via Supabase Auth
      const redirectTo = invitation.role === 'client'
        ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
        : `${process.env.NEXT_PUBLIC_APP_URL}/my-tasks`;

      const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
        invitation.email,
        {
          redirectTo,
          data: {
            invitation_id: invitation.id,
            role: invitation.role,
          },
        }
      );

      if (inviteError) {
        return { success: false, error: inviteError.message };
      }

      return { success: true };
    } catch (error) {
      console.error('[InvitationService.resendInvitation] Error:', error);
      return { success: false, error: 'Failed to resend invitation' };
    }
  }

  /**
   * Cancel invitation
   */
  static async cancelInvitation(
    supabase: SupabaseClient,
    invitationId: string
  ): Promise<{ success: boolean }> {
    try {
      const { error } = await supabase
        .from('invitations')
        .update({ status: 'cancelled' })
        .eq('id', invitationId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('[InvitationService.cancelInvitation] Error:', error);
      return { success: false };
    }
  }

  /**
   * Get all creators
   */
  static async getCreators(
    supabase: SupabaseClient
  ): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('creator_profiles')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[InvitationService.getCreators] Error:', error);
      return [];
    }
  }
}
