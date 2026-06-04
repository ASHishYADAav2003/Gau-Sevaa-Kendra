import { useEffect, useState } from 'react';
import { Save, ShieldCheck } from 'lucide-react';
import { configApi } from '../../api/services';
import { getApiErrorMessage } from '../../api/client';

export default function AdminSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    orgName: '',
    donationEmailEnabled: true,
    notificationEmail: '',
    thresholdEnabled: false,
    thresholdAmount: '',
    sendAllSuccessfulDonations: true,
    receiptPrefix: 'GSK',
    legal80GNumber: '',
    legal80GValidity: '',
    legal80GText: '',
    termsPageContent: '',
    privacyPageContent: '',
    refundPolicyContent: '',
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [notifications, system] = await Promise.all([
          configApi.getNotifications(),
          configApi.getSystem(),
        ]);

        setFormData({
          orgName: system.orgName || '',
          donationEmailEnabled: Boolean(notifications.donationEmailEnabled),
          notificationEmail: notifications.notificationEmail || '',
          thresholdEnabled: Boolean(notifications.thresholdEnabled),
          thresholdAmount: notifications.thresholdAmountPaise
            ? String(notifications.thresholdAmountPaise / 100)
            : notifications.thresholdAmount
              ? String(notifications.thresholdAmount)
              : '',
          sendAllSuccessfulDonations: Boolean(notifications.sendAllSuccessfulDonations),
          receiptPrefix: system.receiptPrefix || 'GSK',
          legal80GNumber: system.legal80GNumber || '',
          legal80GValidity: system.legal80GValidity || '',
          legal80GText: system.legal80GText || '',
          termsPageContent: system.termsPageContent || '',
          privacyPageContent: system.privacyPageContent || '',
          refundPolicyContent: system.refundPolicyContent || '',
        });
      } catch (err) {
        setError(getApiErrorMessage(err, 'Unable to load settings.'));
      } finally {
        setIsLoading(false);
      }
    };

    void loadSettings();
  }, []);

  const updateField = (field: keyof typeof formData, value: string | boolean) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');
    setMessage('');

    try {
      await Promise.all([
        configApi.updateNotifications({
          donationEmailEnabled: formData.donationEmailEnabled,
          notificationEmail: formData.notificationEmail || null,
          thresholdEnabled: formData.thresholdEnabled,
          thresholdAmount: formData.thresholdAmount ? Number(formData.thresholdAmount) : null,
          sendAllSuccessfulDonations: formData.sendAllSuccessfulDonations,
        }),
        configApi.updateSystem({
          orgName: formData.orgName,
          receiptPrefix: formData.receiptPrefix,
          legal80GNumber: formData.legal80GNumber || null,
          legal80GValidity: formData.legal80GValidity || null,
          legal80GText: formData.legal80GText || null,
          termsPageContent: formData.termsPageContent || null,
          privacyPageContent: formData.privacyPageContent || null,
          refundPolicyContent: formData.refundPolicyContent || null,
        }),
      ]);

      setMessage('Settings saved to backend.');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to save settings.'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h2>

      {message && <div className="rounded-lg bg-green-50 border border-green-100 px-4 py-3 mb-6 text-sm text-green-700">{message}</div>}
      {error && <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 mb-6 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-4">Organization</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
              <input className="input-field" value={formData.orgName} onChange={(event) => updateField('orgName', event.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Prefix</label>
              <input className="input-field" value={formData.receiptPrefix} onChange={(event) => updateField('receiptPrefix', event.target.value)} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4 border-b pb-4">
            <ShieldCheck className="text-brand-green w-5 h-5" />
            <h3 className="text-lg font-bold text-gray-800">Compliance & 80G Receipt Text</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">80G Registration Number</label>
              <input className="input-field" placeholder="Leave blank if pending" value={formData.legal80GNumber} onChange={(event) => updateField('legal80GNumber', event.target.value)} />
              <p className="text-xs text-gray-500 mt-1">Appears on generated tax receipts.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Approval Validity Dates</label>
              <input className="input-field" placeholder="e.g. 01-04-2026 to 31-03-2029" value={formData.legal80GValidity} onChange={(event) => updateField('legal80GValidity', event.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Legal Declaration Text</label>
              <textarea className="input-field h-24" value={formData.legal80GText} onChange={(event) => updateField('legal80GText', event.target.value)} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-4">Donation Alerts</h3>

          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4 text-brand-green rounded" checked={formData.donationEmailEnabled} onChange={(event) => updateField('donationEmailEnabled', event.target.checked)} />
              <span className="text-sm font-medium text-gray-700">Enable email alerts for successful donations</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4 text-brand-green rounded" checked={formData.sendAllSuccessfulDonations} onChange={(event) => updateField('sendAllSuccessfulDonations', event.target.checked)} />
              <span className="text-sm font-medium text-gray-700">Send alert for every successful donation</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4 text-brand-green rounded" checked={formData.thresholdEnabled} onChange={(event) => updateField('thresholdEnabled', event.target.checked)} />
              <span className="text-sm font-medium text-gray-700">Enable threshold alerts</span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alert Email Address</label>
                <input type="email" className="input-field" value={formData.notificationEmail} onChange={(event) => updateField('notificationEmail', event.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alert Threshold (Rs.)</label>
                <input type="number" min="0" className="input-field" value={formData.thresholdAmount} onChange={(event) => updateField('thresholdAmount', event.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-4">Policy Page Content</h3>
          <div className="space-y-5">
            <PolicyField label="Terms Page" value={formData.termsPageContent} onChange={(value) => updateField('termsPageContent', value)} />
            <PolicyField label="Privacy Page" value={formData.privacyPageContent} onChange={(value) => updateField('privacyPageContent', value)} />
            <PolicyField label="Refund Policy Page" value={formData.refundPolicyContent} onChange={(value) => updateField('refundPolicyContent', value)} />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button disabled={isSaving} type="submit" className="bg-brand-green hover:bg-brand-lightGreen text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition disabled:opacity-60">
            <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}

function PolicyField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea className="input-field h-24" value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}
