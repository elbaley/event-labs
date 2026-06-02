import type { NextApiRequest, NextApiResponse } from "next";

type LogoutResponse = {
  ok: true;
};

type ErrorResponse = {
  message: string;
};

const clearedAuthCookie =
  "eventlab_token=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<LogoutResponse | ErrorResponse>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  res.setHeader("Set-Cookie", clearedAuthCookie);

  return res.status(200).json({ ok: true });
}
