import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { campaignApi } from '../api/services';
import { getApiErrorMessage } from '../api/client';
import type { Campaign } from '../api/types';
import { formatInr } from '../utils/format';

const progressPercent = (campaign: Campaign) =>
  Math.min(100, Math.round((campaign.raisedAmountPaise / Math.max(campaign.targetAmountPaise, 1)) * 100));

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const result = await campaignApi.listPublic({ pageSize: 50 });
        setCampaigns(result.items);
      } catch (err) {
        setError(getApiErrorMessage(err, 'Unable to load campaigns.'));
      } finally {
        setIsLoading(false);
      }
    };

    void loadCampaigns();
  }, []);

  return (
    <div className="bg-brand-beige min-h-screen py-12">
      <Helmet>
        <title>Active Campaigns | Gau Seva Kendra</title>
        <meta name="description" content="Support active rescue, treatment, and care campaigns at Gau Seva Kendra." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold text-brand-dark mb-3">Active Campaigns</h1>
            <p className="text-brand-dark/70 max-w-2xl">Choose a live campaign and contribute directly to a specific animal or care need.</p>
          </div>
          <Link to="/donate" className="btn-primary inline-flex items-center gap-2 px-5 py-3">
            Donate General Fund <Heart className="w-4 h-4 fill-white" />
          </Link>
        </div>

        {isLoading && <div className="bg-white rounded-xl border border-orange-100 p-8 text-center text-gray-500">Loading campaigns...</div>}
        {error && <div className="bg-red-50 rounded-xl border border-red-100 p-4 text-red-700">{error}</div>}

        {!isLoading && campaigns.length === 0 && !error && (
          <div className="bg-white rounded-xl border border-orange-100 p-8 text-center text-gray-600">
            No active campaigns are available right now. General donations continue supporting daily care.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => {
            const percent = progressPercent(campaign);
            const image = campaign.images?.[0]?.imageUrl || campaign.animal?.images?.[0]?.imageUrl || '/hero-cow-calf.png';

            return (
              <article key={campaign.id} className="bg-white rounded-xl border border-orange-100 shadow-sm overflow-hidden flex flex-col">
                <img src={image} alt={campaign.titleEn} className="h-56 w-full object-cover" />
                <div className="p-5 flex-1 flex flex-col">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{campaign.titleEn}</h2>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-5">{campaign.shortSummaryEn}</p>

                  <div className="mb-5">
                    <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                      <span>{formatInr(campaign.raisedAmountPaise)}</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-orange-100 overflow-hidden">
                      <div className="h-full bg-brand-orange" style={{ width: `${percent}%` }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Goal: {formatInr(campaign.targetAmountPaise)}</p>
                  </div>

                  <div className="mt-auto flex gap-3">
                    <Link to={`/campaigns/${campaign.slug}`} className="flex-1 inline-flex justify-center items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                      View Details <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link to={`/donate?campaign=${campaign.id}`} className="flex-1 inline-flex justify-center items-center rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700">
                      Donate
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
