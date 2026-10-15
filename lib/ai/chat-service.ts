/**
 * AI Chat Service
 * 
 * Orchestrates conversation flow between user, AI, and tool execution
 */

import { AIProvider, AIMessage, createAIProvider } from "./provider-openrouter";
import { AI_TOOLS, executeAITool, ToolContext } from "./tools";

export interface ChatRequest {
  messages: AIMessage[];
  businessId: string;
}

export interface ChatResponse {
  message: AIMessage;
  toolsUsed?: string[];
}

/**
 * System prompt for the AI receptionist
 */
const SYSTEM_PROMPT = `You are a professional AI receptionist for a business. Your role is to:

1. **Answer Questions**: Use the knowledge base to answer questions about services, pricing, hours, policies, and other business information.

2. **Manage Appointments**: 
   - Check availability before suggesting times
   - Collect ALL required information (name, phone, service, date/time) before creating appointments
   - Confirm details with the customer before booking
   - Help reschedule or cancel existing appointments

3. **Handle Contacts**:
   - Look up existing customers to provide personalized service
   - Maintain customer information

4. **Record Callbacks**:
   - When you cannot help or when human assistance is needed, record a callback request
   - Use high priority for urgent matters

**Important Guidelines**:
- Always be polite, professional, and helpful
- Ask clarifying questions when information is missing
- Confirm before taking actions (booking, canceling, etc.)
- If you're uncertain or if the request is sensitive, record a callback for human assistance
- Never make up information - use the knowledge base or say you don't know
- For appointment times, always check availability first
- Use natural, conversational language
- Keep responses concise but complete

**When to escalate to human**:
- Complex requests you cannot handle
- Complaints or dissatisfaction
- Requests for refunds or special accommodations
- Anything outside your defined capabilities
- Customer explicitly asks for a human

Remember: You represent the business, so maintain a professional and friendly tone at all times.`;

/**
 * AI Chat Service class
 */
export class AIChatService {
  private provider: AIProvider;
  private maxToolIterations = 5; // Prevent infinite tool calling loops

  constructor(provider?: AIProvider) {
    this.provider = provider || createAIProvider();
  }

  /**
   * Process a chat request with tool calling support
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    const { messages, businessId } = request;
    const context: ToolContext = { businessId };
    const toolsUsed: string[] = [];

    let currentMessages = [...messages];
    let iterations = 0;

    // Main conversation loop - handles tool calling iterations
    while (iterations < this.maxToolIterations) {
      iterations++;

      // Call AI with tools
      const response = await this.provider.chat(
        currentMessages,
        AI_TOOLS,
        SYSTEM_PROMPT
      );

      // If AI responds with text (no tool calls), we're done
      if (response.finishReason === "stop" && response.content) {
        return {
          message: {
            role: "assistant",
            content: response.content,
          },
          toolsUsed: toolsUsed.length > 0 ? toolsUsed : undefined,
        };
      }

      // If AI wants to call tools, execute them
      if (response.finishReason === "tool_calls" && response.toolCalls.length > 0) {
        // Add assistant's tool call message to history
        currentMessages.push({
          role: "assistant",
          content: response.content || "[Tool calls requested]",
        });

        // Execute all tool calls
        const toolResults: string[] = [];
        
        for (const toolCall of response.toolCalls) {
          toolsUsed.push(toolCall.name);
          
          // Execute the tool
          const result = await executeAITool(
            toolCall.name,
            toolCall.arguments,
            context
          );

          // Format result for AI
          const resultText = result.success
            ? JSON.stringify(result.data, null, 2)
            : `Error: ${result.error}`;

          toolResults.push(`Tool: ${toolCall.name}\nResult: ${resultText}`);
        }

        // Add tool results as a user message (from AI's perspective)
        currentMessages.push({
          role: "user",
          content: `Tool execution results:\n\n${toolResults.join("\n\n")}`,
        });

        // Continue loop to let AI process the tool results
        continue;
      }

      // If we get here with no content and no tool calls, something went wrong
      if (!response.content) {
        return {
          message: {
            role: "assistant",
            content: "I apologize, but I encountered an issue processing your request. Could you please try again or rephrase your question?",
          },
          toolsUsed: toolsUsed.length > 0 ? toolsUsed : undefined,
        };
      }

      // Return the response
      return {
        message: {
          role: "assistant",
          content: response.content,
        },
        toolsUsed: toolsUsed.length > 0 ? toolsUsed : undefined,
      };
    }

    // Max iterations reached
    console.error("[AI Chat] Max tool iterations reached");
    return {
      message: {
        role: "assistant",
        content: "I apologize, but I'm having trouble processing your request. Let me record a callback request so someone can assist you personally. May I have your name and phone number?",
      },
      toolsUsed,
    };
  }

  /**
   * Get the AI provider model name
   */
  getModel(): string {
    return this.provider.getModel();
  }
}

/**
 * Create a chat service instance
 */
export function createChatService(provider?: AIProvider): AIChatService {
  return new AIChatService(provider);
}
