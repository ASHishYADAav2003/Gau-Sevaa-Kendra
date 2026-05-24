import { useParams, Link } from "react-router";
import { Calendar, MapPin, Heart, Activity, Pill, Utensils, Home as HomeIcon, ArrowLeft, Download } from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AnimalProfile() {
  const { id } = useParams();
  const [showSponsorForm, setShowSponsorForm] = useState(false);

  const animalData: Record<string, any> = {
    lakshmi: {
      name: "Lakshmi",
      image: "https://images.unsplash.com/photo-1673229266917-89abfa3ebc58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3clMjBmYXJtJTIwaW5kaWF8ZW58MXx8fHwxNzc4OTM4OTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      age: "8 years",
      gender: "Female",
      breed: "Indigenous Desi Cow",
      status: "Recovering",
      healthStatus: "Good",
      rescueDate: "2024-08-15",
      location: "Main Shelter - Block A",
      weight: "380 kg",
      story: "Lakshmi was found on the roadside after a tragic accident that left her with a severe leg injury. She was in critical condition when our rescue team brought her to the shelter. After months of intensive care, surgery, and physiotherapy, she has made remarkable progress. While she still has a slight limp, her spirit remains unbroken. Lakshmi is gentle and loving, often the first to greet visitors to the shelter.",
      monthlyExpense: 4500,
      sponsored: true,
      sponsorName: "Rajesh Kumar",
      gallery: [
        "https://images.unsplash.com/photo-1673229266917-89abfa3ebc58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3clMjBmYXJtJTIwaW5kaWF8ZW58MXx8fHwxNzc4OTM4OTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1772948260139-d5a6418e143d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxjb3clMjBmYXJtJTIwaW5kaWF8ZW58MXx8fHwxNzc4OTM4OTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1756922892143-471d05711682?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxjb3clMjBmYXJtJTIwaW5kaWF8ZW58MXx8fHwxNzc4OTM4OTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      ],
    },
    nandi: {
      name: "Nandi",
      image: "https://images.unsplash.com/photo-1756922892143-471d05711682?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxjb3clMjBmYXJtJTIwaW5kaWF8ZW58MXx8fHwxNzc4OTM4OTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      age: "5 years",
      gender: "Male",
      breed: "Indigenous Bull",
      status: "Healthy",
      healthStatus: "Excellent",
      rescueDate: "2023-03-20",
      location: "Main Shelter - Block B",
      weight: "450 kg",
      story: "Nandi was abandoned as a young calf and found severely malnourished near a construction site. Our team rescued him and nursed him back to health with proper nutrition and care. Today, Nandi is a strong, healthy bull who loves to play and interact with other animals at the shelter. He has become a symbol of hope and resilience.",
      monthlyExpense: 3800,
      sponsored: false,
      gallery: [
        "https://images.unsplash.com/photo-1756922892143-471d05711682?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxjb3clMjBmYXJtJTIwaW5kaWF8ZW58MXx8fHwxNzc4OTM4OTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1722372088297-845cbc5e9197?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxjb3clMjBmYXJtJTIwaW5kaWF8ZW58MXx8fHwxNzc4OTM4OTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      ],
    },
  };

  const animal = animalData[id || ""] || animalData.lakshmi;

  const treatmentHistory = [
    { date: "2026-05-10", treatment: "Regular health checkup", doctor: "Dr. Sharma", cost: 1500 },
    { date: "2026-05-01", treatment: "Leg physiotherapy session", doctor: "Dr. Patel", cost: 2000 },
    { date: "2026-04-20", treatment: "Vaccination - FMD booster", doctor: "Dr. Sharma", cost: 800 },
    { date: "2026-04-10", treatment: "Dental checkup", doctor: "Dr. Kumar", cost: 1200 },
    { date: "2026-03-25", treatment: "Blood test and analysis", doctor: "Dr. Sharma", cost: 2500 },
  ];

  const expenseBreakdown = [
    { category: "Food & Nutrition", amount: 3500 },
    { category: "Medical Care", amount: 12500 },
    { category: "Shelter Maintenance", amount: 2000 },
    { category: "Special Care", amount: 1500 },
  ];

  const healthTrend = [
    { month: "Nov", weight: 365, health: 70 },
    { month: "Dec", weight: 370, health: 75 },
    { month: "Jan", weight: 375, health: 78 },
    { month: "Feb", weight: 378, health: 82 },
    { month: "Mar", weight: 380, health: 85 },
    { month: "Apr", weight: 380, health: 88 },
    { month: "May", weight: 380, health: 90 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/animals" className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Animals
          </Link>
        </div>
      </div>

      {/* Hero Section with Image Gallery */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <div className="rounded-2xl overflow-hidden shadow-2xl mb-4">
                <ImageWithFallback
                  src={animal.image}
                  alt={animal.name}
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {animal.gallery?.slice(0, 3).map((img: string, index: number) => (
                  <div key={index} className="rounded-lg overflow-hidden shadow-md">
                    <ImageWithFallback
                      src={img}
                      alt={`${animal.name} ${index + 1}`}
                      className="w-full h-32 object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                {animal.sponsored && (
                  <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    ✓ Currently Sponsored by {animal.sponsorName}
                  </div>
                )}
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{animal.name}</h1>
                <p className="text-xl text-gray-600 mb-6">{animal.breed}</p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Age</p>
                    <p className="text-lg font-bold text-gray-900">{animal.age}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Gender</p>
                    <p className="text-lg font-bold text-gray-900">{animal.gender}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Weight</p>
                    <p className="text-lg font-bold text-gray-900">{animal.weight}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Health Status</p>
                    <p className={`text-lg font-bold ${
                      animal.healthStatus === "Excellent" ? "text-green-600" :
                      animal.healthStatus === "Good" ? "text-blue-600" :
                      "text-red-600"
                    }`}>
                      {animal.healthStatus}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-500">Rescue Date</p>
                      <p className="font-semibold">{new Date(animal.rescueDate).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-500">Current Location</p>
                      <p className="font-semibold">{animal.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Activity className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-semibold">{animal.status}</p>
                    </div>
                  </div>
                </div>

                {!animal.sponsored && (
                  <button
                    onClick={() => setShowSponsorForm(true)}
                    className="w-full bg-orange-600 text-white px-8 py-4 rounded-lg hover:bg-orange-700 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
                  >
                    <Heart className="w-5 h-5 fill-white" />
                    Sponsor {animal.name} - ₹{animal.monthlyExpense}/month
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Rescue Story */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Rescue Story</h2>
            <p className="text-gray-700 leading-relaxed text-lg">{animal.story}</p>
          </div>

          {/* Health Trend */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Health Progress</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={healthTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Health Score', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#fb923c" strokeWidth={2} name="Weight (kg)" />
                <Line yAxisId="right" type="monotone" dataKey="health" stroke="#22c55e" strokeWidth={2} name="Health Score" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Expenses */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Monthly Expense Breakdown</h2>
              <div className="space-y-4">
                {expenseBreakdown.map((expense, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      {expense.category.includes("Food") && <Utensils className="w-5 h-5 text-green-600" />}
                      {expense.category.includes("Medical") && <Pill className="w-5 h-5 text-red-600" />}
                      {expense.category.includes("Shelter") && <HomeIcon className="w-5 h-5 text-blue-600" />}
                      {expense.category.includes("Special") && <Heart className="w-5 h-5 text-orange-600" />}
                      <span className="font-medium text-gray-900">{expense.category}</span>
                    </div>
                    <span className="text-lg font-bold text-orange-600">₹{expense.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-3 pt-4 border-t-2 border-gray-200">
                  <span className="font-bold text-gray-900">Total Monthly Cost</span>
                  <span className="text-2xl font-bold text-orange-600">
                    ₹{expenseBreakdown.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Treatment History */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Treatment History</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {treatmentHistory.map((treatment, index) => (
                  <div key={index} className="border-l-4 border-orange-600 pl-4 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900">{treatment.treatment}</p>
                      <button className="text-orange-600 hover:text-orange-700">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">{treatment.doctor}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500">{new Date(treatment.date).toLocaleDateString('en-IN')}</p>
                      <p className="text-sm font-semibold text-orange-600">₹{treatment.cost.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sponsor Form Modal */}
          {showSponsorForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Sponsor {animal.name}</h2>
                  <p className="text-gray-600 mb-6">
                    By sponsoring {animal.name}, you'll receive monthly updates, photos, and detailed expense reports
                    showing exactly how your contribution is making a difference.
                  </p>

                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div className="bg-orange-50 p-6 rounded-lg">
                      <p className="text-sm font-semibold text-gray-900 mb-2">Monthly Sponsorship Amount</p>
                      <p className="text-3xl font-bold text-orange-600">₹{animal.monthlyExpense.toLocaleString()}</p>
                      <p className="text-xs text-gray-600 mt-2">Auto-renewed monthly. Cancel anytime.</p>
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setShowSponsorForm(false)}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                      >
                        Proceed to Payment
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
