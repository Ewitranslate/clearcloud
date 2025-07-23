import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  const token = await getToken({ req });
  res.status(200).json({ accessToken: token?.accessToken });
}
