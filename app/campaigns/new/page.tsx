"use client";

import { useSearchParams } from "next/navigation";
import type { Campaign, CampaignStatus } from "@/models/Campaign";
import { mockCampaigns } from "@/data/mockCampaigns";
import { mockUser } from "@/data/mockUser";
import { useRouter } from "next/navigation";
import CampaignForm from "@/components/CampaignForm";
import AccountDetails from "@/components/AccountDetails";

export default function NewCampaignPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = Number(searchParams.get("productId") ?? "");

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
    const storedWallet = Number(
      localStorage.getItem("walletBalance") ?? mockUser[0].walletBalance
    );
    const nextWallet = storedWallet - newCampaign.fund;
    localStorage.setItem("walletBalance", String(nextWallet));
    router.push("/products");
  };

  return (
    <div className="min-h-screen bg-white px-1 py-10 text-black sm:px-6 sm:py-12">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
            New campaign
          </h1>
          <p className="text-[11px] text-black/70 sm:text-sm lg:text-base">
            Fill in the campaign details for the selected product.
          </p>
        </header>

        <CampaignForm
          productId={productId}
          submitLabel="Create"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
