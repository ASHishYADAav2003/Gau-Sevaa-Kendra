import { useEffect, useState } from 'react';
import { Plus, Search, Star, Target } from 'lucide-react';
import { campaignApi, animalApi } from '../../api/services';
import { getApiErrorMessage } from '../../api/client';
import type { Animal, Campaign } from '../../api/types';
import { formatInr } from '../../utils/format';

const campaignStatuses = ['DRAFT', 'ACTIVE', 'CLOSED', 'ARCHIVED'];

const progressPercent = (campaign: Campaign) =>
  Math.min(100, Math.round((campaign.raisedAmountPaise / Math.max(campaign.targetAmountPaise, 1)) * 100));

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    titleEn: '',
    shortSummaryEn: '',
    fullStoryEn: '',
    targetAmount: '',
    animalId: '',
    status: 'DRAFT',
    isFeatured: false,
    commentsEnabled: true,
    autoCloseOnGoal: true,
  });

  const loadCampaigns = async () => {
    setIsLoading(true);
    try {
      const [campaignResult, animalResult] = await Promise.all([
        campaignApi.listAdmin({ pageSize: 100, status: statusFilter || undefined }),
        animalApi.listAdmin({ pageSize: 100 }),
      ]);
      setCampaigns(campaignResult.items);
      setAnimals(animalResult.items);
    } catch (err) {
      setMessage(getApiErrorMessage(err, 'Unable to load campaign data.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadCampaigns();
  }, [statusFilter]);

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.shortSummaryEn.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');

    try {
      await campaignApi.create({
        titleEn: formData.titleEn,
        shortSummaryEn: formData.shortSummaryEn,
        fullStoryEn: formData.fullStoryEn || null,
        targetAmount: Number(formData.targetAmount),
        animalId: formData.animalId || null,
        status: formData.status,
        isFeatured: formData.isFeatured,
        commentsEnabled: formData.commentsEnabled,
        autoCloseOnGoal: formData.autoCloseOnGoal,
      });
      setFormData({
        titleEn: '',
        shortSummaryEn: '',
        fullStoryEn: '',
        targetAmount: '',
        animalId: '',
        status: 'DRAFT',
        isFeatured: false,
        commentsEnabled: true,
        autoCloseOnGoal: true,
      });
      setIsFormOpen(false);
      setMessage('Campaign saved.');
      await loadCampaigns();
    } catch (err) {
      setMessage(getApiErrorMessage(err, 'Unable to save campaign.'));
    }
  };

  const updateStatus = async (campaignId: string, status: string) => {
    try {
      await campaignApi.updateStatus(campaignId, status);
      await loadCampaigns();
    } catch (err) {
      setMessage(getApiErrorMessage(err, 'Unable to update status.'));
    }
  };

  const toggleFeatured = async (campaign: Campaign) => {
    try {
      await campaignApi.update(campaign.id, { isFeatured: !campaign.isFeatured });
      await loadCampaigns();
    } catch (err) {
      setMessage(getApiErrorMessage(err, 'Unable to update featured campaign.'));
    }
  };

  return (
    <div className="max-w-[1400px] space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Target className="w-6 h-6 text-brand-orange" /> Campaigns
          </h2>
          <p className="text-sm text-gray-500 mt-1">Create campaigns, link animals, and publish them for donors.</p>
        </div>
        <button onClick={() => setIsFormOpen((open) => !open)} className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-700 transition text-sm font-medium shadow-sm">
          <Plus className="w-4 h-4" /> {isFormOpen ? 'Close Form' : 'New Campaign'}
        </button>
      </div>

      {message && <div className="rounded-lg bg-orange-50 border border-orange-100 px-4 py-3 text-sm text-orange-800">{message}</div>}

      {isFormOpen && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title *</label>
              <input required className="input-field" value={formData.titleEn} onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount *</label>
              <input required type="number" min="1" className="input-field" value={formData.targetAmount} onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Linked Animal</label>
              <select className="input-field" value={formData.animalId} onChange={(e) => setFormData({ ...formData, animalId: e.target.value })}>
                <option value="">No animal linked</option>
                {animals.map((animal) => (
                  <option key={animal.id} value={animal.id}>{animal.name} ({animal.tagId})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Initial Status</label>
              <select className="input-field" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                {campaignStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Summary *</label>
            <textarea required className="input-field min-h-24" value={formData.shortSummaryEn} onChange={(e) => setFormData({ ...formData, shortSummaryEn: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Story</label>
            <textarea className="input-field min-h-32" value={formData.fullStoryEn} onChange={(e) => setFormData({ ...formData, fullStoryEn: e.target.value })} />
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input type="checkbox" checked={formData.commentsEnabled} onChange={(e) => setFormData({ ...formData, commentsEnabled: e.target.checked })} />
              Comments enabled
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input type="checkbox" checked={formData.autoCloseOnGoal} onChange={(e) => setFormData({ ...formData, autoCloseOnGoal: e.target.checked })} />
              Auto close on goal
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} />
              Feature on landing page
            </label>
          </div>

          <div className="flex justify-end">
            <button className="bg-brand-green hover:bg-brand-lightGreen text-white px-5 py-2.5 rounded-lg text-sm font-medium">Save Campaign</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green" placeholder="Search campaigns..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            {campaignStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-semibold text-gray-400 tracking-wider uppercase">
                <th className="px-6 py-4">Campaign</th>
                <th className="px-6 py-4">Animal</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4">Featured</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading campaigns...</td></tr>
              ) : filteredCampaigns.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No campaigns found.</td></tr>
              ) : filteredCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-5">
                    <p className="font-semibold text-gray-900">{campaign.titleEn}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{campaign.shortSummaryEn}</p>
                  </td>
                  <td className="px-6 py-5 text-gray-600">{campaign.animal ? `${campaign.animal.name} (${campaign.animal.tagId})` : '-'}</td>
                  <td className="px-6 py-5">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>{formatInr(campaign.raisedAmountPaise)}</span>
                      <span>{formatInr(campaign.targetAmountPaise)}</span>
                    </div>
                    <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-orange" style={{ width: `${progressPercent(campaign)}%` }} />
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <button
                      onClick={() => void toggleFeatured(campaign)}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition ${
                        campaign.isFeatured ? 'bg-orange-50 text-orange-700' : 'bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-700'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${campaign.isFeatured ? 'fill-orange-500 text-orange-500' : ''}`} />
                      {campaign.isFeatured ? 'Featured' : 'Feature'}
                    </button>
                  </td>
                  <td className="px-6 py-5">
                    <select className="text-xs border border-gray-200 rounded px-2 py-1 bg-white" value={campaign.status} onChange={(e) => void updateStatus(campaign.id, e.target.value)}>
                      {campaignStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-5 text-gray-600">{campaign._count?.comments || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
