import { Link } from "react-router";
import { Heart, Users, TrendingUp, Shield, ArrowRight, IndianRupee, Stethoscope, Home as HomeIcon } from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { useLanguage } from "../context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  const stats = [
    { label: t('stats.rescued'), value: "2,500+", icon: Heart },
    { label: t('stats.donors'), value: "5,000+", icon: Users },
    { label: t('stats.expenses'), value: "₹8.5L", icon: IndianRupee },
    { label: t('stats.treatments'), value: "15,000+", icon: Stethoscope },
  ];

  const recentDonations = [
    { name: "Rajesh Kumar", amount: 5000, time: "2 hours ago" },
    { name: "Priya Sharma", amount: 2000, time: "4 hours ago" },
    { name: "Anonymous", amount: 10000, time: "6 hours ago" },
    { name: "Amit Patel", amount: 3000, time: "8 hours ago" },
  ];

  const featuredAnimals = [
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

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-orange-100 text-orange-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
                🙏 Serving with Compassion Since 2015
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                {t('home.hero.title').split(',')[0]},<br />{t('home.hero.title').split(',')[1]}
                <span className="block text-orange-600 mt-2">{t('home.hero.subtitle')}</span>
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                {t('home.hero.description')}
              </p>
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
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
                    <Icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('mission.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('mission.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('mission.protection.title')}</h3>
              <p className="text-gray-600">
                {t('mission.protection.desc')}
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Stethoscope className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('mission.medical.title')}</h3>
              <p className="text-gray-600">
                {t('mission.medical.desc')}
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('mission.transparency.title')}</h3>
              <p className="text-gray-600">
                {t('mission.transparency.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Animals Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('animals.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('animals.subtitle')}
            </p>
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
                  <p className="text-gray-600 mb-4">{animal.story}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500">{t('animals.monthlyExpense')}</p>
                      <p className="text-lg font-bold text-orange-600">₹{animal.monthlyExpense.toLocaleString()}</p>
                    </div>
                    <button className="text-orange-600 font-semibold flex items-center group-hover:text-orange-700">
                      {t('animals.sponsor')} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </button>
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

      {/* Live Donations Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Recent Donations
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join our community of compassionate donors making a real difference
              </p>
              <div className="space-y-4">
                {recentDonations.map((donation, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Heart className="w-5 h-5 text-orange-600 fill-orange-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{donation.name}</p>
                        <p className="text-sm text-gray-500">{donation.time}</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-orange-600">₹{donation.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <Link
                to="/transparency"
                className="inline-flex items-center text-orange-600 font-semibold mt-6 hover:text-orange-700"
              >
                View Full Transparency Report <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Donate?</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🍃</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Daily Nutrition</h4>
                    <p className="text-gray-600 text-sm">₹500 provides fresh fodder and nutritious food for one cow for a week</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">💊</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Medical Treatment</h4>
                    <p className="text-gray-600 text-sm">₹2,000 covers vaccination and basic medical checkup for one animal</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🏠</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Shelter Maintenance</h4>
                    <p className="text-gray-600 text-sm">₹5,000 helps maintain clean and safe shelter facilities monthly</p>
                  </div>
                </div>
              </div>
              <Link
                to="/donate"
                className="block w-full bg-orange-600 text-white text-center px-8 py-4 rounded-lg hover:bg-orange-700 transition-colors font-semibold mt-8"
              >
                Make a Donation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Every Life Matters. Every Rupee Counts.
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
