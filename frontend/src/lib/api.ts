const API_BASE = import.meta.env.VITE_API_URL || '';

export type RecentDonation = {
  id: string;
  name: string;
  amount: number;
  time: string;
  date?: string;
};

export type HomeStats = {
  animalsRescued: number;
  activeDonors: number;
  monthlyExpenses: number;
  treatmentsDone: number;
  volunteerCount: number;
};

export type DonationPayload = {
  donorName: string;
  email: string;
  phone: string;
  panCard?: string;
  amount: number;
  paymentMethod: string;
  isRecurring: boolean;
};

export type VolunteerPayload = {
  name: string;
  email: string;
  mobile: string;
  city: string;
  age: string;
  availability: string[];
  interests: string[];
  message?: string;
};

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

// --- localStorage fallbacks when backend is offline ---
const DONATIONS_KEY = 'gau_donations';
const VOLUNTEERS_KEY = 'gau_volunteers';

function loadLocal<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocal<T>(key: string, item: T) {
  const existing = loadLocal<T>(key);
  localStorage.setItem(key, JSON.stringify([item, ...existing]));
}

function formatTimeAgo(date: string | Date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

const defaultDonations: RecentDonation[] = [
  { id: '1', name: 'Rajesh Kumar', amount: 5000, time: '2 hours ago' },
  { id: '2', name: 'Priya Sharma', amount: 2000, time: '4 hours ago' },
  { id: '3', name: 'Anonymous', amount: 10000, time: '6 hours ago' },
  { id: '4', name: 'Amit Patel', amount: 3000, time: '8 hours ago' },
];

export async function getRecentDonations(limit = 5): Promise<RecentDonation[]> {
  try {
    return await apiFetch<RecentDonation[]>(`/api/donations/recent?limit=${limit}`);
  } catch {
    const local = loadLocal<{ id: string; donorName?: string; name?: string; amount: number; date: string }>(
      DONATIONS_KEY
    );
    if (local.length === 0) return defaultDonations;
    return local.slice(0, limit).map((d) => ({
      id: d.id,
      name: d.name || d.donorName || 'Anonymous',
      amount: d.amount,
      time: formatTimeAgo(d.date),
    }));
  }
}

export async function submitDonation(payload: DonationPayload) {
  try {
    return await apiFetch('/api/donations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch {
    const record = {
      id: String(Date.now()),
      donorName: payload.donorName,
      name: payload.donorName,
      email: payload.email,
      phone: payload.phone,
      amount: payload.amount,
      paymentMethod: payload.paymentMethod,
      isRecurring: payload.isRecurring,
      date: new Date().toISOString(),
    };
    saveLocal(DONATIONS_KEY, record);
    return { message: 'Donation saved locally', donation: record };
  }
}

export async function submitVolunteer(payload: VolunteerPayload) {
  try {
    return await apiFetch('/api/volunteers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch {
    const record = { id: String(Date.now()), ...payload, date: new Date().toISOString() };
    saveLocal(VOLUNTEERS_KEY, record);
    return { message: 'Volunteer application saved locally', volunteer: record };
  }
}

export async function getHomeStats(): Promise<HomeStats> {
  try {
    return await apiFetch<HomeStats>('/api/stats');
  } catch {
    const donations = loadLocal<{ amount: number }>(DONATIONS_KEY);
    const volunteers = loadLocal(VOLUNTEERS_KEY);
    const total = donations.reduce((s, d) => s + d.amount, 0);
    return {
      animalsRescued: 2500,
      activeDonors: 5000 + donations.length,
      monthlyExpenses: total || 850000,
      treatmentsDone: 15000,
      volunteerCount: volunteers.length,
    };
  }
}

export async function getFeaturedAnimals(limit = 3) {
  try {
    const animals = await apiFetch<
      Array<{
        id: string;
        name: string;
        image: string;
        age: string;
        story: string;
        monthlyExpense: number;
      }>
    >('/api/animals');
    return animals.slice(0, limit).map((a) => ({
      id: a.id,
      name: a.name,
      image: a.image,
      age: a.age,
      story: a.story,
      monthlyExpense: a.monthlyExpense,
    }));
  } catch {
    return null;
  }
}
