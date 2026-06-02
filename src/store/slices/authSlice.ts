import { type AuthState, type User } from "@/types/auth";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const AUTH_STORAGE_KEY = "eventlab_auth";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(action.payload));
      }
    },
    hydrateAuth: (state) => {
      if (typeof window === "undefined") return;
      try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) return;

        const parsed = JSON.parse(raw);
        state.user = parsed.user;
        state.token = parsed.token;
        state.isAuthenticated = true;
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    },
  },
});

export const { loginSuccess, hydrateAuth, logout } = authSlice.actions;
export default authSlice.reducer;
