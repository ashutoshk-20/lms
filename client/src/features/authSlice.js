import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    user: null,
    isAuthenticated: false,
}

const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {
        userLoggeddIn: (state, action) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        userLoggedOut: (state,action) => {
            state.user = null;
            state.isAuthenticated = false;
        }
    },
});

export const {userLoggeddIn, userLoggedOut} = authSlice.actions;

export default authSlice.reducer;