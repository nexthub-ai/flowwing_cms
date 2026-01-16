/**
 * Clients Redux Slice
 * State management for clients and brand profiles
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ClientService } from '@/services/clientService';
import { createClient } from '@/supabase/client';
import {
  ClientFull,
  ClientFormData,
  ClientFilters,
  BrandProfile,
  BrandProfileFormData,
} from '@/types';

// ============================================================================
// STATE TYPE
// ============================================================================

interface ClientsState {
  // List
  items: ClientFull[];
  total: number;
  page: number;
  pageSize: number;

  // Single client detail
  currentClient: ClientFull | null;
  currentBrandProfile: BrandProfile | null;

  // Stats
  stats: {
    total: number;
    active: number;
    withContent: number;
  };

  // Filters
  filters: ClientFilters;

  // Loading states
  isLoading: boolean;
  isLoadingDetail: boolean;
  isSaving: boolean;

  // Errors
  error: string | null;
}

const initialState: ClientsState = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 20,
  currentClient: null,
  currentBrandProfile: null,
  stats: {
    total: 0,
    active: 0,
    withContent: 0,
  },
  filters: {},
  isLoading: false,
  isLoadingDetail: false,
  isSaving: false,
  error: null,
};

// ============================================================================
// ASYNC THUNKS
// ============================================================================

/**
 * Fetch clients list
 */
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (params: { filters?: ClientFilters; page?: number; pageSize?: number } = {}) => {
    const supabase = createClient();
    const response = await ClientService.getClients(
      supabase,
      params.filters,
      { page: params.page, pageSize: params.pageSize }
    );
    return response;
  }
);

/**
 * Fetch single client by ID
 */
export const fetchClientById = createAsyncThunk(
  'clients/fetchClientById',
  async (id: string) => {
    const supabase = createClient();
    const client = await ClientService.getClientById(supabase, id);
    return client;
  }
);

/**
 * Fetch client by user ID (for logged-in clients)
 */
export const fetchClientByUserId = createAsyncThunk(
  'clients/fetchClientByUserId',
  async (userId: string) => {
    const supabase = createClient();
    const client = await ClientService.getClientByUserId(supabase, userId);
    return client;
  }
);

/**
 * Create new client
 */
export const createClientRecord = createAsyncThunk(
  'clients/createClient',
  async (data: ClientFormData) => {
    const supabase = createClient();
    const client = await ClientService.createClient(supabase, data);
    return client;
  }
);

/**
 * Update client
 */
export const updateClientRecord = createAsyncThunk(
  'clients/updateClient',
  async (params: { id: string; updates: Partial<ClientFormData> }) => {
    const supabase = createClient();
    const client = await ClientService.updateClient(
      supabase,
      params.id,
      params.updates
    );
    return client;
  }
);

/**
 * Delete client
 */
export const deleteClientRecord = createAsyncThunk(
  'clients/deleteClient',
  async (id: string) => {
    const supabase = createClient();
    await ClientService.deleteClient(supabase, id);
    return id;
  }
);

/**
 * Fetch brand profile
 */
export const fetchBrandProfile = createAsyncThunk(
  'clients/fetchBrandProfile',
  async (clientId: string) => {
    const supabase = createClient();
    const profile = await ClientService.getBrandProfile(supabase, clientId);
    return profile;
  }
);

/**
 * Create brand profile
 */
export const createBrandProfile = createAsyncThunk(
  'clients/createBrandProfile',
  async (params: { clientId: string; data: BrandProfileFormData }) => {
    const supabase = createClient();
    const profile = await ClientService.createBrandProfile(
      supabase,
      params.clientId,
      params.data
    );
    return profile;
  }
);

/**
 * Update brand profile
 */
export const updateBrandProfile = createAsyncThunk(
  'clients/updateBrandProfile',
  async (params: { id: string; updates: Partial<BrandProfileFormData> }) => {
    const supabase = createClient();
    const profile = await ClientService.updateBrandProfile(
      supabase,
      params.id,
      params.updates
    );
    return profile;
  }
);

/**
 * Convert audit to client
 */
export const convertAuditToClient = createAsyncThunk(
  'clients/convertAuditToClient',
  async (auditSignupId: string) => {
    const supabase = createClient();
    const result = await ClientService.convertAuditToClient(supabase, auditSignupId);
    return result;
  }
);

/**
 * Fetch client stats
 */
export const fetchClientStats = createAsyncThunk(
  'clients/fetchClientStats',
  async () => {
    const supabase = createClient();
    const stats = await ClientService.getStats(supabase);
    return stats;
  }
);

