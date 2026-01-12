"use client";

import { useSearchParams } from "next/navigation";
import { keywords } from "@/data/keywords";
import { towns } from "@/data/towns";
import type { Campaign, CampaignStatus } from "@/models/Campaign";
import { mockCampaigns } from "@/data/mockCampaigns";

export default function NewCampaignPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId") ?? "";
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const minValue = Number(event.currentTarget.min || "0");
    const rawValue = Number(event.currentTarget.value);
    if (!Number.isNaN(rawValue) && rawValue < minValue) {
      event.currentTarget.value = String(minValue);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const stored = localStorage.getItem("campaigns");
    let campaigns: Campaign[] = [];
    if (stored) {
      try {
        campaigns = JSON.parse(stored) as Campaign[];
      } catch {
        campaigns = [];
      }
    } else {
      campaigns = mockCampaigns;
    }

    const nextId = campaigns.length > 0 ? Math.max(...campaigns.map(c => c.id)) + 1 : 1;

    const keywordsValue = String(formData.get("keywords"));
    const newCampaign: Campaign = {
      id: nextId,
      productId: Number(formData.get("productId") ?? "0"),
      name: String(formData.get("name") ?? ""),
      keywords: keywordsValue.split(',').map((k) => k.trim()).filter(Boolean), 
      bidAmount: Number(formData.get("bidAmount") ?? "0"),
      fund: Number(formData.get("fund") ?? "0"),
      status: (formData.get("status") ?? "on") as CampaignStatus,
      town: String(formData.get("town") ?? ""),
      radius: Number(formData.get("radius") ?? "0"),
    };

    campaigns.push(newCampaign);
    localStorage.setItem("campaigns", JSON.stringify(campaigns));
    form.reset();

  };

  return (
    <div className="min-h-screen bg-white px-8 py-10 text-black sm:px-6 sm:py-12">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
            New campaign
          </h1>
          <p className="text-[11px] text-black/70 sm:text-sm lg:text-base">
            Fill in the campaign details for the selected product.
          </p>
        </header>

        <form className="flex flex-col gap-6 rounded-2xl border border-black/10 bg-white p-7 shadow-sm sm:p-8"
          onSubmit={handleSubmit}>
          <input name="productId" type="hidden" value={productId} />
          <input name="status" type="hidden" value="on" />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-xs font-medium sm:text-sm">
              Campaign name
              <input
                className="rounded-lg border border-black/15 px-3 py-2 text-xs sm:text-sm"
                name="name"
                placeholder="Spring sale"
                minLength={4}
                maxLength={45}
                required
                type="text"
              />
            </label>
          </div>

          <label className="flex flex-col gap-2 text-xs font-medium sm:text-sm">
            Keywords (comma separated)
            <input
              className="rounded-lg border border-black/15 px-3 py-2 text-xs sm:text-sm"
              name="keywords"
              placeholder={keywords.slice(0, 6).join(", ")}
              type="text"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-xs font-medium sm:text-sm">
              Bid amount
              <input
                className="rounded-lg border border-black/15 px-3 py-2 text-xs sm:text-sm"
                name="bidAmount"
                min="0.01"
                step="0.1"
                onBlur={handleBlur}
                required
                type="number"
              />
            </label>

            <label className="flex flex-col gap-2 text-xs font-medium sm:text-sm">
              Fund
              <input
                className="rounded-lg border border-black/15 px-3 py-2 text-xs sm:text-sm"
                name="fund"
                min="100"
                step="50"
                onBlur={handleBlur}
                required
                type="number"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-xs font-medium sm:text-sm">
              Town
              <select
                className="rounded-lg border border-black/15 px-3 py-2 text-xs sm:text-sm"
                name="town"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Select town
                </option>
                {towns.map((town) => (
                  <option key={town} value={town}>
                    {town}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-2 text-xs font-medium sm:text-sm">
            Radius (km)
            <input
              className="rounded-lg border border-black/15 px-3 py-2 text-xs sm:text-sm"
              min="5"
              max="100"
              step="5"
              name="radius"
              onBlur={handleBlur}
              required
              type="number"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-full bg-red-600 px-4 py-3 text-xs font-semibold text-white transition hover:bg-red-700 sm:text-base"
          >
            Create campaign
          </button>
        </form>
      </div>
    </div>
  );
}
