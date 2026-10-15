/**
 * AI Chat API Route
 * 
 * Server-side endpoint for AI chat interactions
 * Handles authentication and business context
 */

import { NextRequest, NextResponse } from "next/server";
import { createChatService } from "@/lib/ai/chat-service";
import { getCurrentUser, getActiveBusiness } from "@/lib/actions/auth";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
}

/**
 * POST /api/ai/chat
 * 
 * Send a message to the AI receptionist
 */
export async function POST(request: NextRequest) {
  try {
    // Check API key first
    if (!process.env.OPENROUTER_API_KEY) {
      console.error("[AI Chat API] OPENROUTER_API_KEY not configured");
      return NextResponse.json(
        { 
          error: "AI service not configured. Please add OPENROUTER_API_KEY to your environment variables.",
          code: "CONFIG_ERROR"
        },
        { status: 503 }
      );
    }

    // Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user's active business
    const business = await getActiveBusiness();
    if (!business) {
      return NextResponse.json(
        { error: "No active business found" },
        { status: 403 }
      );
    }

    // Parse request body
    const body: ChatRequestBody = await request.json();
    
    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: "Invalid request: messages array required" },
        { status: 400 }
      );
    }

    if (body.messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: at least one message required" },
        { status: 400 }
      );
    }

    // Validate messages
    for (const msg of body.messages) {
      if (!msg.role || !msg.content) {
        return NextResponse.json(
          { error: "Invalid message format" },
          { status: 400 }
        );
      }
      if (msg.role !== "user" && msg.role !== "assistant") {
        return NextResponse.json(
          { error: "Invalid message role" },
          { status: 400 }
        );
      }
    }

    // Create chat service
    const chatService = createChatService();

    // Process chat request
    const response = await chatService.chat({
      messages: body.messages,
      businessId: business.id,
    });

    // Return response
    return NextResponse.json({
      message: response.message,
      toolsUsed: response.toolsUsed,
      model: chatService.getModel(),
    });

  } catch (error: any) {
    console.error("[AI Chat API] Error:", error);
    console.error("[AI Chat API] Error stack:", error.stack);
    console.error("[AI Chat API] Error message:", error.message);

    // Handle specific error types
    if (error.message?.includes("rate limit")) {
      return NextResponse.json(
        { 
          error: "AI service is temporarily busy. Please try again in a moment.",
          code: "RATE_LIMIT"
        },
        { status: 429 }
      );
    }

    if (error.message?.includes("quota")) {
      return NextResponse.json(
        { 
          error: "AI service quota exceeded. Please contact support.",
          code: "QUOTA_EXCEEDED"
        },
        { status: 429 }
      );
    }

    if (error.message?.includes("API key")) {
      return NextResponse.json(
        { 
          error: "AI service configuration error. Please contact support.",
          code: "CONFIG_ERROR"
        },
        { status: 500 }
      );
    }

    // Generic error
    return NextResponse.json(
      { 
        error: "An error occurred processing your request. Please try again.",
        code: "INTERNAL_ERROR"
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai/chat
 * 
 * Health check endpoint
 */
export async function GET() {
  try {
    // Check if API key is configured
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        status: "error",
        message: "AI service not configured",
      }, { status: 503 });
    }

    return NextResponse.json({
      status: "ok",
      message: "AI chat service is available",
    });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Service health check failed",
    }, { status: 500 });
  }
}
