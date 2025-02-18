import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      
      // Set user authentication data
      setAuth: (token, user) => {
        set(() => ({
          token,
          user,
        }));
      },

      // Clear authentication data on logout
      logout: () => {
        set(() => ({
          token: null,
          user: null,
        }));
      },

      // Check if user is authenticated
      isAuthenticated: () => {
        const state = useAuthStore.getState();
        return !!state.token && !!state.user;
      },
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage
    }
  )
);

export default useAuthStore;