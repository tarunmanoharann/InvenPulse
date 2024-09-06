import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const TOKEN_KEY = 'token';

export interface User {
  id: number;
  username: string;
  roles: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem(TOKEN_KEY),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action: PayloadAction<{ token: string }>) => {
      state.isLoading = false;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem(TOKEN_KEY, action.payload.token);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.user = null;
      state.token = null;
      localStorage.removeItem(TOKEN_KEY);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem(TOKEN_KEY);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    // ... add other actions as needed
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  setUser, 
  clearError 
} = authSlice.actions;

export default authSlice.reducer;