/**
 * Central type definitions for Flowwing CMS
 * All database types and shared interfaces
 */

import {
  ContentStatus,
  ContentType,
  Priority,
  UserRole,
  ApprovalStatus,
  AIGenerationType
} from '@/constants/constants';

// ============================================================================
// BASE TYPES
// ============================================================================

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
}

// ============================================================================
// USER & AUTH TYPES
// ============================================================================

export interface Profile extends BaseEntity {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  company_name: string | null;
  role?: string;
  department?: string;
  is_active?: boolean;
}

export interface UserRoleRecord extends BaseEntity {
  user_id: string;
  role: UserRole;
}

// ============================================================================
// CLIENT TYPES
// ============================================================================

export interface Client extends BaseEntity {
  user_id: string | null;
  name: string;
  email: string;
  company_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  notes: string | null;
  is_active: boolean;
}

export interface ClientFull extends Client {
  brand_profile_id: string | null;
  brand_name: string | null;
  brand_voice: BrandVoice | null;
  target_audience: TargetAudience[] | null;
  keywords: string[] | null;
  total_content: number;
  published_content: number;
}

// ============================================================================
// BRAND PROFILE TYPES
// ============================================================================

export interface BrandVoice {
  tone: string[];
  personality: string[];
  dos: string[];
  donts: string[];
  example_phrases: string[];
}

export interface TargetAudience {
  name: string;
  demographics: string;
  pain_points: string[];
  goals: string[];
  platforms: string[];
}

export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
}

export interface BrandFonts {
  heading: string;
  body: string;
}

export interface BrandProfile extends BaseEntity {
  client_id: string;
  audit_signup_id: string | null;
  brand_name: string;
  tagline: string | null;
  description: string | null;
  brand_voice: BrandVoice;
  target_audience: TargetAudience[];
  keywords: string[];
  content_pillars: string[];
  colors: BrandColors;
  fonts: BrandFonts;
  logo_url: string | null;
  brand_assets_folder: string | null;
  competitors: string[];
  inspiration_accounts: string[];
}

// ============================================================================
// CONTENT TYPE TYPES
// ============================================================================

export interface ContentTypeRecord extends BaseEntity {
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
  platform: string | null;
  default_template: {
    sections: string[];
  };
  ai_prompts: {
    ideation: string;
    script: string;
    caption: string;
    hashtags: string;
  };
  sort_order: number;
  is_active: boolean;
}

// ============================================================================
// CONTENT TYPES
// ============================================================================

export interface MediaItem {
  url: string;
  type: 'image' | 'video' | 'audio' | 'document';
  public_id: string;
  name: string;
  size?: number;
  duration?: number; // for video/audio
}

export interface Content extends BaseEntity {
  content_number: number;

  // Basic Info
  title: string;
  description: string | null;
  content_type_id: string | null;
  client_id: string | null;
  brand_id: string | null;

  // Planning Phase
  brief: string | null;
  idea_notes: string | null;
  ai_suggestions: Record<string, any> | null;

  // Creating Phase
  script: string | null;
  caption: string | null;
  hashtags: string[];
  cta: string | null;

  // Media
  media: MediaItem[];
  thumbnail_url: string | null;
  raw_assets: MediaItem[];
  final_assets: MediaItem[];

  // Workflow
  status: ContentStatus;

  // Assignments
  created_by: string | null;
  assigned_to: string | null;
  assigned_editor: string | null;
  assigned_designer: string | null;

  // Dates
  due_date: string | null;
  scheduled_at: string | null;
  published_at: string | null;

  // Approval
  approved_by: string | null;
  approved_at: string | null;
  revision_count: number;

  // Publishing
  publish_url: string | null;
  platform_post_id: string | null;

  // Meta
  priority: Priority;
  tags: string[];
  notes: string | null;
}

export interface ContentFull extends Content {
  content_type_name: string | null;
  content_type_icon: string | null;
  content_type_color: string | null;
  content_type_platform: string | null;
  client_name: string | null;
  client_email: string | null;
  brand_name: string | null;
  brand_voice: BrandVoice | null;
  assigned_to_name: string | null;
  assigned_to_avatar: string | null;
  approved_by_name: string | null;
  unresolved_comments: number;
}

// ============================================================================
// CONTENT COMMENT TYPES
// ============================================================================

