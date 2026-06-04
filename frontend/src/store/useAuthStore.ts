import { create } from 'zustand';
import { authApi } from '../api/services';
import type { AdminUser } from '../api/types';

interface AuthState {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isCheckingSession: boolean;
  setAdmin: (admin: AdminUser | null) => void;
  checkSession: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  admin: null,
  isAuthenticated: false,
  isCheckingSession: true,
  setAdmin: (admin) => set({ admin, isAuthenticated: Boolean(admin), isCheckingSession: false }),
  checkSession: async () => {
    set({ isCheckingSession: true });
    try {
      const admin = await authApi.me();
      set({ admin, isAuthenticated: true, isCheckingSession: false });
    } catch {
      set({ admin: null, isAuthenticated: false, isCheckingSession: false });
    }
  },
  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      set({ admin: null, isAuthenticated: false, isCheckingSession: false });
    }
  },
}));
