import { useEffect, useMemo, useState } from 'react';
import { Download, Mail, Phone, Search } from 'lucide-react';
import { adminDonationApi } from '../../api/services';
import { downloadBlob, getApiErrorMessage } from '../../api/client';
import type { Donation, DonationStatus } from '../../api/types';
import { formatDate, formatInr } from '../../utils/format';

const statusOptions: Array<DonationStatus | ''> = ['', 'CREATED', 'ATTEMPTED', 'PAID', 'FAILED'];

const statusClass: Record<DonationStatus, string> = {
  CREATED: 'bg-gray-50 text-gray-700',
  ATTEMPTED: 'bg-orange-50 text-orange-700',
  PAID: 'bg-green-50 text-green-700',
  FAILED: 'bg-red-50 text-red-700',
};

export default function DonationsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<DonationStatus | ''>('');
  const [donations, setDonations] = useState<Donation[]>([]);
  const [total, setTotal] = useState(0);
  const [summaryAmount, setSummaryAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDonations = async () => {
    setIsLoading(true);
    try {
      const result = await adminDonationApi.list({
        pageSize: 100,
        search: searchTerm || undefined,
        status: status || undefined,
      });
      setDonations(result.items);
      setTotal(result.pagination.total);
      setSummaryAmount(result.summary.totalAmountPaise);
      setError('');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load donations.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadDonations();
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [searchTerm, status]);

  const paidCount = useMemo(() => donations.filter((donation) => donation.status === 'PAID').length, [donations]);
  const pendingCount = useMemo(() => donations.filter((donation) => donation.status === 'CREATED' || donation.status === 'ATTEMPTED').length, [donations]);

  const exportDonations = async () => {
    try {
      const blob = await adminDonationApi.export();
      downloadBlob(blob, `donations-${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to export donations.'));
    }
  };

  return (
    <div className="max-w-[1400px]">
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <span className="text-brand-orange text-3xl">Rs.</span> Donations
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            {total} backend records · {paidCount} paid in view · {formatInr(summaryAmount)} total in view
          </p>
        </div>

        <button
          onClick={() => void exportDonations()}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition text-sm font-medium shadow-sm"
        >
          <Download className="w-4 h-4" /> Export XLSX
        </button>
      </div>

      {error && <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 mb-6 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-28">
          <p className="text-xs font-semibold text-gray-500 tracking-wider mb-2">TOTAL RECEIVED</p>
          <p className="text-3xl font-bold text-green-700">{formatInr(summaryAmount)}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-28">
          <p className="text-xs font-semibold text-gray-500 tracking-wider mb-2">PAID IN VIEW</p>
          <p className="text-3xl font-bold text-gray-900">{paidCount}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-28">
          <p className="text-xs font-semibold text-gray-500 tracking-wider mb-2">PENDING IN VIEW</p>
          <p className="text-3xl font-bold text-orange-500">{pendingCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search donor, phone, order, or payment..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as DonationStatus | '')}
            className="w-full sm:w-auto text-sm font-medium text-gray-700 border border-gray-200 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:border-brand-green"
          >
            {statusOptions.map((option) => (
              <option key={option || 'all'} value={option}>{option || 'All Status'}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-semibold text-gray-400 tracking-wider uppercase">
                <th className="px-6 py-4">Donor</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {isLoading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">Loading donations...</td></tr>
              ) : donations.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">No donations found.</td></tr>
              ) : donations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-6">
                    <p className="font-medium text-gray-800">{donation.donor?.fullName || donation.donorDisplayName || 'Anonymous'}</p>
                    {donation.receiptNumber && <p className="text-xs text-gray-400 mt-1">Receipt {donation.receiptNumber}</p>}
                  </td>
                  <td className="px-6 py-6 text-gray-500 space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{donation.donor?.email || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{donation.donor?.phone || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 font-bold text-green-700">{formatInr(donation.amountPaise)}</td>
                  <td className="px-6 py-6 text-gray-600">{donation.donationType}</td>
                  <td className="px-6 py-6 text-gray-600">{donation.paymentMethod || donation.razorpayPaymentId || '-'}</td>
                  <td className="px-6 py-6 text-gray-600">{formatDate(donation.createdAt)}</td>
                  <td className="px-6 py-6">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusClass[donation.status]}`}>
                      {donation.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
