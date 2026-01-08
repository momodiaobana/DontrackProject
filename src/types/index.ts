export enum AssociationStatus {
  Pending = 0,
  Verified = 1,
  Suspended = 2,
  Rejected = 3,
}

export enum CampaignStatus {
  Active = 0,
  Paused = 1,
  Completed = 2,
  Cancelled = 3,
}

export interface Association {
  id: bigint;
  wallet: `0x${string}`;
  name: string;
  description: string;
  metadata: string;
  status: AssociationStatus;
  registeredAt: bigint;
  totalReceived: bigint;
  totalWithdrawn: bigint;
}

export interface Campaign {
  id: bigint;
  associationId: bigint;
  title: string;
  description: string;
  metadata: string;
  goal: bigint;
  raised: bigint;
  startDate: bigint;
  endDate: bigint;
  status: CampaignStatus;
}

export interface Donation {
  id: bigint;
  campaignId: bigint;
  donor: `0x${string}`;
  amount: bigint;
  timestamp: bigint;
  message: string;
}

export interface Expense {
  id: bigint;
  campaignId: bigint;
  amount: bigint;
  description: string;
  proofHash: string;
  timestamp: bigint;
}

export interface GlobalStats {
    totalAssociations: bigint;
    totalCampaigns: bigint;
    totalDonations: bigint;
    totalRaisedAmount: bigint;
    commissionsCollected: bigint;
}
