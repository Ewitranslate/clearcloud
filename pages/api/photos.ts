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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Photos API error:', errorText);
      return res.status(500).json({ error: 'Failed to fetch media items from Google Photos' });
    }

    const data = await response.json();

    const mediaItems = Array.isArray(data.mediaItems) ? data.mediaItems : [];

    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const recentItems = mediaItems.filter((item: any) => {
      const creationTime = item?.mediaMetadata?.creationTime;
      return creationTime && new Date(creationTime).getTime() >= sevenDaysAgo;
    });

    return res.status(200).json(recentItems);
  } catch (error) {
    console.error('Unexpected server error:', error);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
