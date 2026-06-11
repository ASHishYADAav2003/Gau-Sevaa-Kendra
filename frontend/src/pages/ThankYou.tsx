import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Clock, Download, XCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { donationApi } from '../api/services';
import { getApiErrorMessage } from '../api/client';
import type { DonationStatus } from '../api/types';
import { formatInr } from '../utils/format';

interface PublicDonationStatus {
  id: string;
  status: DonationStatus;
  amountPaise: number;
  receiptNumber: string | null;
  receiptDownloadToken: string | null;
}

export default function ThankYou() {
  const { donationId } = useParams<{ donationId: string }>();
  const [status, setStatus] = useState<PublicDonationStatus | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!donationId) return;

    let isMounted = true;
    let pollCount = 0;

    const loadStatus = async () => {
      try {
        const result = await donationApi.publicStatus(donationId);
        if (!isMounted) return;
        setStatus(result);
        setError('');

        if ((result.status === 'CREATED' || result.status === 'ATTEMPTED') && pollCount < 20) {
          pollCount += 1;
          window.setTimeout(loadStatus, 3000);
        }
      } catch (err) {
        if (isMounted) setError(getApiErrorMessage(err, 'Unable to load donation status.'));
      }
    };

    void loadStatus();

    return () => {
      isMounted = false;
    };
  }, [donationId]);

  const receiptUrl =
    status?.receiptNumber && status.receiptDownloadToken
      ? `/api/v1/receipts/${status.receiptNumber}/download?token=${encodeURIComponent(status.receiptDownloadToken)}`
      : null;

  const isPaid = status?.status === 'PAID';
  const isFailed = status?.status === 'FAILED';

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Helmet title="Donation Status | Gau Seva Kendra">
      </Helmet>

      <div className="bg-white border border-orange-100 rounded-2xl shadow-xl p-8 text-center">
        {!status && !error && (
          <>
            <Clock className="w-14 h-14 text-orange-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Checking payment status</h1>
            <p className="text-gray-600">Please wait while we confirm your payment with the backend.</p>
          </>
        )}

        {error && (
          <>
            <XCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Status unavailable</h1>
            <p className="text-red-600">{error}</p>
          </>
        )}

        {status && (
          <>
            {isPaid ? (
              <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
            ) : isFailed ? (
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            ) : (
              <Clock className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            )}

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isPaid ? 'Thank you for your donation' : isFailed ? 'Payment failed' : 'Payment confirmation pending'}
            </h1>
            <p className="text-gray-600 mb-6">
              Donation amount: <span className="font-semibold text-gray-900">{formatInr(status.amountPaise)}</span>
            </p>

            <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-sm text-gray-600 mb-6">
              Status: <span className="font-bold text-gray-900">{status.status}</span>
              {status.receiptNumber && (
                <span className="block mt-1">Receipt: <span className="font-bold">{status.receiptNumber}</span></span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              {receiptUrl && (
                <a href={receiptUrl} className="btn-primary inline-flex justify-center items-center gap-2 px-5 py-3">
                  <Download className="w-4 h-4" /> Download Receipt
                </a>
              )}
              <Link to="/donate" className="inline-flex justify-center items-center px-5 py-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">
                {isFailed ? 'Try Again' : 'Make Another Donation'}
              </Link>
            </div>

            {!isPaid && !isFailed && (
              <p className="text-xs text-gray-500 mt-6">
                Razorpay webhook confirmation can take a short moment. This page refreshes automatically.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
