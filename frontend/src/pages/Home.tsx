import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Heart, Home as HomeIcon, IndianRupee, ShieldCheck, Stethoscope, Target, Users, Leaf, HeartHandshake, Landmark, Sparkles } from 'lucide-react';
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

const animalImage = (animal: Animal) => animal.images?.[0]?.imageUrl || '/logo_transparent.png';

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

      <section className="relative min-h-[800px] flex items-center overflow-hidden">
        <img
          src="/hero-cow-calf.webp"
          alt="A rescued cow and calf resting at the sanctuary"
          width="1024"
          height="1024"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full pt-32">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-4 py-2 text-sm font-semibold text-white/90 ring-1 ring-white/30 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-orange-200" /> A SACRED JOURNEY OF COMPASSION
              </span>
              <h1 className="mt-8 text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-200 via-orange-100 to-white drop-shadow-sm font-serif">
                <span className="block pb-1 leading-normal">धेनुः कामदुघा राजन्</span>
                <span className="block pt-1 leading-normal">सर्वकामफलप्रदा।</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-white/90 max-w-xl leading-relaxed font-light">
                Experience the divine joy of nurturing gentle souls. We provide luxurious care, healing, and endless love to our sacred mother cows.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-6 items-center">
                <Link to="/donate" className="inline-flex items-center justify-center gap-3 rounded-full bg-brand-orange px-8 py-4 font-bold text-white hover:bg-orange-700 transition-all shadow-[0_0_20px_rgba(217,164,65,0.4)] hover:scale-105">
                  <Heart className="w-5 h-5 fill-white" /> Offer Your Devotion
                </Link>
                <Link to="/about" className="inline-flex items-center justify-center gap-2 font-semibold text-white hover:text-orange-200 transition-colors">
                  Discover Our Soul <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <Reveal delay={200}>
              <div className="rounded-2xl bg-transparent border border-white/20 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold">Live Impact</h3>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-green-300">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Real-time
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-white/60 mb-1">Animals Registered</p>
                    <p className="text-4xl font-light text-orange-100">{animals.length.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="w-full h-px bg-white/10"></div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-white/60 mb-1">Active Campaigns</p>
                    <p className="text-4xl font-light text-orange-100">{campaigns.length.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-sm italic text-white/80 font-light leading-relaxed">
                    "The purity of their gaze washes away all earthly sorrows."
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Our Dharma Section */}
      <section className="py-20 md:py-32 bg-brand-beige relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div className="relative rounded-3xl overflow-hidden aspect-square shadow-2xl group">
                <img src="/sanctuary-landscape.jpeg" alt="Sanctuary of peace" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-8 left-8 text-white">
                  <div className="mb-3">
                    <ShieldCheck className="w-10 h-10 text-orange-300" strokeWidth={1.5} />
                  </div>
                  <p className="text-xl font-serif italic text-white/90">Sanctuary of Peace</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-brand-orange" />
                <span className="text-sm font-bold uppercase tracking-wider text-brand-orange">OUR DHARMA</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold font-serif mb-8 text-brand-dark">
                न हि गोसमं <span className="text-brand-green">पित्रम्</span>
              </h2>
              <div className="space-y-6 text-brand-dark/70 text-lg leading-relaxed">
                <p>
                  Gau Seva Kendra is not merely a shelter; it is a sacred temple dedicated to the welfare, rescue, and rehabilitation of abandoned cows. Here, every hoofprint is a blessing, and every gentle moo is a mantra of peace.
                </p>
                <p>
                  We believe that caring for these gentle creatures elevates the human spirit, purifying our society and nurturing the environment. Through world-class medical care, premium organic feeding, and boundless love, we restore their divine dignity.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Our Sacred Duties Section */}
      <section className="py-20 md:py-32 bg-brand-beige border-t border-brand-orange/10 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-white/40 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-brand-dark mb-6">Our Sacred Duties</h2>
            <div className="flex items-center justify-center gap-4 mb-8 text-brand-orange">
              <div className="h-px w-16 bg-brand-orange/30"></div>
              <Sparkles className="w-5 h-5" />
              <div className="h-px w-16 bg-brand-orange/30"></div>
            </div>
            <p className="text-lg text-brand-dark/70 leading-relaxed">
              Providing unparalleled luxury and devotion to the mother cow, ensuring her ultimate comfort and healing.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Reveal delay={100} className="bg-white rounded-3xl p-8 shadow-[0_5px_20px_rgba(217,164,65,0.15)] hover:shadow-[0_20px_40px_rgba(217,164,65,0.3)] transition-all duration-500 border border-[#D9A441]/30 hover:border-[#D9A441] text-center flex flex-col items-center floating-card">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-6 text-brand-orange">
                <Landmark strokeWidth={1.5} className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-4 font-serif">Divine Shelter</h3>
              <p className="text-brand-dark/60 leading-relaxed text-sm">
                Spacious, climate-controlled havens designed for ultimate comfort and tranquility.
              </p>
            </Reveal>

            <Reveal delay={200} className="bg-white rounded-3xl p-8 shadow-[0_5px_20px_rgba(217,164,65,0.15)] hover:shadow-[0_20px_40px_rgba(217,164,65,0.3)] transition-all duration-500 border border-[#D9A441]/30 hover:border-[#D9A441] text-center flex flex-col items-center floating-card">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 text-blue-500">
                <Stethoscope strokeWidth={1.5} className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-4 font-serif">Medical Excellence</h3>
              <p className="text-brand-dark/60 leading-relaxed text-sm">
                State-of-the-art veterinary care, surgeries, and holistic healing therapies.
              </p>
            </Reveal>

            <Reveal delay={300} className="bg-white rounded-3xl p-8 shadow-[0_5px_20px_rgba(217,164,65,0.15)] hover:shadow-[0_20px_40px_rgba(217,164,65,0.3)] transition-all duration-500 border border-[#D9A441]/30 hover:border-[#D9A441] text-center flex flex-col items-center floating-card">
              <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-6 text-brand-green">
                <Leaf strokeWidth={1.5} className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-4 font-serif">Organic Nutrition</h3>
              <p className="text-brand-dark/60 leading-relaxed text-sm">
                Curated diets of premium organic fodder, fresh herbs, and pure mineral water.
              </p>
            </Reveal>

            <Reveal delay={400} className="bg-white rounded-3xl p-8 shadow-[0_5px_20px_rgba(217,164,65,0.15)] hover:shadow-[0_20px_40px_rgba(217,164,65,0.3)] transition-all duration-500 border border-[#D9A441]/30 hover:border-[#D9A441] text-center flex flex-col items-center floating-card">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mb-6 text-purple-500">
                <HeartHandshake strokeWidth={1.5} className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-4 font-serif">Soulful Care</h3>
              <p className="text-brand-dark/60 leading-relaxed text-sm">
                Daily grooming, devotional music, and gentle affection from dedicated sewadars.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white relative z-10 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <Reveal delay={100}>
            <Metric icon={<HomeIcon className="w-8 h-8" />} label="Animals registered" value={animals.length.toLocaleString('en-IN')} />
          </Reveal>
          <Reveal delay={200}>
            <Metric icon={<Target className="w-8 h-8" />} label="Active campaigns" value={campaigns.length.toLocaleString('en-IN')} />
          </Reveal>
          <Reveal delay={300}>
            <Metric icon={<IndianRupee className="w-8 h-8" />} label="Campaign funds raised" value={formatInr(totalRaisedPaise)} />
          </Reveal>
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
              <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">Support Our Sacred Cows</h2>
              <p className="mt-4 text-brand-dark/70 leading-7">
                Every contribution helps us provide better shelter, food, and medical care for our rescued cows. Join our mission to protect and nurture these divine beings by supporting our active campaigns.
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
              <p className="mt-3 text-gray-600">Explore our ongoing initiatives to provide emergency medical aid, better fodder, and safe shelter for our cows.</p>
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
              <p className="mt-3 text-gray-600">Meet the beautiful souls under our care. Each cow has a unique story of rescue and rehabilitation.</p>
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

      <section className="py-24 md:py-32 bg-[#FBF6EE]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <div className="flex justify-center mb-6">
              <Sparkles className="w-10 h-10 text-[#C29243]" strokeWidth={1.5} />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-[#443831] mb-6">
              सेवा हि परमो धर्मः
            </h2>
            <p className="text-lg md:text-xl text-[#6D635B] font-serif leading-relaxed mb-10 max-w-3xl mx-auto">
              True spirituality lies in selfless service. Touch a life, heal a soul, and find your own inner peace amidst our divine herds.
            </p>
            <Link to="/volunteer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C29243] px-8 py-3.5 font-bold text-white hover:bg-[#a87d37] transition-all shadow-sm">
              Become a gau sevak <Users className="w-5 h-5" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-white border border-[#D9A441]/20 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(217,164,65,0.2)] hover:-translate-y-1 transition-all duration-300 group">
      <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-4 text-brand-orange group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <p className="text-4xl font-bold text-brand-dark mb-2">{value}</p>
      <p className="text-sm font-bold uppercase tracking-wider text-brand-dark/50 text-center">{label}</p>
    </div>
  );
}
