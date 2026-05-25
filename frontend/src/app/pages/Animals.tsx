import { Link } from "react-router";
import { Search, Filter, Heart, Calendar, MapPin } from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Animals() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const [animals, setAnimals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/animals')
      .then(res => res.json())
      .then(data => {
        setAnimals(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch animals:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading animals...</div>;
  }
  const filteredAnimals = animals.filter((animal) => {
    const matchesSearch = animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         animal.story.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterCategory === "all" || animal.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 fill-white" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('nav.animals')}</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              {t('animals.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('animals.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterCategory("all")}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  filterCategory === "all"
                    ? "bg-orange-600 text-white"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-300"
                }`}
              >
                {t('animals.all')}
              </button>
              <button
                onClick={() => setFilterCategory("Healthy")}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  filterCategory === "Healthy"
                    ? "bg-orange-600 text-white"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-300"
                }`}
              >
                {t('animals.healthy')}
              </button>
              <button
                onClick={() => setFilterCategory("Recovering")}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  filterCategory === "Recovering"
                    ? "bg-orange-600 text-white"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-300"
                }`}
              >
                {t('animals.recovering')}
              </button>
              <button
                onClick={() => setFilterCategory("Critical")}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  filterCategory === "Critical"
                    ? "bg-orange-600 text-white"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-300"
                }`}
              >
                {t('animals.critical')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Animals Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredAnimals.length}</span> animals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAnimals.map((animal) => (
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
                  {animal.sponsored && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      ✓ Sponsored
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-orange-600">
                    {animal.age}
                  </div>
                  <div className={`absolute bottom-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                    animal.healthStatus === "Excellent" ? "bg-green-500 text-white" :
                    animal.healthStatus === "Good" ? "bg-blue-500 text-white" :
                    "bg-red-500 text-white"
                  }`}>
                    {animal.healthStatus}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{animal.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{animal.gender} • {animal.status}</p>
                  <p className="text-gray-600 mb-4 line-clamp-2">{animal.story}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Rescued: {new Date(animal.rescueDate).toLocaleDateString('en-IN')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{animal.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500">Monthly Expense</p>
                      <p className="text-lg font-bold text-orange-600">₹{animal.monthlyExpense.toLocaleString()}</p>
                    </div>
                    {!animal.sponsored ? (
                      <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-semibold">
                        Sponsor Now
                      </button>
                    ) : (
                      <span className="text-green-600 font-semibold text-sm">View Profile →</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            We have many more animals under our care. Contact us to learn about other animals needing sponsorship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
            >
              Contact Us
            </Link>
            <Link
              to="/donate"
              className="inline-flex items-center justify-center bg-transparent border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-lg hover:bg-orange-50 transition-colors font-semibold"
            >
              Make General Donation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
