import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/db';
import BlogPost from '../../../models/BlogPost';
import { isAuthenticated } from '../../../lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;
  
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const post = await BlogPost.findOne({ slug });
        
        if (!post) {
          return res.status(404).json({ message: 'Post not found' });
        }
        
        res.status(200).json(post);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        res.status(500).json({ message: 'Error fetching blog post' });
      }
      break;

    case 'PUT':
      // Wrap the PUT handler with authentication
      return new Promise<void>((resolve) => {
        isAuthenticated(req, res, async () => {
          try {
            const post = await BlogPost.findOneAndUpdate(
              { slug },
              req.body,
              { new: true, runValidators: true }
            );
            
            if (!post) {
              res.status(404).json({ message: 'Post not found' });
            } else {
              res.status(200).json(post);
            }
          } catch (error) {
            console.error('Error updating blog post:', error);
            res.status(400).json({ message: 'Error updating blog post' });
          }
          resolve();
        });
      });
      
    case 'DELETE':
      // Wrap the DELETE handler with authentication
      return new Promise<void>((resolve) => {
        isAuthenticated(req, res, async () => {
          try {
            const post = await BlogPost.findOneAndDelete({ slug });
            
            if (!post) {
              res.status(404).json({ message: 'Post not found' });
            } else {
              res.status(200).json({ message: 'Post deleted successfully' });
            }
          } catch (error) {
            console.error('Error deleting blog post:', error);
            res.status(500).json({ message: 'Error deleting blog post' });
          }
          resolve();
        });
      });

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}