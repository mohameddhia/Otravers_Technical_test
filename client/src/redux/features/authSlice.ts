import Cookies from 'universal-cookie';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import api from '../config/axios';

import type { RootState } from '../store';

const cookies = new Cookies();

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  businessId: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  lastTokenRefresh: string | null
}
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  lastTokenRefresh: null
};
// Helper function to set tokens
const setAuthTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
};
const clearAuthTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  delete api.defaults.headers.common['Authorization'];
};
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { accessToken, refreshToken, user } = response.data;
      
      // Set tokens in localStorage and axios headers
      setAuthTokens(accessToken, refreshToken);
      
      return { user, accessToken, refreshToken };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Async Thunk Token Refres
export const refreshUserToken = createAsyncThunk(
  'auth/refresh',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    const refreshToken = state.auth.refreshToken;
    
    if (!refreshToken) {
      return rejectWithValue('No refresh token available');
    }

    try {
      const response = await api.post('/auth/refresh', {
        refreshToken
      });
      
      const { accessToken, newRefreshToken } = response.data;
      
      // Update tokens
      setAuthTokens(accessToken, newRefreshToken);
      
      return { 
        accessToken, 
        refreshToken: newRefreshToken 
      };
    } catch (error: any) {
      clearAuthTokens();
      return rejectWithValue(error.response?.data?.message || 'Token refresh failed');
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as { auth: AuthState };
      return !state.auth.isLoading; // Prevent multiple refresh requests
    }
  }
);


export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async(_,{rejectWithValue}) =>{
    try {
      const response = await api.post('/auth/logout');
      clearAuthTokens();
      return response.data;
    } catch (error: any) {
      // Even if logout fails, clear local tokens
      clearAuthTokens();
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
    .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
    })
    .addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
    })
    .addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    })    // Refresh Token
    .addCase(refreshUserToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
    })
    .addCase(refreshUserToken.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
    })
    .addCase(refreshUserToken.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = action.payload as string;
    })

    // Get Profile
    .addCase(getProfile.pending, (state) => {
    state.isLoading = true;
    })
    .addCase(getProfile.fulfilled, (state, action) => {
    state.isLoading = false;
    state.user = action.payload.data;
    state.isAuthenticated = true;
    })
    .addCase(getProfile.rejected, (state) => {
    state.isLoading = false;
    state.isAuthenticated = false;
    state.user = null;
    })
    // Logout
    .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.error = null;
    });
  },
});

export const { clearError } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;