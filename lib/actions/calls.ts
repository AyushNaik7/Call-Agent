"use server";

import { createClient } from "@/lib/supabase/server";
import { getActiveBusiness } from "./auth";

export async function getCalls() {
  const business = await getActiveBusiness();
  if (!business) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("calls")
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching calls:", error);
    return [];
  }

  return data || [];
}

export async function getRecentCalls(limit: number = 5) {
  const business = await getActiveBusiness();
  if (!business) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("calls")
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent calls:", error);
    return [];
  }

  return data || [];
}
