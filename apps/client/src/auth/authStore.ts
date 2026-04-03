import { create } from "zustand";
import { http } from "../api/http";
import type { ProfilePicture } from "../types/media";

export type Me = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  media: {
    profilePicture: ProfilePicture;
  };
};

type AuthState = {
  accessToken: string | null;
  me: Me | null;
  isBootstrapping: boolean;

  setAccessToken: (token: string | null) => void;
  setMe: (me: Me | null) => void;
  reset: () => void;

  bootstrap: () => Promise<void>;
  signup: (fullName: string, username: string, email: string, password: string) => Promise<void>;
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
    if (get().isBootstrapping === false && get().accessToken) return;

    set({ isBootstrapping: true, me: null });

    try {
      const refreshRes = await http.post("/auth/refresh");
      const accessToken = (refreshRes.data as any)?.accessToken as string | undefined;
      const me = (refreshRes.data as any)?.user as Me | undefined;

      if (!accessToken) throw new Error("Refresh did not return accessToken");
      if (!me?.email) throw new Error("Invalid user response");

      set({ accessToken, me, isBootstrapping: false });
    } catch {
      set({ accessToken: null, me: null, isBootstrapping: false });
    }
  },

  login: async (email, password) => {
    try {
      const res = await http.post("/auth/login", { email, password });

      const accessToken = (res.data as any)?.accessToken as string | undefined;
      const user = (res.data as any)?.user as Me | undefined;

      if (!accessToken || !user?.email) {
        throw new Error("Login failed: invalid response");
      }

      set({ accessToken, me: user });
    } catch (err) {
      set({ accessToken: null, me: null });
      throw err;
    }
  },

  signup: async (fullName, username, email, password) => {
    try {
      const res = await http.post("/auth/signup", { fullName, username, email, password });
      const accessToken = (res.data as any)?.accessToken as string | undefined;
      const user = (res.data as any)?.user as Me | undefined;

      if (!accessToken || !user?.email) throw new Error("Signup failed: invalid response");

      set({ accessToken, me: user });
    } catch (err) {
      set({ accessToken: null, me: null });
      throw err;
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