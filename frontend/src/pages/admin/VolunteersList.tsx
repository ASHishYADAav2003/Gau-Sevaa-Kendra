import { useState } from 'react';
import { Search } from 'lucide-react';

interface Volunteer {
  id: string;
  name: string;
  phone: string;
  email: string;
  joinedAt: string;
  status: string;
  availability?: string;
  message?: string;
}

export default function VolunteersList() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>(() => {
    const saved = localStorage.getItem('gauseva_volunteers');
    if (saved) return JSON.parse(saved);
    const defaultVolunteers = [
      { id: '1', name: 'Ravi Kumar', phone: '+91 9876543210', email: 'ravi@example.com', joinedAt: '15 May 2026', status: 'Active' },
      { id: '2', name: 'Anita Singh', phone: '+91 9876543211', email: 'anita@example.com', joinedAt: '10 Apr 2026', status: 'Active' },
      { id: '3', name: 'Vikram Das', phone: '+91 9876543212', email: 'vikram@example.com', joinedAt: '01 Mar 2026', status: 'Inactive' },
    ];
    localStorage.setItem('gauseva_volunteers', JSON.stringify(defaultVolunteers));
    return defaultVolunteers;
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    const updated = volunteers.map(v => v.id === id ? { ...v, status: newStatus } : v);
    setVolunteers(updated);
    localStorage.setItem('gauseva_volunteers', JSON.stringify(updated));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Volunteers Management</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search volunteers..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Contact Info</th>
                <th className="p-4 font-semibold">Joined Date</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {volunteers.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-medium text-gray-900">{v.name}</td>
                  <td className="p-4 text-gray-600">
                    <p>{v.phone}</p>
                    <p className="text-xs text-gray-400">{v.email}</p>
                  </td>
                  <td className="p-4 text-gray-600">{v.joinedAt}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      v.status === 'Active' ? 'bg-green-100 text-green-700' : 
                      v.status === 'Pending Review' ? 'bg-amber-100 text-amber-700' :
                      v.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {v.status === 'Pending Review' && (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleStatusChange(v.id, 'Active')}
                          className="px-3 py-1 bg-green-50 text-green-600 hover:bg-green-100 rounded-md text-xs font-semibold transition"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => handleStatusChange(v.id, 'Rejected')}
                          className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-xs font-semibold transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}
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
