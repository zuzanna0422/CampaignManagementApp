import type { Campaign } from "@/models/Campaign";

type CampaignsListProps = {
  campaigns: Campaign[];
};

export default function CampaignsList({ campaigns }: CampaignsListProps) {
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
          className="flex items-center gap-2 rounded-md border border-black/10 px-2 py-1"
        >
          <span className="font-semibold text-black">{campaign.name}</span>
          <span>-</span>
          <span>{campaign.status}</span>
          <span>-</span>
          <span>{campaign.town}</span>
        </div>
      ))} 
    </div>
  );
}