import { NextApiRequest, NextApiResponse } from "next";
import { loginUser } from "@/lib/auth";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid credentials." });
  }
}
