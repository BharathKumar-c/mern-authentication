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
}));
