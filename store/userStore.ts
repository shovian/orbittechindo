import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSearchStore } from './searchStore';
import { useMovieStore } from './movieStore';

interface UserState {
  name: string | null;
  email: string | null;
  phone: string | null;
  favItems: string[] | null;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  refreshToken: () => Promise<boolean>;
  setUser: (user: { name: string; email: string; phone: string; favItems: string[] }) => void;
  updateFavItems: (imdbID: string) => void;
  login : (email:string,password:string)=>void;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      name: null,
      email: null,
      phone: null,
      favItems: null,
      accessToken: null,

      setAccessToken: (token) => set({ accessToken: token }),

      refreshToken: async () => {
        try {
          const res = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });
          const data = await res.json();
          if (res.ok) {
            set({ accessToken: data });
            
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },
      setUser: ({ name, email, phone, favItems }) =>
        set({ name, email, phone, favItems }),

      updateFavItems: (imdbID) => {
        const currentFavs = get().favItems || [];
        const updatedFavs = currentFavs.includes(imdbID)
          ? currentFavs.filter((id) => id !== imdbID) // Remove if exists
          : [...currentFavs, imdbID]; // Add if not exists

        set({ favItems: updatedFavs });
      },
      login: async (email,password)=>{
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
    
          const data = await res.json();
          if (res.ok) {
            const { name, email, phone, favItems } = data;
            set({ name, email, phone, favItems })
          } else {
            console.log(`❌ Login failed: ${data.error}`);
          }
        } catch (error) {
          console.error('Logout failed', error);
          throw error
        }

      },
      logout: async () => {
        try {
          const response = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
          });

          if (response.ok) {
            set({ name: null, email: null, phone: null, favItems: null ,accessToken:null});

          } else {
            throw new Error('Failed to log out');
          }
        } catch (error) {
          console.error('Logout failed', error);
          throw error;
        }
      },
    }),
    {
      name: 'user-storage',
    }
  )
);
