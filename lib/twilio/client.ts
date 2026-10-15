/**
 * Twilio Client Configuration
 * 
 * Handles Twilio API interactions for phone calls
 */

import twilio from "twilio";

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
}

/**
 * Create a Twilio client instance
 */
export function createTwilioClient(config?: Partial<TwilioConfig>) {
  const accountSid = config?.accountSid || process.env.TWILIO_ACCOUNT_SID;
  const authToken = config?.authToken || process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error(
      "TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables are required"
    );
  }

  return twilio(accountSid, authToken);
}

/**
 * Get Twilio phone number from environment
 */
export function getTwilioPhoneNumber(): string {
  const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!phoneNumber) {
    throw new Error("TWILIO_PHONE_NUMBER environment variable is required");
  }

  return phoneNumber;
}

/**
 * Validate Twilio webhook signature
 */
export function validateTwilioSignature(
  signature: string,
  url: string,
  params: Record<string, any>
): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!authToken) {
    console.error("TWILIO_AUTH_TOKEN not configured");
    return false;
  }

  return twilio.validateRequest(authToken, signature, url, params);
}
