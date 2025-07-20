import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Access token required' });
  }

  const response = await fetch('https://photoslibrary.googleapis.com/v1/mediaItems?pageSize=100', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return res.status(500).json({ error: 'Failed to fetch media items' });
  }

  const data = await response.json();

  // Оставим только фото/видео за последние 7 дней
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const items = (data.mediaItems || []).filter((item: any) => {
    return new Date(item.mediaMetadata?.creationTime).getTime() >= sevenDaysAgo;
  });

  res.status(200).json(items);
}
