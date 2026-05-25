import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export type SiteSettings = {
  organizationName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  donationGoal: number;
  monthlyBudget: number;
  showDonationTicker: boolean;
  maintenanceMode: boolean;
  taxExemptionNote: string;
};

export const defaultSiteSettings: SiteSettings = {
  organizationName: 'Gau Seva Kendra',
  tagline: 'गौ सेवा केंद्र',
  phone: '+91 6938574125',
  email: 'Gauseva@gmail.com',
  address: 'Village Rampur, District Mathura, Uttar Pradesh - 281001',
  whatsapp: '916938574125',
  donationGoal: 1000000,
  monthlyBudget: 850000,
  showDonationTicker: true,
  maintenanceMode: false,
  taxExemptionNote: 'Donations eligible for 50% tax exemption under Section 80G',
};

const SETTINGS_KEY = 'gau_site_settings';
export const SETTINGS_UPDATED_EVENT = 'gau-settings-updated';

function loadCachedSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaultSiteSettings, ...JSON.parse(raw) } : defaultSiteSettings;
  } catch {
    return defaultSiteSettings;
  }
}

export function phoneToTel(phone: string) {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('91') ? `+${digits}` : `+91${digits}`;
}

export function whatsappLink(whatsapp: string) {
  const digits = whatsapp.replace(/\D/g, '');
  return `https://wa.me/${digits}`;
}

type SettingsContextType = {
  settings: SiteSettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(loadCachedSettings);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        const merged: SiteSettings = {
          organizationName: data.organizationName,
          tagline: data.tagline,
          phone: data.phone,
          email: data.email,
          address: data.address,
          whatsapp: data.whatsapp,
          donationGoal: data.donationGoal,
          monthlyBudget: data.monthlyBudget,
          showDonationTicker: data.showDonationTicker,
          maintenanceMode: data.maintenanceMode,
          taxExemptionNote: data.taxExemptionNote,
        };
        setSettings(merged);
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
      }
    } catch {
      setSettings(loadCachedSettings());
    }
  }, []);

  useEffect(() => {
    refreshSettings().finally(() => setIsLoading(false));

    const onUpdate = () => {
      setSettings(loadCachedSettings());
      refreshSettings();
    };

    window.addEventListener(SETTINGS_UPDATED_EVENT, onUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === SETTINGS_KEY) onUpdate();
    });

    return () => window.removeEventListener(SETTINGS_UPDATED_EVENT, onUpdate);
  }, [refreshSettings]);

  return (
    <SettingsContext.Provider value={{ settings, isLoading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    return { settings: defaultSiteSettings, isLoading: false, refreshSettings: async () => {} };
  }
  return context;
}
