import { getCurrentUser, getActiveBusiness } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { DashboardLayoutClient } from "./dashboard-client";

export const instant = false;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Force dynamic rendering to avoid prerender issues
  await connection();
  
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/auth/login");
  }

  const business = await getActiveBusiness();

  // Redirect to onboarding if no business exists
  if (!business) {
    redirect("/onboarding");
  }

  return <DashboardLayoutClient user={user} business={business}>{children}</DashboardLayoutClient>;
}
