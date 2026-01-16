-- ============================================================================
-- INVITATIONS TABLE
-- Track pending invitations for clients and creators
-- ============================================================================

-- Create invitation status enum
DO $$
BEGIN
  CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'expired', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create invitation role enum
DO $$
BEGIN
  CREATE TYPE invitation_role AS ENUM ('client', 'creator');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ----------------------------------------------------------------------------
-- INVITATIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Invitation details
  email text NOT NULL,
  role invitation_role NOT NULL,
  status invitation_status DEFAULT 'pending',

  -- Link to entity (client or profile for creator)
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,

  -- Creator-specific fields
  creator_name text,
  creator_specialty text,  -- 'writer', 'designer', 'editor', 'videographer'

  -- Invitation metadata
  invited_by uuid REFERENCES auth.users(id),
  message text,  -- Optional personal message

  -- Tracking
  token text UNIQUE,  -- For custom invite links if needed
  expires_at timestamptz DEFAULT (now() + interval '7 days'),
  accepted_at timestamptz,
  accepted_by uuid REFERENCES auth.users(id),

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_invitations_email ON public.invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON public.invitations(status);
CREATE INDEX IF NOT EXISTS idx_invitations_client_id ON public.invitations(client_id);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON public.invitations(token);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_invitations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_invitations_updated_at ON public.invitations;
CREATE TRIGGER trigger_invitations_updated_at
  BEFORE UPDATE ON public.invitations
  FOR EACH ROW
  EXECUTE FUNCTION update_invitations_updated_at();

-- ----------------------------------------------------------------------------
-- CREATOR PROFILES TABLE (extends profiles for freelancers)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.creator_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic info
  display_name text NOT NULL,
  bio text,
  specialty text[] DEFAULT '{}',  -- ['writer', 'designer', 'editor']
  skills text[] DEFAULT '{}',     -- ['copywriting', 'social media', 'video editing']

  -- Portfolio
  portfolio_url text,
  portfolio_samples jsonb DEFAULT '[]'::jsonb,

  -- Availability
  is_available boolean DEFAULT true,
  hourly_rate decimal(10,2),

  -- Stats
  total_projects integer DEFAULT 0,
  completed_projects integer DEFAULT 0,

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_creator_profiles_user_id ON public.creator_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_specialty ON public.creator_profiles USING GIN(specialty);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_is_available ON public.creator_profiles(is_available);

-- ----------------------------------------------------------------------------
-- FUNCTION: Handle invitation acceptance
-- Called after user signs up via invite link
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION handle_invitation_accepted()
RETURNS TRIGGER AS $$
DECLARE
  v_invitation record;
BEGIN
  -- Find pending invitation for this email
  SELECT * INTO v_invitation
  FROM public.invitations
  WHERE email = NEW.email
    AND status = 'pending'
    AND expires_at > now()
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_invitation IS NOT NULL THEN
    -- Mark invitation as accepted
    UPDATE public.invitations
    SET status = 'accepted',
        accepted_at = now(),
        accepted_by = NEW.id
    WHERE id = v_invitation.id;

    -- Assign role based on invitation
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, v_invitation.role::text)
    ON CONFLICT (user_id, role) DO NOTHING;

    -- If client invitation, link user to client record
    IF v_invitation.role = 'client' AND v_invitation.client_id IS NOT NULL THEN
      UPDATE public.clients
      SET user_id = NEW.id
      WHERE id = v_invitation.client_id;
    END IF;

    -- If creator invitation, create creator profile
    IF v_invitation.role = 'creator' THEN
      INSERT INTO public.creator_profiles (user_id, display_name, specialty)
      VALUES (
        NEW.id,
        COALESCE(v_invitation.creator_name, split_part(NEW.email, '@', 1)),
        CASE WHEN v_invitation.creator_specialty IS NOT NULL
             THEN ARRAY[v_invitation.creator_specialty]
             ELSE '{}'::text[]
        END
      )
      ON CONFLICT (user_id) DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created_invitation ON auth.users;
CREATE TRIGGER on_auth_user_created_invitation
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_invitation_accepted();

-- ----------------------------------------------------------------------------
-- RLS POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;

-- Invitations: Admin/PMS can manage all
CREATE POLICY "Admin can manage invitations"
  ON public.invitations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'pms')
    )
  );

-- Creator profiles: Creators can view/edit their own
CREATE POLICY "Creators can view own profile"
  ON public.creator_profiles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Creators can update own profile"
  ON public.creator_profiles FOR UPDATE
  USING (user_id = auth.uid());

-- Admin can view all creator profiles
CREATE POLICY "Admin can view all creator profiles"
  ON public.creator_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'pms')
    )
  );

-- Admin can manage creator profiles
CREATE POLICY "Admin can manage creator profiles"
  ON public.creator_profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'pms')
    )
  );

-- ----------------------------------------------------------------------------
-- GRANTS
-- ----------------------------------------------------------------------------
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invitations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.creator_profiles TO authenticated;
