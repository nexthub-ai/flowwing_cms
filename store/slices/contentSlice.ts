import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createClient } from '@/supabase/client';
import { ContentService, ContentPost } from '@/services/contentService';

interface ContentState {
  posts: ContentPost[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ContentState = {
  posts: [],
  isLoading: false,
  error: null,
};

export const loadContent = createAsyncThunk(
  'content/loadContent',
  async () => {
    const supabase = createClient();
    const data = await ContentService.getContentPosts(supabase);
    return data;
  }
);

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    clearContent: (state) => {
      state.posts = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadContent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(loadContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load content';
      });
  },
});

export const { clearContent } = contentSlice.actions;
export const selectContent = (state: { content: ContentState }) => state.content.posts;
export const selectContentLoading = (state: { content: ContentState }) => state.content.isLoading;
export const selectContentError = (state: { content: ContentState }) => state.content.error;

export default contentSlice.reducer;
