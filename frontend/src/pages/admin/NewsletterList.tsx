import { useState, useEffect } from 'react';
import { Mail, Search, Trash2 } from 'lucide-react';

interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export default function NewsletterList() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('gauseva_newsletter');
    if (saved) {
      setSubscribers(JSON.parse(saved));
    }
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this subscriber?')) {
      const updated = subscribers.filter(s => s.id !== id);
      setSubscribers(updated);
      localStorage.setItem('gauseva_newsletter', JSON.stringify(updated));
    }
  };

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Mail className="w-6 h-6 text-brand-orange" />
          Newsletter Subscribers
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-full max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search subscribers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green bg-white"
            />
          </div>
          <div className="text-sm text-gray-500 font-medium">
            Total: {subscribers.length}
          </div>
        </div>

        {subscribers.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Mail className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-lg font-medium">No subscribers yet.</p>
            <p className="text-sm mt-1">When users subscribe via the footer, they will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                  <th className="p-4 font-semibold">Email Address</th>
                  <th className="p-4 font-semibold">Subscribed On</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredSubscribers.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition group">
                    <td className="p-4 font-medium text-gray-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                        {s.email.charAt(0).toUpperCase()}
                      </div>
                      {s.email}
                    </td>
                    <td className="p-4 text-gray-600">{s.subscribedAt}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(s.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                        title="Remove Subscriber"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredSubscribers.length === 0 && searchTerm && (
              <div className="p-8 text-center text-gray-500">
                No subscribers match your search.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
