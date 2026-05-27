import { useState } from "react";
import { Heart, CreditCard, Smartphone, Building, CheckCircle, IndianRupee, Loader2, AlertCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useSettings } from "../context/SettingsContext";
import { submitDonation } from "../../lib/api";

export default function Donate() {
  const { t } = useLanguage();
  const { settings } = useSettings();
  const [amount, setAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking" | null>(null);
  const [donorInfo, setDonorInfo] = useState({
    name: "",
    email: "",
    phone: "",
    panCard: "",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const predefinedAmounts = [500, 1000, 2000, 5000, 10000];

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentMethod) {
      setError("Please select a payment method");
      return;
    }

    const donationAmount = customAmount ? parseInt(customAmount, 10) : amount;
    if (!donationAmount || donationAmount < 100) {
      setError("Please enter a valid amount (minimum ₹100)");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await submitDonation({
        donorName: donorInfo.name,
        email: donorInfo.email,
        phone: donorInfo.phone,
        panCard: donorInfo.panCard || undefined,
        amount: donationAmount,
        paymentMethod,
        isRecurring: recurring,
      });

      setShowConfirmation(true);
      // Removed auto-reset so donor can download receipt
    } catch (err) {
      setError(err instanceof Error ? err.message : "Donation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const finalAmount = customAmount ? parseInt(customAmount) : amount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-16 h-16 mx-auto mb-4 fill-white" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('donate.title')}</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            {t('donate.description')}
          </p>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {showConfirmation ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You for Your Donation!</h2>
              <p className="text-lg text-gray-600 mb-6">
                Your donation of <span className="font-bold text-orange-600">₹{finalAmount.toLocaleString()}</span> has been received.
              </p>
              <p className="text-gray-600 mb-8">
                A confirmation email with your donation receipt has been sent to your email address.
                Your contribution will help us continue our mission to protect and care for animals.
              </p>
              <div className="bg-orange-50 p-6 rounded-lg mb-8">
                <p className="text-sm text-gray-700">
                  <strong>Tax Benefit:</strong> {settings.taxExemptionNote}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.print()}
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-semibold"
                >
                  Download Receipt
                </button>
                <button
                  onClick={() => {
                    setShowConfirmation(false);
                    setDonorInfo({ name: "", email: "", phone: "", panCard: "" });
                    setCustomAmount("");
                    setPaymentMethod(null);
                    setRecurring(false);
                  }}
                  className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Make Another Donation
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleDonate}>
              {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              <div className="grid md:grid-cols-3 gap-8">
                {/* Left Side - Donation Details */}
                <div className="md:col-span-2 space-y-6">
                  {/* Amount Selection */}
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Donation Amount</h2>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {predefinedAmounts.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setAmount(amt);
                            setCustomAmount("");
                          }}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            amount === amt && !customAmount
                              ? "border-orange-600 bg-orange-50 text-orange-600"
                              : "border-gray-200 hover:border-orange-300"
                          }`}
                        >
                          <div className="text-2xl font-bold">₹{amt.toLocaleString()}</div>
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        placeholder="Enter custom amount"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none"
                      />
                    </div>

                    {/* Recurring Option */}
                    <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={recurring}
                          onChange={(e) => setRecurring(e.target.checked)}
                          className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                        />
                        <div>
                          <span className="font-semibold text-gray-900">Make this a monthly donation</span>
                          <p className="text-sm text-gray-600">Help us provide consistent care to our animals</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("upi")}
                        className={`p-6 rounded-lg border-2 transition-all ${
                          paymentMethod === "upi"
                            ? "border-orange-600 bg-orange-50"
                            : "border-gray-200 hover:border-orange-300"
                        }`}
                      >
                        <Smartphone className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                        <div className="font-semibold text-gray-900">UPI</div>
                        <div className="text-xs text-gray-500 mt-1">PhonePe, GPay, Paytm</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`p-6 rounded-lg border-2 transition-all ${
                          paymentMethod === "card"
                            ? "border-orange-600 bg-orange-50"
                            : "border-gray-200 hover:border-orange-300"
                        }`}
                      >
                        <CreditCard className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                        <div className="font-semibold text-gray-900">Card</div>
                        <div className="text-xs text-gray-500 mt-1">Credit/Debit</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("netbanking")}
                        className={`p-6 rounded-lg border-2 transition-all ${
                          paymentMethod === "netbanking"
                            ? "border-orange-600 bg-orange-50"
                            : "border-gray-200 hover:border-orange-300"
                        }`}
                      >
                        <Building className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                        <div className="font-semibold text-gray-900">Net Banking</div>
                        <div className="text-xs text-gray-500 mt-1">All banks</div>
                      </button>
                    </div>

                    {paymentMethod === "upi" && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                        <input
                          type="text"
                          placeholder="yourname@upi"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    )}

                    {paymentMethod === "card" && (
                      <div className="mt-6 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                            <input
                              type="text"
                              placeholder="123"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "netbanking" && (
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Bank</label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                          <option>State Bank of India</option>
                          <option>HDFC Bank</option>
                          <option>ICICI Bank</option>
                          <option>Axis Bank</option>
                          <option>Punjab National Bank</option>
                          <option>Other</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Donor Information */}
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Information</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={donorInfo.name}
                          onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                        <input
                          type="email"
                          required
                          value={donorInfo.email}
                          onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={donorInfo.phone}
                          onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">PAN Card (Optional - for 80G certificate)</label>
                        <input
                          type="text"
                          value={donorInfo.panCard}
                          onChange={(e) => setDonorInfo({ ...donorInfo, panCard: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="ABCDE1234F"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Summary */}
                <div className="md:col-span-1">
                  <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Donation Summary</h3>
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount</span>
                        <span className="font-bold text-gray-900">₹{finalAmount.toLocaleString()}</span>
                      </div>
                      {recurring && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Frequency</span>
                          <span className="font-semibold text-orange-600">Monthly</span>
                        </div>
                      )}
                      <div className="border-t pt-4">
                        <div className="flex justify-between text-lg">
                          <span className="font-bold text-gray-900">Total</span>
                          <span className="font-bold text-orange-600">₹{finalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || !paymentMethod || !donorInfo.name || !donorInfo.email || !donorInfo.phone}
                      className="w-full bg-orange-600 text-white px-6 py-4 rounded-lg hover:bg-orange-700 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        t('donate.complete')
                      )}
                    </button>

                    <div className="mt-6 text-xs text-gray-500 text-center">
                      <p>🔒 Secure payment powered by Razorpay</p>
                      <p className="mt-2">All donations are safe and encrypted</p>
                    </div>

                    <div className="mt-6 p-4 bg-green-50 rounded-lg">
                      <p className="text-sm font-semibold text-green-800 mb-2">Tax Benefits</p>
                      <p className="text-xs text-green-700">
                        {settings.taxExemptionNote}
                      </p>
                    </div>

                    <div className="mt-6 text-sm text-gray-600">
                      <p className="font-semibold mb-2">Your donation helps:</p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-orange-600">•</span>
                          <span>Provide nutritious food daily</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-600">•</span>
                          <span>Cover medical treatments</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-600">•</span>
                          <span>Maintain safe shelters</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-600">•</span>
                          <span>Rescue injured animals</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
