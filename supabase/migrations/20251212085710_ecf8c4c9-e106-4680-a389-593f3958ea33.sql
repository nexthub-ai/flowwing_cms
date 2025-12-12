-- Add role column to profiles if it doesn't have proper values for our use case
-- The existing role column will be used for: 'admin', 'client', 'designer'

-- Create clients table (companies/brands we work with)
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  website TEXT,
  instagram_url TEXT,
  tiktok_url TEXT,
  youtube_url TEXT,
  niche TEXT,
  status TEXT DEFAULT 'lead', -- lead, audit_sent, onboarded, active, churned
  notes TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create social_audits table
CREATE TABLE public.social_audits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'draft', -- draft, in_review, sent, viewed, converted
  audience_profile JSONB,
  brand_voice_analysis JSONB,
  strengths TEXT[],
  weaknesses TEXT[],
  engagement_patterns JSONB,
  content_strategy JSONB,
  recommendations JSONB,
  admin_notes TEXT,
  payment_status TEXT DEFAULT 'pending', -- pending, paid, refunded
  payment_amount NUMERIC DEFAULT 100,
  sent_at TIMESTAMP WITH TIME ZONE,
  viewed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create content_requests table (client requests for content)
CREATE TABLE public.content_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  request_type TEXT DEFAULT 'content', -- content, revision, idea
  priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
  status TEXT DEFAULT 'requested', -- requested, in_progress, draft_ready, awaiting_approval, approved, published, rejected
  attachments TEXT[],
  due_date DATE,
  assigned_to UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create approvals table (for content approval workflow)
CREATE TABLE public.approvals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_request_id UUID NOT NULL REFERENCES public.content_requests(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  draft_url TEXT,
  draft_content TEXT,
  caption TEXT,
  thumbnail_url TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected, revision_requested
  client_feedback TEXT,
  revision_notes TEXT,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create communications_log table
CREATE TABLE public.communications_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  content_request_id UUID REFERENCES public.content_requests(id) ON DELETE SET NULL,
  message_type TEXT DEFAULT 'text', -- text, audio, file
  message_content TEXT,
  file_url TEXT,
  category TEXT, -- idea, request, revision, complaint, contractual, general
  summary TEXT,
  sentiment TEXT, -- positive, neutral, negative
  priority TEXT DEFAULT 'normal', -- low, normal, high, urgent
  source TEXT DEFAULT 'manual', -- manual, whatsapp, email
  sender_type TEXT DEFAULT 'client', -- client, admin, designer
  sender_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create weekly_reports table
CREATE TABLE public.weekly_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  summary TEXT,
  posts_published INTEGER DEFAULT 0,
  posts_approved INTEGER DEFAULT 0,
  posts_rejected INTEGER DEFAULT 0,
  kpis JSONB,
  recommendations TEXT[],
  report_url TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communications_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for clients
CREATE POLICY "Admins can manage all clients" ON public.clients
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Designers can view assigned clients" ON public.clients
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'designer')
    AND assigned_to = auth.uid()
  );

-- RLS Policies for social_audits
CREATE POLICY "Admins can manage all audits" ON public.social_audits
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for content_requests
CREATE POLICY "Admins can manage all content requests" ON public.content_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Designers can view and update assigned requests" ON public.content_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'designer')
    AND assigned_to = auth.uid()
  );

-- RLS Policies for approvals
CREATE POLICY "Admins can manage all approvals" ON public.approvals
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for communications_log
CREATE POLICY "Admins can manage all communications" ON public.communications_log
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for weekly_reports
CREATE POLICY "Admins can manage all reports" ON public.weekly_reports
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Create updated_at triggers
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_social_audits_updated_at BEFORE UPDATE ON public.social_audits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_requests_updated_at BEFORE UPDATE ON public.content_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_approvals_updated_at BEFORE UPDATE ON public.approvals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_weekly_reports_updated_at BEFORE UPDATE ON public.weekly_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();