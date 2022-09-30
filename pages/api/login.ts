// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import crypto from "crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    if (!req.headers.authorization) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const auth = Buffer.from(req.headers.authorization, "base64")
      .toString()
      .split(":");
    const [password, email] = auth;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if (user.password !== password) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    res.status(200).json({ message: "success" });
  }
}
