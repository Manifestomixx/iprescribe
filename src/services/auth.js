import api from './api';
import useAuthStore from '../store/authStore';

export const login = async (email, password) => {
  try {
    const endpoint = '/auth/login';
    const requestData = {
      email,
      password,
    };
    
    const response = await api.post(endpoint, requestData);

    if (response.token || response.data?.token) {
      const token = response.token || response.data.token;
      localStorage.setItem('authToken', token);
      
      if (response.user || response.data?.user) {
        const user = response.user || response.data.user;
        localStorage.setItem('user', JSON.stringify(user));
      }
    }

    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = () => {
  const { logout: logoutStore } = useAuthStore.getState();
  logoutStore();
  window.location.href = '/login';
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getToken = () => {
  return localStorage.getItem('authToken');
};

