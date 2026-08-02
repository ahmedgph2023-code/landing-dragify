import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/db';
import BlogPost, { IBlogPost } from '../../../models/BlogPost';
import { isAuthenticated } from '../../../lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const posts = await BlogPost.find({}).sort({ createdAt: -1 });
        res.status(200).json(posts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        res.status(500).json({ message: 'Error fetching blog posts' });
      }
      break;

    case 'POST':
      // Wrap the POST handler with authentication
      return new Promise<void>((resolve) => {
        isAuthenticated(req, res, async () => {
          try {
            const post = await BlogPost.create(req.body);
            res.status(201).json(post);
          } catch (error) {
            console.error('Error creating blog post:', error);
            res.status(400).json({ message: 'Error creating blog post' });
          }
          resolve();
        });
      });

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}