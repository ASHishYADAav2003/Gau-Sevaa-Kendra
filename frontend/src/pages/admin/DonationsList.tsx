import { useState, useEffect } from 'react';
import { Search, Download, Mail, Phone, Eye, Trash2 } from 'lucide-react';

export default function DonationsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState('All Status');

  // Initial Mock data matching the screenshot exactly
  const initialDonations = [
    { id: '1', donor: 'prerit', email: 'yadavashish200369@gmail.com', phone: '6399541242', amount: 500, payment: 'UPI', date: '31 May 2026', status: 'Success' },
    { id: '2', donor: 'prerit', email: 'hello.heoolo.work@gmail.com', phone: '6399547321', amount: 500, payment: 'UPI', date: '31 May 2026', status: 'Success' },
    { id: '3', donor: 'Test User', email: 'test@test.com', phone: '9876543210', amount: 2500, payment: 'UPI', date: '25 May 2026', status: 'Success' },
  ];

  // State with localStorage persistence
  const [donations, setDonations] = useState<any[]>(() => {
    const saved = localStorage.getItem('gauseva_donations');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return initialDonations; }
    }
    return initialDonations;
  });

  useEffect(() => {
    localStorage.setItem('gauseva_donations', JSON.stringify(donations));
  }, [donations]);

  // Derived metrics
  const totalReceived = donations.reduce((sum, d) => sum + (d.status === 'Success' ? d.amount : 0), 0);
  const successfulCount = donations.filter(d => d.status === 'Success').length;
  const pendingCount = donations.filter(d => d.status === 'Pending').length;

  // Filtering logic
  const filteredDonations = donations.filter(d => {
    const matchesSearch = 
      d.donor.toLowerCase().includes(searchTerm.toLowerCase()) || 
      d.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
      d.phone.includes(searchTerm);
    
    const matchesStatus = activeStatus === 'All Status' || d.status === activeStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Donor', 'Email', 'Phone', 'Amount', 'Payment Mode', 'Date', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredDonations.map(d => `"${d.id}","${d.donor}","${d.email}","${d.phone}",${d.amount},"${d.payment}","${d.date}","${d.status}"`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'donations_export.csv';
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete (Optional action for demo)
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this donation record?')) {
      setDonations(donations.filter(d => d.id !== id));
    }
  };

  return (
    <div className="max-w-[1400px]">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <span className="text-brand-orange text-3xl">₹</span> Donations
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            {filteredDonations.length} records · {successfulCount} successful · ₹{totalReceived.toLocaleString()} in view
          </p>
        </div>
        
        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition text-sm font-medium shadow-sm"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center h-28">
          <p className="text-xs font-semibold text-gray-500 tracking-wider mb-2">TOTAL RECEIVED</p>
          <p className="text-3xl font-bold text-green-700">₹{totalReceived.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center h-28">
          <p className="text-xs font-semibold text-gray-500 tracking-wider mb-2">SUCCESSFUL</p>
          <p className="text-3xl font-bold text-gray-900">{successfulCount}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center h-28">
          <p className="text-xs font-semibold text-gray-500 tracking-wider mb-2">PENDING</p>
          <p className="text-3xl font-bold text-orange-500">{pendingCount}</p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search donor, email, or phone..." 
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full sm:w-auto">
            <select 
              value={activeStatus}
              onChange={(e) => setActiveStatus(e.target.value)}
              className="w-full text-sm font-medium text-gray-700 border border-gray-200 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="Success">Success</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-semibold text-gray-400 tracking-wider uppercase">
                <th className="px-6 py-4">Donor</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredDonations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No donations found matching your criteria.
                  </td>
                </tr>
              ) : filteredDonations.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-6 font-medium text-gray-800">{d.donor}</td>
                  <td className="px-6 py-6 text-gray-500 space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{d.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{d.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 font-bold text-green-700">₹{d.amount.toLocaleString()}</td>
                  <td className="px-6 py-6 text-gray-600">{d.payment}</td>
                  <td className="px-6 py-6 text-gray-600">{d.date}</td>
                  <td className="px-6 py-6">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      d.status === 'Success' ? 'bg-green-50 text-green-700' : 
                      d.status === 'Pending' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Added hover actions just in case */}
                      <button onClick={() => alert(`Viewing receipt for ${d.donor}`)} className="text-gray-400 hover:text-blue-600 transition" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(d.id)} className="text-gray-400 hover:text-red-500 transition" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
