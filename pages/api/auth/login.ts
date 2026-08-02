import { NextApiRequest, NextApiResponse } from 'next';
import { generateToken } from '../../../lib/auth';
import { serialize } from 'cookie';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { username, password } = req.body;

  // Check against environment variables
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    // Generate token
    const token = generateToken(username);
    
    // Set cookie
    res.setHeader(
      'Set-Cookie',
      serialize(process.env.COOKIE_NAME || 'simplify_admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
        sameSite: 'strict'
      })
    );
    
    return res.status(200).json({
      message: 'Login successful',
      user: { username }
    });
  }
  
  return res.status(401).json({ message: 'Invalid credentials' });
}