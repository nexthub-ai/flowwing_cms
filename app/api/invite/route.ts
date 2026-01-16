import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/supabase/server';

/**
 * POST /api/invite
 * Send invitation email to client or creator
 * Requires admin/pms role
 */
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has admin/pms role
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const hasPermission = roles?.some(r => r.role === 'admin' || r.role === 'pms');
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden: Admin or PMS role required' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { type, email, clientId, creatorName, specialty, message } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (type !== 'client' && type !== 'creator') {
      return NextResponse.json(
        { error: 'Invalid invitation type. Must be "client" or "creator"' },
        { status: 400 }
      );
    }

    // Use service client for admin operations
    const serviceClient = createServiceClient();

    // Check if invitation already exists and is pending
    const { data: existing } = await serviceClient
      .from('invitations')
      .select('*')
      .eq('email', email)
      .eq('status', 'pending')
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'An invitation is already pending for this email', invitation: existing },
        { status: 409 }
      );
    }

    // Create invitation record
    const invitationData: any = {
      email,
      role: type,
      invited_by: user.id,
      message,
      token: crypto.randomUUID(),
    };

    if (type === 'client' && clientId) {
      invitationData.client_id = clientId;
    }

    if (type === 'creator') {
      invitationData.creator_name = creatorName || email.split('@')[0];
      invitationData.creator_specialty = specialty;
    }

    const { data: invitation, error: insertError } = await serviceClient
      .from('invitations')
      .insert(invitationData)
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create invitation record' },
        { status: 500 }
      );
    }

    // Send invitation via Supabase Auth
    const redirectTo = type === 'client'
      ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
      : `${process.env.NEXT_PUBLIC_APP_URL}/my-tasks`;

    const { error: inviteError } = await serviceClient.auth.admin.inviteUserByEmail(
      email,
      {
        redirectTo,
        data: {
          invitation_id: invitation.id,
          role: type,
        },
      }
    );

    if (inviteError) {
      console.error('Auth invite error:', inviteError);
      // Still return success but note the email issue
      return NextResponse.json({
        invitation,
        warning: `Invitation created but email may not have been sent: ${inviteError.message}`,
      });
    }

    return NextResponse.json({
      invitation,
      message: `Invitation sent successfully to ${email}`,
    });

  } catch (error) {
    console.error('Invite API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/invite
 * Get all invitations (admin/pms only)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check permissions
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const hasPermission = roles?.some(r => r.role === 'admin' || r.role === 'pms');
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get query params
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const status = searchParams.get('status');

    // Fetch invitations
    let query = supabase
      .from('invitations')
      .select(`
        *,
        inviter:invited_by (
          email
        ),
        client:client_id (
          name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (role) {
      query = query.eq('role', role);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch invitations' },
        { status: 500 }
      );
    }

    return NextResponse.json({ invitations: data || [] });

  } catch (error) {
    console.error('Get invitations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/invite?id=xxx&action=resend
 * Resend invitation email
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check permissions
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const hasPermission = roles?.some(r => r.role === 'admin' || r.role === 'pms');
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const action = searchParams.get('action');

    if (!id) {
      return NextResponse.json(
        { error: 'Invitation ID is required' },
        { status: 400 }
      );
    }

    const serviceClient = createServiceClient();

    // Get the invitation
    const { data: invitation, error: fetchError } = await serviceClient
      .from('invitations')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    if (action === 'resend') {
      // Update expiration
      const { error: updateError } = await serviceClient
        .from('invitations')
        .update({
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
        })
        .eq('id', id);

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to update invitation' },
          { status: 500 }
        );
      }

      // Resend via Supabase Auth
      const redirectTo = invitation.role === 'client'
        ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
        : `${process.env.NEXT_PUBLIC_APP_URL}/my-tasks`;

      const { error: inviteError } = await serviceClient.auth.admin.inviteUserByEmail(
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
        return NextResponse.json({
          message: 'Invitation updated but email may not have been sent',
          warning: inviteError.message,
        });
      }

      return NextResponse.json({ message: 'Invitation resent successfully' });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('PUT invite error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/invite?id=xxx
 * Cancel an invitation
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check permissions
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const hasPermission = roles?.some(r => r.role === 'admin' || r.role === 'pms');
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Invitation ID is required' },
        { status: 400 }
      );
    }

    const serviceClient = createServiceClient();

    // Update status to cancelled
    const { error } = await serviceClient
      .from('invitations')
      .update({ status: 'cancelled' })
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to cancel invitation' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Invitation cancelled' });

  } catch (error) {
    console.error('DELETE invite error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
