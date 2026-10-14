"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getActiveBusiness } from "./auth";

export async function getContacts() {
  const business = await getActiveBusiness();
  if (!business) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contacts")
    .select(`
      *,
      calls:calls(count),
      appointments:appointments(count)
    `)
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }

  return data || [];
}

export async function createContact(formData: {
  name: string;
  phone: string;
  email?: string;
  tags?: string[];
  notes?: string;
}) {
  const business = await getActiveBusiness();
  if (!business) throw new Error("No active business");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contacts")
    .insert({
      business_id: business.id,
      ...formData,
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/contacts");
  return data;
}

export async function updateContact(
  id: string,
  updates: {
    name?: string;
    phone?: string;
    email?: string;
    tags?: string[];
    notes?: string;
  }
) {
  const business = await getActiveBusiness();
  if (!business) throw new Error("No active business");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contacts")
    .update(updates)
    .eq("id", id)
    .eq("business_id", business.id)
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/contacts");
  return data;
}

export async function deleteContact(id: string) {
  const business = await getActiveBusiness();
  if (!business) throw new Error("No active business");

  const supabase = await createClient();
  const { error } = await supabase
    .from("contacts")
    .delete()
    .eq("id", id)
    .eq("business_id", business.id);

  if (error) throw error;

  revalidatePath("/contacts");
}
