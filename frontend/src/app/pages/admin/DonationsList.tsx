import { useState, useEffect } from 'react';
import { Search, Trash2, Download, IndianRupee, Mail, Phone, CheckCircle, Clock, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

type Donation = {
  id: string;
  donorName: string;
  email: string;
  phone: string;
  panCard?: string | null;
  amount: number;
  paymentMethod: string;
  isRecurring: boolean;
  paymentStatus: string;
  date: string;
};

const DONATIONS_KEY = 'gau_donations';

function loadLocalDonations(): Donation[] {
  try {
    const raw = localStorage.getItem(DONATIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((d: Record<string, unknown>) => ({
      id: String(d.id),
      donorName: String(d.donorName || d.name || 'Anonymous'),
      email: String(d.email || ''),
      phone: String(d.phone || ''),
      panCard: d.panCard ? String(d.panCard) : null,
      amount: Number(d.amount) || 0,
      paymentMethod: String(d.paymentMethod || 'UPI'),
      isRecurring: Boolean(d.isRecurring),
      paymentStatus: 'Success',
      date: String(d.date || new Date().toISOString()),
    }));
  } catch {
    return [];
  }
}

const paymentLabels: Record<string, string> = {
  upi: 'UPI',
  card: 'Card',
  netbanking: 'Net Banking',
};

export default function DonationsList() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchDonations = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/donations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        const local = loadLocalDonations();
        const apiIds = new Set(data.map((d: Donation) => d.id));
        const merged = [...data, ...local.filter((d) => !apiIds.has(d.id))];
        setDonations(merged);
      } else {
        setDonations(loadLocalDonations());
      }
    } catch {
      setDonations(loadLocalDonations());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const updateStatus = async (id: string, paymentStatus: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`/api/donations/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentStatus }),
      });
    } catch {
      /* local-only */
    }
    setDonations((prev) => prev.map((d) => (d.id === id ? { ...d, paymentStatus } : d)));
    toast.success(`Status updated to ${paymentStatus}`);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Remove donation record from ${name}?`)) return;
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`/api/donations/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch {
      /* local */
    }
    setDonations((prev) => prev.filter((d) => d.id !== id));
    toast.success('Donation record removed');
  };

  const handleExportCSV = () => {
    if (filtered.length === 0) {
      toast.error('No donations to export');
      return;
    }
    const headers = ['Donor', 'Email', 'Phone', 'Amount', 'Method', 'Recurring', 'Status', 'Date'];
    const rows = filtered.map((d) => [
      d.donorName,
      d.email,
      d.phone,
      d.amount,
      d.paymentMethod,
      d.isRecurring ? 'Yes' : 'No',
      d.paymentStatus,
      new Date(d.date).toLocaleDateString(),
    ]);
    const csv = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n' + rows.map((r) => r.join(',')).join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = 'donations.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV exported');
  };

  const filtered = donations.filter((d) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      d.donorName.toLowerCase().includes(q) ||
      d.email.toLowerCase().includes(q) ||
      d.phone.includes(searchTerm);
    const matchesStatus = statusFilter ? d.paymentStatus === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const totalAmount = filtered.reduce((s, d) => s + (d.paymentStatus === 'Success' ? d.amount : 0), 0);
  const successCount = donations.filter((d) => d.paymentStatus === 'Success').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Success':
        return 'bg-[#E8F5E9] text-[#2E7D32]';
      case 'Failed':
        return 'bg-[#FDECEA] text-[#C62828]';
      default:
        return 'bg-[#FFF3E0] text-[#F57C00]';
    }
  };

  return (
    <div className="space-y-6 font-['Inter',sans-serif]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <IndianRupee className="w-7 h-7 text-[#FF6600]" />
            Donations
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {donations.length} records · {successCount} successful · ₹{totalAmount.toLocaleString('en-IN')} in view
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Download size={16} className="mr-2" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-[#EBEBEB] p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase font-medium">Total Received</p>
          <p className="text-2xl font-bold text-[#2E7D32] mt-1">
            ₹{donations.filter((d) => d.paymentStatus === 'Success').reduce((s, d) => s + d.amount, 0).toLocaleString('en-IN')}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-[#EBEBEB] p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase font-medium">Successful</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{successCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-[#EBEBEB] p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase font-medium">Pending</p>
          <p className="text-2xl font-bold text-[#F57C00] mt-1">
            {donations.filter((d) => d.paymentStatus === 'Pending').length}
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search donor, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-[#FF6600] focus:border-[#FF6600]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border-gray-300 rounded-md text-sm py-2 px-3 focus:ring-[#FF6600] focus:border-[#FF6600]"
          >
            <option value="">All Status</option>
            <option value="Success">Success</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-gray-500">Loading donations...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <IndianRupee className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No donations yet.</p>
            <p className="text-sm text-gray-400 mt-1">Donations from the public Donate page will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{d.donorName}</div>
                      {d.isRecurring && (
                        <span className="text-xs text-orange-600 font-medium">Monthly</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Mail size={14} /> {d.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone size={14} /> {d.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-[#2E7D32]">₹{d.amount.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                      {paymentLabels[d.paymentMethod] || d.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(d.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadge(d.paymentStatus)}`}>
                        {d.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {d.paymentStatus !== 'Success' && (
                          <button
                            onClick={() => updateStatus(d.id, 'Success')}
                            title="Mark success"
                            className="p-1.5 text-[#2E7D32] hover:bg-[#E8F5E9] rounded-md"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        {d.paymentStatus !== 'Pending' && (
                          <button
                            onClick={() => updateStatus(d.id, 'Pending')}
                            title="Mark pending"
                            className="p-1.5 text-[#F57C00] hover:bg-[#FFF3E0] rounded-md"
                          >
                            <Clock size={18} />
                          </button>
                        )}
                        {d.paymentStatus !== 'Failed' && (
                          <button
                            onClick={() => updateStatus(d.id, 'Failed')}
                            title="Mark failed"
                            className="p-1.5 text-[#C62828] hover:bg-[#FDECEA] rounded-md"
                          >
                            <XCircle size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(d.id, d.donorName)}
                          title="Delete"
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
