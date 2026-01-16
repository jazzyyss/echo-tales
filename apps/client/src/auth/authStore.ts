import { create } from "zustand";
import { http } from "../api/http";

export type Me = {
  id: string;
  fullName: string;
  email: string;
};

type AuthState = {
  accessToken: string | null;
  me: Me | null;
  isBootstrapping: boolean;

  setAccessToken: (token: string | null) => void;
  setMe: (me: Me | null) => void;
  reset: () => void;

  bootstrap: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  me: null,
  isBootstrapping: true,

  setAccessToken: (token: string | null) => set({ accessToken: token }),
  setMe: (me: Me | null) => set({ me }),

  reset: () => set({ accessToken: null, me: null, isBootstrapping: false }),

  bootstrap: async () => {
    // Prevent double bootstrap
    if (get().isBootstrapping === false && get().accessToken) return;

    set({ isBootstrapping: true, me: null });

    try {
      // 1) Refresh -> new access token (cookie-based)
      const refreshRes = await http.post("/auth/refresh");
      const accessToken = (refreshRes.data as any)?.accessToken as string | undefined;
      if (!accessToken) throw new Error("Refresh did not return accessToken");

      set({ accessToken });

      // 2) Get user
      const meRes = await http.get("/users/me");
      const me = meRes.data as Me;
      if (!me?.email) throw new Error("Invalid /users/me response");

      set({ me, isBootstrapping: false });
    } catch {
      // Not logged in or refresh invalid
      set({ accessToken: null, me: null, isBootstrapping: false });
    }
  },

  login: async (email, password) => {
    try{
      // 1) Login -> returns access token + sets refresh cookie
      const res = await http.post("/auth/login", { email, password });
      const accessToken = (res.data as any)?.accessToken as string | undefined;
      if (!accessToken) throw new Error("Login failed: accessToken missing");

      set({ accessToken });

      // 2) Hydrate user
      const meRes = await http.get("/users/me");
      const me = meRes.data as Me;
      if (!me?.email) throw new Error("Invalid /users/me response");

      set({ me });
    }catch(err){
      set({accessToken: null, me: null})
      throw err
    }
  },

  logout: async () => {
    try {
      await http.post("/auth/logout");
    } finally {
      set({ accessToken: null, me: null });
    }
  },
}));
