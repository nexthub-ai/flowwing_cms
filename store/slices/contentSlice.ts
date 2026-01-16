/**
 * Content Redux Slice
 * State management for content workflow
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ContentService } from '@/services/contentService';
import { createClient } from '@/supabase/client';
import {
  ContentFull,
  ContentFilters,
  ContentFormData,
  ContentCommentWithUser,
  PaginatedResponse,
} from '@/types';
import { ContentStatus } from '@/constants/constants';

// ============================================================================
// STATE TYPE
// ============================================================================

interface ContentTypeOption {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  platform: string;
}

interface ContentState {
  // List view
  items: ContentFull[];
  total: number;
  page: number;
  pageSize: number;

  // Kanban view (grouped by status)
  byStatus: Record<ContentStatus, ContentFull[]>;

  // Single content detail
  currentContent: ContentFull | null;
  currentComments: ContentCommentWithUser[];

  // Content types from database
  contentTypes: ContentTypeOption[];

  // Stats
  stats: Record<ContentStatus, number>;

  // Filters
  filters: ContentFilters;

  // Loading states
  isLoading: boolean;
  isLoadingDetail: boolean;
  isLoadingComments: boolean;
  isSaving: boolean;

  // Errors
  error: string | null;
}

const initialState: ContentState = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 20,
  byStatus: {
    inbox: [],
    ideation: [],
    creating: [],
    review: [],
    revision: [],
    approved: [],
    scheduled: [],
    published: [],
  },
  currentContent: null,
  currentComments: [],
  contentTypes: [],
  stats: {
    inbox: 0,
    ideation: 0,
    creating: 0,
    review: 0,
    revision: 0,
    approved: 0,
    scheduled: 0,
    published: 0,
  },
  filters: {},
  isLoading: false,
  isLoadingDetail: false,
  isLoadingComments: false,
  isSaving: false,
  error: null,
};

// ============================================================================
// ASYNC THUNKS
// ============================================================================

/**
 * Fetch content types from database
 */
export const fetchContentTypes = createAsyncThunk(
  'content/fetchContentTypes',
  async () => {
    const supabase = createClient();
    const contentTypes = await ContentService.getContentTypes(supabase);
    return contentTypes;
  }
);

/**
 * Fetch content list
 */
export const fetchContent = createAsyncThunk(
  'content/fetchContent',
  async (params: { filters?: ContentFilters; page?: number; pageSize?: number } = {}) => {
    const supabase = createClient();
    const response = await ContentService.getContent(
      supabase,
      params.filters,
      { page: params.page, pageSize: params.pageSize }
    );
    return response;
  }
);

/**
 * Fetch content for kanban view (all statuses)
 */
export const fetchContentForKanban = createAsyncThunk<
  Record<ContentStatus, ContentFull[]>,
  ContentFilters | void
>(
  'content/fetchContentForKanban',
  async (filters) => {
    const supabase = createClient();
    const allStatuses: ContentStatus[] = [
      'inbox', 'ideation', 'creating', 'review', 'revision', 'approved', 'scheduled', 'published'
    ];
    const response = await ContentService.getContentByStatus(supabase, allStatuses);

    // Group by status
    const byStatus: Record<string, ContentFull[]> = {};
    allStatuses.forEach(status => {
      byStatus[status] = response.filter(item => item.status === status);
    });

    return byStatus as Record<ContentStatus, ContentFull[]>;
  }
);

/**
 * Fetch single content by ID
 */
export const fetchContentById = createAsyncThunk(
  'content/fetchContentById',
  async (id: string) => {
    const supabase = createClient();
    const content = await ContentService.getContentById(supabase, id);
    return content;
  }
);

/**
 * Fetch assigned content for creator
 */
export const fetchAssignedContent = createAsyncThunk(
  'content/fetchAssignedContent',
  async (params: { userId: string; filters?: ContentFilters }) => {
    const supabase = createClient();
    const response = await ContentService.getAssignedContent(
      supabase,
      params.userId,
      params.filters
    );
    return response;
  }
);

/**
 * Create new content
 */
export const createContent = createAsyncThunk(
  'content/createContent',
  async (params: { data: ContentFormData; createdBy: string }) => {
    const supabase = createClient();
    const content = await ContentService.createContent(
      supabase,
      params.data,
      params.createdBy
    );
    return content;
  }
);

