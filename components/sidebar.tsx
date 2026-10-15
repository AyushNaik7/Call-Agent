"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, getInitials } from "@/lib/utils";
import {
  LayoutDashboard,
  Phone,
  Calendar,
  Users,
  MessageSquare,
  BookOpen,
  Settings,
  Bot,
} from "lucide-react";

const navigation = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Calls", href: "/calls", icon: Phone },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Contacts", href: "/contacts", icon: Users },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Knowledge Base", href: "/knowledge", icon: BookOpen },
  { name: "AI Configuration", href: "/ai-config", icon: Bot },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  business?: {
    name: string;
  } | null;
}

export function Sidebar({ business }: SidebarProps) {
  const pathname = usePathname();
  const businessInitials = business?.name ? getInitials(business.name) : "?";

  return (
    <div className="flex h-full w-72 flex-col glass border-r border-white/20 dark:border-white/5 backdrop-blur-xl shadow-xl">
      {/* Logo */}
      <div className="flex h-20 items-center px-8 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              AI Receptionist
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">Smart Call Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200/50 dark:border-blue-800/50"
                  : "text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-blue-400"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Business Selector */}
      <div className="border-t border-white/10 p-4 m-4 rounded-xl glass">
        {business ? (
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold text-white shadow-lg">
              {businessInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {business.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Active Business</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-400">
              ?
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">No Business</p>
              <Link href="/onboarding" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                Set up now →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
