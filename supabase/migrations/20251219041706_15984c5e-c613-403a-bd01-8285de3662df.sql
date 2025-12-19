-- =============================================
-- FLOWWING CMS FRESH SCHEMA
-- =============================================

-- 1. ENUMS
-- =============================================

-- User roles enum
CREATE TYPE public.app_role AS ENUM ('agency_admin', 'agency_manager', 'creator_editor', 'client_approver', 'client_viewer');

-- Audit statuses
CREATE TYPE public.audit_status AS ENUM ('draft', 'internal_review', 'final', 'converted_to_project');

-- Content statuses (full workflow)
CREATE TYPE public.content_status AS ENUM (
  'idea', 'planned', 'scripting', 'recording', 'editing', 
  'review', 'changes_requested', 'approved', 'scheduled', 'published', 'archived'
);

-- Content type enum
CREATE TYPE public.content_type_enum AS ENUM (
  'youtube_video', 'youtube_short', 'instagram_reel', 'instagram_post', 
  'instagram_story', 'tiktok', 'linkedin_post', 'blog', 'podcast', 'other'
);

-- Platform enum
CREATE TYPE public.platform_enum AS ENUM (
  'youtube', 'instagram', 'tiktok', 'linkedin', 'twitter', 'blog', 'podcast', 'other'
);

-- 2. USER ROLES TABLE (security-first)
-- =============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'client_viewer',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get user's role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'agency_admin'));

-- 3. PROJECTS TABLE
-- =============================================
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view projects" ON public.projects
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins and managers can manage projects" ON public.projects
  FOR ALL USING (
    public.has_role(auth.uid(), 'agency_admin') OR 
    public.has_role(auth.uid(), 'agency_manager')
  );

