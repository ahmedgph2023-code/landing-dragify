import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPost extends Document {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage?: string;
  author: {
    name: string;
    avatar: string;
  };
  publishDate: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema: Schema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    excerpt: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    coverImage: {
      type: String,
      required: false,
      validate: {
        validator: function(v: string) {
          // Allow empty string or URLs starting with /uploads/ or https:// or http://
          return !v || v === '' || v.startsWith('/uploads/') || v.startsWith('http://') || v.startsWith('https://');
        },
        message: 'Cover image must be a valid URL or path to an uploaded image'
      }
    },
    author: {
      name: {
        type: String,
        required: true
      },
      avatar: {
        type: String,
        required: true
      }
    },
    publishDate: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Add a virtual for the 'id' field that converts MongoDB's _id to a string
BlogPostSchema.virtual('id').get(function(this: any) {
  return this._id.toHexString();
});

// Ensure virtual fields are included when converting to JSON
BlogPostSchema.set('toJSON', {
  virtuals: true
});

// Use Mongoose's model function to create the model
export default mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);