/**
 * Update content
 */
export const updateContent = createAsyncThunk(
  'content/updateContent',
  async (params: { id: string; updates: Partial<ContentFormData> }) => {
    const supabase = createClient();
    const content = await ContentService.updateContent(
      supabase,
      params.id,
      params.updates
    );
    return content;
  }
);

/**
 * Update content status
 */
export const updateContentStatus = createAsyncThunk(
  'content/updateContentStatus',
  async (params: { id: string; status: ContentStatus }) => {
    const supabase = createClient();
    const content = await ContentService.updateStatus(
      supabase,
      params.id,
      params.status
    );
    return { id: params.id, status: params.status, content };
  }
);

/**
 * Assign content
 */
export const assignContent = createAsyncThunk(
  'content/assignContent',
  async (params: { id: string; assigneeId: string; role?: 'primary' | 'editor' | 'designer' }) => {
    const supabase = createClient();
    const content = await ContentService.assignContent(
      supabase,
      params.id,
      params.assigneeId,
      params.role
    );
    return content;
  }
);

/**
 * Approve content
 */
export const approveContent = createAsyncThunk(
  'content/approveContent',
  async (params: { id: string; approvedBy: string }) => {
    const supabase = createClient();
    const content = await ContentService.approveContent(
      supabase,
      params.id,
      params.approvedBy
    );
    return content;
  }
);

/**
 * Request revision
 */
export const requestRevision = createAsyncThunk(
  'content/requestRevision',
  async (id: string) => {
    const supabase = createClient();
    const content = await ContentService.requestRevision(supabase, id);
    return content;
  }
);

/**
 * Schedule content
 */
export const scheduleContent = createAsyncThunk(
  'content/scheduleContent',
  async (params: { id: string; scheduledAt: string }) => {
    const supabase = createClient();
    const content = await ContentService.scheduleContent(
      supabase,
      params.id,
      params.scheduledAt
    );
    return content;
  }
);

/**
 * Delete content
 */
export const deleteContent = createAsyncThunk(
  'content/deleteContent',
  async (id: string) => {
    const supabase = createClient();
    await ContentService.deleteContent(supabase, id);
    return id;
  }
);

/**
 * Fetch comments
 */
export const fetchComments = createAsyncThunk(
  'content/fetchComments',
  async (contentId: string) => {
    const supabase = createClient();
    const comments = await ContentService.getComments(supabase, contentId);
    return comments;
  }
);

/**
 * Add comment
 */
export const addComment = createAsyncThunk(
  'content/addComment',
  async (params: {
    contentId: string;
    userId: string;
    comment: string;
    options?: {
      parentId?: string;
      mediaReference?: any;
      isApprovalAction?: boolean;
      approvalDecision?: string;
    };
  }) => {
    const supabase = createClient();
    const newComment = await ContentService.addComment(
      supabase,
      params.contentId,
      params.userId,
      params.comment,
      params.options
    );
    return newComment;
  }
);

/**
 * Fetch content stats
 */
export const fetchContentStats = createAsyncThunk(
  'content/fetchContentStats',
  async (clientId?: string) => {
    const supabase = createClient();
    const stats = await ContentService.getStats(supabase, clientId);
    return stats;
  }
);

