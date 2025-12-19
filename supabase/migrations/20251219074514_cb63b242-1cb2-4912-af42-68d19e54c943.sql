-- Add 'creator' to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'creator';

-- Create tools table for the tools gallery
CREATE TABLE public.tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('ai_writing', 'analytics', 'media')),
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on tools
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view tools
CREATE POLICY "Authenticated users can view active tools"
ON public.tools
FOR SELECT
USING (is_active = true);

-- Only admins can manage tools
CREATE POLICY "Admins can manage tools"
ON public.tools
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_tools_updated_at
BEFORE UPDATE ON public.tools
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default tools
INSERT INTO public.tools (name, description, category, icon) VALUES
-- AI Writing Tools
('Caption Generator', 'Generate engaging captions for your posts with AI', 'ai_writing', 'Sparkles'),
('Hashtag Suggester', 'Get relevant hashtags based on your content', 'ai_writing', 'Hash'),
('Content Rephraser', 'Rewrite content in different tones and styles', 'ai_writing', 'RefreshCw'),
('Bio Generator', 'Create compelling profile bios', 'ai_writing', 'User'),
-- Analytics Tools
('Engagement Tracker', 'Track likes, comments, and shares over time', 'analytics', 'TrendingUp'),
('Best Time to Post', 'Find optimal posting times for your audience', 'analytics', 'Clock'),
('Competitor Analysis', 'Analyze competitor social media strategies', 'analytics', 'Target'),
('Audience Insights', 'Understand your follower demographics', 'analytics', 'Users'),
-- Media Tools
('Image Resizer', 'Resize images for different platforms', 'media', 'ImageIcon'),
('Video Trimmer', 'Trim and cut video clips', 'media', 'Scissors'),
('Thumbnail Generator', 'Create eye-catching thumbnails', 'media', 'Film'),
('Background Remover', 'Remove backgrounds from images', 'media', 'Eraser');

-- Create audit_signups table for audit customers
CREATE TABLE public.audit_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  company_name TEXT,
  social_handles JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'planning', 'in_progress', 'review', 'completed')),
  assigned_to UUID,
  notes TEXT,
  stripe_payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit_signups
ALTER TABLE public.audit_signups ENABLE ROW LEVEL SECURITY;

-- Users can view their own audit signups
CREATE POLICY "Users can view their own audit signups"
ON public.audit_signups
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own audit signups
CREATE POLICY "Users can create their own audit signups"
ON public.audit_signups
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins and PMS can view all audit signups
CREATE POLICY "Admins and PMS can view all audit signups"
ON public.audit_signups
FOR SELECT
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'pms'));

-- Admins and PMS can update audit signups
CREATE POLICY "Admins and PMS can update audit signups"
ON public.audit_signups
FOR UPDATE
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'pms'));

-- Add trigger for updated_at
CREATE TRIGGER update_audit_signups_updated_at
BEFORE UPDATE ON public.audit_signups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();