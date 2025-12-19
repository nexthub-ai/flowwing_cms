-- Content posts table for the CMS
CREATE TABLE public.content_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'scheduled', 'published', 'rejected')),
  platform TEXT CHECK (platform IN ('instagram', 'tiktok', 'youtube', 'twitter', 'linkedin', 'facebook')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  media_urls TEXT[],
  hashtags TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Content approvals/comments
CREATE TABLE public.content_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.content_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_approval BOOLEAN DEFAULT false,
  approval_status TEXT CHECK (approval_status IN ('approved', 'rejected', 'revision_requested')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Content templates
CREATE TABLE public.content_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  platform TEXT,
  content_template TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.content_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_templates ENABLE ROW LEVEL SECURITY;

-- Content posts policies
CREATE POLICY "Users can view their own posts" ON public.content_posts
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins and PMS can view all posts" ON public.content_posts
  FOR SELECT TO authenticated USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'pms')
  );

CREATE POLICY "Clients can view their assigned posts" ON public.content_posts
  FOR SELECT TO authenticated USING (auth.uid() = client_id);

CREATE POLICY "Users can create posts" ON public.content_posts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON public.content_posts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "PMS can update any post" ON public.content_posts
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'pms'));

CREATE POLICY "Users can delete their own posts" ON public.content_posts
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Users can view comments on their posts" ON public.content_comments
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.content_posts 
      WHERE id = post_id AND (user_id = auth.uid() OR client_id = auth.uid())
    ) OR 
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'pms')
  );

CREATE POLICY "Authenticated users can create comments" ON public.content_comments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Templates policies
CREATE POLICY "Users can manage their own templates" ON public.content_templates
  FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all templates" ON public.content_templates
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Update trigger for content_posts
CREATE TRIGGER update_content_posts_updated_at
  BEFORE UPDATE ON public.content_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();