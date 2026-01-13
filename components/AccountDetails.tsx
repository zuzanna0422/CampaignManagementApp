"use client";

import { useState } from "react";
import { mockUser } from "@/data/mockUser";

export default function AccountDetails() {
  const [walletBalance] = useState(() => {
    if (typeof window === "undefined") {
      return mockUser[0].walletBalance;
    }
    const stored = localStorage.getItem("walletBalance");
    const parsed = Number(stored);
    return stored && !Number.isNaN(parsed) ? parsed : mockUser[0].walletBalance;
  });

  return (
    <div className="inline-flex items-center gap-4 rounded-2xl border border-black/5 bg-white px-4 py-3 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
        {mockUser[0].initials}
      </div>
      <div className="space-y-1">
        <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
            {mockUser[0].name}
        </h1>
        <p className="text-xs text-black/60 sm:text-sm">
          Wallet: {walletBalance} 𖢻
        </p>
      </div>
    </div>
  );
}
