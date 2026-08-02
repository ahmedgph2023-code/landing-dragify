import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs/promises';
import { isAuthenticated } from '../../../lib/auth';

export const config = {
  api: {
    bodyParser: false,
  },
};

const saveFile = async (file: formidable.File): Promise<string> => {
  // Create upload directory if it doesn't exist
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  try {
    await fs.access(uploadDir);
  } catch (error) {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  // Generate unique filename
  const timestamp = new Date().getTime();
  const originalExt = path.extname(file.originalFilename || '.jpg');
  const fileName = `${timestamp}${originalExt}`;
  const filePath = path.join(uploadDir, fileName);
  
  // Check if filepath exists
  if (!file.filepath) {
    console.error('File path is undefined:', file);
    throw new Error('Invalid file path');
  }
  
  // Save the file
  const data = await fs.readFile(file.filepath);
  await fs.writeFile(filePath, data);
  
  // Return the path that can be used in <img src="...">
  return `/uploads/${fileName}`;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST method
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Wrap the handler with authentication check
  return new Promise<void>((resolve) => {
    isAuthenticated(req, res, async () => {
      try {
        // Parse form data
        const form = formidable({ multiples: false });
        
        const [fields, files] = await new Promise<[formidable.Fields<string>, formidable.Files<string>]>(
          (resolve, reject) => {
            form.parse(req, (err, fields, files) => {
              if (err) reject(err);
              resolve([fields, files]);
            });
          }
        );

        // Check if file exists
        if (!files.image) {
          return res.status(400).json({ error: 'No image file uploaded' });
        }
        
        // Handle both array and single file scenarios
        const file = Array.isArray(files.image) 
          ? files.image[0] 
          : files.image as formidable.File;

        // Save file and get path
        const filePath = await saveFile(file);

        // Return success response with file path
        res.status(200).json({ filePath });
        resolve();
      } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Failed to upload file' });
        resolve();
      }
    });
  });
}