// ============================================================================
// SLICE
// ============================================================================

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<ContentFilters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setCurrentContent: (state, action: PayloadAction<ContentFull | null>) => {
      state.currentContent = action.payload;
    },
    clearCurrentContent: (state) => {
      state.currentContent = null;
      state.currentComments = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    // Optimistic update for drag-and-drop
    moveContentToStatus: (
      state,
      action: PayloadAction<{ id: string; fromStatus: ContentStatus; toStatus: ContentStatus }>
    ) => {
      const { id, fromStatus, toStatus } = action.payload;
      const contentIndex = state.byStatus[fromStatus].findIndex(c => c.id === id);
      if (contentIndex !== -1) {
        const [content] = state.byStatus[fromStatus].splice(contentIndex, 1);
        content.status = toStatus;
        state.byStatus[toStatus].push(content);
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch content types
    builder
      .addCase(fetchContentTypes.fulfilled, (state, action) => {
        state.contentTypes = action.payload;
      });

    // Fetch content list
    builder
      .addCase(fetchContent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch content';
      });

    // Fetch kanban content
    builder
      .addCase(fetchContentForKanban.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContentForKanban.fulfilled, (state, action) => {
        state.isLoading = false;
        state.byStatus = action.payload;
      })
      .addCase(fetchContentForKanban.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch content';
      });

    // Fetch single content
    builder
      .addCase(fetchContentById.pending, (state) => {
        state.isLoadingDetail = true;
        state.error = null;
      })
      .addCase(fetchContentById.fulfilled, (state, action) => {
        state.isLoadingDetail = false;
        state.currentContent = action.payload;
      })
      .addCase(fetchContentById.rejected, (state, action) => {
        state.isLoadingDetail = false;
        state.error = action.error.message || 'Failed to fetch content';
      });

    // Fetch assigned content
    builder
      .addCase(fetchAssignedContent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAssignedContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchAssignedContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch assigned content';
      });

    // Create content
    builder
      .addCase(createContent.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(createContent.fulfilled, (state, action) => {
        state.isSaving = false;
        // Add to inbox in kanban view
        if (state.byStatus.inbox) {
          state.byStatus.inbox.unshift(action.payload as any);
        }
      })
      .addCase(createContent.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error.message || 'Failed to create content';
      });

    // Update content
    builder
      .addCase(updateContent.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(updateContent.fulfilled, (state, action) => {
        state.isSaving = false;
        if (state.currentContent?.id === action.payload.id) {
          state.currentContent = { ...state.currentContent, ...action.payload };
        }
      })
      .addCase(updateContent.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error.message || 'Failed to update content';
      });

    // Update status
    builder
      .addCase(updateContentStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        // Update in kanban view
        Object.keys(state.byStatus).forEach(key => {
          const statusKey = key as ContentStatus;
          const index = state.byStatus[statusKey].findIndex(c => c.id === id);
          if (index !== -1) {
            const [content] = state.byStatus[statusKey].splice(index, 1);
            content.status = status;
            state.byStatus[status].push(content);
          }
        });
        // Update current content if viewing
        if (state.currentContent?.id === id) {
          state.currentContent.status = status;
        }
      });

    // Delete content
    builder
      .addCase(deleteContent.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter(c => c.id !== id);
        Object.keys(state.byStatus).forEach(key => {
          const statusKey = key as ContentStatus;
          state.byStatus[statusKey] = state.byStatus[statusKey].filter(c => c.id !== id);
        });
        if (state.currentContent?.id === id) {
          state.currentContent = null;
        }
      });

    // Fetch comments
    builder
      .addCase(fetchComments.pending, (state) => {
        state.isLoadingComments = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoadingComments = false;
        state.currentComments = action.payload;
      })
      .addCase(fetchComments.rejected, (state) => {
        state.isLoadingComments = false;
      });

    // Add comment
    builder
      .addCase(addComment.fulfilled, (state, action) => {
        // Refetch comments would be better, but for now just add to list
        // This won't have user info, so we should refetch
      });

    // Fetch stats
    builder
      .addCase(fetchContentStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

// ============================================================================
// EXPORTS
// ============================================================================

export const {
  setFilters,
  clearFilters,
  setCurrentContent,
  clearCurrentContent,
  clearError,
  moveContentToStatus,
} = contentSlice.actions;

export default contentSlice.reducer;

// ============================================================================
// SELECTORS
// ============================================================================

export const selectContent = (state: { content: ContentState }) => state.content.items;
export const selectContentByStatus = (state: { content: ContentState }) => state.content.byStatus;
export const selectCurrentContent = (state: { content: ContentState }) => state.content.currentContent;
export const selectCurrentComments = (state: { content: ContentState }) => state.content.currentComments;
export const selectContentTypes = (state: { content: ContentState }) => state.content.contentTypes;
export const selectContentStats = (state: { content: ContentState }) => state.content.stats;
export const selectContentFilters = (state: { content: ContentState }) => state.content.filters;
export const selectContentLoading = (state: { content: ContentState }) => state.content.isLoading;
export const selectContentSaving = (state: { content: ContentState }) => state.content.isSaving;
export const selectContentError = (state: { content: ContentState }) => state.content.error;
