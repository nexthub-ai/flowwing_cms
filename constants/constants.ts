/**
 * Application-wide constants
 * Prevents typos and makes refactoring easier
 */

export const AUDIT_STATUS = {
  PENDING: 'pending',
  PLANNING: 'planning',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  COMPLETED: 'completed',
  PAYMENT_RECEIVED: 'payment_received',
  PAYMENT_FAILED: 'payment_failed',
} as const;

export type AuditStatus = typeof AUDIT_STATUS[keyof typeof AUDIT_STATUS];

export const CONTENT_STATUS = {
  DRAFT: 'draft',
  REVIEW: 'review',
  APPROVED: 'approved',
  SCHEDULED: 'scheduled',
  PUBLISHED: 'published',
  REJECTED: 'rejected',
} as const;

export type ContentStatus = typeof CONTENT_STATUS[keyof typeof CONTENT_STATUS];

export const PLATFORMS = {
  INSTAGRAM: 'instagram',
  TIKTOK: 'tiktok',
  YOUTUBE: 'youtube',
  TWITTER: 'twitter',
  LINKEDIN: 'linkedin',
  FACEBOOK: 'facebook',
} as const;

export type Platform = typeof PLATFORMS[keyof typeof PLATFORMS];

export const APPROVAL_STATUS = {
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REVISION_REQUESTED: 'revision_requested',
} as const;

export type ApprovalStatus = typeof APPROVAL_STATUS[keyof typeof APPROVAL_STATUS];

export const USER_ROLES = {
  ADMIN: 'admin',
  PMS: 'pms',
  CREATOR: 'creator',
  CLIENT: 'client',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const TOOL_CATEGORIES = {
  AI_WRITING: 'ai_writing',
  ANALYTICS: 'analytics',
  MEDIA: 'media',
} as const;

export type ToolCategory = typeof TOOL_CATEGORIES[keyof typeof TOOL_CATEGORIES];

// Status badge colors
export const STATUS_COLORS: Record<string, string> = {
  [CONTENT_STATUS.DRAFT]: 'bg-muted text-muted-foreground',
  [CONTENT_STATUS.REVIEW]: 'bg-warning/20 text-warning',
  [CONTENT_STATUS.APPROVED]: 'bg-success/20 text-success',
  [CONTENT_STATUS.SCHEDULED]: 'bg-primary/20 text-primary',
  [CONTENT_STATUS.PUBLISHED]: 'bg-success text-success-foreground',
  [CONTENT_STATUS.REJECTED]: 'bg-destructive/20 text-destructive',
  [AUDIT_STATUS.PENDING]: 'bg-yellow-500/20 text-yellow-700',
  [AUDIT_STATUS.PLANNING]: 'bg-blue-500/20 text-blue-700',
  [AUDIT_STATUS.IN_PROGRESS]: 'bg-purple-500/20 text-purple-700',
  [AUDIT_STATUS.COMPLETED]: 'bg-green-500/20 text-green-700',
  'audit_review': 'bg-orange-500/20 text-orange-700',
};

// API Query Keys for React Query
export const QUERY_KEYS = {
  AUDIT_SIGNUPS: 'audit-signups',
  CONTENT_POSTS: 'content-posts',
  CONTENT_TEMPLATES: 'content-templates',
  PROFILES: 'profiles',
  USER_ROLES: 'user-roles',
  TOOLS: 'tools',
  DASHBOARD_STATS: 'dashboard-stats',
} as const;
