import { ObjectId } from "mongodb";
import NextAuth, { DefaultSession, User } from "next-auth";
import { JWT } from "next-auth/jwt";

import { OpenAIModel } from "./openai";

declare module "next-auth/jwt" {
  interface JWT {
    _id: string;
    email: string;
    name: string | null | undefined;
    model: OpenAIModel | null | undefined;
    openAiKeyAdded: boolean;
    role: "admin" | "user";
    customerId?: string;
    connectedAccountId?: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      _id: string;
      password?: string;
      email: string;
      name: string | null | undefined;
      model: OpenAIModel | null | undefined;
      openAiKeyAdded: boolean;
      role: "admin" | "user";
      customerId?: string;
      connectedAccountId?: string;
    };
  }
}
