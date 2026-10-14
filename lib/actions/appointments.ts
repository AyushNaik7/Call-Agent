"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getActiveBusiness } from "./auth";

export async function getAppointments() {
  const business = await getActiveBusiness();
  if (!business) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("business_id", business.id)
    .order("date_time", { ascending: true });

  if (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }

  return data || [];
}

export async function createAppointment(formData: {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  service: string;
  date_time: string;
  duration: number;
  notes?: string;
}) {
  const business = await getActiveBusiness();
  if (!business) throw new Error("No active business");

  const supabase = await createClient();

  // Check for conflicts
  const appointmentTime = new Date(formData.date_time);
  const endTime = new Date(appointmentTime.getTime() + formData.duration * 60000);

  const { data: conflicts } = await supabase
    .from("appointments")
    .select("*")
    .eq("business_id", business.id)
    .eq("status", "confirmed")
    .gte("date_time", appointmentTime.toISOString())
    .lt("date_time", endTime.toISOString());

  if (conflicts && conflicts.length > 0) {
    throw new Error("Time slot conflict - appointment already exists");
  }

  // Create or find contact
  let contactId = null;
  const { data: existingContact } = await supabase
    .from("contacts")
    .select("id")
    .eq("business_id", business.id)
    .eq("phone", formData.customer_phone)
    .single();

  if (existingContact) {
    contactId = existingContact.id;
  } else {
    const { data: newContact } = await supabase
      .from("contacts")
      .insert({
        business_id: business.id,
        name: formData.customer_name,
        phone: formData.customer_phone,
        email: formData.customer_email,
      })
      .select("id")
      .single();

    if (newContact) contactId = newContact.id;
  }

  // Create appointment
  const { data, error } = await supabase
    .from("appointments")
    .insert({
      business_id: business.id,
      contact_id: contactId,
      customer_name: formData.customer_name,
      customer_phone: formData.customer_phone,
      customer_email: formData.customer_email,
      service: formData.service,
      date_time: formData.date_time,
      duration: formData.duration,
      status: "confirmed",
      notes: formData.notes,
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/appointments");
  return data;
}

export async function updateAppointment(
  id: string,
  updates: {
    status?: string;
    date_time?: string;
    notes?: string;
  }
) {
  const business = await getActiveBusiness();
  if (!business) throw new Error("No active business");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .update(updates)
    .eq("id", id)
    .eq("business_id", business.id)
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/appointments");
  return data;
}

export async function deleteAppointment(id: string) {
  const business = await getActiveBusiness();
  if (!business) throw new Error("No active business");

  const supabase = await createClient();
  const { error } = await supabase
    .from("appointments")
    .delete()
    .eq("id", id)
    .eq("business_id", business.id);

  if (error) throw error;

  revalidatePath("/appointments");
}
