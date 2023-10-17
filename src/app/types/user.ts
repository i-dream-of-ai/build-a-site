import { ObjectId } from "mongodb";
import { OpenAIModel } from "./openai";

export interface User {
  _id: string | ObjectId;
  name: string;
  email: string;
  password?: string;
  model: OpenAIModel;
  role: "admin" | "user";
  openAiKeyAdded: boolean;
  customerId?: string;
  connectedAccountId?: string;
}

export interface UserUpdates {
  name: string;
  email: string;
  model: OpenAIModel;
  openAiKeyAdded: boolean;
  role: "admin" | "user";
  connectedAccountId?: string;
}
