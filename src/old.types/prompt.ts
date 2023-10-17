import { OpenAIModel } from './openai'
import { ObjectId } from 'mongodb'
import { PromptCategory } from './promptCategory'

export interface Prompt {
  _id: ObjectId
  name: string
  description: string
  content: string
  model: OpenAIModel
  folderId: ObjectId | null
  public: boolean
  category: PromptCategory
}
