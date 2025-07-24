import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });
  if (!token?.accessToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const response = await fetch("https://cloud-api.yandex.net/v1/disk/resources/files", {
      headers: {
        Authorization: `OAuth ${token.accessToken}`,
      },
    });

    const data = await response.json();
    res.status(200).json(data.items || []);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch files" });
  }
}
