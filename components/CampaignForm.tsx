"use client";

import { useRef, useState } from "react";
import { Menu, MenuItem, Typeahead } from "react-bootstrap-typeahead";
import type { TypeaheadRef } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { keywords } from "@/data/keywords";
import { towns } from "@/data/towns";
import type { Campaign } from "@/models/Campaign";
import { mockUser } from "@/data/mockUser";

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
  const typeaheadRef = useRef<TypeaheadRef>(null);
  const [keywordInput, setKeywordInput] = useState("");
  const [keywordsList, setKeywordsList] = useState<string[]>(
    (initialCampaign?.keywords ?? []).filter((keyword) =>
      keywords.includes(keyword)
    )
  );
  const [keywordsMessage, setKeywordsMessage] = useState("");
  const [walletBalance] = useState(() => {
    if (typeof window === "undefined") {
      return mockUser[0].walletBalance;
    }
    const stored = localStorage.getItem("walletBalance");
    const parsed = Number(stored);
    return stored && !Number.isNaN(parsed) ? parsed : mockUser[0].walletBalance;
  });
  const [fundValue, setFundValue] = useState(
    Number(initialCampaign?.fund ?? 0)
  );


  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const minValue = Number(event.currentTarget.min || "0");
    const maxValue = Number(event.currentTarget.max || "");
    const rawValue = Number(event.currentTarget.value);
    if (!Number.isNaN(rawValue) && rawValue < minValue) {
      event.currentTarget.value = String(minValue);
    }
    if (!Number.isNaN(rawValue) && !Number.isNaN(maxValue) && rawValue > maxValue) {
      event.currentTarget.value = String(maxValue);
    }
    if (event.currentTarget.name === "fund") {
      const normalizedValue = Number(event.currentTarget.value);
      setFundValue(Number.isNaN(normalizedValue) ? 0 : normalizedValue);
    }
  };

  const handleFundChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = Number(event.currentTarget.value);
    setFundValue(Number.isNaN(rawValue) ? 0 : rawValue);
  };

  const addKeywordValue = (value: string) => {
    const addKeyword = value.trim();
    if (!addKeyword) return;

    if (keywordsList.includes(addKeyword)) {
      typeaheadRef.current?.clear();
      setKeywordInput("");
      return;
    }

    setKeywordsList((prev) => [...prev, addKeyword]);
    setKeywordsMessage("");
    typeaheadRef.current?.clear();
    setKeywordInput("");
  };

  const handleKeywordChange = () => {
    addKeywordValue(keywordInput);
  };

  const handleKeywordSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const rawValue =
        event.currentTarget.value ||
        typeaheadRef.current?.getInput()?.value ||
        keywordInput;
      const normalizedInput = rawValue.trim().toLowerCase();
      if (!normalizedInput) return;

      const suggested = keywords.find((keyword) =>
        keyword.toLowerCase().includes(normalizedInput)
      );

      addKeywordValue(suggested ?? rawValue);
    }
  };

  const handleTypeaheadSelection = (selected: unknown[]) => {
    const value = selected[0];
    if (typeof value !== "string") return;
    setKeywordInput(value);
  };

  const handleRemoveKeyword = (index: number) => {
    setKeywordsList((prev) => prev.filter((_, i) => i !== index));
    if (keywordsList.length === 1) {
      setKeywordsMessage("");
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (keywordsList.length === 0) {
      event.preventDefault();
      setKeywordsMessage("Please add at least one keyword.");
      return;
    }

    setKeywordsMessage("");
    onSubmit(event);
  };

  return (
    <form
      className="flex flex-col gap-6 rounded-2xl border border-black/10 bg-white p-7 shadow-sm sm:p-8"
      onSubmit={handleFormSubmit}
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
          <Typeahead
            id="campaign-keywords"
            options={keywords}
            placeholder={keywords.slice(0, 6).join(", ")}
            onInputChange={setKeywordInput}
            onChange={handleTypeaheadSelection}
            onKeyDown={handleKeywordSubmit}
            renderMenu={(results, menuProps) => (
              <Menu
                {...menuProps}
                className={`absolute left-0 right-0 mt-2 w-full rounded-lg border border-black/10 bg-white shadow ${menuProps.className ?? ""}`}
                style={{ ...menuProps.style, zIndex: 50 }}
              >
                {results.map((result, index) => (
                  <MenuItem
                    key={typeof result === "string" ? result : result.label}
                    option={result}
                    position={index}
                    className="block px-3 py-2 text-xs sm:text-sm hover:bg-black/5"
                  >
                    {typeof result === "string" ? result : result.label}
                  </MenuItem>
                ))}
              </Menu>
            )}
            inputProps={{
              className:
                "w-full rounded-lg border border-black/15 px-3 py-2 text-xs sm:text-sm",
              onKeyDown: handleKeywordSubmit
            }}
            className="relative w-full"
            ref={typeaheadRef}
          />
          <button
            type="button"
            className="rounded-lg border border-black/10 bg-black px-3 py-2 text-xs font-semibold text-white transition hover:bg-black/90"
            onClick={handleKeywordChange}
          >
            Add
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
        {keywordsMessage && (
          <span className="text-xs text-red-500">{keywordsMessage}</span>
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
              className={`w-full rounded-lg border border-black/15 px-3 py-2 text-xs sm:text-sm pl-8 ${initialCampaign ? "bg-black/5 text-black/60" : ""}`}
              name="fund"
              min="100"
              max={walletBalance}
              step="50"
              onBlur={handleBlur}
              onChange={handleFundChange}
              required
              disabled={Boolean(initialCampaign)}
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
      <p className="text-sm border-t pt-4 text-black/60 sm:text-base">
        <b>Emeralds balance:</b> {walletBalance} - {fundValue} = {walletBalance - fundValue} 𖢻
      </p>
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
