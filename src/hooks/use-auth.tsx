import { useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginSuccess, logout as logoutAction } from "@/store/slices/authSlice";
import { loginRequest, logoutRequest } from "@/services/auth.service";
import type { LoginCredentials } from "@/types/auth";
import { useRouter } from "next/router";

export function useAuth() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setIsLoggingIn(true);
      setLoginError(null);

      try {
        const response = await loginRequest(credentials);
        dispatch(loginSuccess(response));
      } catch (error) {
        const message = error instanceof Error ? error.message : "Login failed";
        setLoginError(message);
        throw error;
      } finally {
        setIsLoggingIn(false);
      }
    },
    [dispatch],
  );

  const logout = useCallback(async () => {
    setLoginError(null);
    dispatch(logoutAction());
    await logoutRequest();
    router.replace("/");
  }, [dispatch, router]);

  return {
    auth,
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    isLoggingIn,
    loginError,
    login,
    logout,
  };
}
