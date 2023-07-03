import { OpenAIModel } from './openai'
import { ObjectId } from 'mongodb'

export interface Message {
  role: Role
  name?: string
  content: string
}

export type Role = 'assistant' | 'user' | 'function' | 'system'

export interface ChatBody {
  model: OpenAIModel
  messages: Message[]
  temperature: number
  namespace?: string
  systemPrompt: string
}

export interface EmbedChatBody {
  model: OpenAIModel
  messages: Message[]
  apiKey: {
    user_id: ObjectId
    teamIds: ObjectId[]
  }
  temperature: number
  namespace: string
  prompt: string
  systemPrompt: string
  teamId: ObjectId
}

export interface Conversation {
  _id?: ObjectId
  name: string
  messages: Message[]
  model: OpenAIModel
  prompt: string
  temperature: number
  persona?: {
    name: string
    content: string
    icon: object
    color: string
  }
}
