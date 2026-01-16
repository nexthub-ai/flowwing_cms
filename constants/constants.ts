/**
 * Application-wide constants
 * Prevents typos and makes refactoring easier
 */

// ============================================================================
// AUDIT CONSTANTS
// ============================================================================

export const AUDIT_STATUS = {
  PENDING: 'pending',
  PLANNING: 'planning',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  COMPLETED: 'completed',
  DELIVERED: 'delivered',
  PAYMENT_RECEIVED: 'payment_received',
  PAYMENT_FAILED: 'payment_failed',
} as const;

export type AuditStatus = typeof AUDIT_STATUS[keyof typeof AUDIT_STATUS];

// ============================================================================
// CONTENT WORKFLOW CONSTANTS
// ============================================================================

export const CONTENT_STATUS = {
  INBOX: 'inbox',           // New request from client
  IDEATION: 'ideation',     // Brainstorming/planning with AI
  CREATING: 'creating',     // Being written/designed
  REVIEW: 'review',         // Waiting for approval
  REVISION: 'revision',     // Changes requested
  APPROVED: 'approved',     // Ready to schedule
  SCHEDULED: 'scheduled',   // Scheduled for publishing
  PUBLISHED: 'published',   // Published/completed
} as const;

export type ContentStatus = typeof CONTENT_STATUS[keyof typeof CONTENT_STATUS];

// Workflow order (for kanban columns)
export const CONTENT_STATUS_ORDER: ContentStatus[] = [
  CONTENT_STATUS.INBOX,
  CONTENT_STATUS.IDEATION,
  CONTENT_STATUS.CREATING,
  CONTENT_STATUS.REVIEW,
  CONTENT_STATUS.REVISION,
  CONTENT_STATUS.APPROVED,
  CONTENT_STATUS.SCHEDULED,
  CONTENT_STATUS.PUBLISHED,
];

// Human-readable labels
export const CONTENT_STATUS_LABELS: Record<ContentStatus, string> = {
  [CONTENT_STATUS.INBOX]: 'Inbox',
  [CONTENT_STATUS.IDEATION]: 'Ideation',
  [CONTENT_STATUS.CREATING]: 'Creating',
  [CONTENT_STATUS.REVIEW]: 'Review',
  [CONTENT_STATUS.REVISION]: 'Revision',
  [CONTENT_STATUS.APPROVED]: 'Approved',
  [CONTENT_STATUS.SCHEDULED]: 'Scheduled',
  [CONTENT_STATUS.PUBLISHED]: 'Published',
};

// ============================================================================
// CONTENT TYPES
// ============================================================================

export const CONTENT_TYPES = {
  YOUTUBE_VIDEO: 'youtube_video',
  YOUTUBE_SHORT: 'youtube_short',
  INSTAGRAM_POST: 'instagram_post',
  INSTAGRAM_REEL: 'instagram_reel',
  INSTAGRAM_STORY: 'instagram_story',
  TIKTOK: 'tiktok',
  LINKEDIN_POST: 'linkedin_post',
  TWITTER_POST: 'twitter_post',
  FACEBOOK_POST: 'facebook_post',
  BLOG: 'blog',
  PODCAST: 'podcast',
  NEWSLETTER: 'newsletter',
} as const;

export type ContentType = typeof CONTENT_TYPES[keyof typeof CONTENT_TYPES];

export const CONTENT_TYPE_CONFIG: Record<ContentType, {
  label: string;
  icon: string;
  color: string;
  platform: string;
}> = {
  [CONTENT_TYPES.YOUTUBE_VIDEO]: { label: 'YouTube Video', icon: '🎬', color: '#FF0000', platform: 'youtube' },
  [CONTENT_TYPES.YOUTUBE_SHORT]: { label: 'YouTube Short', icon: '📱', color: '#FF0000', platform: 'youtube' },
  [CONTENT_TYPES.INSTAGRAM_POST]: { label: 'Instagram Post', icon: '📷', color: '#E1306C', platform: 'instagram' },
  [CONTENT_TYPES.INSTAGRAM_REEL]: { label: 'Instagram Reel', icon: '🎞️', color: '#E1306C', platform: 'instagram' },
  [CONTENT_TYPES.INSTAGRAM_STORY]: { label: 'Instagram Story', icon: '📖', color: '#E1306C', platform: 'instagram' },
  [CONTENT_TYPES.TIKTOK]: { label: 'TikTok', icon: '🎵', color: '#000000', platform: 'tiktok' },
  [CONTENT_TYPES.LINKEDIN_POST]: { label: 'LinkedIn Post', icon: '💼', color: '#0A66C2', platform: 'linkedin' },
  [CONTENT_TYPES.TWITTER_POST]: { label: 'Twitter/X Post', icon: '🐦', color: '#1DA1F2', platform: 'twitter' },
  [CONTENT_TYPES.FACEBOOK_POST]: { label: 'Facebook Post', icon: '👍', color: '#1877F2', platform: 'facebook' },
  [CONTENT_TYPES.BLOG]: { label: 'Blog Article', icon: '📝', color: '#4A5568', platform: 'website' },
  [CONTENT_TYPES.PODCAST]: { label: 'Podcast Episode', icon: '🎙️', color: '#9333EA', platform: 'podcast' },
  [CONTENT_TYPES.NEWSLETTER]: { label: 'Newsletter', icon: '📧', color: '#059669', platform: 'email' },
};

