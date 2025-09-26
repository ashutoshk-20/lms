import authReducer from '../features/authSlice.js'
import { combineReducers } from '@reduxjs/toolkit';
import { authApi } from '../features/api/authApi.js';
import { courseApi } from '@/features/api/courseApi.js';
import { courseProgressApi } from '@/features/api/courseProgressApi.js';

const rootReducer = combineReducers({
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
    [courseProgressApi.reducerPath]: courseProgressApi.reducer,
});

export default rootReducer;