import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Heart, ShieldCheck } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

type DonationFormData = {
  donationType: 'GENERAL' | 'CAMPAIGN';
  amount: string;
  fullName: string;
  phone: string;
  email: string;
  taxReceiptRequested: boolean;
  isAnonymousPublic: boolean;
  consent: boolean;
};

export default function Donate() {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<DonationFormData>({
    defaultValues: {
      donationType: 'GENERAL',
      amount: '501',
      taxReceiptRequested: false,
      isAnonymousPublic: false,
      consent: false,
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentAmount = watch('amount');
  const taxReceiptRequested = watch('taxReceiptRequested');

  const predefinedAmounts = ['501', '1100', '2100', '5100'];

  const onSubmit = async (data: DonationFormData) => {
    setIsSubmitting(true);
    // Mock Razorpay integration flow
    console.log("Submitting donation:", data);
    setTimeout(() => {
      alert("This is a mockup. In production, Razorpay would open here for ₹" + data.amount);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Helmet>
        <title>Make a Donation | Gau Seva Kendra</title>
        <meta name="description" content="Secure online donation to Gau Seva Kendra. Choose general fund or specific campaigns. 80G tax exemption receipts available." />
        <meta property="og:title" content="Donate to Save Cows - Gau Seva Kendra" />
      </Helmet>
      
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Make a Donation</h1>
        <p className="text-gray-600 text-lg">Your generous contribution directly impacts the lives of sacred cows in our shelter.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
        <div className="bg-orange-50 p-6 border-b border-orange-100 flex items-start gap-4">
          <ShieldCheck className="h-8 w-8 text-orange-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-900">Secure Payment</h3>
            <p className="text-sm text-gray-600">All transactions are secured and encrypted. You will receive an instant 80G tax exemption receipt if requested.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-8">
          {/* Donation Type & Amount */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Donation Details</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <label className={`border-2 rounded-xl p-4 cursor-pointer transition flex items-center justify-center font-bold ${watch('donationType') === 'GENERAL' ? 'border-primary-500 bg-orange-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-orange-200'}`}>
                <input type="radio" value="GENERAL" className="hidden" {...register('donationType')} />
                General Fund
              </label>
              <label className={`border-2 rounded-xl p-4 cursor-pointer transition flex items-center justify-center font-bold ${watch('donationType') === 'CAMPAIGN' ? 'border-primary-500 bg-orange-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-orange-200'}`}>
                <input type="radio" value="CAMPAIGN" className="hidden" {...register('donationType')} />
                Specific Campaign
              </label>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Amount (₹)</label>
              <div className="flex flex-wrap gap-3 mb-3">
                {predefinedAmounts.map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setValue('amount', amt)}
                    className={`px-5 py-2 rounded-full border text-sm font-bold transition ${currentAmount === amt ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-gray-300 text-gray-700 hover:border-primary-500'}`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 font-semibold">₹</span>
                <input
                  type="number"
                  min="1"
                  className="input-field pl-8 font-semibold text-lg"
                  placeholder="Custom Amount"
                  {...register('amount', { required: 'Amount is required', min: { value: 1, message: 'Minimum ₹1' } })}
                />
              </div>
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
            </div>
          </section>

          {/* Donor Details */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Your Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                <input type="text" className="input-field" placeholder="Ram Sharma" {...register('fullName', { required: 'Name is required' })} />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                <input type="tel" className="input-field" placeholder="+91 98765 43210" {...register('phone')} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email Address {taxReceiptRequested && '*'}
                </label>
                <input 
                  type="email" 
                  className="input-field" 
                  placeholder="ram@example.com" 
                  {...register('email', { required: taxReceiptRequested ? 'Email is required for tax receipt' : false })} 
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div className="space-y-3 mt-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500" {...register('taxReceiptRequested')} />
                <div>
                  <span className="text-sm font-semibold text-gray-800">I want an 80G Tax Exemption Receipt</span>
                  <p className="text-xs text-gray-500">A valid email is required to send the receipt.</p>
                </div>
              </label>
              
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500" {...register('isAnonymousPublic')} />
                <div>
                  <span className="text-sm font-semibold text-gray-800">Make my donation anonymous</span>
                  <p className="text-xs text-gray-500">Your name will not be displayed on public campaigns.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer pt-4 border-t border-gray-100">
                <input type="checkbox" className="mt-1 h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500" {...register('consent', { required: 'You must agree to the terms' })} />
                <div>
                  <span className="text-sm text-gray-700">I agree to the <a href="/terms" className="text-primary-600 hover:underline">Terms & Conditions</a> and <a href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</a>.</span>
                </div>
              </label>
              {errors.consent && <p className="text-red-500 text-sm">{errors.consent.message}</p>}
            </div>
          </section>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full btn-primary py-4 text-lg flex justify-center items-center gap-2 mt-8 shadow-xl"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              <>
                Donate ₹{currentAmount || '0'} Now <Heart className="h-5 w-5 fill-white" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