export interface MediaReference {
  media_index: number;
  timestamp?: string; // for video: "0:32"
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface ContentComment extends BaseEntity {
  content_id: string;
  user_id: string;
  comment: string;
  media_reference: MediaReference | null;
  parent_id: string | null;
  is_resolved: boolean;
  resolved_by: string | null;
  resolved_at: string | null;
  is_approval_action: boolean;
  approval_decision: ApprovalStatus | null;
}

export interface ContentCommentWithUser extends ContentComment {
  user_name: string;
  user_avatar: string | null;
  replies?: ContentCommentWithUser[];
}

// ============================================================================
// CONTENT VERSION TYPES
// ============================================================================

export interface ContentVersion {
  id: string;
  content_id: string;
  version_number: number;
  snapshot: Partial<Content>;
  change_summary: string | null;
  changed_by: string | null;
  created_at: string;
}

// ============================================================================
// CONTENT TEMPLATE TYPES
// ============================================================================

export interface ContentTemplate extends BaseEntity {
  name: string;
  description: string | null;
  content_type_id: string | null;
  template_brief: string | null;
  template_script: string | null;
  template_caption: string | null;
  template_hashtags: string[];
  ai_prompt: string | null;
  is_global: boolean;
  client_id: string | null;
  created_by: string | null;
}

// ============================================================================
// CONTENT REQUEST TYPES
// ============================================================================

export interface ContentRequest extends BaseEntity {
  client_id: string;
  title: string;
  description: string | null;
  content_type_id: string | null;
  reference_urls: string[];
  attachments: MediaItem[];
  requested_date: string | null;
  urgency: Priority;
  status: 'pending' | 'accepted' | 'declined' | 'converted';
  converted_to_content_id: string | null;
  admin_notes: string | null;
  responded_by: string | null;
  responded_at: string | null;
}

// ============================================================================
// AI GENERATION TYPES
// ============================================================================

export interface AIGeneration {
  id: string;
  content_id: string | null;
  generation_type: AIGenerationType;
  prompt: string;
  input_context: Record<string, any> | null;
  output: string;
  model: string | null;
  tokens_used: number | null;
  was_accepted: boolean;
  generated_by: string | null;
  created_at: string;
}

// ============================================================================
// AUDIT TYPES (existing, kept for reference)
// ============================================================================

export interface AuditSignup extends BaseEntity {
  email: string;
  company_name: string | null;
  social_handles: Record<string, string> | null;
  status: string;
  assigned_to: string | null;
  notes: string | null;
  stripe_payment_id: string | null;
  converted_to_client_id: string | null;
}

export interface AuditRun extends BaseEntity {
  audit_signup_id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  report_url: string | null;
  review_url: string | null;
  delivered_at: string | null;
}

export interface AuditBrandReview extends BaseEntity {
  audit_run_id: string;
  executive_summary: Record<string, any> | null;
  overall_score: number | null;
  brand_clarity: Record<string, any> | null;
  strategic_focus_areas: string[] | null;
  solutions: Record<string, any>[] | null;
  inspiration_guidance: Record<string, any>[] | null;
  next_30_day_focus: string[] | null;
  platforms: Record<string, any>[] | null;
  content_patterns: string[] | null;
  platform_priority_order: string[] | null;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================================================
// FILTER & QUERY TYPES
// ============================================================================

export interface ContentFilters {
  status?: ContentStatus | ContentStatus[];
  client_id?: string;
  content_type_id?: string;
  assigned_to?: string;
  priority?: Priority;
  search?: string;
  date_from?: string;
  date_to?: string;
}

export interface ClientFilters {
  search?: string;
  is_active?: boolean;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface ContentFormData {
  title: string;
  description?: string;
  content_type_id?: string;
  client_id?: string;
  brand_id?: string;
  brief?: string;
  idea_notes?: string;
  ai_suggestions?: Record<string, any>;
  script?: string;
  caption?: string;
  hashtags?: string[];
  cta?: string;
  media?: MediaItem[];
  thumbnail_url?: string;
  raw_assets?: MediaItem[];
  final_assets?: MediaItem[];
  due_date?: string;
  scheduled_at?: string;
  priority?: Priority;
  assigned_to?: string;
  assigned_editor?: string;
  assigned_designer?: string;
  tags?: string[];
  notes?: string;
}

export interface ClientFormData {
  name: string;
  email: string;
  company_name?: string;
  phone?: string;
  notes?: string;
}

export interface BrandProfileFormData {
  brand_name: string;
  tagline?: string;
  description?: string;
  brand_voice?: Partial<BrandVoice>;
  target_audience?: Partial<TargetAudience>[];
  keywords?: string[];
  content_pillars?: string[];
  colors?: Partial<BrandColors>;
  fonts?: Partial<BrandFonts>;
  logo_url?: string;
}
