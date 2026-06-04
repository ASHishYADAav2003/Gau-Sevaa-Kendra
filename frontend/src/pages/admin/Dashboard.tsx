import { useEffect, useMemo, useState } from 'react';
import { Banknote, Heart, IndianRupee, Target, Users } from 'lucide-react';
import { dashboardApi } from '../../api/services';
import { getApiErrorMessage } from '../../api/client';
import type { DashboardMetrics } from '../../api/types';
import { formatInr } from '../../utils/format';

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const result = await dashboardApi.metrics();
        setMetrics(result);
      } catch (err) {
        setError(getApiErrorMessage(err, 'Unable to load dashboard metrics.'));
      } finally {
        setIsLoading(false);
      }
    };

    void loadMetrics();
  }, []);

  const totalAnimals = useMemo(
    () => metrics?.animals.reduce((sum, item) => sum + item._count.id, 0) || 0,
    [metrics],
  );
  const monthExpenses = useMemo(
    () => metrics?.expenses.reduce((sum, item) => sum + (item._sum.amountPaise || 0), 0) || 0,
    [metrics],
  );
  const activeCampaigns = metrics?.campaigns.filter((campaign) => campaign.status === 'ACTIVE').length || 0;

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="rounded-lg bg-red-50 border border-red-100 p-4 text-red-700">{error}</div>;
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Animals" value={totalAnimals.toLocaleString('en-IN')} icon={<Heart className="w-5 h-5 text-orange-500 fill-orange-500" />} accent="border-t-orange-400" />
        <MetricCard title="Today's Donations" value={formatInr(metrics?.donations.today._sum.amountPaise || 0)} icon={<IndianRupee className="w-5 h-5 text-green-600" />} accent="border-t-green-500" />
        <MetricCard title="This Month Expenses" value={formatInr(monthExpenses)} icon={<Banknote className="w-5 h-5 text-yellow-600" />} accent="border-t-yellow-400" />
        <MetricCard title="Active Campaigns" value={activeCampaigns.toLocaleString('en-IN')} icon={<Target className="w-5 h-5 text-purple-600" />} accent="border-t-purple-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-800">Campaign Progress</h3>
          </div>
          <div className="p-5 space-y-5">
            {metrics?.campaigns.length === 0 && <p className="text-sm text-gray-500">No campaigns yet.</p>}
            {metrics?.campaigns.slice(0, 6).map((campaign) => {
              const percent = Math.min(100, Math.round((campaign.raisedAmountPaise / Math.max(campaign.targetAmountPaise, 1)) * 100));
              return (
                <div key={campaign.id}>
                  <div className="flex justify-between gap-4 mb-2">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{campaign.titleEn}</p>
                      <p className="text-xs text-gray-500">{campaign.status}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{percent}%</p>
                  </div>
                  <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-orange" style={{ width: `${percent}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{formatInr(campaign.raisedAmountPaise)} of {formatInr(campaign.targetAmountPaise)}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-800">Operational Snapshot</h3>
          </div>
          <div className="p-5 space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Donation Status</h4>
              <div className="grid grid-cols-2 gap-3">
                {metrics?.donations.statusCounts.map((item) => (
                  <div key={item.status} className="rounded-lg border border-gray-100 p-3">
                    <p className="text-xs text-gray-500">{item.status}</p>
                    <p className="text-xl font-bold text-gray-900">{item._count.id}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Animal Status</h4>
              <div className="space-y-2">
                {metrics?.animals.map((item) => (
                  <div key={item.status} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.status.replaceAll('_', ' ')}</span>
                    <span className="font-semibold text-gray-900">{item._count.id}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-green-50 border border-green-100 p-4 flex items-center gap-3">
              <Users className="w-5 h-5 text-green-700" />
              <div>
                <p className="text-sm font-semibold text-green-900">{metrics?.donors.total || 0} donors recorded</p>
                <p className="text-xs text-green-700">{metrics?.donors.repeat || 0} repeat donors</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, accent }: { title: string; value: string; icon: React.ReactNode; accent: string }) {
  return (
    <div className={`bg-white p-5 rounded-xl shadow-sm border-t-4 ${accent} border-x border-b border-gray-100 flex flex-col justify-between h-32`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="bg-gray-50 p-2 rounded-full">{icon}</div>
      </div>
    </div>
  );
}
