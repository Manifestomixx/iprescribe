import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setToken: (token) => {
        set({ token, isAuthenticated: !!token });
        if (token) {
          localStorage.setItem('authToken', token);
        } else {
          localStorage.removeItem('authToken');
        }
      },

      login: (user, token) => {
        set({ 
          user, 
          token, 
          isAuthenticated: true,
          loading: false 
        });
        if (token) {
          localStorage.setItem('authToken', token);
        }
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
      },

      logout: () => {
        // Clear Zustand state
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          loading: false
        });
        // Clear localStorage items
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        // Clear Zustand persisted storage
        localStorage.removeItem('auth-storage');
      },

      setLoading: (loading) => set({ loading }),

      initialize: () => {
        const token = localStorage.getItem('authToken');
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        
        if (token && user) {
          set({ 
            user, 
            token, 
            isAuthenticated: true 
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export default useAuthStore;

