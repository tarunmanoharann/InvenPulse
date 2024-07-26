import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  email: string
  role: 'user' | 'admin'
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string; password: string }>) => {
      state.isLoading = true
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false
      state.user = action.payload
      state.error = null
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    register: (state, action: PayloadAction<{ email: string; password: string; role: 'user' | 'admin' }>) => {
      state.isLoading = true
    },
    registerSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false
      state.user = action.payload
      state.error = null
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.error = null
    },
  },
})

export const { login, loginSuccess, loginFailure, register, registerSuccess, registerFailure, logout } = authSlice.actions

export default authSlice.reducer