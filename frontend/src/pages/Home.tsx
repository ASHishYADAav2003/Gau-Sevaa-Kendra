import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Heart, Home as HomeIcon, IndianRupee, ShieldCheck, Stethoscope, Target, Users } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Reveal from '../components/Reveal';
import { animalApi, campaignApi, publicApi } from '../api/services';
import { getApiErrorMessage } from '../api/client';
import type { Animal, Campaign } from '../api/types';
import { formatDate, formatInr } from '../utils/format';

const progressPercent = (campaign: Campaign) =>
  Math.min(100, Math.round((campaign.raisedAmountPaise / Math.max(campaign.targetAmountPaise, 1)) * 100));

const campaignImage = (campaign: Campaign) =>
  campaign.images?.[0]?.imageUrl || campaign.animal?.images?.[0]?.imageUrl || '/hero-cow-calf.png';

const animalImage = (animal: Animal) => animal.images?.[0]?.imageUrl || '/logo.jpeg';

export default function HomePage() {
  const [orgName, setOrgName] = useState('Gau Seva Kendra');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadLandingData = async () => {
      try {
        const [siteConfig, campaignResult, animalResult] = await Promise.all([
          publicApi.siteConfig().catch(() => null),
          campaignApi.listPublic({ pageSize: 6 }),
          animalApi.listPublic({ pageSize: 6 }),
        ]);

        if (siteConfig?.orgName) setOrgName(siteConfig.orgName);
        setCampaigns(campaignResult.items);
        setAnimals(animalResult.items);
      } catch (err) {
        setError(getApiErrorMessage(err, 'Unable to load current sanctuary data.'));
      }
    };

    void loadLandingData();
  }, []);

  const featuredCampaign = useMemo(
    () => campaigns.find((campaign) => campaign.isFeatured) || campaigns[0] || null,
    [campaigns],
  );

  const totalRaisedPaise = useMemo(
    () => campaigns.reduce((sum, campaign) => sum + campaign.raisedAmountPaise, 0),
    [campaigns],
  );

  return (
    <div className="bg-brand-beige text-brand-dark">
      <Helmet>
        <title>{orgName} | Cow Rescue, Care and Donation Platform</title>
        <meta name="description" content={`Support active rescue and care campaigns at ${orgName}. Donate securely and follow transparent campaign progress.`} />
      </Helmet>

      <section className="relative min-h-[680px] flex items-center overflow-hidden">
        <img src="/hero-cow-calf.png" alt="Cow and calf at the sanctuary" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-3xl">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-orange-100 ring-1 ring-white/20">
                <ShieldCheck className="w-4 h-4" /> Transparent donation and care management
              </span>
              <h1 className="mt-6 text-4xl md:text-6xl font-extrabold text-white leading-tight">
                Help rescued cows receive daily food, shelter, and medical care.
              </h1>
              <p className="mt-6 text-lg md:text-xl text-white/85 max-w-2xl">
                {orgName} connects donors with active campaigns, real animal records, and secure receipts through a backend-managed platform.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/donate" className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3">
                  Donate Now <Heart className="w-5 h-5 fill-white" />
                </Link>
                <Link to="/campaigns" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-brand-green hover:bg-orange-50">
                  View Campaigns <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-orange-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Metric icon={<HomeIcon className="w-5 h-5" />} label="Animals registered" value={animals.length.toLocaleString('en-IN')} />
          <Metric icon={<Target className="w-5 h-5" />} label="Active campaigns" value={campaigns.length.toLocaleString('en-IN')} />
          <Metric icon={<IndianRupee className="w-5 h-5" />} label="Campaign funds raised" value={formatInr(totalRaisedPaise)} />
          <Metric icon={<Users className="w-5 h-5" />} label="Public records" value="Backend live" />
        </div>
      </section>

      {error && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        </section>
      )}

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 items-start">
            <Reveal>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-12 bg-brand-orange" />
                <span className="text-sm font-bold uppercase tracking-wider text-brand-orange">Featured Campaign</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">A landing page should show what needs help now.</h2>
              <p className="mt-4 text-brand-dark/70 leading-7">
                Mark a campaign as featured in the admin panel to control the first campaign donors see here. If no campaign is featured, the newest active campaign is shown.
              </p>
            </Reveal>

            {featuredCampaign ? (
              <Reveal delay={150}>
                <div className="bg-white rounded-xl border border-orange-100 shadow-sm overflow-hidden">
                  <div className="grid md:grid-cols-2">
                    <img src={campaignImage(featuredCampaign)} alt={featuredCampaign.titleEn} className="h-full min-h-[320px] w-full object-cover" />
                    <div className="p-6 md:p-8 flex flex-col">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                        {featuredCampaign.isFeatured ? 'Featured by admin' : 'Latest active campaign'}
                      </span>
                      <h3 className="mt-3 text-2xl font-bold text-gray-900">{featuredCampaign.titleEn}</h3>
                      <p className="mt-3 text-gray-600 leading-7 line-clamp-4">{featuredCampaign.shortSummaryEn}</p>
                      <div className="mt-6">
                        <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
                          <span>{formatInr(featuredCampaign.raisedAmountPaise)}</span>
                          <span>{progressPercent(featuredCampaign)}%</span>
                        </div>
                        <div className="h-3 rounded-full bg-orange-100 overflow-hidden">
                          <div className="h-full bg-brand-orange" style={{ width: `${progressPercent(featuredCampaign)}%` }} />
                        </div>
                        <p className="mt-2 text-xs text-gray-500">Goal: {formatInr(featuredCampaign.targetAmountPaise)}</p>
                      </div>
                      <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <Link to={`/campaigns/${featuredCampaign.slug}`} className="inline-flex justify-center items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50">
                          Details <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link to={`/donate?campaign=${featuredCampaign.id}`} className="inline-flex justify-center items-center rounded-lg bg-brand-orange px-4 py-2 font-semibold text-white hover:bg-orange-700">
                          Donate to this campaign
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ) : (
              <div className="rounded-xl border border-orange-100 bg-white p-8 text-gray-600">
                No active campaigns are published yet. Create and activate one from the admin campaign page.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-y border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Active Campaigns</h2>
              <p className="mt-3 text-gray-600">Campaign data comes directly from the backend and updates with paid donations.</p>
            </div>
            <Link to="/campaigns" className="inline-flex items-center gap-2 font-semibold text-brand-green hover:text-brand-orange">
              See all campaigns <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {campaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {campaigns.slice(0, 3).map((campaign) => (
                <article key={campaign.id} className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                  <img src={campaignImage(campaign)} alt={campaign.titleEn} className="h-52 w-full object-cover" />
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{campaign.titleEn}</h3>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3">{campaign.shortSummaryEn}</p>
                    <div className="mt-5 h-2 rounded-full bg-orange-100 overflow-hidden">
                      <div className="h-full bg-brand-orange" style={{ width: `${progressPercent(campaign)}%` }} />
                    </div>
                    <div className="mt-3 flex justify-between text-xs font-semibold text-gray-500">
                      <span>{formatInr(campaign.raisedAmountPaise)}</span>
                      <span>{formatInr(campaign.targetAmountPaise)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-8 text-center text-gray-600">No active campaigns yet.</div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Animals In Care</h2>
              <p className="mt-3 text-gray-600">These records are loaded from the public animal API, not browser storage.</p>
            </div>
            <Link to="/campaigns" className="inline-flex items-center gap-2 font-semibold text-brand-green hover:text-brand-orange">
              Support a campaign <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {animals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {animals.slice(0, 3).map((animal) => (
                <article key={animal.id} className="rounded-xl border border-orange-100 bg-white shadow-sm overflow-hidden">
                  <img src={animalImage(animal)} alt={animal.name} className="h-56 w-full object-cover" />
                  <div className="p-5">
                    <div className="flex justify-between gap-4">
                      <h3 className="font-bold text-xl text-gray-900">{animal.name}</h3>
                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">{animal.status.replaceAll('_', ' ')}</span>
                    </div>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-400">{animal.tagId}</p>
                    <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                      {animal.notes || `${animal.name} is registered for daily shelter, feeding, and care.`}
                    </p>
                    <div className="mt-4 text-xs text-gray-500">
                      Rescued: {formatDate(animal.rescueDate)} {animal.healthStatus ? `| Health: ${animal.healthStatus}` : ''}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-8 text-center text-gray-600">No public animal records yet.</div>
          )}
        </div>
      </section>

      <section className="py-16 bg-brand-green text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Ready to help today?</h2>
            <p className="mt-3 text-white/75 max-w-2xl">
              Donate to the general fund or choose a live campaign. Successful payments are verified by the backend and receipts are generated automatically.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/donate" className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-orange px-6 py-3 font-bold text-white hover:bg-orange-700">
              Donate <Heart className="w-5 h-5 fill-white" />
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-bold text-brand-green hover:bg-orange-50">
              Contact Us <Stethoscope className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-orange-100 bg-orange-50/50 p-4">
      <div className="rounded-lg bg-white p-3 text-brand-orange shadow-sm">{icon}</div>
      <div>
        <p className="text-xl font-bold text-gray-900">{value}</p>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
      </div>
    </div>
  );
}
