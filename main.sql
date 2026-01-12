-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.audit_brand_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  audit_run_id uuid NOT NULL,
  executive_summary jsonb,
  overall_score integer CHECK (overall_score >= 0 AND overall_score <= 100),
  brand_clarity jsonb,
  strategic_focus_areas jsonb,
  solutions jsonb,
  inspiration_guidance jsonb,
  next_30_day_focus jsonb,
  platforms jsonb,
  content_patterns jsonb,
  platform_priority_order jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT audit_brand_reviews_pkey PRIMARY KEY (id),
  CONSTRAINT audit_brand_reviews_audit_run_id_fkey FOREIGN KEY (audit_run_id) REFERENCES public.audit_runs(id)
);
CREATE TABLE public.audit_platform_snapshots (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  audit_run_id uuid NOT NULL,
  platform text NOT NULL CHECK (platform = ANY (ARRAY['instagram'::text, 'tiktok'::text, 'youtube'::text, 'twitter'::text, 'linkedin'::text, 'website'::text])),
  profile jsonb,
  metrics jsonb,
  hook_analysis jsonb,
  post_count integer,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT audit_platform_snapshots_pkey PRIMARY KEY (id),
  CONSTRAINT audit_platform_snapshots_audit_run_id_fkey FOREIGN KEY (audit_run_id) REFERENCES public.audit_runs(id)
);
CREATE TABLE public.audit_raw_platform_data (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  audit_run_id uuid NOT NULL,
  platform text NOT NULL CHECK (platform = ANY (ARRAY['instagram'::text, 'tiktok'::text, 'youtube'::text, 'twitter'::text, 'linkedin'::text, 'website'::text])),
  raw_payload jsonb NOT NULL,
  scraped_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT audit_raw_platform_data_pkey PRIMARY KEY (id),
  CONSTRAINT audit_raw_platform_data_audit_run_id_fkey FOREIGN KEY (audit_run_id) REFERENCES public.audit_runs(id)
);
CREATE TABLE public.audit_runs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  audit_signup_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'in_progress'::text,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  report_url text,
  delivered_at timestamp without time zone,
  review_url text,
  CONSTRAINT audit_runs_pkey PRIMARY KEY (id),
  CONSTRAINT audit_runs_audit_signup_id_fkey FOREIGN KEY (audit_signup_id) REFERENCES public.audit_signups(id)
);
CREATE TABLE public.audit_signups (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL,
  company_name text,
  social_handles jsonb,
  status text NOT NULL DEFAULT 'pending'::text,
  assigned_to uuid,
  notes text,
  stripe_payment_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT audit_signups_pkey PRIMARY KEY (id)
);
CREATE TABLE public.content_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL,
  user_id uuid NOT NULL,
  content text NOT NULL,
  is_approval boolean DEFAULT false,
  approval_status text CHECK (approval_status = ANY (ARRAY['approved'::text, 'rejected'::text, 'revision_requested'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT content_comments_pkey PRIMARY KEY (id),
  CONSTRAINT content_comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.content_posts(id),
  CONSTRAINT content_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.content_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  client_id uuid,
  title text NOT NULL,
  content text,
  status text NOT NULL DEFAULT 'draft'::text CHECK (status = ANY (ARRAY['draft'::text, 'review'::text, 'approved'::text, 'scheduled'::text, 'published'::text, 'rejected'::text])),
  platform text CHECK (platform = ANY (ARRAY['instagram'::text, 'tiktok'::text, 'youtube'::text, 'twitter'::text, 'linkedin'::text, 'facebook'::text])),
  scheduled_at timestamp with time zone,
  published_at timestamp with time zone,
  media_urls ARRAY,
  hashtags ARRAY,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT content_posts_pkey PRIMARY KEY (id),
  CONSTRAINT content_posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT content_posts_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.users(id)
);
CREATE TABLE public.content_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  platform text,
  content_template text NOT NULL,
  category text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT content_templates_pkey PRIMARY KEY (id),
  CONSTRAINT content_templates_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  full_name text,
  avatar_url text,
  company_name text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.tools (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL CHECK (category = ANY (ARRAY['ai_writing'::text, 'analytics'::text, 'media'::text])),
  icon text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tools_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role USER-DEFINED NOT NULL DEFAULT 'client'::app_role,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_roles_pkey PRIMARY KEY (id),
  CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);