-- 4. BRAND HUB (one per project)
-- =============================================
CREATE TABLE public.brand_hub (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE UNIQUE,
  
  -- Brand Profile
  brand_name TEXT,
  brand_mission TEXT,
  brand_values TEXT,
  unique_selling_proposition TEXT,
  brand_personality TEXT,
  goals JSONB DEFAULT '[]',
  
  -- Brand Voice
  voice_tone TEXT,
  voice_style TEXT,
  do_phrases JSONB DEFAULT '[]',
  dont_phrases JSONB DEFAULT '[]',
  example_content JSONB DEFAULT '[]',
  
  -- Audience Profiles (array of objects)
  audience_profiles JSONB DEFAULT '[]',
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.brand_hub ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view brand hub" ON public.brand_hub
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Staff can manage brand hub" ON public.brand_hub
  FOR ALL USING (
    public.has_role(auth.uid(), 'agency_admin') OR 
    public.has_role(auth.uid(), 'agency_manager') OR
    public.has_role(auth.uid(), 'creator_editor')
  );

-- 5. CONTENT ITEMS (first-class entity)
-- =============================================
CREATE TABLE public.cms_content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_number TEXT UNIQUE, -- C000123 format
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic info
  title TEXT NOT NULL,
  description TEXT,
  content_type content_type_enum,
  platforms platform_enum[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  
  -- Status workflow
  status content_status DEFAULT 'idea',
  priority TEXT DEFAULT 'normal', -- low, normal, high, urgent
  
  -- Assignment
  owner_id UUID REFERENCES auth.users(id),
  editor_id UUID REFERENCES auth.users(id),
  
  -- Dates
  target_publish_date DATE,
  actual_publish_date TIMESTAMPTZ,
  
  -- Content fields (Creating stage)
  script_content TEXT,
  script_doc_link TEXT,
  caption_text TEXT,
  title_final TEXT,
  thumbnail_brief TEXT,
  
  -- Requirements checklist
  needs_script BOOLEAN DEFAULT false,
  needs_caption BOOLEAN DEFAULT false,
  needs_thumbnail BOOLEAN DEFAULT false,
  
  -- Asset links (Producing stage)
  drive_folder_link TEXT,
  frame_project_link TEXT,
  final_asset_link TEXT,
  
  -- Publishing
  published_url TEXT,
  platform_post_ids JSONB DEFAULT '{}',
  
  -- Repurpose tracking
  repurposed_from_id UUID REFERENCES public.cms_content_items(id),
  
  -- Source (from idea, audit recommendation, manual)
  source_type TEXT DEFAULT 'manual',
  source_id UUID, -- Reference to original idea or audit
  
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.cms_content_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view content items" ON public.cms_content_items
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Staff can create content items" ON public.cms_content_items
  FOR INSERT TO authenticated WITH CHECK (
    public.has_role(auth.uid(), 'agency_admin') OR 
    public.has_role(auth.uid(), 'agency_manager') OR
    public.has_role(auth.uid(), 'creator_editor')
  );

CREATE POLICY "Staff can update content items" ON public.cms_content_items
  FOR UPDATE USING (
    public.has_role(auth.uid(), 'agency_admin') OR 
    public.has_role(auth.uid(), 'agency_manager') OR
    owner_id = auth.uid() OR
    editor_id = auth.uid()
  );

CREATE POLICY "Admins can delete content items" ON public.cms_content_items
  FOR DELETE USING (public.has_role(auth.uid(), 'agency_admin'));

-- Function to generate content number
CREATE OR REPLACE FUNCTION public.generate_content_number()
RETURNS TRIGGER AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(content_number FROM 2) AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.cms_content_items;
  
  NEW.content_number := 'C' || LPAD(next_num::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_content_number
  BEFORE INSERT ON public.cms_content_items
  FOR EACH ROW
  WHEN (NEW.content_number IS NULL)
  EXECUTE FUNCTION public.generate_content_number();

-- 6. CONTENT TEMPLATES
-- =============================================
CREATE TABLE public.cms_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  content_type content_type_enum,
  template_text TEXT,
  template_type TEXT DEFAULT 'script', -- script, caption, thumbnail_brief
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.cms_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view templates" ON public.cms_templates
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Staff can manage templates" ON public.cms_templates
  FOR ALL USING (
    public.has_role(auth.uid(), 'agency_admin') OR 
    public.has_role(auth.uid(), 'agency_manager') OR
    public.has_role(auth.uid(), 'creator_editor')
  );

-- 7. COMMENTS / REVIEW NOTES
-- =============================================
CREATE TABLE public.cms_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id UUID REFERENCES public.cms_content_items(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  message TEXT NOT NULL,
  comment_type TEXT DEFAULT 'general', -- general, review, change_request
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.cms_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view comments" ON public.cms_comments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create comments" ON public.cms_comments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

-- 8. APPROVAL EVENTS
-- =============================================
CREATE TABLE public.cms_approval_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id UUID REFERENCES public.cms_content_items(id) ON DELETE CASCADE NOT NULL,
  approved_by UUID REFERENCES auth.users(id) NOT NULL,
  decision TEXT NOT NULL, -- approved, rejected, changes_requested
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.cms_approval_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view approvals" ON public.cms_approval_events
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Approvers and staff can create approvals" ON public.cms_approval_events
  FOR INSERT TO authenticated WITH CHECK (
    public.has_role(auth.uid(), 'agency_admin') OR 
    public.has_role(auth.uid(), 'agency_manager') OR
    public.has_role(auth.uid(), 'client_approver')
  );

-- 9. ACTIVITY LOG (audit trail)
-- =============================================
CREATE TABLE public.cms_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id UUID REFERENCES public.cms_content_items(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL, -- status_change, assignment, comment, approval, etc.
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.cms_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view activity log" ON public.cms_activity_log
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "System can insert activity log" ON public.cms_activity_log
  FOR INSERT TO authenticated WITH CHECK (true);

-- 10. AUDITS (enhanced)
-- =============================================
CREATE TABLE public.cms_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Lead/Client info
  lead_name TEXT,
  lead_email TEXT,
  lead_company TEXT,
  
  -- Intake data
  instagram_url TEXT,
  tiktok_url TEXT,
  youtube_url TEXT,
  website_url TEXT,
  goals TEXT,
  challenges TEXT,
  target_audience TEXT,
  
  -- Audit sections (AI-generated content)
  sections JSONB DEFAULT '[]', -- Array of {title, content, order}
  
  -- Status
  status audit_status DEFAULT 'draft',
  
  -- Conversion
  converted_to_project_id UUID REFERENCES public.projects(id),
  converted_at TIMESTAMPTZ,
  converted_by UUID REFERENCES auth.users(id),
  
  -- Report
  report_link TEXT,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.cms_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view audits" ON public.cms_audits
  FOR SELECT TO authenticated USING (
    public.has_role(auth.uid(), 'agency_admin') OR 
    public.has_role(auth.uid(), 'agency_manager') OR
    public.has_role(auth.uid(), 'creator_editor')
  );

CREATE POLICY "Staff can manage audits" ON public.cms_audits
  FOR ALL USING (
    public.has_role(auth.uid(), 'agency_admin') OR 
    public.has_role(auth.uid(), 'agency_manager')
  );

-- 11. WEEKLY REPORTS (for CMS)
-- =============================================
CREATE TABLE public.cms_weekly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  
  -- Metrics
  items_published INTEGER DEFAULT 0,
  items_approved INTEGER DEFAULT 0,
  items_rejected INTEGER DEFAULT 0,
  items_blocked INTEGER DEFAULT 0,
  
  -- Content
  summary TEXT,
  recommendations JSONB DEFAULT '[]',
  next_week_schedule JSONB DEFAULT '[]',
  
  -- Sharing
  report_url TEXT,
  sent_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.cms_weekly_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view reports" ON public.cms_weekly_reports
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Managers can manage reports" ON public.cms_weekly_reports
  FOR ALL USING (
    public.has_role(auth.uid(), 'agency_admin') OR 
    public.has_role(auth.uid(), 'agency_manager')
  );

-- 12. INTEGRATION CONFIG (per project)
-- =============================================
CREATE TABLE public.cms_integration_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE UNIQUE,
  
  -- Drive config
  drive_root_folder_id TEXT,
  drive_folder_template TEXT, -- Folder naming pattern
  
  -- Frame.io config
  frame_team_id TEXT,
  
  -- Slack config
  slack_channel_id TEXT,
  slack_notification_types JSONB DEFAULT '["assignment", "review", "approved"]',
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.cms_integration_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view integration config" ON public.cms_integration_config
  FOR SELECT TO authenticated USING (
    public.has_role(auth.uid(), 'agency_admin') OR 
    public.has_role(auth.uid(), 'agency_manager')
  );

CREATE POLICY "Admins can manage integration config" ON public.cms_integration_config
  FOR ALL USING (public.has_role(auth.uid(), 'agency_admin'));

-- 13. UPDATED_AT TRIGGERS
-- =============================================
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_brand_hub_updated_at
  BEFORE UPDATE ON public.brand_hub
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_content_items_updated_at
  BEFORE UPDATE ON public.cms_content_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_templates_updated_at
  BEFORE UPDATE ON public.cms_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_audits_updated_at
  BEFORE UPDATE ON public.cms_audits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_weekly_reports_updated_at
  BEFORE UPDATE ON public.cms_weekly_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_integration_config_updated_at
  BEFORE UPDATE ON public.cms_integration_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 14. AUTO-ASSIGN DEFAULT ROLE ON USER CREATION
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client_viewer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created_assign_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_role();