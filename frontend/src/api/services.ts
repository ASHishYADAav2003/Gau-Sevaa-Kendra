import { apiClient } from './client';
import type {
  AdminUser,
  Animal,
  Campaign,
  CampaignComment,
  DashboardMetrics,
  Donation,
  DonationStatus,
  DonationType,
  Expense,
  ExpenseCategory,
  NotificationConfig,
  PaginatedResponse,
  SystemConfig,
} from './types';

export const authApi = {
  login: async (payload: { username: string; password: string }) => {
    const { data } = await apiClient.post<{ message: string; admin: AdminUser }>('/auth/login', payload);
    return data;
  },
  me: async () => {
    const { data } = await apiClient.get<{ admin: AdminUser }>('/auth/me');
    return data.admin;
  },
  logout: async () => {
    const { data } = await apiClient.post<{ message: string }>('/auth/logout');
    return data;
  },
};

export const publicApi = {
  siteConfig: async () => {
    const { data } = await apiClient.get<SystemConfig>('/site/config');
    return data;
  },
};

export const donationApi = {
  createOrder: async (payload: {
    donationType: DonationType;
    campaignId?: string;
    amount: number;
    currency: 'INR';
    donor: {
      fullName: string;
      phone?: string;
      email?: string;
      isAnonymousPublic: boolean;
    };
    taxReceiptRequested: boolean;
  }) => {
    const { data } = await apiClient.post<{
      donationId: string;
      razorpayOrderId: string;
      amountPaise: number;
      currency: string;
      keyId: string;
      redirectedToGeneral: boolean;
    }>('/donations/create-order', payload);
    return data;
  },
  verify: async (payload: {
    donationId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) => {
    const { data } = await apiClient.post<{ verified: boolean; status: DonationStatus; message: string }>(
      '/donations/verify',
      payload,
    );
    return data;
  },
  publicStatus: async (donationId: string) => {
    const { data } = await apiClient.get<{
      id: string;
      status: DonationStatus;
      amountPaise: number;
      receiptNumber: string | null;
      receiptDownloadToken: string | null;
    }>(`/donations/${donationId}/public-status`);
    return data;
  },
};

export const campaignApi = {
  listPublic: async (params?: { page?: number; pageSize?: number }) => {
    const { data } = await apiClient.get<PaginatedResponse<Campaign>>('/campaigns', { params });
    return data;
  },
  getPublic: async (slug: string) => {
    const { data } = await apiClient.get<Campaign>(`/campaigns/${slug}`);
    return data;
  },
  postComment: async (
    campaignId: string,
    payload: { donorName: string; donorPhone?: string; donorEmail?: string; commentText: string },
  ) => {
    const { data } = await apiClient.post<CampaignComment>(`/campaigns/${campaignId}/comments`, payload);
    return data;
  },
  listAdmin: async (params?: { page?: number; pageSize?: number; status?: string }) => {
    const { data } = await apiClient.get<PaginatedResponse<Campaign>>('/admin/campaigns', { params });
    return data;
  },
  create: async (payload: {
    animalId?: string | null;
    titleEn: string;
    shortSummaryEn: string;
    fullStoryEn?: string | null;
    targetAmount: number;
    status?: string;
    isFeatured?: boolean;
    commentsEnabled?: boolean;
    autoCloseOnGoal?: boolean;
  }) => {
    const { data } = await apiClient.post<Campaign>('/admin/campaigns', payload);
    return data;
  },
  update: async (id: string, payload: Partial<{
    animalId: string | null;
    titleEn: string;
    shortSummaryEn: string;
    fullStoryEn: string | null;
    targetAmount: number;
    status: string;
    isFeatured: boolean;
    commentsEnabled: boolean;
    autoCloseOnGoal: boolean;
  }>) => {
    const { data } = await apiClient.put<Campaign>(`/admin/campaigns/${id}`, payload);
    return data;
  },
  updateStatus: async (id: string, status: string) => {
    const { data } = await apiClient.patch<Campaign>(`/admin/campaigns/${id}/status`, { status });
    return data;
  },
};

export const adminDonationApi = {
  list: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: DonationStatus;
    type?: DonationType;
    campaignId?: string;
  }) => {
    const { data } = await apiClient.get<PaginatedResponse<Donation> & { summary: { totalAmountPaise: number } }>(
      '/admin/donations',
      { params },
    );
    return data;
  },
  export: async () => {
    const { data } = await apiClient.get<Blob>('/admin/donations/export', { responseType: 'blob' });
    return data;
  },
};

