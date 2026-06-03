import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, Plus, List, Grid, Star, Edit, Trash2 } from 'lucide-react';

interface Animal {
  id: string;
  nameEn: string;
  nameHi: string;
  tag: string;
  species: string;
  healthStatus: string;
  rescueDate: string;
  cost: number;
  isStarred: boolean;
  photos?: string[];
  rawFormData?: any;
}

export default function AnimalsList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [healthFilter, setHealthFilter] = useState('All Health Status');
  const [speciesFilter, setSpeciesFilter] = useState('All Species');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const [animals, setAnimals] = useState<Animal[]>(() => {
    const saved = localStorage.getItem('animalsList');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { 
        id: '1', 
        nameEn: 'shubhi', 
        nameHi: 'shubhi', 
        tag: 'GSK-2490',
        species: 'Cow',
        healthStatus: 'Critical',
        rescueDate: '18 May 2026',
        cost: 1250,
        isStarred: true
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('animalsList', JSON.stringify(animals));
  }, [animals]);

  const filteredAnimals = animals.filter((animal: Animal) => {
    const matchesSearch = animal.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          animal.tag.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHealth = healthFilter === 'All Health Status' || animal.healthStatus === healthFilter;
    const matchesSpecies = speciesFilter === 'All Species' || animal.species === speciesFilter;
    return matchesSearch && matchesHealth && matchesSpecies;
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'Name (EN)', 'Name (HI)', 'Tag', 'Species', 'Health Status', 'Rescue Date', 'Cost', 'Starred'];
    const csvContent = [
      headers.join(','),
      ...filteredAnimals.map((a: Animal) => 
        `"${a.id}","${a.nameEn}","${a.nameHi}","${a.tag}","${a.species}","${a.healthStatus}","${a.rescueDate}","${a.cost}","${a.isStarred}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'animals_list.csv';
    link.click();
  };

  const handleToggleStar = (id: string) => {
    setAnimals((prev: Animal[]) => prev.map((a: Animal) => a.id === id ? { ...a, isStarred: !a.isStarred } : a));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this animal?')) {
      setAnimals((prev: Animal[]) => prev.filter((a: Animal) => a.id !== id));
    }
  };

  return (
    <div className="max-w-[1400px]">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Manage Animals <span className="text-gray-400 font-normal">/ पशु प्रबंधित करें</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">Dashboard &gt; Animals</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition text-sm font-medium shadow-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => navigate('/admin/animals/add')} className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-[#e06612] transition text-sm font-medium shadow-sm">
            <Plus className="w-4 h-4" /> Add New Animal
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search animals by name or tag..." 
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-400" />
            <select 
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-gray-300 cursor-pointer"
              value={healthFilter}
              onChange={(e) => setHealthFilter(e.target.value)}
            >
              <option>All Health Status</option>
              <option>Critical</option>
              <option>Treatment</option>
              <option>Recovering</option>
              <option>Healthy</option>
            </select>
            <select 
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-gray-300 cursor-pointer"
              value={speciesFilter}
              onChange={(e) => setSpeciesFilter(e.target.value)}
            >
              <option>All Species</option>
              <option>Cow</option>
              <option>Bull</option>
              <option>Calf</option>
            </select>
            
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden ml-2">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 transition ${viewMode === 'list' ? 'bg-gray-100 text-gray-800' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <div className="w-[1px] h-4 bg-gray-200"></div>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 transition ${viewMode === 'grid' ? 'bg-gray-100 text-gray-800' : 'bg-white text-gray-400 hover:text-gray-700 hover:bg-gray-50'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* View Content */}
        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-semibold text-gray-400 tracking-wider uppercase">
                  <th className="px-6 py-4">Animal</th>
                  <th className="px-6 py-4">Species</th>
                  <th className="px-6 py-4">Health Status</th>
                  <th className="px-6 py-4">Rescue Date</th>
                  <th className="px-6 py-4">Cost/Mo</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredAnimals.length > 0 ? filteredAnimals.map((animal: Animal) => (
                  <tr key={animal.id} className="hover:bg-gray-50/50 transition group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 shrink-0">
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
                            {animal.nameEn.substring(0, 3)}
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {animal.nameEn} <span className="text-gray-400 font-normal">({animal.nameHi})</span>
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{animal.tag}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{animal.species}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium ${
                        animal.healthStatus === 'Critical' ? 'bg-red-50 text-red-600' :
                        animal.healthStatus === 'Treatment' ? 'bg-orange-50 text-orange-600' :
                        animal.healthStatus === 'Recovering' ? 'bg-yellow-50 text-yellow-600' :
                        'bg-green-50 text-green-600'
                      }`}>
                        {animal.healthStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{animal.rescueDate}</td>
                    <td className="px-6 py-4 text-gray-600">₹{Number(animal.cost).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3 opacity-80 group-hover:opacity-100 transition">
                        <button onClick={() => handleToggleStar(animal.id)} className={`p-1.5 rounded ${animal.isStarred ? 'bg-orange-50 text-orange-500' : 'text-gray-400'} hover:bg-orange-100 hover:text-orange-500 transition`}>
                          <Star className={`w-4 h-4 ${animal.isStarred ? 'fill-orange-500' : ''}`} />
                        </button>
                        <button onClick={() => navigate(`/admin/animals/edit/${animal.id}`)} className="p-1.5 text-gray-400 hover:text-gray-700 transition">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(animal.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                      No animals found matching your search and filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-gray-50/30">
            {filteredAnimals.length > 0 ? filteredAnimals.map((animal: Animal) => (
              <div key={animal.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition group relative">
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button onClick={() => handleToggleStar(animal.id)} className={`p-1.5 rounded-full ${animal.isStarred ? 'bg-orange-50 text-orange-500' : 'bg-gray-50 text-gray-400'} hover:bg-orange-100 transition`}>
                    <Star className={`w-4 h-4 ${animal.isStarred ? 'fill-orange-500' : ''}`} />
                  </button>
                </div>
                <div className="flex flex-col items-center mb-4 mt-2">
                   <div className="w-16 h-16 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 mb-3">
                     <div className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-400">
                       {animal.nameEn.substring(0, 3)}
                     </div>
                   </div>
                   <h3 className="font-semibold text-gray-800 text-center">{animal.nameEn} <span className="text-gray-400 font-normal block text-xs">({animal.nameHi})</span></h3>
                   <p className="text-xs text-gray-400 mt-1">{animal.tag}</p>
                </div>
                <div className="space-y-2 text-sm text-gray-600 border-t border-gray-100 pt-3">
                   <div className="flex justify-between"><span>Species:</span> <span className="font-medium">{animal.species}</span></div>
                   <div className="flex justify-between"><span>Status:</span> 
                     <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium ${
                        animal.healthStatus === 'Critical' ? 'bg-red-50 text-red-600' :
                        animal.healthStatus === 'Treatment' ? 'bg-orange-50 text-orange-600' :
                        animal.healthStatus === 'Recovering' ? 'bg-yellow-50 text-yellow-600' :
                        'bg-green-50 text-green-600'
                      }`}>
                        {animal.healthStatus}
                      </span>
                   </div>
                   <div className="flex justify-between"><span>Date:</span> <span className="font-medium">{animal.rescueDate}</span></div>
                   <div className="flex justify-between"><span>Cost:</span> <span className="font-medium">₹{Number(animal.cost).toLocaleString()}</span></div>
                </div>
                <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                   <button onClick={() => navigate(`/admin/animals/edit/${animal.id}`)} className="p-1.5 text-gray-400 hover:text-gray-700 transition"><Edit className="w-4 h-4" /></button>
                   <button onClick={() => handleDelete(animal.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-8 text-center text-gray-500 text-sm">
                 No animals found matching your search and filters.
              </div>
            )}
          </div>
        )}
        
        {/* Footer Pagination Info */}
        <div className="p-4 border-t border-gray-100 text-xs text-gray-500">
          Showing {filteredAnimals.length > 0 ? 1 : 0} to {filteredAnimals.length} of {filteredAnimals.length} entries
        </div>

      </div>
    </div>
  );
}
