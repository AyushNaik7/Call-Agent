"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getActiveBusiness } from "./auth";

export async function getKnowledgeEntries() {
  const business = await getActiveBusiness();
  if (!business) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("knowledge_entries")
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching knowledge entries:", error);
    return [];
  }

  return data || [];
}

export async function createKnowledgeEntry(formData: {
  question: string;
  answer: string;
  category?: string;
}) {
  const business = await getActiveBusiness();
  if (!business) throw new Error("No active business");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("knowledge_entries")
    .insert({
      business_id: business.id,
      ...formData,
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/knowledge");
  return data;
}

export async function updateKnowledgeEntry(
  id: string,
  updates: {
    question?: string;
    answer?: string;
    category?: string;
    enabled?: boolean;
  }
) {
  const business = await getActiveBusiness();
  if (!business) throw new Error("No active business");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("knowledge_entries")
    .update(updates)
    .eq("id", id)
    .eq("business_id", business.id)
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/knowledge");
  return data;
}

export async function deleteKnowledgeEntry(id: string) {
  const business = await getActiveBusiness();
  if (!business) throw new Error("No active business");

  const supabase = await createClient();
  const { error } = await supabase
    .from("knowledge_entries")
    .delete()
    .eq("id", id)
    .eq("business_id", business.id);

  if (error) throw error;

  revalidatePath("/knowledge");
}

export async function incrementKnowledgeUsage(id: string) {
  const business = await getActiveBusiness();
  if (!business) return;

  const supabase = await createClient();
  await supabase.rpc("increment_knowledge_usage", { entry_id: id });
}
