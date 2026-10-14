"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/auth/login");
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getUserBusinesses() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: members, error } = await supabase
    .from("business_members")
    .select(
      `
      business_id,
      role,
      businesses (
        id,
        name,
        business_type,
        phone,
        email
      )
    `
    )
    .eq("user_id", user.id);

  if (error || !members) return [];

  return members.map((member: any) => ({
    ...member.businesses,
    role: member.role,
  }));
}

export async function getActiveBusiness() {
  const businesses = await getUserBusinesses();
  return businesses[0] || null;
}
