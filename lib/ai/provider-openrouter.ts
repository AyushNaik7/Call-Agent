/**
 * AI Provider Adapter - OpenRouter Edition
 * 
 * OpenRouter provides access to many AI models through an OpenAI-compatible API
 * This includes free models with better rate limits than direct Gemini API
 */

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AITool {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface AIToolCall {
  name: string;
  arguments: Record<string, any>;
}

export interface AIResponse {
  content: string | null;
  toolCalls: AIToolCall[];
  finishReason: "stop" | "tool_calls" | "length" | "error";
}

/**
 * AI Provider configuration
 */
export interface AIProviderConfig {
  apiKey: string;
  model?: string;
}

/**
 * AI Provider class - wraps OpenRouter API (OpenAI-compatible)
 */
export class AIProvider {
  private apiKey: string;
  private model: string;
  private baseUrl = "https://openrouter.ai/api/v1";

  constructor(config: AIProviderConfig) {
    if (!config.apiKey) {
      throw new Error("AI Provider API key is required");
    }

    this.apiKey = config.apiKey;
    // If no model specified, let OpenRouter auto-select the best available model
    this.model = config.model || "openai/gpt-3.5-turbo";
    
    if (!config.model) {
      console.log("[AI Provider] No model specified - OpenRouter will auto-select best available model");
    }
  }

  /**
   * Generate a chat completion with tool calling support
   */
  async chat(
    messages: AIMessage[],
    tools?: AITool[],
    systemPrompt?: string
  ): Promise<AIResponse> {
    try {
      console.log("[AI Provider] Starting chat with model:", this.model);
      console.log("[AI Provider] Messages count:", messages.length);
      console.log("[AI Provider] Tools count:", tools?.length || 0);

      // Build messages array
      const apiMessages: any[] = [];

      // Add system message if provided
      if (systemPrompt) {
        apiMessages.push({
          role: "system",
          content: systemPrompt,
        });
      }

      // Add conversation messages
      for (const msg of messages) {
        apiMessages.push({
          role: msg.role,
          content: msg.content,
        });
      }

      // Build request body
      const requestBody: any = {
        model: this.model,
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 2048,
      };

      // Add tools if provided (OpenAI function calling format)
      if (tools && tools.length > 0) {
        requestBody.tools = tools.map((tool) => ({
          type: "function",
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters,
          },
        }));
      }

      console.log("[AI Provider] Sending request to OpenRouter");

      // Make API request
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          "X-Title": "AI Receptionist SaaS",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[AI Provider] API Error:", response.status, errorText);
        throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log("[AI Provider] Response received");

      // Parse response
      const choice = data.choices?.[0];
      if (!choice) {
        return {
          content: null,
          toolCalls: [],
          finishReason: "error",
        };
      }

      const message = choice.message;
      const toolCalls: AIToolCall[] = [];

      // Check for tool calls
      if (message.tool_calls && message.tool_calls.length > 0) {
        for (const toolCall of message.tool_calls) {
          if (toolCall.type === "function") {
            toolCalls.push({
              name: toolCall.function.name,
              arguments: JSON.parse(toolCall.function.arguments),
            });
          }
        }
      }

      return {
        content: message.content || null,
        toolCalls: toolCalls,
        finishReason:
          toolCalls.length > 0
            ? "tool_calls"
            : choice.finish_reason === "length"
            ? "length"
            : "stop",
      };
    } catch (error: any) {
      console.error("[AI Provider] Error:", error);

      // Handle specific errors
      if (error.message?.includes("rate limit") || error.message?.includes("429")) {
        throw new Error(
          "AI service rate limit exceeded. Please try again in a moment."
        );
      }

      if (error.message?.includes("quota") || error.message?.includes("credits")) {
        throw new Error(
          "AI service quota exhausted. Please check your OpenRouter account."
        );
      }

      if (error.message?.includes("401") || error.message?.includes("403")) {
        throw new Error(
          "AI service authentication failed. Please check your API key."
        );
      }

      throw new Error("AI service error. Please try again.");
    }
  }

  /**
   * Get the current model name
   */
  getModel(): string {
    return this.model;
  }
}

/**
 * Create an AI provider instance
 * This should only be called on the server side
 */
export function createAIProvider(config?: Partial<AIProviderConfig>): AIProvider {
  const apiKey = config?.apiKey || process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY environment variable is required. Get your API key from https://openrouter.ai/keys"
    );
  }

  // Get model from config or env, allow empty/undefined for auto-selection
  const envModel = process.env.OPENROUTER_MODEL?.trim();
  const model = config?.model || (envModel && envModel.length > 0 ? envModel : undefined);

  return new AIProvider({
    apiKey,
    model,
  });
}
