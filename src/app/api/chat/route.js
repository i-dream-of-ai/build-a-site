import { StreamingTextResponse } from "ai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BufferWindowMemory, ChatMessageHistory } from "langchain/memory";
import { AIMessage, BaseMessage, HumanMessage } from "langchain/schema";

import { LangChainStream } from "@/app/lib/langchain";
import { llmTools } from "@/app/lib/tools";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { chatbotSystemPrompt } from "@/app/config/chat" 

export const runtime = "edge";

export async function POST(req) {

    const user = await getToken({req});
    const token = await getToken({req, raw:true});

    if (!user || !user?._id) {
        console.log("User is required");
        return NextResponse.json({message: "Unauthorized. User is required"}, { status: 403 });
    }

    //input and output kets must be set to this
    const memory = new BufferWindowMemory({
        returnMessages: true,
        memoryKey: "chat_history",
        inputKey: "input",
        outputKey: "output",
        k: 6,
    });

    const { messages, prompt, conversationUUID, test } = await req.json();

    const formattedMessages = messages.map((message) => {
        if (message.role === "user") {
        return new HumanMessage(message.content);
        } else if (message.role === "assistant") {
        return new AIMessage(message.content);
        }
        return new BaseMessage(message.content);
    });

    const chatHistory = new ChatMessageHistory(formattedMessages);

    memory.chatHistory = chatHistory;

    let tools;
    try {
      tools = await llmTools(user?._id);
    } catch (error) {
      console.log("Error Fetching Tools: ", error);
      return new Response(`Error Fetching Tools: ${error.message}`, { status: 500 });
    }

  try {
    const model = new ChatOpenAI({
      modelName: "gpt-4-0613",
      streaming: true,
      //maxTokens: 500,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const executor = await initializeAgentExecutorWithOptions(tools, model, {
      memory,
      agentType: "openai-functions",
      returnIntermediateSteps: true,
      agentArgs: {
        prefix: chatbotSystemPrompt,
      },
    });

    if(test === false || typeof test === 'undefined'){
      //save user message
      await handleSaveOutput({
        conversationUUID,
        role: "user",
        content: prompt,
        token,
        userId: user._id
      });
    }

    // My own LangChainStream implementation
    const { stream, handlers } = LangChainStream({
      ...((test === false || typeof test === 'undefined') ? { handleSaveOutput } : {}),
      token,
      conversationUUID,
      userId: user._id
    });

    executor.call({ input: prompt, verbose: true }, [handlers]).catch(console.error);

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.log("Chat Stream Error: ", error);
    return NextResponse.json({message:`Chat Stream Error: ${error.message}`}, { status: 500 });
  }
}

async function handleSaveOutput({ conversationUUID, role, content, token, userId }) {
  const res = await fetch(`${env.NEXT_PUBLIC_APP_URL}/api/conversation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ conversationUUID, role, content, userId }),
  });

  if (!res.ok) {
    console.error(`Error Saving Completion: ${res.status} ${res.statusText}`);
    throw new Error(`Error Saving Completion: ${res.status} ${res.statusText}`);
  }

  return true;
}