// ============================================================================
// SLICE
// ============================================================================

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<ClientFilters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setCurrentClient: (state, action: PayloadAction<ClientFull | null>) => {
      state.currentClient = action.payload;
    },
    clearCurrentClient: (state) => {
      state.currentClient = null;
      state.currentBrandProfile = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch clients list
    builder
      .addCase(fetchClients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch clients';
      });

    // Fetch single client
    builder
      .addCase(fetchClientById.pending, (state) => {
        state.isLoadingDetail = true;
        state.error = null;
      })
      .addCase(fetchClientById.fulfilled, (state, action) => {
        state.isLoadingDetail = false;
        state.currentClient = action.payload;
      })
      .addCase(fetchClientById.rejected, (state, action) => {
        state.isLoadingDetail = false;
        state.error = action.error.message || 'Failed to fetch client';
      });

    // Fetch client by user ID
    builder
      .addCase(fetchClientByUserId.pending, (state) => {
        state.isLoadingDetail = true;
        state.error = null;
      })
      .addCase(fetchClientByUserId.fulfilled, (state, action) => {
        state.isLoadingDetail = false;
        state.currentClient = action.payload;
      })
      .addCase(fetchClientByUserId.rejected, (state, action) => {
        state.isLoadingDetail = false;
        state.error = action.error.message || 'Failed to fetch client';
      });

    // Create client
    builder
      .addCase(createClientRecord.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(createClientRecord.fulfilled, (state, action) => {
        state.isSaving = false;
        state.items.unshift(action.payload as any);
        state.total += 1;
      })
      .addCase(createClientRecord.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error.message || 'Failed to create client';
      });

    // Update client
    builder
      .addCase(updateClientRecord.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(updateClientRecord.fulfilled, (state, action) => {
        state.isSaving = false;
        const index = state.items.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
        if (state.currentClient?.id === action.payload.id) {
          state.currentClient = { ...state.currentClient, ...action.payload };
        }
      })
      .addCase(updateClientRecord.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error.message || 'Failed to update client';
      });

    // Delete client
    builder
      .addCase(deleteClientRecord.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter(c => c.id !== id);
        state.total -= 1;
        if (state.currentClient?.id === id) {
          state.currentClient = null;
          state.currentBrandProfile = null;
        }
      });

    // Fetch brand profile
    builder
      .addCase(fetchBrandProfile.pending, (state) => {
        state.isLoadingDetail = true;
      })
      .addCase(fetchBrandProfile.fulfilled, (state, action) => {
        state.isLoadingDetail = false;
        state.currentBrandProfile = action.payload;
      })
      .addCase(fetchBrandProfile.rejected, (state) => {
        state.isLoadingDetail = false;
      });

    // Create brand profile
    builder
      .addCase(createBrandProfile.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(createBrandProfile.fulfilled, (state, action) => {
        state.isSaving = false;
        state.currentBrandProfile = action.payload;
      })
      .addCase(createBrandProfile.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error.message || 'Failed to create brand profile';
      });

    // Update brand profile
    builder
      .addCase(updateBrandProfile.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(updateBrandProfile.fulfilled, (state, action) => {
        state.isSaving = false;
        state.currentBrandProfile = action.payload;
      })
      .addCase(updateBrandProfile.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error.message || 'Failed to update brand profile';
      });

    // Convert audit to client
    builder
      .addCase(convertAuditToClient.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(convertAuditToClient.fulfilled, (state, action) => {
        state.isSaving = false;
        state.items.unshift(action.payload.client as any);
        state.total += 1;
        state.currentClient = action.payload.client as any;
        state.currentBrandProfile = action.payload.brandProfile;
      })
      .addCase(convertAuditToClient.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error.message || 'Failed to convert audit to client';
      });

    // Fetch stats
    builder
      .addCase(fetchClientStats.fulfilled, (state, action) => {
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
  setCurrentClient,
  clearCurrentClient,
  clearError,
} = clientsSlice.actions;

export default clientsSlice.reducer;

// ============================================================================
// SELECTORS
// ============================================================================

export const selectClients = (state: { clients: ClientsState }) => state.clients.items;
export const selectCurrentClient = (state: { clients: ClientsState }) => state.clients.currentClient;
export const selectCurrentBrandProfile = (state: { clients: ClientsState }) => state.clients.currentBrandProfile;
export const selectClientStats = (state: { clients: ClientsState }) => state.clients.stats;
export const selectClientFilters = (state: { clients: ClientsState }) => state.clients.filters;
export const selectClientsLoading = (state: { clients: ClientsState }) => state.clients.isLoading;
export const selectClientsSaving = (state: { clients: ClientsState }) => state.clients.isSaving;
export const selectClientsError = (state: { clients: ClientsState }) => state.clients.error;
