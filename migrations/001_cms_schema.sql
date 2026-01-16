-- ============================================================================
-- FLOWWING CMS - DATABASE MIGRATION
-- Version: 1.0
-- Description: Complete CMS schema for content management workflow
-- Flow: Planning → Creating → Producing → Distributing
-- ============================================================================

-- ============================================================================
-- STEP 1: UPDATE ENUMS
-- ============================================================================

-- Update app_role enum to include creator role (for freelancers)
-- Note: If enum already exists, this will add new values
DO $$
BEGIN
  -- Check if app_role type exists and add 'creator' if not present
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'creator' AND enumtypid = 'app_role'::regtype) THEN
    ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'creator';
  END IF;
EXCEPTION
  WHEN undefined_object THEN
    -- Create the enum if it doesn't exist
    CREATE TYPE app_role AS ENUM ('admin', 'pms', 'creator', 'client');
END $$;

-- Create content_status enum
DO $$
BEGIN
  CREATE TYPE content_status AS ENUM (
    'inbox',        -- New request from client
    'ideation',     -- Brainstorming/planning
    'creating',     -- Being written/designed
    'review',       -- Waiting for approval
    'revision',     -- Changes requested
    'approved',     -- Approved, ready to schedule
    'scheduled',    -- Scheduled for publishing
    'published'     -- Published/completed
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create content_type enum
DO $$
BEGIN
  CREATE TYPE content_type_enum AS ENUM (
    'youtube_video',
    'youtube_short',
    'instagram_post',
    'instagram_reel',
    'instagram_story',
    'tiktok',
    'linkedin_post',
    'twitter_post',
    'facebook_post',
    'blog',
    'podcast',
    'newsletter'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- STEP 2: CREATE NEW TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- CLIENTS TABLE
-- Stores client information (separate from auth.users for flexibility)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,  -- Optional login
  name text NOT NULL,
  email text NOT NULL,
  company_name text,
  phone text,
  avatar_url text,
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON public.clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);

-- ----------------------------------------------------------------------------
-- BRAND PROFILES TABLE
-- Stores brand information (can be created from audit or manually)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.brand_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  audit_signup_id uuid REFERENCES public.audit_signups(id) ON DELETE SET NULL,  -- Link to audit

  -- Brand Identity
  brand_name text NOT NULL,
  tagline text,
  description text,

  -- Brand Voice (for AI assistance)
  brand_voice jsonb DEFAULT '{
    "tone": [],
    "personality": [],
    "dos": [],
    "donts": [],
    "example_phrases": []
  }'::jsonb,

  -- Target Audience
  target_audience jsonb DEFAULT '[{
    "name": "",
    "demographics": "",
    "pain_points": [],
    "goals": [],
    "platforms": []
  }]'::jsonb,

  -- Keywords & Topics
  keywords jsonb DEFAULT '[]'::jsonb,           -- For SEO/hashtags
  content_pillars jsonb DEFAULT '[]'::jsonb,    -- Main content themes

  -- Visual Brand
  colors jsonb DEFAULT '{
    "primary": "",
    "secondary": "",
    "accent": ""
  }'::jsonb,
  fonts jsonb DEFAULT '{
    "heading": "",
    "body": ""
  }'::jsonb,
  logo_url text,
  brand_assets_folder text,                     -- Cloudinary folder

  -- Competitors & Inspiration
  competitors jsonb DEFAULT '[]'::jsonb,
  inspiration_accounts jsonb DEFAULT '[]'::jsonb,

  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_brand_profiles_client_id ON public.brand_profiles(client_id);

