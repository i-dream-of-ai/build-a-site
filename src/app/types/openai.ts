export class OpenAIError extends Error {
  type: string;
  param: string;
  code: string;

  constructor(message: string, type: string, param: string, code: string) {
    super(message);
    this.name = "OpenAIError";
    this.type = type;
    this.param = param;
    this.code = code;
  }
}

export interface OpenAIModel {
  id: string;
  name: string;
  maxLength: number; // maximum length of a message
  tokenLimit: number;
}

export enum OpenAIModelID {
  GPT_3_5 = "gpt-3.5-turbo-0613",
  GPT_3_5_16K = "gpt-3.5-turbo-16k-0613",
  GPT_3_5_AZ = "gpt-35-turbo",
  GPT_4 = "gpt-4-0613",
  GPT_4_32K = "gpt-4-32k",
}

// in case the `NEXT_PUBLIC_DEFAULT_MODEL` environment variable is not set or set to an unsupported model
export const fallbackModelID = OpenAIModelID.GPT_3_5;

export const OpenAIModels: Record<OpenAIModelID, OpenAIModel> = {
  [OpenAIModelID.GPT_3_5]: {
    id: OpenAIModelID.GPT_3_5,
    name: "GPT-3.5-Turbo",
    maxLength: 12000,
    tokenLimit: 4000,
  },
  [OpenAIModelID.GPT_3_5_16K]: {
    id: OpenAIModelID.GPT_3_5_16K,
    name: "GPT-3.5-Turbo-16K",
    maxLength: 48000,
    tokenLimit: 16000,
  },
  [OpenAIModelID.GPT_3_5_AZ]: {
    id: OpenAIModelID.GPT_3_5_AZ,
    name: "GPT-3.5",
    maxLength: 12000,
    tokenLimit: 4000,
  },
  [OpenAIModelID.GPT_4]: {
    id: OpenAIModelID.GPT_4,
    name: "GPT-4",
    maxLength: 24000,
    tokenLimit: 8000,
  },
  [OpenAIModelID.GPT_4_32K]: {
    id: OpenAIModelID.GPT_4_32K,
    name: "GPT-4-32K",
    maxLength: 96000,
    tokenLimit: 32000,
  },
};