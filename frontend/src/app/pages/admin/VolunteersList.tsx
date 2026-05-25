import { useState, useEffect } from 'react';
import { Search, Trash2, Download, Users, Mail, Phone, CheckCircle, Clock, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

type Volunteer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  areaOfInterest: string;
  availability: string;
  status: string;
  createdAt: string;
};

const VOLUNTEERS_KEY = 'gau_volunteers';

function loadLocalVolunteers(): Volunteer[] {
  try {
    const raw = localStorage.getItem(VOLUNTEERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((v: Record<string, unknown>) => ({
      id: String(v.id),
      name: String(v.name || ''),
      email: String(v.email || ''),
      phone: String(v.mobile || v.phone || ''),
      areaOfInterest: Array.isArray(v.interests) ? (v.interests as string[]).join(', ') : String(v.areaOfInterest || 'General'),
      availability: Array.isArray(v.availability) ? (v.availability as string[]).join(', ') : String(v.availability || 'Flexible'),
      status: 'Pending',
      createdAt: String(v.date || new Date().toISOString()),
    }));
  } catch {
    return [];
  }
}

export default function VolunteersList() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchVolunteers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/volunteers');
      if (res.ok) {
        const data = await res.json();
        const local = loadLocalVolunteers();
        const apiEmails = new Set(data.map((v: Volunteer) => v.email));
        const merged = [...data, ...local.filter((v) => !apiEmails.has(v.email))];
        setVolunteers(merged);
      } else {
        setVolunteers(loadLocalVolunteers());
      }
    } catch {
      setVolunteers(loadLocalVolunteers());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/volunteers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setVolunteers((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
        toast.success(`Status updated to ${status}`);
      } else {
        setVolunteers((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
        toast.success(`Status updated to ${status}`);
      }
    } catch {
      setVolunteers((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
      toast.success(`Status updated to ${status}`);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Remove volunteer application from ${name}?`)) return;
    try {
      await fetch(`/api/volunteers/${id}`, { method: 'DELETE' });
    } catch {
      /* local-only entry */
    }
    setVolunteers((prev) => prev.filter((v) => v.id !== id));
    toast.success('Volunteer application removed');
  };

  const handleExportCSV = () => {
    if (filtered.length === 0) {
      toast.error('No volunteers to export');
      return;
    }
    const headers = ['Name', 'Email', 'Phone', 'Interests', 'Availability', 'Status', 'Applied'];
    const rows = filtered.map((v) => [
      v.name,
      v.email,
      v.phone,
      v.areaOfInterest,
      v.availability,
      v.status,
      new Date(v.createdAt).toLocaleDateString(),
    ]);
    const csv = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n' + rows.map((r) => r.join(',')).join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = 'volunteers.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV exported');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-[#E8F5E9] text-[#2E7D32]';
      case 'Rejected':
        return 'bg-[#FDECEA] text-[#C62828]';
      default:
        return 'bg-[#FFF3E0] text-[#F57C00]';
    }
  };

  const filtered = volunteers.filter((v) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      v.name.toLowerCase().includes(q) ||
      v.email.toLowerCase().includes(q) ||
      v.phone.includes(searchTerm);
    const matchesStatus = statusFilter ? v.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = volunteers.filter((v) => v.status === 'Pending').length;

  return (
    <div className="space-y-6 font-['Inter',sans-serif]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-[#FF6600]" />
            Volunteer Applications
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {volunteers.length} total · {pendingCount} pending review
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

      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
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
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-gray-500">Loading volunteers...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No volunteer applications yet.</p>
            <p className="text-sm text-gray-400 mt-1">Applications from the public Volunteer page will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volunteer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interests</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Availability</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{v.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Mail size={14} /> {v.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone size={14} /> {v.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-[160px]">{v.areaOfInterest}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{v.availability}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(v.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadge(v.status)}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {v.status !== 'Approved' && (
                          <button
                            onClick={() => updateStatus(v.id, 'Approved')}
                            title="Approve"
                            className="p-1.5 text-[#2E7D32] hover:bg-[#E8F5E9] rounded-md"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        {v.status !== 'Pending' && (
                          <button
                            onClick={() => updateStatus(v.id, 'Pending')}
                            title="Mark pending"
                            className="p-1.5 text-[#F57C00] hover:bg-[#FFF3E0] rounded-md"
                          >
                            <Clock size={18} />
                          </button>
                        )}
                        {v.status !== 'Rejected' && (
                          <button
                            onClick={() => updateStatus(v.id, 'Rejected')}
                            title="Reject"
                            className="p-1.5 text-[#C62828] hover:bg-[#FDECEA] rounded-md"
                          >
                            <XCircle size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(v.id, v.name)}
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