-- ----------------------------------------------------------------------------
-- CONTENT TYPES TABLE
-- Configurable content types with default settings
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.content_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,                           -- 'YouTube Video', 'Instagram Reel'
  slug text NOT NULL UNIQUE,                    -- 'youtube_video', 'instagram_reel'
  icon text,                                    -- Icon name or emoji
  color text,                                   -- Hex color for badges
  platform text,                                -- Primary platform

  -- Default template structure
  default_template jsonb DEFAULT '{
    "sections": ["brief", "script", "caption", "hashtags"]
  }'::jsonb,

  -- AI Prompts for this content type
  ai_prompts jsonb DEFAULT '{
    "ideation": "",
    "script": "",
    "caption": "",
    "hashtags": ""
  }'::jsonb,

  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Insert default content types
INSERT INTO public.content_types (name, slug, icon, color, platform, sort_order) VALUES
  ('YouTube Video', 'youtube_video', '🎬', '#FF0000', 'youtube', 1),
  ('YouTube Short', 'youtube_short', '📱', '#FF0000', 'youtube', 2),
  ('Instagram Post', 'instagram_post', '📷', '#E1306C', 'instagram', 3),
  ('Instagram Reel', 'instagram_reel', '🎞️', '#E1306C', 'instagram', 4),
  ('Instagram Story', 'instagram_story', '📖', '#E1306C', 'instagram', 5),
  ('TikTok', 'tiktok', '🎵', '#000000', 'tiktok', 6),
  ('LinkedIn Post', 'linkedin_post', '💼', '#0A66C2', 'linkedin', 7),
  ('Twitter/X Post', 'twitter_post', '🐦', '#1DA1F2', 'twitter', 8),
  ('Facebook Post', 'facebook_post', '👍', '#1877F2', 'facebook', 9),
  ('Blog Article', 'blog', '📝', '#4A5568', 'website', 10),
  ('Podcast Episode', 'podcast', '🎙️', '#9333EA', 'podcast', 11),
  ('Newsletter', 'newsletter', '📧', '#059669', 'email', 12)
ON CONFLICT (slug) DO NOTHING;

-- ----------------------------------------------------------------------------
-- CONTENT TABLE (Main content/posts - enhanced)
-- This replaces/enhances the existing content_posts table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_number serial,                        -- Auto-increment: 1, 2, 3...

  -- Basic Info
  title text NOT NULL,
  description text,
  content_type_id uuid REFERENCES public.content_types(id),
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  brand_id uuid REFERENCES public.brand_profiles(id) ON DELETE SET NULL,

  -- Planning Phase
  brief text,                                   -- Client request/brief
  idea_notes text,                              -- Ideation notes
  ai_suggestions jsonb,                         -- AI-generated ideas/suggestions

  -- Creating Phase
  script text,                                  -- Rich text script/copy
  caption text,                                 -- Social media caption
  hashtags text[] DEFAULT '{}',                 -- Hashtags array
  cta text,                                     -- Call to action

  -- Media (Cloudinary)
  media jsonb DEFAULT '[]'::jsonb,              -- [{url, type, public_id, name}]
  thumbnail_url text,
  raw_assets jsonb DEFAULT '[]'::jsonb,         -- Original/raw files
  final_assets jsonb DEFAULT '[]'::jsonb,       -- Final deliverables

  -- Workflow
  status text DEFAULT 'inbox' CHECK (status IN (
    'inbox', 'ideation', 'creating', 'review', 'revision', 'approved', 'scheduled', 'published'
  )),

  -- Assignments
  created_by uuid REFERENCES auth.users(id),
  assigned_to uuid REFERENCES auth.users(id),   -- Primary assignee (creator)
  assigned_editor uuid REFERENCES auth.users(id),
  assigned_designer uuid REFERENCES auth.users(id),

  -- Dates
  due_date date,
  scheduled_at timestamp with time zone,
  published_at timestamp with time zone,

  -- Approval
  approved_by uuid REFERENCES auth.users(id),
  approved_at timestamp with time zone,
  revision_count integer DEFAULT 0,

  -- Publishing
  publish_url text,                             -- URL where content was published
  platform_post_id text,                        -- ID from platform (for tracking)

  -- Meta
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  tags text[] DEFAULT '{}',
  notes text,                                   -- Internal notes

  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_content_client_id ON public.content(client_id);
