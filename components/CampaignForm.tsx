"use client";

import { useState } from "react";
import { keywords } from "@/data/keywords";
import { towns } from "@/data/towns";
import type { Campaign } from "@/models/Campaign";

type CampaignFormProps = {
  productId: number;
  initialCampaign?: Campaign | null;
  submitLabel: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
};

export default function CampaignForm({
  productId,
  initialCampaign,
  submitLabel,
  onSubmit,
  secondaryLabel,
  onSecondary
}: CampaignFormProps) {
  const [keywordInput, setKeywordInput] = useState("");
  const [keywordsList, setKeywordsList] = useState<string[]>(
    initialCampaign?.keywords ?? []
  );

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

  return (
    <form
      className="flex flex-col gap-6 rounded-2xl border border-black/10 bg-white p-7 shadow-sm sm:p-8"
      onSubmit={onSubmit}
    >
      <input name="productId" type="hidden" value={productId} />
      <input name="status" type="hidden" value={initialCampaign?.status ?? "on"} />

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
          defaultValue={initialCampaign?.name ?? ""}
        />
      </label>

      <label className="flex flex-col gap-2 text-xs font-medium sm:text-sm">
        Keywords
        <div className="w-full flex gap-2">
          <input
            className="flex-1 rounded-lg border border-black/15 px-3 py-2 text-xs sm:text-sm"
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
                  x
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
              step="0.01"
              onBlur={handleBlur}
              required
              type="number"
              defaultValue={initialCampaign?.bidAmount ?? ""}
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
              defaultValue={initialCampaign?.fund ?? ""}
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
            defaultValue={initialCampaign?.town ?? ""}
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
              defaultValue={initialCampaign?.radius ?? ""}
            />
          </div>
        </label>
      </div>
      <div className="flex flex-col gap-8 sm:flex-row sm:justify-end pt-2">
        {secondaryLabel && onSecondary && (
          <button
            type="button"
            onClick={onSecondary}
            className="w-full rounded-full bg-neutral-400 px-4 py-3 text-xs font-semibold text-white transition hover:bg-neutral-500 sm:text-base"
          >
            {secondaryLabel}
          </button>
        )}
        <button
            type="submit"
            className="w-full rounded-full bg-red-600 px-4 py-3 text-xs font-semibold text-white transition hover:bg-red-700 sm:text-base"
        >
            {submitLabel}
        </button>
      </div>
    </form>
  );
}