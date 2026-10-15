"use client";

import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { ThemeProvider, useTheme } from "@/components/theme-provider";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: any;
  business: any;
}

function DashboardContent({ children, user, business }: DashboardLayoutProps) {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Sidebar business={business} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={user} theme={theme} toggleTheme={toggleTheme} />
        <main className="flex-1 overflow-y-auto p-8 gradient-mesh">
          <div className="mx-auto max-w-7xl space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function DashboardLayoutClient({ children, user, business }: DashboardLayoutProps) {
  return (
    <ThemeProvider>
      <DashboardContent user={user} business={business}>
        {children}
      </DashboardContent>
    </ThemeProvider>
  );
}
