import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store=configureStore({
    reducer:{
        auth:authReducer,
        ui:uiReducer,
        dashboard:dashboardReducer,
    },
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware({
            serializableCheck:{
                ignoredActions:['auth/signIn/fulfilled','auth/initialize/fulfilled'],
                ignoredPaths:['auth.user'],
            },
        }),
        devTools:process.env.NODE_ENV!=='production',
});
export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch=typeof store.dispatch;