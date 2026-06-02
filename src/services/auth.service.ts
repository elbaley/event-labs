import type { LoginCredentials, LoginResponse } from "@/types/auth";

type ErrorResponse = {
  message?: string;
};

export async function loginRequest(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  });

  if (!response.ok) {
    let errorMessage = "Login failed";

    try {
      const data = (await response.json()) as ErrorResponse;
      errorMessage = data.message || errorMessage;
    } catch {
      // Keep the default error message when the response body is not JSON.
    }

    throw new Error(errorMessage);
  }

  return response.json() as Promise<LoginResponse>;
}

export async function logoutRequest() {
  await fetch("/api/logout", {
    method: "POST",
  });
}
