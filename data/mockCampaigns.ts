import { Campaign } from "@/models/Campaign";
export const mockCampaigns: Campaign[] = [
    {
        id: 1,
        productId: 1,
        name: 'Summer Sale',
        keywords: ['running', 'shoes', 'summer', 'sale', 'sports'],
        bidAmount: 1.5,
        fund: 100,
        status: 'on',
        town: 'Warsaw',
        radius: 50,
    }
]