"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Campaign, CampaignStatus } from "@/models/Campaign";
import { mockCampaigns } from "@/data/mockCampaigns";
import CampaignForm from "@/components/CampaignForm";

export default function EditCampaignPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = Number(params?.id ?? "");

  const campaign = useMemo(() => {
    if (typeof window === "undefined") {
      return mockCampaigns.find((c) => c.id === campaignId) ?? null;
    }

    const stored = localStorage.getItem("campaigns");
    const campaigns = stored
      ? (JSON.parse(stored) as Campaign[])
      : mockCampaigns;

    return campaigns.find((c) => c.id === campaignId) ?? null;
  }, [campaignId]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!campaign) return;

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

    const keywordsValue = String(formData.get("keywords"));
    const updated: Campaign = {
      id: campaign.id,
      productId: Number(formData.get("productId") ?? "0"),
      name: String(formData.get("name") ?? ""),
      keywords: keywordsValue
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
      bidAmount: Number(formData.get("bidAmount") ?? "0"),
      fund: Number(formData.get("fund") ?? "0"),
      status: (formData.get("status") ?? "on") as CampaignStatus,
      town: String(formData.get("town") ?? ""),
      radius: Number(formData.get("radius") ?? "0"),
    };

    const next = campaigns.map((c) => (c.id === campaign.id ? updated : c));
    localStorage.setItem("campaigns", JSON.stringify(next));
    router.push("/products");
  };

  if (!campaign) {
    return (
      <div className="min-h-screen bg-white px-8 py-10 text-black sm:px-6 sm:py-12">
        <div className="mx-auto w-full max-w-3xl">
          <p className="text-sm text-black/70">Campaign not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-8 py-10 text-black sm:px-6 sm:py-12">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
            Edit campaign
          </h1>
          <p className="text-[11px] text-black/70 sm:text-sm lg:text-base">
            Update campaign details.
          </p>
        </header>

        <CampaignForm
          productId={campaign.productId}
          initialCampaign={campaign}
          submitLabel="Save changes"
          onSubmit={handleSubmit}
          secondaryLabel="Discard changes"
          onSecondary={() => router.push("/products")}
        />
      </div>
    </div>
  );
}