CREATE INDEX IF NOT EXISTS idx_content_status ON public.content(status);
CREATE INDEX IF NOT EXISTS idx_content_assigned_to ON public.content(assigned_to);
CREATE INDEX IF NOT EXISTS idx_content_content_type_id ON public.content(content_type_id);
CREATE INDEX IF NOT EXISTS idx_content_scheduled_at ON public.content(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_content_created_at ON public.content(created_at);

-- ----------------------------------------------------------------------------
-- CONTENT COMMENTS TABLE (Enhanced for feedback loop)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS public.content_comments CASCADE;

CREATE TABLE public.content_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id),

  -- Comment content
  comment text NOT NULL,

  -- For media-specific comments (video timestamps, image regions)
  media_reference jsonb,                        -- {media_index, timestamp, x, y, width, height}

  -- For threaded replies
  parent_id uuid REFERENCES public.content_comments(id) ON DELETE CASCADE,

  -- Status
  is_resolved boolean DEFAULT false,
  resolved_by uuid REFERENCES auth.users(id),
  resolved_at timestamp with time zone,

  -- Approval action (if this comment is an approval decision)
  is_approval_action boolean DEFAULT false,
  approval_decision text CHECK (approval_decision IN ('approved', 'revision_requested', 'rejected')),

  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_comments_content_id ON public.content_comments(content_id);
CREATE INDEX IF NOT EXISTS idx_content_comments_user_id ON public.content_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_content_comments_parent_id ON public.content_comments(parent_id);

-- ----------------------------------------------------------------------------
-- CONTENT VERSIONS TABLE (Track revisions)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.content_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  version_number integer NOT NULL,

  -- Snapshot of content at this version
  snapshot jsonb NOT NULL,                      -- Full content data

  -- What changed
  change_summary text,
  changed_by uuid REFERENCES auth.users(id),

  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_versions_content_id ON public.content_versions(content_id);

-- ----------------------------------------------------------------------------
-- CONTENT TEMPLATES TABLE (Enhanced)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS public.content_templates CASCADE;

CREATE TABLE public.content_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  content_type_id uuid REFERENCES public.content_types(id),

  -- Template content
  template_brief text,
  template_script text,
  template_caption text,
  template_hashtags text[] DEFAULT '{}',

  -- AI Enhancement
  ai_prompt text,                               -- Custom AI prompt for this template

  -- Visibility
  is_global boolean DEFAULT false,              -- Available to all clients
  client_id uuid REFERENCES public.clients(id), -- Or specific to one client
  created_by uuid REFERENCES auth.users(id),

  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_templates_content_type_id ON public.content_templates(content_type_id);
CREATE INDEX IF NOT EXISTS idx_content_templates_client_id ON public.content_templates(client_id);

-- ----------------------------------------------------------------------------
-- CONTENT REQUESTS TABLE (Client inbox/requests)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.content_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,

  -- Request details
  title text NOT NULL,
  description text,
  content_type_id uuid REFERENCES public.content_types(id),

  -- Attachments/references
  reference_urls text[] DEFAULT '{}',
  attachments jsonb DEFAULT '[]'::jsonb,        -- Cloudinary uploads

  -- Timing
  requested_date date,
  urgency text DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'urgent')),

  -- Status
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'converted')),
  converted_to_content_id uuid REFERENCES public.content(id),

  -- Response
  admin_notes text,
  responded_by uuid REFERENCES auth.users(id),
  responded_at timestamp with time zone,

  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_requests_client_id ON public.content_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_content_requests_status ON public.content_requests(status);

