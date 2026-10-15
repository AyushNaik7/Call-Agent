"use client";

import { useState } from "react";
import { Bell, Search, LogOut, Moon, Sun } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { logout } from "@/lib/actions/auth";

interface HeaderProps {
  user?: {
    email?: string;
    user_metadata?: {
      full_name?: string;
    };
  };
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export function Header({ user, theme, toggleTheme }: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  
  const fullName = user?.user_metadata?.full_name || user?.email || "User";
  const initials = getInitials(fullName);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="flex h-20 items-center justify-between glass border-b border-white/10 px-8 backdrop-blur-xl shadow-sm">
      {/* Search */}
      <div className="flex flex-1 items-center gap-4 max-w-2xl">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search calls, contacts, appointments..."
            className="h-12 w-full rounded-2xl border border-gray-200/50 dark:border-white/10 bg-white/50 dark:bg-white/5 pl-12 pr-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-400 dark:focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-xl p-3 hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-200"
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative rounded-xl p-3 hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-200">
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-200"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-lg">
              {initials}
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{fullName}</span>
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 z-20 mt-2 w-56 rounded-2xl glass border border-white/20 dark:border-white/10 py-2 shadow-2xl backdrop-blur-xl">
                <div className="border-b border-white/10 px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{fullName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/10 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