// ============================================================================
// PLATFORMS
// ============================================================================

export const PLATFORMS = {
  INSTAGRAM: 'instagram',
  TIKTOK: 'tiktok',
  YOUTUBE: 'youtube',
  TWITTER: 'twitter',
  LINKEDIN: 'linkedin',
  FACEBOOK: 'facebook',
  WEBSITE: 'website',
  PODCAST: 'podcast',
  EMAIL: 'email',
} as const;

export type Platform = typeof PLATFORMS[keyof typeof PLATFORMS];

// ============================================================================
// APPROVAL & PRIORITY
// ============================================================================

export const APPROVAL_STATUS = {
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REVISION_REQUESTED: 'revision_requested',
} as const;

export type ApprovalStatus = typeof APPROVAL_STATUS[keyof typeof APPROVAL_STATUS];

export const PRIORITY = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export type Priority = typeof PRIORITY[keyof typeof PRIORITY];

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  [PRIORITY.LOW]: { label: 'Low', color: 'bg-slate-500/20 text-slate-700' },
  [PRIORITY.NORMAL]: { label: 'Normal', color: 'bg-blue-500/20 text-blue-700' },
  [PRIORITY.HIGH]: { label: 'High', color: 'bg-orange-500/20 text-orange-700' },
  [PRIORITY.URGENT]: { label: 'Urgent', color: 'bg-red-500/20 text-red-700' },
};

// ============================================================================
// USER ROLES
// ============================================================================

export const USER_ROLES = {
  ADMIN: 'admin',
  PMS: 'pms',         // Project Manager (same as admin but maybe limited)
  CREATOR: 'creator', // Freelancer (writer, designer, editor)
  CLIENT: 'client',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.PMS]: 'Project Manager',
  [USER_ROLES.CREATOR]: 'Creator',
  [USER_ROLES.CLIENT]: 'Client',
};

// ============================================================================
// AI GENERATION TYPES
// ============================================================================

export const AI_GENERATION_TYPES = {
  IDEA: 'idea',
  SCRIPT: 'script',
  CAPTION: 'caption',
  HASHTAGS: 'hashtags',
  TITLE: 'title',
  BRIEF: 'brief',
} as const;

export type AIGenerationType = typeof AI_GENERATION_TYPES[keyof typeof AI_GENERATION_TYPES];

// ============================================================================
// TOOL CATEGORIES
// ============================================================================

export const TOOL_CATEGORIES = {
  AI_WRITING: 'ai_writing',
  ANALYTICS: 'analytics',
  MEDIA: 'media',
} as const;

export type ToolCategory = typeof TOOL_CATEGORIES[keyof typeof TOOL_CATEGORIES];

// ============================================================================
// STATUS COLORS (for badges)
// ============================================================================

// Content status colors
export const CONTENT_STATUS_COLORS: Record<ContentStatus, string> = {
  [CONTENT_STATUS.INBOX]: 'bg-slate-500/20 text-slate-700',
  [CONTENT_STATUS.IDEATION]: 'bg-purple-500/20 text-purple-700',
  [CONTENT_STATUS.CREATING]: 'bg-blue-500/20 text-blue-700',
  [CONTENT_STATUS.REVIEW]: 'bg-yellow-500/20 text-yellow-700',
  [CONTENT_STATUS.REVISION]: 'bg-orange-500/20 text-orange-700',
  [CONTENT_STATUS.APPROVED]: 'bg-emerald-500/20 text-emerald-700',
  [CONTENT_STATUS.SCHEDULED]: 'bg-indigo-500/20 text-indigo-700',
  [CONTENT_STATUS.PUBLISHED]: 'bg-green-500 text-white',
};

// Audit status colors
export const AUDIT_STATUS_COLORS: Record<AuditStatus, string> = {
  [AUDIT_STATUS.PENDING]: 'bg-yellow-500/20 text-yellow-700',
  [AUDIT_STATUS.PLANNING]: 'bg-blue-500/20 text-blue-700',
  [AUDIT_STATUS.IN_PROGRESS]: 'bg-purple-500/20 text-purple-700',
  [AUDIT_STATUS.REVIEW]: 'bg-orange-500/20 text-orange-700',
  [AUDIT_STATUS.COMPLETED]: 'bg-green-500/20 text-green-700',
  [AUDIT_STATUS.DELIVERED]: 'bg-green-500 text-white',
  [AUDIT_STATUS.PAYMENT_RECEIVED]: 'bg-green-500 text-white',
  [AUDIT_STATUS.PAYMENT_FAILED]: 'bg-red-500/20 text-red-700',
};

