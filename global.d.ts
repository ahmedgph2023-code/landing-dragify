import mongoose from 'mongoose';

declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };

  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      ADMIN_USERNAME: string;
      ADMIN_PASSWORD: string;
      JWT_SECRET: string;
      COOKIE_NAME: string;
      NODE_ENV: 'development' | 'production';
    }
  }
}

declare module 'jsonwebtoken';