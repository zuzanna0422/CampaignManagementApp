import type { Campaign } from "@/models/Campaign";
import Link from "next/link";
import { RiEdit2Line, RiCloseLine } from "react-icons/ri";

type CampaignsListProps = {
  campaigns: Campaign[];
  onToggleStatus?: (campaignId: number) => void;
  onDelete: (campaignId: number) => void;
};

export default function CampaignsList({ campaigns, onToggleStatus, onDelete }: CampaignsListProps) {
  if (campaigns.length === 0) {
    return (
      <span className="text-xs text-black/50 sm:text-sm">No campaigns yet</span>
    );
  }

  return (
    <div className="space-y-1 text-[10px] text-black/70 sm:text-xs">
      {campaigns.map((campaign) => (
        <div
          key={campaign.id}
          className="flex items-center gap-1.5 rounded-md border border-black/10 px-2 py-1 text-[10px] sm:text-xs">

          <button
            type="button"
            onClick={() => onToggleStatus?.(campaign.id)}
            className={`w-7 rounded-full px-1 py-0.5 text-[9px] font-semibold leading-none transition ${
                campaign.status === "on"
                ? "bg-green-500 text-white"
                : "bg-black/10 text-black/40"
            }`}
            >
            {campaign.status === "on" ? "On" : "Off"}
            </button>

          <span className="min-w-0 flex-1 truncate font-semibold text-black">
            {campaign.name}
          </span>
          <span>-</span>
          <span>{campaign.bidAmount}$</span>
          <span>/</span>
          <span>{campaign.fund}$</span>
          <span>-</span>
          <span>{campaign.town}</span>
          <span>-</span>
          <span>{campaign.radius}km</span>

          <div className="ml-auto flex shrink-0 gap-1.5">
            <Link href={`/campaigns/${campaign.id}/edit`}
                  className="text-black/60 hover:text-black sm:text-xs"
                  aria-label={`Edit ${campaign.name} campaign`}
            >
              <RiEdit2Line className="h-3.5 w-3.5"/>
            </Link>

            <button type="button"
                    onClick={() => onDelete?.(campaign.id)} 
                    className="text-black/60 hover:text-black sm:text-xs"
                    aria-label={`Delete ${campaign.name} campaign`}>
              <RiCloseLine className="h-3.5 w-3.5"/>
            </button>
          </div>
        </div>
      ))} 
    </div>
  );
}
