export type CampaignStatus = 'active' | 'paused' | 'ended';

export interface Campaign {
    id: number;
    productId: number;
    name: string;
    keywords: string[];
    bidAmount: number;
    fund: number;
    status: CampaignStatus;
    town: string;
    radius: number;

}