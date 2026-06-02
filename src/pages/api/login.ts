import type { NextApiRequest, NextApiResponse } from "next";
import type { LoginResponse } from "@/types/auth";

type ErrorResponse = {
  message: string;
};

const mockCredentials = {
  email: "demo@eventlab.com",
  password: "123456",
};

const mockAuthResponse: LoginResponse = {
  user: {
    id: "demo-user-1",
    name: "Demo User",
    email: mockCredentials.email,
  },
  token: "mock-demo-token",
};

function createAuthCookie(token: string) {
  return `eventlab_token=${encodeURIComponent(
    token,
  )}; Path=/; Max-Age=86400; SameSite=Lax; HttpOnly`;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse | ErrorResponse>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body ?? {};

  if (
    email !== mockCredentials.email ||
    password !== mockCredentials.password
  ) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.setHeader("Set-Cookie", createAuthCookie(mockAuthResponse.token));

  return res.status(200).json(mockAuthResponse);
}
