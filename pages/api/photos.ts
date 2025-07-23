import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Access token required' });
  }

  try {
    const response = await fetch('https://photoslibrary.googleapis.com/v1/mediaItems?pageSize=100', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Google Photos API error:', data); // 👈 Лог ошибки
      return res.status(500).json({ error: 'Failed to fetch media items from Google Photos' });
    }

    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const items = (data.mediaItems || []).filter((item: any) => {
      return new Date(item.mediaMetadata?.creationTime).getTime() >= sevenDaysAgo;
    });

    res.status(200).json(items);
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
}