-- ----------------------------------------------------------------------------
-- AI GENERATIONS LOG (Track AI-assisted content)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES public.content(id) ON DELETE CASCADE,

  -- What was generated
  generation_type text NOT NULL CHECK (generation_type IN (
    'idea', 'script', 'caption', 'hashtags', 'title', 'brief'
  )),

  -- Input/Output
  prompt text NOT NULL,
  input_context jsonb,                          -- Brand voice, etc.
  output text NOT NULL,

  -- Usage tracking
  model text,                                   -- 'gpt-4', 'claude', etc.
  tokens_used integer,

  -- Was it used?
  was_accepted boolean DEFAULT false,

  generated_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_generations_content_id ON public.ai_generations(content_id);

-- ============================================================================
-- STEP 3: UPDATE EXISTING TABLES
-- ============================================================================

-- Add client reference to audit_signups (for conversion)
ALTER TABLE public.audit_signups
ADD COLUMN IF NOT EXISTS converted_to_client_id uuid REFERENCES public.clients(id);

-- Update profiles table with role info
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role text DEFAULT 'client',
ADD COLUMN IF NOT EXISTS department text,
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- ============================================================================
-- STEP 4: CREATE VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View: Content with all related info
CREATE OR REPLACE VIEW public.content_full AS
SELECT
  c.*,
  ct.name as content_type_name,
  ct.icon as content_type_icon,
  ct.color as content_type_color,
  ct.platform as content_type_platform,
  cl.name as client_name,
  cl.email as client_email,
  bp.brand_name,
  bp.brand_voice,
  creator.full_name as assigned_to_name,
  creator.avatar_url as assigned_to_avatar,
  approver.full_name as approved_by_name,
  (SELECT COUNT(*) FROM public.content_comments cc WHERE cc.content_id = c.id AND NOT cc.is_resolved) as unresolved_comments
FROM public.content c
LEFT JOIN public.content_types ct ON c.content_type_id = ct.id
LEFT JOIN public.clients cl ON c.client_id = cl.id
LEFT JOIN public.brand_profiles bp ON c.brand_id = bp.id
LEFT JOIN public.profiles creator ON c.assigned_to = creator.user_id
LEFT JOIN public.profiles approver ON c.approved_by = approver.user_id;

-- View: Client with brand info
CREATE OR REPLACE VIEW public.clients_full AS
SELECT
  c.*,
  bp.id as brand_profile_id,
  bp.brand_name,
  bp.brand_voice,
  bp.target_audience,
  bp.keywords,
  (SELECT COUNT(*) FROM public.content ct WHERE ct.client_id = c.id) as total_content,
  (SELECT COUNT(*) FROM public.content ct WHERE ct.client_id = c.id AND ct.status = 'published') as published_content
FROM public.clients c
LEFT JOIN public.brand_profiles bp ON bp.client_id = c.id;

-- ============================================================================
-- STEP 5: CREATE FUNCTIONS
-- ============================================================================

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Generate content number (C1, C2, C3...)
CREATE OR REPLACE FUNCTION public.generate_content_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.content_number IS NULL THEN
    NEW.content_number = (SELECT COALESCE(MAX(content_number), 0) + 1 FROM public.content);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Create content version on update
