/**
 * Twilio Voice Handler
 * 
 * Manages real-time voice conversations with AI
 */

import twilio from "twilio";
const VoiceResponse = twilio.twiml.VoiceResponse;

export interface CallContext {
  callSid: string;
  from: string;
  to: string;
  businessId: string;
}

/**
 * Generate TwiML for incoming call greeting
 */
export function generateGreetingTwiML(websocketUrl: string): string {
  const twiml = new VoiceResponse();

  // Greet the caller
  twiml.say(
    {
      voice: "Polly.Joanna", // Amazon Polly voice (more natural)
    },
    "Hello! Thank you for calling. Please wait while I connect you to our AI receptionist."
  );

  // Connect to WebSocket for streaming
  const connect = twiml.connect();
  connect.stream({
    url: websocketUrl,
  });

  return twiml.toString();
}

/**
 * Generate TwiML for call recording
 */
export function generateRecordingTwiML(): string {
  const twiml = new VoiceResponse();

  twiml.say(
    {
      voice: "Polly.Joanna",
    },
    "This call will be recorded for quality and training purposes."
  );

  // Start recording
  twiml.record({
    transcribe: true,
    transcribeCallback: "/api/twilio/transcription",
    maxLength: 300, // 5 minutes max
  });

  return twiml.toString();
}

/**
 * Generate TwiML for ending call
 */
export function generateHangupTwiML(message?: string): string {
  const twiml = new VoiceResponse();

  if (message) {
    twiml.say(
      {
        voice: "Polly.Joanna",
      },
      message
    );
  }

  twiml.hangup();

  return twiml.toString();
}

/**
 * Generate TwiML for error handling
 */
export function generateErrorTwiML(): string {
  const twiml = new VoiceResponse();

  twiml.say(
    {
      voice: "Polly.Joanna",
    },
    "We're sorry, but we're experiencing technical difficulties. Please try calling again later or visit our website."
  );

  twiml.hangup();

  return twiml.toString();
}

/**
 * Generate TwiML for transferring to human
 */
export function generateTransferTwiML(transferNumber: string): string {
  const twiml = new VoiceResponse();

  twiml.say(
    {
      voice: "Polly.Joanna",
    },
    "Please hold while I transfer you to a team member."
  );

  twiml.dial(transferNumber);

  return twiml.toString();
}
