import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/api';

let savedUser = null;
try {
  const item = localStorage.getItem('kb_user');
  savedUser = item && item !== 'undefined' ? JSON.parse(item) : null;
} catch (e) {
  localStorage.removeItem('kb_user');
  localStorage.removeItem('kb_token');
}
const savedToken = localStorage.getItem('kb_token') || null;

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      const { token, user } = response.data;
      localStorage.setItem('kb_token', token);
      localStorage.setItem('kb_user', JSON.stringify(user));
      return { token, user };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      const { token, user } = response.data;
      localStorage.setItem('kb_token', token);
      localStorage.setItem('kb_user', JSON.stringify(user));
      return { token, user };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed. Please check inputs.'
      );
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('kb_token');
      if (!token) throw new Error('No token');
      const response = await authService.getMe();
      return response.data.user;
    } catch (error) {
      localStorage.removeItem('kb_token');
      localStorage.removeItem('kb_user');
      return rejectWithValue('Session expired');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser,
    token: savedToken,
    isAuthenticated: !!savedToken,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('kb_token');
      localStorage.removeItem('kb_user');
    },
    clearError: (state) => {
      state.error = null;
    },
    updateCurrentUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('kb_user', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check auth
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, updateCurrentUser } = authSlice.actions;
export default authSlice.reducer;
