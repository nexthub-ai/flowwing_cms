-- ============================================================================
-- CLEANUP: Remove unused tables
-- These tables were created but never implemented in the codebase
-- ============================================================================

-- Drop unused tables
-- NOTE: Run this only after confirming these tables contain no important data

-- 1. Drop 'tools' table - no references in codebase
DROP TABLE IF EXISTS public.tools CASCADE;

-- 2. Drop 'content_templates' table - no references in codebase
DROP TABLE IF EXISTS public.content_templates CASCADE;

-- 3. Drop 'ai_generations' table - feature not implemented
DROP TABLE IF EXISTS public.ai_generations CASCADE;

-- 4. Drop 'content_posts' table - redundant with 'content' table
-- First, update dashboard to use 'content' table instead if needed
DROP TABLE IF EXISTS public.content_posts CASCADE;

-- Clean up any orphaned sequences
DROP SEQUENCE IF EXISTS content_posts_id_seq CASCADE;

-- ============================================================================
-- SUMMARY OF REMAINING TABLES:
-- ============================================================================
-- Core tables:
--   - profiles (user metadata)
--   - user_roles (authorization)
--   - clients
--   - brand_profiles
--   - content
--   - content_types
--   - content_comments
--   - content_requests
--   - content_versions
--   - creator_profiles
--   - invitations
--
-- Audit tables:
--   - audit_signups
--   - audit_runs
--   - audit_brand_reviews
--   - audit_platform_snapshots
--   - audit_raw_platform_data
-- ============================================================================
