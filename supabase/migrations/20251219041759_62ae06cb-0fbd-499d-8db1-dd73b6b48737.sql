-- Fix RLS on legacy tables that don't have it enabled

-- Enable RLS on tables that are missing it
ALTER TABLE public.brand_voices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitor_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_creation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_framework ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_ideation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_planning ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repurpose_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tracked_profiles ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for legacy tables (user-based access)

-- brand_voices: users can manage their own
CREATE POLICY "Users can view own brand voices" ON public.brand_voices
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own brand voices" ON public.brand_voices
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own brand voices" ON public.brand_voices
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own brand voices" ON public.brand_voices
  FOR DELETE USING (auth.uid() = user_id);

-- competitor_analysis: users can manage their own
CREATE POLICY "Users can view own competitor analysis" ON public.competitor_analysis
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own competitor analysis" ON public.competitor_analysis
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own competitor analysis" ON public.competitor_analysis
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own competitor analysis" ON public.competitor_analysis
  FOR DELETE USING (auth.uid() = user_id);

-- content_creation: users can manage their own
CREATE POLICY "Users can view own content creation" ON public.content_creation
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own content creation" ON public.content_creation
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own content creation" ON public.content_creation
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own content creation" ON public.content_creation
  FOR DELETE USING (auth.uid() = user_id);

-- content_framework: users can manage their own
CREATE POLICY "Users can view own content framework" ON public.content_framework
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own content framework" ON public.content_framework
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own content framework" ON public.content_framework
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own content framework" ON public.content_framework
  FOR DELETE USING (auth.uid() = user_id);

-- content_ideation: users can manage their own
CREATE POLICY "Users can view own content ideation" ON public.content_ideation
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own content ideation" ON public.content_ideation
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own content ideation" ON public.content_ideation
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own content ideation" ON public.content_ideation
  FOR DELETE USING (auth.uid() = user_id);

-- content_planning: users can manage their own
CREATE POLICY "Users can view own content planning" ON public.content_planning
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own content planning" ON public.content_planning
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own content planning" ON public.content_planning
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own content planning" ON public.content_planning
  FOR DELETE USING (auth.uid() = user_id);

-- knowledge_base: users can manage their own
CREATE POLICY "Users can view own knowledge base" ON public.knowledge_base
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own knowledge base" ON public.knowledge_base
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own knowledge base" ON public.knowledge_base
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own knowledge base" ON public.knowledge_base
  FOR DELETE USING (auth.uid() = user_id);

-- profiles: users can view all, but only update their own
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- repurpose_content: users can manage their own
CREATE POLICY "Users can view own repurpose content" ON public.repurpose_content
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own repurpose content" ON public.repurpose_content
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own repurpose content" ON public.repurpose_content
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own repurpose content" ON public.repurpose_content
  FOR DELETE USING (auth.uid() = user_id);

-- system_prompts: users can manage their own
CREATE POLICY "Users can view own system prompts" ON public.system_prompts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own system prompts" ON public.system_prompts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own system prompts" ON public.system_prompts
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own system prompts" ON public.system_prompts
  FOR DELETE USING (auth.uid() = user_id);

-- user_tracked_profiles: users can manage their own
CREATE POLICY "Users can view own tracked profiles" ON public.user_tracked_profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tracked profiles" ON public.user_tracked_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tracked profiles" ON public.user_tracked_profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tracked profiles" ON public.user_tracked_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Fix function search paths for security
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client_viewer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;