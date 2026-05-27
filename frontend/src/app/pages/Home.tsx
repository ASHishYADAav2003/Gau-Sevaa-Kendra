import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Heart, Users, TrendingUp, Shield, ArrowRight, IndianRupee, Stethoscope } from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { useLanguage } from "../context/LanguageContext";
import { useSettings } from "../context/SettingsContext";
import { getRecentDonations, getHomeStats, getFeaturedAnimals, type RecentDonation } from "../../lib/api";

const defaultFeaturedAnimals = [
  {
    id: "lakshmi",
    name: "Lakshmi",
    image: "https://images.unsplash.com/photo-1673229266917-89abfa3ebc58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3clMjBmYXJtJTIwaW5kaWF8ZW58MXx8fHwxNzc4OTM4OTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    age: "8 years",
    story: "Rescued from accident, now recovering well",
    monthlyExpense: 4500,
  },
  {
    id: "nandi",
    name: "Nandi",
    image: "https://images.unsplash.com/photo-1756922892143-471d05711682?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxjb3clMjBmYXJtJTIwaW5kaWF8ZW58MXx8fHwxNzc4OTM4OTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    age: "5 years",
    story: "Abandoned calf, now healthy and strong",
    monthlyExpense: 3800,
  },
  {
    id: "ganga",
    name: "Ganga",
    image: "https://images.unsplash.com/photo-1769466100846-86239ba740aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3clMjBzaGVsdGVyJTIwcmVzY3VlfGVufDF8fHx8MTc3ODkzODk2OHww&ixlib=rb-4.1.0&q=80&w=1080",
    age: "3 years",
    story: "Orphaned triplet calves, growing together",
    monthlyExpense: 8500,
  },
];

const heroMessages = [
  { emoji: "🙏", text: "Serving with Compassion Since 2015" },
  { emoji: "🐄", text: "2,500+ Animals Under Our Care" },
  { emoji: "❤️", text: "Every Donation Saves a Life" },
];

function useAnimatedNumber(target: number, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return value;
}

