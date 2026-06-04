import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Edit, Filter, Grid, List, Plus, Search, Trash2 } from 'lucide-react';
import { animalApi } from '../../api/services';
import { downloadBlob, getApiErrorMessage } from '../../api/client';
import type { Animal } from '../../api/types';
import { formatDate } from '../../utils/format';

const statuses = ['', 'ACTIVE', 'UNDER_TREATMENT', 'ADOPTED', 'DECEASED'];

export default function AnimalsList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAnimals = async () => {
    setIsLoading(true);
    try {
      const result = await animalApi.listAdmin({ pageSize: 100, status: statusFilter || undefined });
      setAnimals(result.items);
      setError('');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load animals.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadAnimals();
  }, [statusFilter]);

  const filteredAnimals = animals.filter((animal) => {
    const query = searchTerm.toLowerCase();
    return animal.name.toLowerCase().includes(query) || animal.tagId.toLowerCase().includes(query) || (animal.breed || '').toLowerCase().includes(query);
  });

  const handleExport = async () => {
    try {
      const blob = await animalApi.export();
      downloadBlob(blob, `animals-${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to export animals.'));
    }
  };

  const handleDelete = async (animal: Animal) => {
    if (!window.confirm(`Delete ${animal.name} (${animal.tagId})? Linked campaigns and expenses will remain but lose this animal link.`)) return;

    try {
      await animalApi.delete(animal.id);
      await loadAnimals();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to delete animal.'));
    }
  };

  return (
    <div className="max-w-[1400px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Animals</h2>
          <p className="text-sm text-gray-500 mt-1">Create, update, filter, and export registered animals.</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => void handleExport()} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition text-sm font-medium shadow-sm">
            <Download className="w-4 h-4" /> Export XLSX
          </button>
          <button onClick={() => navigate('/admin/animals/add')} className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-700 transition text-sm font-medium shadow-sm">
            <Plus className="w-4 h-4" /> Add Animal
          </button>
        </div>
      </div>

      {error && <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 mb-6 text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search animals by name, tag, or breed..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-400" />
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              {statuses.map((status) => <option key={status || 'all'} value={status}>{status || 'All Status'}</option>)}
            </select>

            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden ml-2">
              <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 text-gray-800' : 'bg-white text-gray-400'}`}>
                <List className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-800' : 'bg-white text-gray-400'}`}>
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-semibold text-gray-400 tracking-wider uppercase">
                  <th className="px-6 py-4">Animal</th>
                  <th className="px-6 py-4">Breed</th>
                  <th className="px-6 py-4">Health</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Rescue Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {isLoading ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading animals...</td></tr>
                ) : filteredAnimals.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No animals found.</td></tr>
                ) : filteredAnimals.map((animal) => (
                  <tr key={animal.id} className="hover:bg-gray-50/50 transition group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <AnimalAvatar animal={animal} />
                        <div>
                          <p className="font-semibold text-gray-800">{animal.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{animal.tagId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{animal.breed || '-'}</td>
                    <td className="px-6 py-4 text-gray-600">{animal.healthStatus || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-700">
                        {animal.status.replaceAll('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(animal.rescueDate)}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => navigate(`/admin/animals/edit/${animal.id}`)} className="p-1.5 text-gray-400 hover:text-gray-700 transition" title="Edit animal">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => void handleDelete(animal)} className="p-1.5 text-gray-400 hover:text-red-600 transition" title="Delete animal">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-gray-50/30">
            {filteredAnimals.map((animal) => (
              <div key={animal.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
                <AnimalAvatar animal={animal} large />
                <h3 className="font-semibold text-gray-800 text-center mt-3">{animal.name}</h3>
                <p className="text-xs text-gray-400 text-center mt-1">{animal.tagId}</p>
                <div className="space-y-2 text-sm text-gray-600 border-t border-gray-100 pt-3 mt-4">
                  <div className="flex justify-between"><span>Breed:</span> <span className="font-medium">{animal.breed || '-'}</span></div>
                  <div className="flex justify-between"><span>Status:</span> <span className="font-medium">{animal.status.replaceAll('_', ' ')}</span></div>
                  <div className="flex justify-between"><span>Rescued:</span> <span className="font-medium">{formatDate(animal.rescueDate)}</span></div>
                </div>
                <button onClick={() => navigate(`/admin/animals/edit/${animal.id}`)} className="mt-4 w-full rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Edit
                </button>
                <button onClick={() => void handleDelete(animal)} className="mt-2 w-full rounded-lg border border-red-100 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="p-4 border-t border-gray-100 text-xs text-gray-500">
          Showing {filteredAnimals.length} of {animals.length} entries
        </div>
      </div>
    </div>
  );
}

function AnimalAvatar({ animal, large = false }: { animal: Animal; large?: boolean }) {
  const image = animal.images?.[0]?.imageUrl;
  const size = large ? 'w-20 h-20 mx-auto' : 'w-10 h-10';
  return (
    <div className={`${size} rounded-full border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 shrink-0`}>
      {image ? (
        <img src={image} alt={animal.name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-xs font-bold text-gray-400">{animal.name.substring(0, 3).toUpperCase()}</span>
      )}
    </div>
  );
}
