import { ObjectId } from "mongodb";

export type Chatbot = {
  _id: ObjectId;
  userId: ObjectId;
  type: string;
  name: string;
  token: string;
  domain: string;
  context?: string;
  createdAt?: Date;
  chatbotPersona: string;
  botFunctions: [];
  branding: ChatbotBranding;
};

export type ChatbotTool = {
  name: string;
  description: string;
  functionName: string;
};

export type ChatbotBranding = {
  welcome_text: string,
  primary_color: string,
  powered_link: string,
  powered_text: string
}