function formatStat(value: number, type: 'count' | 'currency' | 'plus') {
  if (type === 'currency') {
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${value.toLocaleString('en-IN')}`;
  }
  if (type === 'plus') return `${value.toLocaleString('en-IN')}+`;
  return value.toLocaleString('en-IN');
}

export default function Home() {
  const { t } = useLanguage();
  const { settings } = useSettings();
  const [recentDonations, setRecentDonations] = useState<RecentDonation[]>([]);
  const [featuredAnimals, setFeaturedAnimals] = useState(defaultFeaturedAnimals);
  const [stats, setStats] = useState({
    animalsRescued: 2500,
    activeDonors: 5000,
    monthlyExpenses: 850000,
    treatmentsDone: 15000,
    volunteerCount: 0,
  });
  const [heroIndex, setHeroIndex] = useState(0);
  const [donationHighlight, setDonationHighlight] = useState(0);

  const animatedRescued = useAnimatedNumber(stats.animalsRescued);
  const animatedDonors = useAnimatedNumber(stats.activeDonors);
  const animatedTreatments = useAnimatedNumber(stats.treatmentsDone);

  useEffect(() => {
    if (settings.showDonationTicker) {
      getRecentDonations(5).then(setRecentDonations);
    }
    getHomeStats().then((data) => {
      setStats({
        ...data,
        monthlyExpenses: settings.monthlyBudget || data.monthlyExpenses,
      });
    });
    getFeaturedAnimals(3).then((animals) => {
      if (animals && animals.length > 0) setFeaturedAnimals(animals);
    });
  }, [settings.showDonationTicker, settings.monthlyBudget]);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroMessages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (recentDonations.length === 0) return;
    const timer = setInterval(() => {
      setDonationHighlight((i) => (i + 1) % recentDonations.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [recentDonations.length]);

  const monthlyExpenseDisplay = settings.monthlyBudget || stats.monthlyExpenses;

  const statItems = [
    { label: t('stats.rescued'), value: formatStat(animatedRescued, 'plus'), icon: Heart },
    { label: t('stats.donors'), value: formatStat(animatedDonors, 'plus'), icon: Users },
    { label: t('stats.expenses'), value: formatStat(monthlyExpenseDisplay, 'currency'), icon: IndianRupee },
    { label: t('stats.treatments'), value: formatStat(animatedTreatments, 'plus'), icon: Stethoscope },
  ];

  const titleParts = t('home.hero.title').includes(',')
    ? t('home.hero.title').split(',')
    : [t('home.hero.title'), ''];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div
                key={heroIndex}
                className="inline-block bg-orange-100 text-orange-800 px-4 py-1 rounded-full text-sm font-medium mb-4 transition-opacity duration-500"
              >
                {heroMessages[heroIndex].emoji} {heroMessages[heroIndex].text}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                {titleParts[0]?.trim()}
                {titleParts[1] && (
                  <>
                    ,<br />
                    {titleParts[1].trim()}
                  </>
                )}
                <span className="block text-orange-600 mt-2">{settings.tagline}</span>
              </h1>
              <p className="text-lg text-gray-700 mb-8">{t('home.hero.description')}</p>
              <p className="text-sm text-gray-500 mb-4 -mt-4">
                Donation goal: ₹{settings.donationGoal.toLocaleString('en-IN')} · Monthly budget: ₹{settings.monthlyBudget.toLocaleString('en-IN')}
              </p>
              {stats.volunteerCount > 0 && (
                <p className="text-sm text-orange-700 font-medium mb-4 -mt-4">
                  {stats.volunteerCount} volunteers have joined our mission recently
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/donate"
                  className="inline-flex items-center justify-center bg-orange-600 text-white px-8 py-4 rounded-lg hover:bg-orange-700 transition-colors text-lg font-semibold shadow-lg"
                >
                  <Heart className="w-5 h-5 mr-2 fill-white" />
                  {t('home.hero.donate')}
                </Link>
                <Link
                  to="/animals"
                  className="inline-flex items-center justify-center bg-white text-orange-600 px-8 py-4 rounded-lg hover:bg-orange-50 transition-colors text-lg font-semibold border-2 border-orange-600"
                >
                  {t('home.hero.sponsor')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1772948260139-d5a6418e143d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxjb3clMjBmYXJtJTIwaW5kaWF8ZW58MXx8fHwxNzc4OTM4OTY3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Cow in peaceful shelter"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                  <p className="text-lg font-semibold">{t('home.hero.animalsCount')}</p>
                  <p className="text-sm opacity-90">{t('home.hero.animalsSubtext')}</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-orange-500 text-white p-4 rounded-full shadow-lg animate-pulse">
                <Heart className="w-8 h-8 fill-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statItems.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
                    <Icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 tabular-nums">{stat.value}</div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('mission.title')}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t('mission.subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('mission.protection.title')}</h3>
              <p className="text-gray-600">{t('mission.protection.desc')}</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Stethoscope className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('mission.medical.title')}</h3>
              <p className="text-gray-600">{t('mission.medical.desc')}</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('mission.transparency.title')}</h3>
              <p className="text-gray-600">{t('mission.transparency.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Animals Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('animals.title')}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t('animals.subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredAnimals.map((animal) => (
              <Link
                key={animal.id}
                to={`/animals/${animal.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="relative h-64 overflow-hidden">
                  <ImageWithFallback
                    src={animal.image}
                    alt={animal.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-orange-600">
                    {animal.age}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{animal.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{animal.story}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500">{t('animals.monthlyExpense')}</p>
                      <p className="text-lg font-bold text-orange-600">
                        ₹{animal.monthlyExpense.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-orange-600 font-semibold flex items-center group-hover:text-orange-700">
                      {t('animals.sponsor')} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/animals"
              className="inline-flex items-center justify-center bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
            >
              View All Animals <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Support {settings.organizationName}
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Join us in our mission to protect and care for animals. Your support creates a direct impact on their lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/donate"
              className="inline-flex items-center justify-center bg-white text-orange-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
            >
              <Heart className="w-5 h-5 mr-2" />
              Donate Now
            </Link>
            <Link
              to="/volunteer"
              className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-colors font-semibold text-lg"
            >
              <Users className="w-5 h-5 mr-2" />
              Become a Volunteer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
