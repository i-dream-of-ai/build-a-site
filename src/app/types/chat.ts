import { ObjectId } from "mongodb";

import { OpenAIModel } from "./openai";

export interface Message {
  role: Role;
  name?: string;
  content: string;
  id?: any;
}

export type Role = "assistant" | "user" | "function" | "system" | "error";

export interface ChatBody {
  model: OpenAIModel;
  messages: Message[];
  apiKey: {
    user_id: ObjectId;
    teamIds: ObjectId[];
  };
  temperature: number;
  namespace: string;
  systemPrompt: string;
  teamId: ObjectId;
  chatbotPersona: string;
}

export interface EmbedChatBody {
  modelId: "gpt-3.5-turbo-0613" | "gpt-4-0613";
  messages: Message[];
  apiKey: {
    user_id: ObjectId;
    teamIds: ObjectId[];
  };
  temperature: number;
  namespace: string;
  prompt: string;
  systemPrompt: string;
  teamId: ObjectId;
}

export interface Conversation {
  _id: ObjectId;
  name?: string;
  messages: Message[];
  model?: OpenAIModel;
  prompt?: string;
  temperature?: number;
  generatedAt: Date;
  contaxt: string;
}
