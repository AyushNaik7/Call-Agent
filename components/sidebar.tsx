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
    <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900">AI Receptionist</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Business Selector */}
      <div className="border-t border-gray-200 p-4">
        {business ? (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-sm font-medium text-gray-600">
              {businessInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {business.name}
              </p>
              <p className="text-xs text-gray-500">Active Business</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-sm font-medium text-gray-600">
              ?
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">No Business</p>
              <Link href="/onboarding" className="text-xs text-blue-600 hover:text-blue-700">
                Set up now
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