export const animalApi = {
  listPublic: async (params?: { page?: number; pageSize?: number; status?: string }) => {
    const { data } = await apiClient.get<PaginatedResponse<Animal>>('/animals', { params });
    return data;
  },
  listAdmin: async (params?: { page?: number; pageSize?: number; status?: string; breed?: string; healthStatus?: string }) => {
    const { data } = await apiClient.get<PaginatedResponse<Animal>>('/admin/animals', { params });
    return data;
  },
  getAdmin: async (id: string) => {
    const { data } = await apiClient.get<Animal>(`/admin/animals/${id}`);
    return data;
  },
  create: async (payload: {
    tagId: string;
    name: string;
    ageMonths?: number | null;
    gender?: string | null;
    breed?: string | null;
    healthStatus?: string | null;
    rescueDate?: string | null;
    shedLocation?: string | null;
    notes?: string | null;
    status?: string;
  }) => {
    const { data } = await apiClient.post<Animal>('/admin/animals', payload);
    return data;
  },
  update: async (id: string, payload: Partial<Animal>) => {
    const { data } = await apiClient.put<Animal>(`/admin/animals/${id}`, payload);
    return data;
  },
  delete: async (id: string) => {
    const { data } = await apiClient.delete<{ message: string }>(`/admin/animals/${id}`);
    return data;
  },
  uploadImages: async (id: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    const { data } = await apiClient.post(`/admin/animals/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  export: async () => {
    const { data } = await apiClient.get<Blob>('/admin/animals/export', { responseType: 'blob' });
    return data;
  },
};

export const expenseApi = {
  list: async (params?: { page?: number; pageSize?: number; category?: ExpenseCategory; search?: string }) => {
    const { data } = await apiClient.get<PaginatedResponse<Expense> & { summary?: { totalAmountPaise: number } }>(
      '/admin/expenses',
      { params },
    );
    return data;
  },
  create: async (payload: {
    expenseDate: string;
    amount: number;
    category: ExpenseCategory;
    vendorName?: string | null;
    notes?: string | null;
    attachmentUrl?: string | null;
    animalId?: string | null;
    campaignId?: string | null;
  }) => {
    const { data } = await apiClient.post<Expense>('/admin/expenses', payload);
    return data;
  },
  update: async (id: string, payload: Partial<{
    expenseDate: string;
    amount: number;
    category: ExpenseCategory;
    vendorName: string | null;
    notes: string | null;
    attachmentUrl: string | null;
    animalId: string | null;
    campaignId: string | null;
  }>) => {
    const { data } = await apiClient.put<Expense>(`/admin/expenses/${id}`, payload);
    return data;
  },
  delete: async (id: string) => {
    const { data } = await apiClient.delete<{ message: string }>(`/admin/expenses/${id}`);
    return data;
  },
  export: async () => {
    const { data } = await apiClient.get<Blob>('/admin/expenses/export', { responseType: 'blob' });
    return data;
  },
};

export const dashboardApi = {
  metrics: async () => {
    const { data } = await apiClient.get<DashboardMetrics>('/admin/dashboard');
    return data;
  },
};

export const configApi = {
  getNotifications: async () => {
    const { data } = await apiClient.get<NotificationConfig>('/admin/config/notifications');
    return data;
  },
  updateNotifications: async (payload: {
    donationEmailEnabled?: boolean;
    notificationEmail?: string | null;
    thresholdEnabled?: boolean;
    thresholdAmount?: number | null;
    sendAllSuccessfulDonations?: boolean;
  }) => {
    const { data } = await apiClient.put<NotificationConfig>('/admin/config/notifications', payload);
    return data;
  },
  getSystem: async () => {
    const { data } = await apiClient.get<SystemConfig>('/admin/config/system');
    return data;
  },
  updateSystem: async (payload: Partial<SystemConfig>) => {
    const { data } = await apiClient.put<SystemConfig>('/admin/config/system', payload);
    return data;
  },
};
