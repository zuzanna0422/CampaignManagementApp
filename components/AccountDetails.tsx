"use client";

import { useSyncExternalStore } from "react";
import { mockUser } from "@/data/mockUser";

export default function AccountDetails() {
  const walletBalance = useSyncExternalStore(
    (callback) => {
      const handler = (event: StorageEvent) => {
        if (event.key === "walletBalance") {
          callback();
        }
      };
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    },
    () => {
      const stored = localStorage.getItem("walletBalance");
      const parsed = Number(stored);
      return stored && !Number.isNaN(parsed)
        ? parsed
        : mockUser[0].walletBalance;
    },
    () => mockUser[0].walletBalance
  );

  return (
    <div className="inline-flex items-center gap-4 rounded-2xl border border-black/5 bg-white px-4 py-3 shadow-sm sm:text-base">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-s font-semibold text-white sm:text-xs">
        {mockUser[0].initials}
      </div>
      <div className="space-y-1">
        <h1 className="text-base font-semibold tracking-tight sm:text-lg">
            {mockUser[0].name}
        </h1>
        <p className="text-[11px] text-black/60 sm:text-xs">
          Wallet: {walletBalance} 𖢻
        </p>
      </div>
    </div>
  );
}
