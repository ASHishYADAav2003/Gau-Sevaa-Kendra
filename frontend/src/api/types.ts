export type DonationType = 'GENERAL' | 'CAMPAIGN';
export type DonationStatus = 'CREATED' | 'ATTEMPTED' | 'PAID' | 'FAILED';
export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED';
export type AnimalStatus = 'ACTIVE' | 'ADOPTED' | 'DECEASED' | 'UNDER_TREATMENT';
export type ExpenseCategory =
  | 'FODDER'
  | 'MEDICINE'
  | 'STAFF'
  | 'TRANSPORT'
  | 'MAINTENANCE'
  | 'UTILITIES'
  | 'INFRASTRUCTURE'
  | 'OTHER';

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}

export interface AdminUser {
  id: string;
  username: string;
}

export interface Donor {
  id: string;
  fullName: string;
  phone?: string | null;
  email?: string | null;
  isAnonymousPublic?: boolean;
}

export interface AnimalImage {
  id: string;
  imageUrl: string;
  sortOrder?: number;
}

export interface Animal {
  id: string;
  tagId: string;
  name: string;
  ageMonths?: number | null;
  gender?: string | null;
  breed?: string | null;
  healthStatus?: string | null;
  rescueDate?: string | null;
  shedLocation?: string | null;
  notes?: string | null;
  status: AnimalStatus;
  images?: AnimalImage[];
  createdAt?: string;
}

export interface CampaignImage {
  id: string;
  imageUrl: string;
  sortOrder?: number;
}

export interface CampaignUpdate {
  id: string;
  titleEn: string;
  titleHi?: string | null;
  bodyEn: string;
  bodyHi?: string | null;
  imageUrl?: string | null;
  publishedAt?: string;
}

export interface CampaignComment {
  id: string;
  donorName: string;
  donorPhone?: string | null;
  donorEmail?: string | null;
  commentText: string;
  isApproved: boolean;
  isHidden: boolean;
  createdAt: string;
}

export interface Campaign {
  id: string;
  animalId?: string | null;
  slug: string;
  titleEn: string;
  titleHi?: string | null;
  shortSummaryEn: string;
  shortSummaryHi?: string | null;
  fullStoryEn?: string | null;
  fullStoryHi?: string | null;
  targetAmountPaise: number;
  raisedAmountPaise: number;
  status: CampaignStatus;
  isFeatured: boolean;
  startDate?: string | null;
  endDate?: string | null;
  commentsEnabled: boolean;
  autoCloseOnGoal: boolean;
  images?: CampaignImage[];
  animal?: Animal | null;
  updates?: CampaignUpdate[];
  comments?: CampaignComment[];
  _count?: {
    donations?: number;
    comments?: number;
    updates?: number;
  };
}

export interface Donation {
  id: string;
  donorId: string;
  campaignId?: string | null;
  donationType: DonationType;
  amountPaise: number;
  currency: string;
  status: DonationStatus;
  taxReceiptRequested: boolean;
  isAnonymousPublic: boolean;
  donorDisplayName?: string | null;
  paymentMethod?: string | null;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  receiptNumber?: string | null;
  createdAt: string;
  donor?: Donor;
  campaign?: Campaign | null;
  receipt?: {
    id: string;
    receiptNumber: string;
  } | null;
}

export interface Expense {
  id: string;
  expenseDate: string;
  amountPaise: number;
  category: ExpenseCategory;
  vendorName?: string | null;
  notes?: string | null;
  attachmentUrl?: string | null;
  animalId?: string | null;
  campaignId?: string | null;
  animal?: Animal | null;
  campaign?: Campaign | null;
  createdAt?: string;
}

export interface NotificationConfig {
  donationEmailEnabled: boolean;
  notificationEmail?: string | null;
  thresholdEnabled: boolean;
  thresholdAmountPaise?: number | null;
  thresholdAmount?: number | null;
  sendAllSuccessfulDonations: boolean;
}

export interface SystemConfig {
  orgName: string;
  defaultLanguage: string;
  supportedLanguages: string;
  commentsDefaultEnabled: boolean;
  receiptPrefix: string;
  legal80GText?: string | null;
  legal80GNumber?: string | null;
  legal80GValidity?: string | null;
  termsPageContent?: string | null;
  privacyPageContent?: string | null;
  refundPolicyContent?: string | null;
}

export interface DashboardMetrics {
  donations: {
    today: { _sum: { amountPaise?: number | null }; _count: { id: number } };
    month: { _sum: { amountPaise?: number | null }; _count: { id: number } };
    year: { _sum: { amountPaise?: number | null }; _count: { id: number } };
    statusCounts: Array<{ status: DonationStatus; _count: { id: number } }>;
  };
  campaigns: Campaign[];
  expenses: Array<{ category: ExpenseCategory; _sum: { amountPaise?: number | null } }>;
  animals: Array<{ status: AnimalStatus; _count: { id: number } }>;
  donors: { total: number; new: number; repeat: number };
}
