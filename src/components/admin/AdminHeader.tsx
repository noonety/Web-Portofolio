"use client";

import { signOut } from "next-auth/react";

export default function AdminHeader() {
  return (
    <header className="h-16 bg-bg-secondary border-b border-border flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-text-primary">Admin Panel</h1>
      <button
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-secondary hover:text-error transition-colors rounded-md hover:bg-error/10"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </button>
    </header>
  );
}