import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });

  if (!token?.accessToken) {
    return res.status(401).json({ error: 'No access token found in session' });
  }

  res.status(200).json({ accessToken: token.accessToken });
}
