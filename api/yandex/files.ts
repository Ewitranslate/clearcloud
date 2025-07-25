import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });

  if (!token?.accessToken || token.provider !== "yandex") {
    return res.status(401).json({ error: "Not authenticated with Yandex" });
  }

  try {
    const response = await fetch("https://cloud-api.yandex.net/v1/disk/resources/files", {
      headers: {
        Authorization: `OAuth ${token.accessToken}`,
      },
    });

    const data = await response.json();

    // Проверка наличия поля items
    if (!Array.isArray(data.items)) {
      console.error("Yandex API response:", data);
      return res.status(500).json({ error: "Invalid response from Yandex Disk" });
    }

    res.status(200).json(data.items);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch files" });
  }
}
