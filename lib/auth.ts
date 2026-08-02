import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

interface DecodedToken {
  username: string;
}

export function isAuthenticated(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) {
  try {
    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    const token = cookies[process.env.COOKIE_NAME || 'simplify_admin_token'];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default-secret'
    ) as DecodedToken;

    (req as any).user = decoded;
    
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function generateToken(username: string) {
  return jwt.sign(
    { username },
    process.env.JWT_SECRET || 'default-secret',
    { expiresIn: '24h' }
  );
}