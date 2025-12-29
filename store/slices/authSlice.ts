import {createSlice,createAsyncThunk,PayloadAction} from "@reduxjs/toolkit";
import {User} from '@supabase/supabase-js';
import { AuthService,AppRole } from "@/services/authService"; 
import { createClient } from "@/supabase/client"; 
interface AuthState{
    user: User|null;
    roles:AppRole[];
    isInitialized:boolean;
    isLoading:boolean;
    error:string|null;
}

const initialState:AuthState={
    user:null,
    roles:[],
    isLoading:true,
    isInitialized:false,
    error:null,
}

export const fetchUserRoles=createAsyncThunk(
    'auth/featchRoles',
    async(userId:string)=>{
        const supabase=createClient();
        return await AuthService.getUserRoles(supabase,userId);
    }
);

export const initializeAuth=createAsyncThunk(
    'auth/initialize',
    async()=>{
        const supabase=createClient();
        const session=await AuthService.getCurrentSession(supabase);
        return session;
    }
);

export const signIn=createAsyncThunk(
    'auth/signIn',
    async({email,password}:{email:string;password:string})=>{
        const supabase=createClient();
        return await AuthService.signIn(supabase,email,password);
    }
);

export const signOut=createAsyncThunk(
    'auth/signOut',
    async()=>{
        const supabase=createClient();
        await AuthService.signOut(supabase);
    }
);

const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        setUser:(state,action:PayloadAction<User|null>)=>{
            state.user=action.payload;
        },
        setRoles:(state,action:PayloadAction<AppRole[]>)=>{
            state.roles=action.payload;
        },
        clearAuth:(state)=>{
            state.user=null;
            state.roles=[];
            state.error=null;
        },
        clearError:(state)=>{
            state.error=null;
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(initializeAuth.pending,(state)=>{
            state.isLoading=true; 
        })
        .addCase(initializeAuth.fulfilled,(state,action)=>{
            if(action.payload){
                state.user=action.payload.user;
                state.roles=action.payload.roles;
            }
            state.isLoading=false;
            state.isInitialized=true;
        })
        .addCase(initializeAuth.rejected,(state,action)=>{
            state.isLoading=false;
            state.error=action.error.message||'Failed to initialize authentication';
            state.isInitialized=true;
        });
        // Fetch roles
        builder
        .addCase(fetchUserRoles.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(fetchUserRoles.fulfilled, (state, action) => {
            state.roles = action.payload;
            state.isLoading = false;
        })
        .addCase(fetchUserRoles.rejected, (state, action) => {
            state.error = action.error.message || 'Failed to fetch roles';
            state.isLoading = false;
        });
    // Sign in
        builder
        .addCase(signIn.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(signIn.fulfilled, (state, action) => {
            state.user = action.payload.user;
            state.roles = action.payload.roles;
            state.isLoading = false;
        })
        .addCase(signIn.rejected, (state, action) => {
            state.error = action.error.message || 'Sign in failed';
            state.isLoading = false;
        });

        // Sign out
        builder
        .addCase(signOut.fulfilled, (state) => {
            state.user = null;
            state.roles = [];
            state.error = null;
        });
    },
});

export const {setUser,setRoles,clearAuth,clearError}=authSlice.actions;
export const selectUser=(state:{auth:AuthState})=>state.auth.user;
export const selectRoles=(state:{auth:AuthState})=>state.auth.roles;
export const selectIsLoading=(state:{auth:AuthState})=>state.auth.isLoading;
export const selectIsAuthenticated=(state:{auth:AuthState})=>!!state.auth.user;

export const selectHasRole=(role:AppRole)=>(state:{auth:AuthState})=>{
    return AuthService.hasRole(state.auth.roles,role);
}
export default authSlice.reducer;