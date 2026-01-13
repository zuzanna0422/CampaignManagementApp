import type { Campaign } from "@/models/Campaign";
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
    <div className="space-y-1 text-xs text-black/70 sm:text-sm">
      {campaigns.map((campaign) => (
        <div
          key={campaign.id}
          className="flex items-center gap-2 rounded-md border border-black/10 px-2 py-1">

          <button
            type="button"
            onClick={() => onToggleStatus?.(campaign.id)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                campaign.status === "on"
                ? "bg-green-500 text-white"
                : "bg-black/10 text-black/40"
            }`}
            >
            {campaign.status === "on" ? "On" : "Off"}
            </button>

          <span className="font-semibold text-black">{campaign.name}</span>
          <span>-</span>
          <span>{campaign.bidAmount}$ bid</span>
          <span>/</span>
          <span>{campaign.fund}$ fund</span>
          <span>-</span>
          <span>{campaign.town}</span>
          <span>-</span>
          <span>{campaign.radius}km</span>
          <div className="ml-auto flex gap-4">
            <button type="button"
                    className="text-black/60 hover:text-black sm:text-xs">
                <RiEdit2Line className="h-5 w-5"/>
            </button>
            <button type="button"
                    onClick={() => onDelete?.(campaign.id)} 
                    className="text-black/60 hover:text-black sm:text-xs">
                <RiCloseLine className="h-6 w-6"/>
            </button>
          </div>
        </div>
      ))} 
    </div>
  );
}