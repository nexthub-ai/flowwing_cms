import {createSlice,PayloadAction} from '@reduxjs/toolkit';

interface UIState{
    theme:'light'|'dark'|'system';
    sidebarOpen:boolean;
    modals:{
        createContent:boolean;
        editContent:boolean;
        deleteConfirm:boolean;
        createAudit:boolean;
        editAudit:boolean;
    };
    isPageLoading:boolean;
}

const initialState:UIState={
    theme:'system',
    sidebarOpen:false,
    modals:{
        createContent:false,
        editContent:false,
        deleteConfirm:false,
        createAudit:false,
        editAudit:false,
    },
    isPageLoading:false,
}

const uiSlice=createSlice({
    name:'ui',
    initialState,
    reducers:{
        setTheme:(state,action:PayloadAction<'light'|'dark'|'system'>)=>{
            state.theme=action.payload;
        },
        toggleSidebar:(state)=>{
            state.sidebarOpen=!state.sidebarOpen;
        },
        setSidebarOpen:(state,action:PayloadAction<boolean>)=>{
            state.sidebarOpen=action.payload;
        },
        openModal:(state,action:PayloadAction<keyof UIState['modals']>)=>{
            state.modals[action.payload]=true;
        },
        closeModal:(state,action:PayloadAction<keyof UIState['modals']>)=>{
            state.modals[action.payload]=false;
        },
        closeAllModals:(state)=>{
            Object.keys(state.modals).forEach(key=>{
                state.modals[key as keyof UIState['modals']]=false;
            });
        },
        setPageLoading:(state,action:PayloadAction<boolean>)=>{
            state.isPageLoading=action.payload;
        },
    },
})

export const {setTheme,toggleSidebar,setSidebarOpen,openModal,closeModal,setPageLoading}=uiSlice.actions;
export const selectTheme=(state:{ui:UIState})=>state.ui.theme;
export const selectSidebarOpen=(state:{ui:UIState})=>state.ui.sidebarOpen;
export const selectModal=(modalName:keyof UIState['modals'])=>(state:{ui:UIState})=>state.ui.modals[modalName];
export const selectIsPageLoading=(state:{ui:UIState})=>state.ui.isPageLoading;
export default uiSlice.reducer;