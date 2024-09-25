import {create} from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  isCheckingAuth: true,
  message: null,

  signup: async (email, password, name) => {
    set({isCheckingAuth: true, error: null, isLoading: true});
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });
      set({user: response.data.user, isLoading: false, isAuthenticated: true});
    } catch (error) {
      set({
        error: error.response.data.message || 'Error signing up',
        isCheckingAuth: false,
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({isLoading: true, error: null});
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      set({user: response.data.user, isLoading: false, isAuthenticated: true});
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || 'Error logging in',
        isLoading: false,
      });
    }
  },

  logout: async () => {
    set({isLoading: true, error: null});
    try {
      await axios.post(`${API_URL}/logout`);
      set({user: null, error: null, isLoading: false, isAuthenticated: false});
    } catch (error) {
      set({
        error: error.response.data.message || 'Error logging out',
        isLoading: false,
      });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({error: null, isLoading: true});
    try {
      const response = await axios.post(`${API_URL}/verify-email`, {
        code,
      });
      set({user: response.data.user, isLoading: false, isAuthenticated: true});
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || 'Error verifying email',
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({isCheckingAuth: true, error: null});
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({error: null, isCheckingAuth: false, isAuthenticated: false});
      console.log(`Error checking authentication: ${error.message}`);
    }
  },

  forgotPassword: async (email) => {
    set({isLoading: true, error: null, message: null});
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({message: response.data.message, isLoading: false, error: null});
    } catch (error) {
      set({
        error: error.response.data.message || 'Error sending reset email',
        isLoading: false,
      });
      throw error;
    }
  },
}));
