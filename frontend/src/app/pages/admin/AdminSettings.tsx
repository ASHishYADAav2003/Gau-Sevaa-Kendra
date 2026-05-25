import { useState, useEffect } from 'react';
import { Settings, Save, Building2, Phone, Mail, MapPin, IndianRupee, Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router';
import toast from 'react-hot-toast';
import { SETTINGS_UPDATED_EVENT } from '../../context/SettingsContext';

type SiteSettings = {
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

const SETTINGS_KEY = 'gau_site_settings';

const defaultSettings: SiteSettings = {
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

function loadLocalSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [savedSnapshot, setSavedSnapshot] = useState<string>(JSON.stringify(defaultSettings));

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          const loaded = {
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
          setSettings(loaded);
          setSavedSnapshot(JSON.stringify(loaded));
        } else {
          const local = loadLocalSettings();
          setSettings(local);
          setSavedSnapshot(JSON.stringify(local));
        }
      } catch {
        const local = loadLocalSettings();
        setSettings(local);
        setSavedSnapshot(JSON.stringify(local));
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    setHasUnsavedChanges(JSON.stringify(settings) !== savedSnapshot);
  }, [settings, savedSnapshot]);

  useEffect(() => {
    if (saveStatus !== 'success') return;
    const timer = setTimeout(() => setSaveStatus('idle'), 8000);
    return () => clearTimeout(timer);
  }, [saveStatus]);

  const handleChange = (field: keyof SiteSettings, value: string | number | boolean) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setSaveStatus('idle');
  };

  const markSaved = (saved: SiteSettings, message: string) => {
    const snapshot = JSON.stringify(saved);
    setSettings(saved);
    setSavedSnapshot(snapshot);
    localStorage.setItem(SETTINGS_KEY, snapshot);
    setLastSavedAt(new Date());
    setSaveStatus('success');
    setHasUnsavedChanges(false);
    window.dispatchEvent(new Event(SETTINGS_UPDATED_EVENT));
    toast.success(message, {
      icon: '✓',
      style: { borderRadius: '12px', background: '#E8F5E9', color: '#2E7D32' },
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        const saved = await res.json();
        markSaved(
          {
            organizationName: saved.organizationName,
            tagline: saved.tagline,
            phone: saved.phone,
            email: saved.email,
            address: saved.address,
            whatsapp: saved.whatsapp,
            donationGoal: saved.donationGoal,
            monthlyBudget: saved.monthlyBudget,
            showDonationTicker: saved.showDonationTicker,
            maintenanceMode: saved.maintenanceMode,
            taxExemptionNote: saved.taxExemptionNote,
          },
          'Settings saved! Changes are live on the website.'
        );
      } else {
        throw new Error('Save failed');
      }
    } catch {
      if (navigator.onLine) {
        setSaveStatus('error');
        toast.error('Could not save settings. Is the backend running?');
      } else {
        markSaved(settings, 'Settings saved locally. Start the backend to sync to the server.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const formatSavedTime = (date: Date) =>
    date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  if (isLoading) {
    return (
      <div className="py-16 text-center text-gray-500 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        Loading settings...
      </div>
    );
  }

  return (
    <div className="space-y-6 font-['Inter',sans-serif] max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-7 h-7 text-[#FF6600]" />
            Site Settings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage organization details, contact info, and donation preferences
          </p>
          {lastSavedAt && saveStatus !== 'success' && (
            <p className="text-xs text-gray-400 mt-2">
              Last saved: {formatSavedTime(lastSavedAt)}
            </p>
          )}
        </div>
        {hasUnsavedChanges && saveStatus !== 'success' && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            Unsaved changes
          </span>
        )}
      </div>

      {saveStatus === 'success' && (
        <div
          role="status"
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-lg border border-[#A5D6A7] bg-[#E8F5E9] text-[#2E7D32]"
        >
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[15px]">Settings saved successfully</p>
              <p className="text-sm mt-0.5 opacity-90">
                Your changes are now live on the homepage, header, footer, and donate page.
                {lastSavedAt && <> Saved at {formatSavedTime(lastSavedAt)}.</>}
              </p>
            </div>
          </div>
          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md bg-white border border-[#A5D6A7] text-[#2E7D32] hover:bg-[#C8E6C9] shrink-0"
          >
            <ExternalLink size={16} />
            View website
          </Link>
        </div>
      )}

      {saveStatus === 'error' && (
        <div className="flex items-center gap-3 p-4 rounded-lg border border-red-200 bg-red-50 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">Failed to save settings. Please try again.</p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b pb-3">
            <Building2 size={20} className="text-[#FF6600]" />
            Organization
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
              <input
                type="text"
                value={settings.organizationName}
                onChange={(e) => handleChange('organizationName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF6600] focus:border-[#FF6600]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline (Hindi)</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF6600] focus:border-[#FF6600] font-['Noto_Sans_Devanagari']"
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b pb-3">
            <Phone size={20} className="text-[#FF6600]" />
            Contact Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF6600] focus:border-[#FF6600]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF6600] focus:border-[#FF6600]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
              <input
                type="tel"
                value={settings.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                placeholder="916938574125"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF6600] focus:border-[#FF6600]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <MapPin size={14} /> Address
            </label>
            <textarea
              value={settings.address}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF6600] focus:border-[#FF6600]"
            />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b pb-3">
            <IndianRupee size={20} className="text-[#FF6600]" />
            Donation Settings
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Annual Donation Goal (₹)</label>
              <input
                type="number"
                min={0}
                value={settings.donationGoal}
                onChange={(e) => handleChange('donationGoal', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF6600] focus:border-[#FF6600]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Budget (₹)</label>
              <input
                type="number"
                min={0}
                value={settings.monthlyBudget}
                onChange={(e) => handleChange('monthlyBudget', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF6600] focus:border-[#FF6600]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Exemption Note</label>
            <textarea
              value={settings.taxExemptionNote}
              onChange={(e) => handleChange('taxExemptionNote', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF6600] focus:border-[#FF6600]"
            />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-3">Site Options</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showDonationTicker}
              onChange={(e) => handleChange('showDonationTicker', e.target.checked)}
              className="rounded text-[#FF6600] focus:ring-[#FF6600] w-4 h-4"
            />
            <span className="text-sm text-gray-700">Show live donation ticker on homepage</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
              className="rounded text-[#FF6600] focus:ring-[#FF6600] w-4 h-4"
            />
            <span className="text-sm text-gray-700">Maintenance mode (show notice to visitors)</span>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center px-6 py-3 bg-[#FF6600] text-white rounded-md font-medium hover:bg-[#e65c00] disabled:opacity-70 shadow-sm"
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : saveStatus === 'success' && !hasUnsavedChanges ? (
              <>
                <CheckCircle size={18} className="mr-2" />
                Saved
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Save Settings
              </>
            )}
          </button>
          {saveStatus === 'success' && !hasUnsavedChanges && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2E7D32]">
              <CheckCircle size={16} />
              All changes published
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
