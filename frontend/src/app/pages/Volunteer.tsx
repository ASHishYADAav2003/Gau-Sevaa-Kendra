import { useState } from "react";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { submitVolunteer } from "../../lib/api";

export default function Volunteer() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    city: "",
    age: "",
    availability: [] as string[],
    interests: [] as string[],
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availabilityOptions = ["Weekdays", "Weekends", "Both"];
  
  const interestOptions = [
    { id: "Animal Care", label: "Animal Care", icon: "🐄" },
    { id: "Fundraising", label: "Fundraising", icon: "💰" },
    { id: "Social Media", label: "Social Media", icon: "📱" },
    { id: "Events", label: "Events", icon: "🎪" },
    { id: "Medical Help", label: "Medical Help", icon: "🩺" },
    { id: "Other", label: "Other", icon: "🖊" },
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile Number is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Invalid mobile number (must be 10 digits)";
    }
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.age.trim() || isNaN(Number(formData.age)) || Number(formData.age) < 16) {
      newErrors.age = "Valid age is required (minimum 16)";
    }
    if (formData.availability.length === 0) newErrors.availability = "Select at least one availability";
    if (formData.interests.length === 0) newErrors.interests = "Select at least one area of interest";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    
    if (!validate()) return;

    setIsLoading(true);
    try {
      await submitVolunteer({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        city: formData.city,
        age: formData.age,
        availability: formData.availability,
        interests: formData.interests,
        message: formData.message || undefined,
      });

      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        mobile: "",
        city: "",
        age: "",
        availability: [],
        interests: [],
        message: "",
      });
    } catch (error: any) {
      setApiError(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleArrayField = (field: "availability" | "interests", value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#FF6600] to-[#cc5200] text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80" 
            alt="Volunteer with cows" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-devanagari">
            Join Our Seva Mission / हमारी सेवा में जुड़ें
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Become a part of our family and help us care for the voiceless.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        {submitted ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-t-4 border-[#2E7D32]">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-[#2E7D32]" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-devanagari">Thank you! 🙏</h2>
            <p className="text-lg text-gray-600 mb-8">
              We have received your request. Our team will contact you within 2-3 days.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-[#FF6600] text-white px-8 py-3 rounded-md hover:bg-[#e65c00] transition-colors font-medium shadow-sm"
            >
              Register Another Volunteer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
            {apiError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-sm text-red-700">{apiError}</p>
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-[#FF6600] outline-none transition-colors ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-[#FF6600] outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="mobile"
                      maxLength={10}
                      value={formData.mobile}
                      onChange={handleChange}
                      className={`flex-1 min-w-0 block w-full px-4 py-2 border rounded-none rounded-r-md focus:ring-2 focus:ring-[#FF6600] focus:border-[#FF6600] outline-none transition-colors ${errors.mobile ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  </div>
                  {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    min="16"
                    value={formData.age}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-[#FF6600] outline-none transition-colors ${errors.age ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-[#FF6600] outline-none transition-colors ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Availability</h3>
              <div className="flex flex-wrap gap-3">
                {availabilityOptions.map((option) => {
                  const isSelected = formData.availability.includes(option);
                  return (
                    <button
                      type="button"
                      key={option}
                      onClick={() => toggleArrayField("availability", option)}
                      className={`px-6 py-2 rounded-full text-sm font-medium border transition-colors ${
                        isSelected 
                          ? 'bg-[#1B5E20] text-white border-[#1B5E20]' 
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {errors.availability && <p className="mt-2 text-xs text-red-500">{errors.availability}</p>}
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Area of Interest</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {interestOptions.map((interest) => {
                  const isSelected = formData.interests.includes(interest.id);
                  return (
                    <label 
                      key={interest.id} 
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        isSelected ? 'bg-orange-50 border-[#FF6600]' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleArrayField("interests", interest.id)}
                        className="w-4 h-4 text-[#FF6600] rounded focus:ring-[#FF6600] border-gray-300 mr-3"
                      />
                      <span className="text-xl mr-2">{interest.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{interest.label}</span>
                    </label>
                  );
                })}
              </div>
              {errors.interests && <p className="mt-2 text-xs text-red-500">{errors.interests}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Message / Motivation (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-[#FF6600] outline-none transition-colors"
                placeholder="Tell us why you'd like to join..."
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FF6600] text-white px-8 py-4 rounded-md hover:bg-[#e65c00] transition-colors font-semibold text-lg flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 size={24} className="animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
