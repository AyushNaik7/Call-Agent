"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getActiveBusiness } from "./auth";

export async function getMessages() {
  const business = await getActiveBusiness();
  if (!business) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }

  return data || [];
}

export async function updateMessageStatus(
  id: string,
  status: "unread" | "read" | "resolved"
) {
  const business = await getActiveBusiness();
  if (!business) throw new Error("No active business");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .update({ status })
    .eq("id", id)
    .eq("business_id", business.id)
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/messages");
  return data;
}

export async function createMessage(data: {
  customer_name: string;
  customer_phone: string;
  message: string;
  priority?: "low" | "medium" | "high";
}) {
  const business = await getActiveBusiness();
  if (!business) {
    throw new Error("No active business found");
  }

  const supabase = await createClient();

  const { error } = await supabase.from("messages").insert({
    business_id: business.id,
    customer_name: data.customer_name,
    customer_phone: data.customer_phone,
    message: data.message,
    priority: data.priority || "medium",
    status: "unread",
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/messages");
}
