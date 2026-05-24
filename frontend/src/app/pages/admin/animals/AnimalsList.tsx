import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  List as ListIcon,
  Edit,
  Trash2,
  PlusCircle,
  AlertTriangle,
  Download,
  Dog,
  MapPin
} from 'lucide-react';
import toast from 'react-hot-toast';

// Mock data
const initialAnimals = [
  { id: 1, nameEn: 'Gauri', nameHi: 'गौरी', tagId: 'GSK-10021', species: 'Cow', healthStatus: 'Healthy', urgencyLevel: 'Stable', cost: 2500, photo: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=150&q=80', rescueDate: '2026-01-01', location: 'City Square' },
  { id: 2, nameEn: 'Nandi', nameHi: 'नंदी', tagId: 'GSK-10022', species: 'Bull', healthStatus: 'Recovering', urgencyLevel: 'Moderate', cost: 3000, photo: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=150&q=80', rescueDate: '2026-04-05', location: 'Highway 10' },
  { id: 3, nameEn: 'Kapila', nameHi: 'कपिला', tagId: 'GSK-10023', species: 'Cow', healthStatus: 'Critical', urgencyLevel: 'Urgent', cost: 5500, photo: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=150&q=80', rescueDate: '2026-05-12', location: 'Market Area' },
  { id: 4, nameEn: 'Gopal', nameHi: 'गोपाल', tagId: 'GSK-10024', species: 'Calf', healthStatus: 'Under Treatment', urgencyLevel: 'Moderate', cost: 1500, photo: 'https://images.unsplash.com/photo-1605001088484-9541a7d18bf0?auto=format&fit=crop&w=150&q=80', rescueDate: '2026-05-18', location: 'Village Road' },
  { id: 5, nameEn: 'Surabhi', nameHi: 'सुरभि', tagId: 'GSK-10025', species: 'Cow', healthStatus: 'Healthy', urgencyLevel: 'Stable', cost: 2500, photo: 'https://images.unsplash.com/photo-1594056637372-68045e7e17bb?auto=format&fit=crop&w=150&q=80', rescueDate: '2025-10-20', location: 'North District' },
];

export default function AnimalsList() {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [animals, setAnimals] = useState<any[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [animalToDelete, setAnimalToDelete] = useState<any>(null);
  
  // Filters
  const [healthFilter, setHealthFilter] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('animals');
    if (stored) {
      setAnimals(JSON.parse(stored));
    } else {
      setAnimals(initialAnimals);
      localStorage.setItem('animals', JSON.stringify(initialAnimals));
    }
  }, []);

  const getHealthBadgeColor = (status: string) => {
    switch(status) {
      case 'Healthy': return 'bg-[#E8F5E9] text-[#2E7D32]';
      case 'Recovering': return 'bg-[#FFFDE7] text-[#FBC02D]';
      case 'Under Treatment': return 'bg-[#FFF3E0] text-[#F57C00]';
      case 'Critical': return 'bg-[#FDECEA] text-[#C62828]';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const openDeleteModal = (animal: any) => {
    setAnimalToDelete(animal);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (animalToDelete) {
      const newAnimals = animals.filter(a => a.id !== animalToDelete.id);
      setAnimals(newAnimals);
      localStorage.setItem('animals', JSON.stringify(newAnimals));
      toast.success(`${animalToDelete.nameEn} has been removed.`, { style: { borderRadius: '20px', background: '#E8F5E9', color: '#2E7D32' } });
      setDeleteModalOpen(false);
      setAnimalToDelete(null);
    }
  };

  const handleExportCSV = () => {
    if (animals.length === 0) {
      toast.error('No animals to export', { style: { borderRadius: '20px', background: '#FDECEA', color: '#C62828' } });
      return;
    }
    
    const headers = ['Tag ID', 'Name (EN)', 'Name (HI)', 'Species', 'Health Status', 'Urgency', 'Cost/Mo', 'Rescue Date'];
    const rows = filteredAnimals.map(a => [
      a.tagId,
      a.nameEn,
      a.nameHi,
      a.species,
      a.healthStatus,
      a.urgencyLevel,
      a.cost,
      a.rescueDate || ''
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + '\n' 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "animals_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CSV Exported Successfully', { style: { borderRadius: '20px', background: '#E8F5E9', color: '#2E7D32' } });
  };

  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = animal.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          animal.nameHi?.includes(searchTerm) ||
                          animal.tagId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHealth = healthFilter ? animal.healthStatus === healthFilter : true;
    const matchesSpecies = speciesFilter ? animal.species === speciesFilter : true;
    
    return matchesSearch && matchesHealth && matchesSpecies;
  });

  return (
    <div className="font-['Inter',sans-serif] space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Manage Animals <span className="font-['Noto_Sans_Devanagari'] text-[#757575] font-normal">/ पशु प्रबंधित करें</span></h1>
          <p className="text-[13px] text-[#757575] mt-1">Dashboard &gt; Animals</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleExportCSV}
            className="h-[40px] px-4 border border-[#EBEBEB] rounded-[8px] text-[13px] font-medium text-gray-700 bg-white hover:bg-[#F5F5F0] transition-colors flex items-center shadow-sm"
          >
            <Download size={16} className="mr-2 text-[#757575]" />
            Export CSV
          </button>
          <Link
            to="/admin/animals/add"
            className="h-[40px] px-4 rounded-[8px] text-[13px] font-medium text-white bg-[#FF6600] hover:bg-[#E55A00] transition-colors flex items-center shadow-sm"
          >
            <PlusCircle size={16} className="mr-2" />
            Add New Animal
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-[12px] border border-[#EBEBEB] shadow-sm flex flex-col overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-[#EBEBEB] flex flex-col md:flex-row justify-between gap-4 items-center bg-[#FAFAFA]">
          
          {/* Search */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={16} className="text-[#757575]" />
            </div>
            <input
              type="text"
              placeholder="Search animals by name or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full h-[36px] pl-9 pr-3 rounded-[8px] border border-[#EBEBEB] text-[13px] focus:outline-none focus:ring-1 focus:ring-[#FF6600] focus:border-[#FF6600] transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter size={14} className="text-[#757575]" />
              <select
                value={healthFilter}
                onChange={(e) => setHealthFilter(e.target.value)}
                className="block w-full sm:w-auto h-[36px] px-3 border border-[#EBEBEB] bg-white rounded-[8px] text-[13px] focus:outline-none focus:ring-1 focus:ring-[#FF6600] focus:border-[#FF6600]"
              >
                <option value="">All Health Status</option>
                <option value="Healthy">Healthy</option>
                <option value="Recovering">Recovering</option>
                <option value="Under Treatment">Under Treatment</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <select
              value={speciesFilter}
              onChange={(e) => setSpeciesFilter(e.target.value)}
              className="block w-full sm:w-auto h-[36px] px-3 border border-[#EBEBEB] bg-white rounded-[8px] text-[13px] focus:outline-none focus:ring-1 focus:ring-[#FF6600] focus:border-[#FF6600]"
            >
              <option value="">All Species</option>
              <option value="Cow">Cow</option>
              <option value="Calf">Calf</option>
              <option value="Bull">Bull</option>
            </select>

            <div className="flex bg-gray-100 rounded-[8px] p-1 border border-[#EBEBEB]">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-[4px] ${viewMode === 'table' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <ListIcon size={16} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-[4px] ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Content View */}
        {filteredAnimals.length === 0 ? (
          <div className="text-center py-12 text-[#757575]">
            <div className="flex flex-col items-center justify-center">
              <Dog size={32} className="text-[#EBEBEB] mb-2" />
              <p className="text-[13px]">No animals found matching your criteria.</p>
            </div>
          </div>
        ) : viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#EBEBEB] bg-white">
                  <th className="py-3 px-5 text-[12px] font-medium text-[#757575] uppercase tracking-wider">Animal</th>
                  <th className="py-3 px-5 text-[12px] font-medium text-[#757575] uppercase tracking-wider">Species</th>
                  <th className="py-3 px-5 text-[12px] font-medium text-[#757575] uppercase tracking-wider">Health Status</th>
                  <th className="py-3 px-5 text-[12px] font-medium text-[#757575] uppercase tracking-wider">Rescue Date</th>
                  <th className="py-3 px-5 text-[12px] font-medium text-[#757575] uppercase tracking-wider text-right">Cost/Mo</th>
                  <th className="py-3 px-5 text-[12px] font-medium text-[#757575] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBEB]">
                {filteredAnimals.map((animal) => (
                  <tr key={animal.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="py-3 px-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-[8px] object-cover border border-[#EBEBEB]" src={animal.photo} alt={animal.nameEn} />
                        </div>
                        <div className="ml-3">
                          <div className="text-[13px] font-medium text-gray-900">{animal.nameEn} <span className="font-['Noto_Sans_Devanagari'] text-[#757575] text-[11px] ml-1">({animal.nameHi})</span></div>
                          <div className="text-[11px] text-[#757575]">{animal.tagId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-5 whitespace-nowrap">
                      <div className="text-[13px] text-gray-900">{animal.species}</div>
                    </td>
                    <td className="py-3 px-5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 inline-flex text-[11px] font-medium rounded-[20px] ${getHealthBadgeColor(animal.healthStatus)}`}>
                        {animal.healthStatus}
                      </span>
                    </td>
                    <td className="py-3 px-5 whitespace-nowrap text-[13px] text-[#757575]">
                      {animal.rescueDate ? new Date(animal.rescueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                    </td>
                    <td className="py-3 px-5 whitespace-nowrap text-right text-[13px] font-medium text-[#2E7D32]">
                      ₹{animal.cost.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-5 whitespace-nowrap text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-[#757575] hover:text-[#FF6600] hover:bg-[#FFF3E0] rounded-[6px] mr-1 transition-colors">
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => openDeleteModal(animal)}
                        className="p-1.5 text-[#757575] hover:text-[#C62828] hover:bg-[#FDECEA] rounded-[6px] transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAnimals.map((animal) => (
                <div key={animal.id} className="bg-white border border-[#EBEBEB] rounded-[12px] overflow-hidden shadow-sm hover:border-[#FF6600]/30 hover:shadow-md transition-all group">
                  <div className="h-40 overflow-hidden relative">
                    <img src={animal.photo} alt={animal.nameEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-0.5 text-[11px] font-medium rounded-[20px] shadow-sm ${getHealthBadgeColor(animal.healthStatus)}`}>
                        {animal.healthStatus}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-[15px] font-medium text-gray-900 leading-tight">{animal.nameEn}</h3>
                        <p className="text-[12px] text-[#757575] font-['Noto_Sans_Devanagari'] leading-tight mt-0.5">{animal.nameHi}</p>
                      </div>
                      <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-[4px]">{animal.tagId}</span>
                    </div>
                    
                    <div className="flex items-center text-[11px] text-[#757575] mb-4 space-x-3">
                      <span className="flex items-center"><MapPin size={12} className="mr-1"/> {animal.location || 'Shelter'}</span>
                      <span>•</span>
                      <span>{animal.species}</span>
                    </div>
                    
                    <div className="pt-3 border-t border-[#EBEBEB] flex justify-between items-center">
                      <span className="text-[13px] font-medium text-[#2E7D32]">₹{animal.cost.toLocaleString('en-IN')}/mo</span>
                      <div className="flex space-x-1">
                        <button className="p-1.5 text-[#757575] hover:text-[#FF6600] hover:bg-[#FFF3E0] rounded-[6px] transition-colors">
                          <Edit size={14} />
                        </button>
                        <button onClick={() => openDeleteModal(animal)} className="p-1.5 text-[#757575] hover:text-[#C62828] hover:bg-[#FDECEA] rounded-[6px] transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination (Static for UI) */}
        {filteredAnimals.length > 0 && (
          <div className="p-4 border-t border-[#EBEBEB] flex items-center justify-between text-[12px] text-[#757575] bg-white">
            <span>Showing 1 to {filteredAnimals.length} of {filteredAnimals.length} entries</span>
            <div className="flex gap-1">
              <button className="px-2 py-1 border border-[#EBEBEB] rounded-[4px] hover:bg-gray-50 disabled:opacity-50">Prev</button>
              <button className="px-2 py-1 border border-[#FF6600] bg-[#FF6600] text-white rounded-[4px]">1</button>
              <button className="px-2 py-1 border border-[#EBEBEB] rounded-[4px] hover:bg-gray-50 disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto font-['Inter',sans-serif]">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity" onClick={() => setDeleteModalOpen(false)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-[12px] text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-[#EBEBEB]">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[#FDECEA] sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-5 w-5 text-[#C62828]" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-[16px] leading-6 font-medium text-gray-900">Remove Animal</h3>
                    <div className="mt-2">
                      <p className="text-[13px] text-[#757575]">
                        Are you sure you want to remove <span className="font-bold text-gray-900">{animalToDelete?.nameEn}</span>? 
                        This will hide the animal from the public site and admin dashboard. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#FAFAFA] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-[#EBEBEB]">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="w-full inline-flex justify-center rounded-[8px] border border-transparent shadow-sm px-4 py-2 bg-[#C62828] text-[13px] font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto transition-colors"
                >
                  Remove
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-[8px] border border-[#EBEBEB] shadow-sm px-4 py-2 bg-white text-[13px] font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
