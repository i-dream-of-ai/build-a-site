import { ObjectId } from "mongodb";

export type Blog = {
  _id: string | ObjectId;
  slug: string;
  title: string;
  description: string;
  content: string | TrustedHTML;
  userId?: string | ObjectId;
  generatedAt: Date;
  image: string; // Ensure this is of type string
};