CREATE OR REPLACE FUNCTION public.create_content_version()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create version if content changed significantly
  IF OLD.script IS DISTINCT FROM NEW.script
     OR OLD.caption IS DISTINCT FROM NEW.caption
     OR OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.content_versions (content_id, version_number, snapshot, change_summary, changed_by)
    VALUES (
      NEW.id,
      (SELECT COALESCE(MAX(version_number), 0) + 1 FROM public.content_versions WHERE content_id = NEW.id),
      to_jsonb(OLD),
      CASE
        WHEN OLD.status IS DISTINCT FROM NEW.status THEN 'Status changed from ' || OLD.status || ' to ' || NEW.status
        ELSE 'Content updated'
      END,
      NEW.assigned_to
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Update revision count when status changes to revision
CREATE OR REPLACE FUNCTION public.update_revision_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'revision' AND OLD.status != 'revision' THEN
    NEW.revision_count = OLD.revision_count + 1;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 6: CREATE TRIGGERS
-- ============================================================================

-- Trigger: Auto-update updated_at for content
DROP TRIGGER IF EXISTS content_updated_at ON public.content;
CREATE TRIGGER content_updated_at
  BEFORE UPDATE ON public.content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Trigger: Auto-update updated_at for clients
DROP TRIGGER IF EXISTS clients_updated_at ON public.clients;
CREATE TRIGGER clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Trigger: Auto-update updated_at for brand_profiles
DROP TRIGGER IF EXISTS brand_profiles_updated_at ON public.brand_profiles;
CREATE TRIGGER brand_profiles_updated_at
  BEFORE UPDATE ON public.brand_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Trigger: Generate content number
DROP TRIGGER IF EXISTS content_number_trigger ON public.content;
CREATE TRIGGER content_number_trigger
  BEFORE INSERT ON public.content
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_content_number();

-- Trigger: Create version on content update
DROP TRIGGER IF EXISTS content_version_trigger ON public.content;
CREATE TRIGGER content_version_trigger
  AFTER UPDATE ON public.content
  FOR EACH ROW
  EXECUTE FUNCTION public.create_content_version();

-- Trigger: Update revision count
DROP TRIGGER IF EXISTS content_revision_count_trigger ON public.content;
CREATE TRIGGER content_revision_count_trigger
  BEFORE UPDATE ON public.content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_revision_count();

-- ============================================================================
-- STEP 7: ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can see all clients
CREATE POLICY "Admins can manage all clients" ON public.clients
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Clients can see their own record
CREATE POLICY "Clients can view own record" ON public.clients
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy: Admins can see all content
CREATE POLICY "Admins can manage all content" ON public.content
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Creators can see assigned content
CREATE POLICY "Creators can view assigned content" ON public.content
  FOR SELECT
  TO authenticated
  USING (
    assigned_to = auth.uid()
    OR assigned_editor = auth.uid()
    OR assigned_designer = auth.uid()
    OR created_by = auth.uid()
  );

-- Policy: Creators can update assigned content
CREATE POLICY "Creators can update assigned content" ON public.content
  FOR UPDATE
  TO authenticated
  USING (
    assigned_to = auth.uid()
    OR assigned_editor = auth.uid()
    OR assigned_designer = auth.uid()
  );

-- Policy: Clients can see their own content
CREATE POLICY "Clients can view own content" ON public.content
  FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM public.clients WHERE user_id = auth.uid()
    )
  );

-- Policy: Anyone can view and add comments on content they can see
CREATE POLICY "Users can manage comments on accessible content" ON public.content_comments
  FOR ALL
  TO authenticated
  USING (
    content_id IN (
      SELECT id FROM public.content WHERE
        assigned_to = auth.uid()
        OR client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
    )
  );

-- Policy: Clients can create content requests
CREATE POLICY "Clients can manage own requests" ON public.content_requests
  FOR ALL
  TO authenticated
  USING (
    client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- ============================================================================
-- STEP 8: GRANTS
-- ============================================================================

-- Grant access to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.brand_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_comments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_versions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_templates TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_requests TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_types TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_generations TO authenticated;

-- Grant sequence usage
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================================================
-- DONE!
-- ============================================================================

-- Summary of new tables:
-- 1. clients              - Client information
-- 2. brand_profiles       - Brand voice, audience, keywords (from audit)
-- 3. content_types        - YouTube, Instagram, Blog, etc.
-- 4. content              - Main content table (replaces content_posts)
-- 5. content_comments     - Feedback/comments with threading
-- 6. content_versions     - Revision history
-- 7. content_templates    - Reusable templates
-- 8. content_requests     - Client content requests (inbox)
-- 9. ai_generations       - AI generation history

-- Views:
-- 1. content_full         - Content with all related info
-- 2. clients_full         - Clients with brand info
