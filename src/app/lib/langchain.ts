import { UUID } from "crypto";
import { type OpenAIStreamCallbacks } from "ai";

const runs = new Set();

type SaveOutputArgs = {
  conversationUUID: string | undefined;
  role: string;
  content: string;
  token: string | undefined;
  userId: string | undefined;
};

type Props = {
  callbacks?: OpenAIStreamCallbacks;
  handleSaveOutput?: (arg: SaveOutputArgs) => Promise<void>;
  conversationUUID?: UUID;
  token?: string;
  userId?: string;
};

export function LangChainStream(params: Props) {
  const encoder = new TextEncoder();

  let controller: ReadableStreamDefaultController;

  const stream = new ReadableStream({
    start(c) {
      controller = c;
      // Additional initialization logic can be placed here if needed
    },
    pull(controller) {
      // This method will be automatically called by the browser when it's ready to receive more data
      // In our case, this won't do anything since you're manually pushing data to the stream
    },
    cancel(reason) {
      // Handle the cleanup if stream is cancelled
      console.error(reason);
    },
  });

  const handleError = (e: Error, runId: string, tags?: string[]) => {
    runs.delete(runId);

    console.error("langchain stream error: ", e);

    controller.enqueue(
      encoder.encode(
        JSON.stringify({
          event: "error",
          content: e,
          tags,
        }) + "\n"
      )
    );
    controller.error(e);
    controller.close();
  };

  const handleStart = (runId: string, type: string, tags?: string[]) => {
    controller.enqueue(
      encoder.encode(
        JSON.stringify({
          event: "start",
          type: type,
          content: params.conversationUUID,
          tags,
        }) + "\n"
      )
    );

    runs.add(runId);
  };

  const handleEnd = (runId: string, type: string, output?: any, tags?: string[]) => {
    controller.enqueue(
      encoder.encode(
        JSON.stringify({
          event: "done",
          type: type,
          content: type,
          output: output,
          tags,
        }) + "\n"
      )
    );

    runs.delete(runId);
    if (runs.size === 0) {
      controller.close();
    }
  };

  return {
    stream: stream,
    handlers: {
      handleLLMNewToken: (token: string) => {
        if (token) {
          const dataToEnqueue = encoder.encode(
            JSON.stringify({
              event: "token",
              content: token,
            }) + "\n"
          );
          controller.enqueue(dataToEnqueue);
        }
      },
      handleLLMStart: (_llm: any, _prompts: string[], runId: string) => {
        handleStart(runId, "LLM");
      },
      handleLLMEnd: async (_output: any, runId: string) => {
        // Assuming that the `_output` structure always has the `generations[0][0].text` path.
        const extractedText = _output.generations[0][0].text;

        //save assistant message
        if (params.handleSaveOutput) {
          await params.handleSaveOutput({
            conversationUUID: params.conversationUUID,
            role: "assistant",
            content: extractedText,
            token: params.token,
            userId: params.userId,
          });
        }

        handleEnd(runId, "llm", _output);
      },
      handleLLMError: (e: Error, runId: string) => {
        handleError(e, runId);
      },
      handleChatModelStart: (
        _llm: any,
        _messages: any,
        runId: string,
        parentRunId: string,
        extraParams: Record<string, unknown>,
        tags: string[]
      ) => {
        handleStart(runId, "chatModel", tags);
      },
      handleChatModelEnd: (_output: any, runId: string, tags: string[]) => {
        handleEnd(runId, "chatModel", _output, tags);
      },
      handleChainStart: (_chain: any, _inputs: any, runId: string) => {
        handleStart(runId, "chain");
      },
      handleChainEnd: (_outputs: any, runId: string) => {
        handleEnd(runId, "chain", _outputs);
      },
      handleChainError: (e: Error, runId: string) => {
        handleError(e, runId);
      },
      handleToolStart: (
        _tool: any,
        _input: string,
        runId: string,
        parentRunId: string,
        tags: string[]
      ) => {
        handleStart(runId, "tool", tags);
      },
      handleToolEnd: (_output: string, runId: string, parentRunId: string, tags: string[]) => {
        handleEnd(runId, "tool", _output, tags);
      },
      handleToolError: (e: Error, runId: string, parentRunId: string, tags: string[]) => {
        handleError(e, runId, tags);
      },
      handleAgentAction: (_action: any, runId: string) => {
        handleStart(runId, "agent");
      },
      handleAgentEnd: (_output: any, runId: string) => {
        handleEnd(runId, "agent", _output);
      },
    },
  };
}
