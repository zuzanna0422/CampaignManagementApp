'use client';

import Link from "next/link";
import { useState } from "react";
import { mockProducts } from "@/data/mockProducts";
import { mockCampaigns } from "@/data/mockCampaigns";
import CampaignsList from "@/components/CampaignsList";
import type { Campaign } from "@/models/Campaign";

export default function ProductsList() {

  const [campaigns] = useState<Campaign[]>(() => {
    const stored = localStorage.getItem("campaigns");
    if (stored) {
      try {
        return JSON.parse(stored) as Campaign[];
      } catch {
        return mockCampaigns;
      }
    }
    return mockCampaigns;
  });

  return (
    <div className="flex flex-col gap-3">
      {mockProducts.map((product) => {
        const productCampaigns = campaigns.filter(
          (campaign) => campaign.productId === product.id
        );

        return (
          <div
            key={product.id}
            className="flex flex-col gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold sm:text-base lg:text-lg">
                {product.name}
              </span>
              <Link
                href={`/campaigns/new?productId=${product.id}`}
                className="rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 sm:text-sm lg:text-base"
              >
                Add campaign
              </Link>
            </div>
            <CampaignsList campaigns={productCampaigns} />
          </div>
        );
      })}
    </div>
  );
}