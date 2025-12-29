import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createClient } from '@/supabase/client';
import { AuditService, AuditSignup } from '@/services/auditService';

interface AuditsState {
  audits: AuditSignup[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AuditsState = {
  audits: [],
  isLoading: false,
  error: null,
};

export const loadAudits = createAsyncThunk(
  'audits/loadAudits',
  async () => {
    const supabase = createClient();
    const data = await AuditService.getAuditSignups(supabase);
    return data;
  }
);

const auditsSlice = createSlice({
  name: 'audits',
  initialState,
  reducers: {
    clearAudits: (state) => {
      state.audits = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAudits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadAudits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.audits = action.payload;
      })
      .addCase(loadAudits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load audits';
      });
  },
});

export const { clearAudits } = auditsSlice.actions;
export const selectAudits = (state: { audits: AuditsState }) => state.audits.audits;
export const selectAuditsLoading = (state: { audits: AuditsState }) => state.audits.isLoading;
export const selectAuditsError = (state: { audits: AuditsState }) => state.audits.error;

export default auditsSlice.reducer;
