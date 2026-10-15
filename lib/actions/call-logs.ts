"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getActiveBusiness } from "./auth";

export interface CallLog {
  id: string;
  business_id: string;
  call_sid: string;
  direction: "inbound" | "outbound";
  from_number: string;
  to_number: string;
  status: string;
  started_at?: string;
  answered_at?: string;
  ended_at?: string;
  duration?: number;
  recording_url?: string;
  transcription?: string;
  ai_handled: boolean;
  tools_used?: string[];
  conversation_summary?: string;
  appointment_created: boolean;
  callback_requested: boolean;
  transferred_to_human: boolean;
  caller_name?: string;
  caller_email?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export async function getCallLogs() {
  const business = await getActiveBusiness();
  if (!business) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("call_logs")
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching call logs:", error);
    return [];
  }

  return data || [];
}

export async function createCallLog(callData: {
  call_sid: string;
  direction: "inbound" | "outbound";
  from_number: string;
  to_number: string;
  started_at?: string;
}) {
  const business = await getActiveBusiness();
  if (!business) throw new Error("No active business");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("call_logs")
    .insert({
      business_id: business.id,
      status: "initiated",
      ...callData,
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/calls");
  return data;
}

export async function updateCallLog(
  callSid: string,
  updates: {
    status?: string;
    answered_at?: string;
    ended_at?: string;
    duration?: number;
    recording_url?: string;
    transcription?: string;
    ai_handled?: boolean;
    tools_used?: string[];
    conversation_summary?: string;
    appointment_created?: boolean;
    callback_requested?: boolean;
    transferred_to_human?: boolean;
    caller_name?: string;
    caller_email?: string;
    notes?: string;
  }
) {
  const business = await getActiveBusiness();
  if (!business) throw new Error("No active business");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("call_logs")
    .update(updates)
    .eq("call_sid", callSid)
    .eq("business_id", business.id)
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/calls");
  return data;
}

export async function getCallLog(callSid: string) {
  const business = await getActiveBusiness();
  if (!business) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("call_logs")
    .select("*")
    .eq("call_sid", callSid)
    .eq("business_id", business.id)
    .single();

  if (error) {
    console.error("Error fetching call log:", error);
    return null;
  }

  return data;
}

export async function deleteCallLog(id: string) {
  const business = await getActiveBusiness();
  if (!business) throw new Error("No active business");

  const supabase = await createClient();
  const { error } = await supabase
    .from("call_logs")
    .delete()
    .eq("id", id)
    .eq("business_id", business.id);

  if (error) throw error;

  revalidatePath("/calls");
}
