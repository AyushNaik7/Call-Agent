/**
 * Twilio Voice Webhook
 * 
 * Handles incoming phone calls from Twilio
 */

import { NextRequest, NextResponse } from "next/server";
import { generateGreetingTwiML, generateErrorTwiML } from "@/lib/twilio/voice-handler";
import { validateTwilioSignature } from "@/lib/twilio/client";

/**
 * POST /api/twilio/voice
 * 
 * Twilio calls this webhook when a call comes in
 */
export async function POST(request: NextRequest) {
  try {
    console.log("[Twilio Voice] Incoming call webhook");

    // Get request body
    const formData = await request.formData();
    const params: Record<string, any> = {};
    
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    console.log("[Twilio Voice] Call from:", params.From, "to:", params.To);
    console.log("[Twilio Voice] Call SID:", params.CallSid);

    // Validate Twilio signature (security)
    const signature = request.headers.get("x-twilio-signature") || "";
    const url = request.url;

    if (process.env.NODE_ENV === "production") {
      const isValid = validateTwilioSignature(signature, url, params);
      
      if (!isValid) {
        console.error("[Twilio Voice] Invalid Twilio signature");
        return new NextResponse(generateErrorTwiML(), {
          status: 403,
          headers: { "Content-Type": "text/xml" },
        });
      }
    }

    // Generate WebSocket URL for streaming
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const websocketUrl = `wss://${baseUrl.replace(/^https?:\/\//, "")}/api/twilio/stream`;

    // Generate TwiML response to connect call to AI
    const twiml = generateGreetingTwiML(websocketUrl);

    console.log("[Twilio Voice] Responding with TwiML");

    return new NextResponse(twiml, {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });

  } catch (error: any) {
    console.error("[Twilio Voice] Error:", error);
    
    return new NextResponse(generateErrorTwiML(), {
      status: 500,
      headers: { "Content-Type": "text/xml" },
    });
  }
}

/**
 * GET /api/twilio/voice
 * 
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Twilio voice webhook is ready",
  });
}
