import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { getCurrentUser, getActiveBusiness } from "@/lib/actions/auth";
import { redirect } from "next/navigation";

export const instant = false;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/auth/login");
  }

  const business = await getActiveBusiness();

  // Redirect to onboarding if no business exists
  if (!business) {
    redirect("/onboarding");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar business={business} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
