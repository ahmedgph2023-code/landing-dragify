import { NextApiRequest, NextApiResponse } from 'next';
import { isAuthenticated } from '../../../lib/auth';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Wrap the handler with authentication check
  return new Promise<void>((resolve) => {
    isAuthenticated(req, res, async () => {
      // If we get here, the user is authenticated
      res.status(200).json({ authenticated: true });
      resolve();
    });
  });
}