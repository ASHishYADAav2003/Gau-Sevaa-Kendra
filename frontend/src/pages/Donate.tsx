import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, ShieldCheck } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { campaignApi, donationApi, publicApi } from '../api/services';
import { getApiErrorMessage } from '../api/client';
import type { Campaign } from '../api/types';
import { formatInr } from '../utils/format';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type DonationFormData = {
  donationType: 'GENERAL' | 'CAMPAIGN';
  campaignId: string;
  amount: string;
  fullName: string;
  phone: string;
  email: string;
  taxReceiptRequested: boolean;
  isAnonymousPublic: boolean;
  consent: boolean;
};

type RazorpayPaymentResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

const loadRazorpayScript = () =>
  new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function Donate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<DonationFormData>({
    defaultValues: {
      donationType: 'GENERAL',
      campaignId: '',
      amount: '501',
      taxReceiptRequested: false,
      isAnonymousPublic: false,
      consent: false,
    }
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [orgName, setOrgName] = useState('Gau Seva Kendra');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const currentAmount = watch('amount');
  const donationType = watch('donationType');
  const taxReceiptRequested = watch('taxReceiptRequested');

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const [campaignResult, config] = await Promise.all([
          campaignApi.listPublic({ pageSize: 100 }),
          publicApi.siteConfig().catch(() => null),
        ]);
        setCampaigns(campaignResult.items);
        const campaignId = searchParams.get('campaign');
        if (campaignId && campaignResult.items.some((campaign) => campaign.id === campaignId)) {
          setValue('donationType', 'CAMPAIGN');
          setValue('campaignId', campaignId);
        }
        if (config?.orgName) setOrgName(config.orgName);
      } catch (err) {
        setError(getApiErrorMessage(err, 'Unable to load active campaigns.'));
      }
    };

    void loadPageData();
  }, [searchParams, setValue]);

  useEffect(() => {
    if (donationType === 'CAMPAIGN' && campaigns.length === 1) {
      setValue('campaignId', campaigns[0].id);
    }
  }, [campaigns, donationType, setValue]);

  const predefinedAmounts = ['501', '1100', '2100', '5100'];

  const onSubmit = async (data: DonationFormData) => {
    setIsSubmitting(true);
    setError('');
    setNotice('');

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded || !window.Razorpay) {
        throw new Error('Razorpay checkout could not be loaded. Please refresh and try again.');
      }

      const amount = Number(data.amount);
      const order = await donationApi.createOrder({
        donationType: data.donationType,
        campaignId: data.donationType === 'CAMPAIGN' ? data.campaignId : undefined,
        amount,
        currency: 'INR',
        donor: {
          fullName: data.fullName,
          phone: data.phone || undefined,
          email: data.email || undefined,
          isAnonymousPublic: data.isAnonymousPublic,
        },
        taxReceiptRequested: data.taxReceiptRequested,
      });

      if (order.redirectedToGeneral) {
        setNotice('The selected campaign is no longer active, so this donation will go to the general fund.');
      }

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amountPaise,
        currency: order.currency,
        name: orgName,
        description: data.donationType === 'CAMPAIGN' ? 'Campaign donation' : 'General donation',
        order_id: order.razorpayOrderId,
        prefill: {
          name: data.fullName,
          email: data.email,
          contact: data.phone,
        },
        handler: async (response: RazorpayPaymentResponse) => {
          try {
            await donationApi.verify({
              donationId: order.donationId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            navigate(`/thank-you/${order.donationId}`);
          } catch (err) {
            setError(getApiErrorMessage(err, 'Payment verification failed.'));
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => setIsSubmitting(false),
        },
        theme: {
          color: '#ea580c',
        },
      });

      razorpay.open();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to start the donation checkout.'));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Helmet title="Make a Donation | Gau Seva Kendra">
        <meta name="description" content="Secure online donation to Gau Seva Kendra. Choose general fund or a specific campaign. Tax receipts available." />
      </Helmet>

      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Make a Donation</h1>
        <p className="text-gray-600 text-lg">Your contribution directly supports rescue, food, shelter, and medical care.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
        <div className="bg-orange-50 p-6 border-b border-orange-100 flex items-start gap-4">
          <ShieldCheck className="h-8 w-8 text-orange-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-900">Secure Payment</h3>
            <p className="text-sm text-gray-600">Orders are created by the backend and completed through Razorpay Checkout.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-8">
          {error && <div role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}
          {notice && <div role="status" aria-live="polite" className="rounded-lg bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">{notice}</div>}

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Donation Details</h2>
            <fieldset className="grid grid-cols-2 gap-4 mb-6">
              <legend className="sr-only">Choose donation type</legend>
              <label className={`border-2 rounded-xl p-4 cursor-pointer transition flex items-center justify-center font-bold ${donationType === 'GENERAL' ? 'border-primary-500 bg-orange-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-orange-200'}`}>
                <input type="radio" value="GENERAL" className="sr-only" {...register('donationType')} />
                General Fund
              </label>
              <label className={`border-2 rounded-xl p-4 cursor-pointer transition flex items-center justify-center font-bold ${donationType === 'CAMPAIGN' ? 'border-primary-500 bg-orange-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-orange-200'}`}>
                <input type="radio" value="CAMPAIGN" className="sr-only" {...register('donationType')} />
                Specific Campaign
              </label>
            </fieldset>

            {donationType === 'CAMPAIGN' && (
              <div className="mb-6">
                <label htmlFor="campaignId" className="block text-sm font-semibold text-gray-700 mb-2">Active Campaign *</label>
                <select
                  id="campaignId"
                  className="input-field"
                  aria-invalid={Boolean(errors.campaignId)}
                  aria-describedby={errors.campaignId ? 'campaign-error' : undefined}
                  {...register('campaignId', {
                    validate: (value) => donationType !== 'CAMPAIGN' || Boolean(value) || 'Please select a campaign',
                  })}
                >
                  <option value="">Select a campaign</option>
                  {campaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.titleEn} - {formatInr(campaign.raisedAmountPaise)} raised of {formatInr(campaign.targetAmountPaise)}
                    </option>
                  ))}
                </select>
                {campaigns.length === 0 && <p className="text-xs text-gray-500 mt-2">No active campaigns are available. Please use the general fund.</p>}
                {errors.campaignId && <p id="campaign-error" className="text-red-700 text-sm mt-1">{errors.campaignId.message}</p>}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">Select Amount (Rs.)</label>
              <div className="flex flex-wrap gap-3 mb-3">
                {predefinedAmounts.map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setValue('amount', amt)}
                    aria-pressed={currentAmount === amt}
                    className={`px-5 py-2 rounded-full border text-sm font-bold transition ${currentAmount === amt ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-gray-300 text-gray-700 hover:border-primary-500'}`}
                  >
                    Rs. {amt}
                  </button>
                ))}
              </div>
              <input
                id="amount"
                type="number"
                min="1"
                inputMode="numeric"
                aria-invalid={Boolean(errors.amount)}
                aria-describedby={errors.amount ? 'amount-error' : undefined}
                className="input-field font-semibold text-lg"
                placeholder="Custom Amount"
                {...register('amount', { required: 'Amount is required', min: { value: 1, message: 'Minimum Rs. 1' } })}
              />
              {errors.amount && <p id="amount-error" className="text-red-700 text-sm mt-1">{errors.amount.message}</p>}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Your Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                <input id="fullName" type="text" autoComplete="name" aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? 'name-error' : undefined} className="input-field" placeholder="Ram Sharma" {...register('fullName', { required: 'Name is required' })} />
                {errors.fullName && <p id="name-error" className="text-red-700 text-sm mt-1">{errors.fullName.message}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                <input id="phone" type="tel" autoComplete="tel" className="input-field" placeholder="+91 98765 43210" {...register('phone')} />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                  Email Address {taxReceiptRequested && '*'}
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className="input-field"
                  placeholder="ram@example.com"
                  {...register('email', { required: taxReceiptRequested ? 'Email is required for tax receipt' : false })}
                />
                {errors.email && <p id="email-error" className="text-red-700 text-sm mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div className="space-y-3 mt-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500" {...register('taxReceiptRequested')} />
                <div>
                  <span className="text-sm font-semibold text-gray-800">I want a tax receipt</span>
                  <p className="text-xs text-gray-500">A valid email is required to send the receipt.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500" {...register('isAnonymousPublic')} />
                <div>
                  <span className="text-sm font-semibold text-gray-800">Make my donation anonymous publicly</span>
                  <p className="text-xs text-gray-500">Your name stays visible to admins for records.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer pt-4 border-t border-gray-100">
                <input type="checkbox" className="mt-1 h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500" {...register('consent', { required: 'You must agree to the terms' })} />
                <span className="text-sm text-gray-700">I agree to the <Link to="/terms" className="text-primary-600 hover:underline">Terms</Link> and <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>.</span>
              </label>
              {errors.consent && <p role="alert" className="text-red-700 text-sm">{errors.consent.message}</p>}
            </div>
          </section>

          <button
            type="submit"
            disabled={isSubmitting || (donationType === 'CAMPAIGN' && campaigns.length === 0)}
            className="w-full btn-primary py-4 text-lg flex justify-center items-center gap-2 mt-8 shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Opening checkout...</span>
            ) : (
              <>
                Donate Rs. {currentAmount || '0'} Now <Heart className="h-5 w-5 fill-white" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
