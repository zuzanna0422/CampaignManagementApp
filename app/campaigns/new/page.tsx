"use client";

import { useSearchParams } from "next/navigation";
import { keywords } from "@/data/keywords";
import { towns } from "@/data/towns";
import type { Campaign, CampaignStatus } from "@/models/Campaign";
import { mockCampaigns } from "@/data/mockCampaigns";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCampaignPage() {
  const router = useRouter();
  const [keywordInput, setKeywordInput] = useState("");
  const [keywordsList, setKeywordsList] = useState<string[]>([]);

  const searchParams = useSearchParams();
  const productId = searchParams.get("productId") ?? "";

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const minValue = Number(event.currentTarget.min || "0");
    const rawValue = Number(event.currentTarget.value);
    if (!Number.isNaN(rawValue) && rawValue < minValue) {
      event.currentTarget.value = String(minValue);
    }
  };

  const handleKeywordChange = () => {
    const addKeyword = keywordInput.trim();
    if (!addKeyword) return;

    if (keywordsList.includes(addKeyword)) {
      setKeywordInput("");
      return;
    }

    setKeywordsList((prev) => [...prev, addKeyword]);
    setKeywordInput("");
  };

  const handleKeywordSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => { 
    if (event.key === "Enter") {
      event.preventDefault();
      handleKeywordChange();
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setKeywordsList((prev) => prev.filter((_, i) => i !== index));
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
    setKeywordInput("");
    setKeywordsList([]);
    router.push("/products");
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

          <label className="flex flex-col gap-2 text-xs font-medium sm:text-sm">
            Keywords
            <div className="w-full flex gap-2">
              <input
                className="flex-1 rounded-lg border border-black/15 px-3 py-2 text-xs sm:text-sm"
                name="keywords"
                placeholder={keywords.slice(0, 6).join(", ")}
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleKeywordSubmit}
              />
              <button
                type="button"
                className="rounded-lg border border-black/10 bg-black px-3 py-2 text-xs font-semibold text-white transition hover:bg-black/90"
                onClick={handleKeywordChange}
              >
                Add keyword
              </button>
            </div>
            <input name="keywords" type="hidden" value={keywordsList.join(",")} />
            {keywordsList.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {keywordsList.map((keyword, index) => (
                  <span
                    key={`${keyword}-${index}`}
                    className="inline-flex items-center gap-2 rounded-full border border-black/15 px-3 py-1 text-[11px] sm:text-xs"
                  >
                    {keyword}
                    <button
                      type="button"
                      className="text-black/60 hover:text-black"
                      onClick={() => handleRemoveKeyword(index)}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </label>

          <div className="grid gap-10 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-xs font-medium sm:text-sm">
              Bid amount
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-black/50 sm:text-sm">
                  $
                </span>
                <input
                  className="w-full rounded-lg border border-black/15 px-3 py-2 text-xs sm:text-sm pl-8"
                  name="bidAmount"
                  min="0.01"
                  step="0.1"
                  onBlur={handleBlur}
                  required
                  type="number"
                />
              </div>
            </label>

            <label className="flex flex-col gap-2 text-xs font-medium sm:text-sm">
              Fund
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-black/50 sm:text-sm">
                  $
                </span>
                <input
                  className="w-full rounded-lg border border-black/15 px-3 py-2 text-xs sm:text-sm pl-8"
                  name="fund"
                  min="100"
                  step="50"
                  onBlur={handleBlur}
                  required
                  type="number"
                />
              </div>
            </label>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
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

            <label className="flex flex-col gap-2 text-xs font-medium sm:text-sm">
              Radius
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-black/50 sm:text-sm">
                  km
                </span>
                <input
                  className="w-full rounded-lg border border-black/15 px-3 py-2 text-xs sm:text-sm pl-9"
                  min="5"
                  max="100"
                  step="5"
                  name="radius"
                  onBlur={handleBlur}
                  required
                  type="number"
                />
              </div>
            </label>
          </div>

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