// Combined for backwards compatibility (uses content status as primary)
export const STATUS_COLORS: Record<string, string> = {
  ...CONTENT_STATUS_COLORS,
  // Legacy/audit specific
  'pending': 'bg-yellow-500/20 text-yellow-700',
  'planning': 'bg-blue-500/20 text-blue-700',
  'in_progress': 'bg-purple-500/20 text-purple-700',
  'completed': 'bg-green-500/20 text-green-700',
  'delivered': 'bg-green-500 text-white',
  'draft': 'bg-slate-500/20 text-slate-700',
  'audit_review': 'bg-orange-500/20 text-orange-700',
};

// ============================================================================
// QUERY KEYS (for React Query)
// ============================================================================

export const QUERY_KEYS = {
  // Audit
  AUDIT_SIGNUPS: 'audit-signups',
  AUDIT_RUNS: 'audit-runs',
  AUDIT_REVIEWS: 'audit-reviews',

  // Content
  CONTENT: 'content',
  CONTENT_LIST: 'content-list',
  CONTENT_DETAIL: 'content-detail',
  CONTENT_COMMENTS: 'content-comments',
  CONTENT_VERSIONS: 'content-versions',
  CONTENT_TYPES: 'content-types',
  CONTENT_REQUESTS: 'content-requests',

  // Clients & Brands
  CLIENTS: 'clients',
  CLIENT_DETAIL: 'client-detail',
  BRAND_PROFILES: 'brand-profiles',

  // Users & Team
  PROFILES: 'profiles',
  USER_ROLES: 'user-roles',
  CREATORS: 'creators',
  INVITATIONS: 'invitations',

  // Other
  DASHBOARD_STATS: 'dashboard-stats',
} as const;

// ============================================================================
// ROUTES (for navigation)
// ============================================================================

export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',

  // Dashboard
  DASHBOARD: '/dashboard',

  // Content
  CONTENT: '/content',
  CONTENT_INBOX: '/content/inbox',
  CONTENT_CREATE: '/content/create',
  CONTENT_CALENDAR: '/content/calendar',
  CONTENT_DETAIL: (id: string) => `/content/${id}`,

  // My Tasks (for creators)
  MY_TASKS: '/my-tasks',

  // Clients
  CLIENTS: '/clients',
  CLIENT_DETAIL: (id: string) => `/clients/${id}`,
  CLIENT_BRAND: (id: string) => `/clients/${id}/brand`,

  // Templates
  TEMPLATES: '/templates',

  // Audit
  AUDIT_MANAGEMENT: '/audit-management',

  // Admin
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_SETTINGS: '/admin/settings',
} as const;

// ============================================================================
// SIDEBAR NAVIGATION CONFIG
// ============================================================================

export const SIDEBAR_NAV = [
  {
    label: 'Dashboard',
    href: ROUTES.DASHBOARD,
    icon: 'LayoutDashboard',
    roles: ['admin', 'pms', 'creator', 'client'],
  },
  {
    label: 'Content',
    href: ROUTES.CONTENT,
    icon: 'FileText',
    roles: ['admin', 'pms'],
    children: [
      { label: 'All Content', href: ROUTES.CONTENT, icon: 'List' },
      { label: 'Inbox', href: ROUTES.CONTENT_INBOX, icon: 'Inbox' },
      { label: 'Calendar', href: ROUTES.CONTENT_CALENDAR, icon: 'Calendar' },
      { label: 'Create', href: ROUTES.CONTENT_CREATE, icon: 'Plus' },
    ],
  },
  {
    label: 'My Tasks',
    href: ROUTES.MY_TASKS,
    icon: 'CheckSquare',
    roles: ['creator'],
  },
  {
    label: 'Clients',
    href: ROUTES.CLIENTS,
    icon: 'Users',
    roles: ['admin', 'pms'],
  },
  {
    label: 'Templates',
    href: ROUTES.TEMPLATES,
    icon: 'Layout',
    roles: ['admin', 'pms', 'creator'],
  },
  {
    label: 'Audit Management',
    href: ROUTES.AUDIT_MANAGEMENT,
    icon: 'ClipboardCheck',
    roles: ['admin', 'pms'],
  },
  {
    label: 'Admin',
    href: ROUTES.ADMIN,
    icon: 'Settings',
    roles: ['admin'],
  },
] as const;
