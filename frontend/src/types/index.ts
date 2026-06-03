export interface AdminAuth {
  id: string;
  username: string;
  lastLogin?: string;
}

export interface Donor {
  id: string;
  fullName: string;
  phone?: string;
  email?: string;
  panNumber?: string;
  donations?: Donation[];
  createdAt: string;
}

export interface Donation {
  id: string;
  donorId: string;
  campaignId?: string;
  amount: number;
  type: 'GENERAL' | 'CAMPAIGN';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  isAnonymous: boolean;
  taxReceiptRequested: boolean;
  transactionRef?: string;
  createdAt: string;
  
  // Relations (optional for populated queries)
  donor?: Donor;
  campaign?: Campaign;
  receipt?: Receipt;
}

export interface Campaign {
  id: string;
  animalId: string;
  title: string;
  summary: string;
  description?: string;
  targetAmount: number;
  raisedAmount: number;
  primaryImage: string;
  images?: string[];
  startDate: string;
  endDate?: string;
  commentsEnabled: boolean;
  isClosed: boolean;
  
  // Relations
  animal?: Animal;
  updates?: CampaignUpdate[];
  comments?: CampaignComment[];
}

export interface CampaignUpdate {
  id: string;
  campaignId: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface CampaignComment {
  id: string;
  campaignId: string;
  donorId?: string; // Optional if public guests can comment
  authorName: string;
  content: string;
  isApproved: boolean;
  createdAt: string;
}

export interface Animal {
  id: string;
  name: string;
  tagId: string;
  age?: number;
  gender: 'MALE' | 'FEMALE';
  breed?: string;
  healthStatus: 'HEALTHY' | 'UNDER_TREATMENT' | 'CRITICAL';
  rescueDate: string;
  location?: string;
  notes?: string;
  status: 'ACTIVE' | 'ADOPTED' | 'DECEASED';
  images?: string[];
  
  // Relations
  medicalRecords?: AnimalMedicalRecord[];
  linkedCampaign?: Campaign;
}

export interface AnimalMedicalRecord {
  id: string;
  animalId: string;
  date: string;
  treatment: string;
  veterinarian?: string;
  notes?: string;
}

export interface ExpenseLedger {
  id: string;
  date: string;
  amount: number;
  category: string;
  vendor?: string;
  notes?: string;
  receiptUrl?: string;
  linkedAnimalId?: string;
  linkedCampaignId?: string;
}

export interface Receipt {
  id: string;
  donationId: string;
  receiptNumber: string;
  fileUrl: string;
  issuedAt: string;
}

export interface NotificationConfig {
  id: string;
  alertEmail: string;
  enableAlerts: boolean;
  alertThreshold: number;
}

export interface SystemConfig {
  id: string;
  registration80G: string;
  validity80G: string;
  legalDeclaration: string;
}
