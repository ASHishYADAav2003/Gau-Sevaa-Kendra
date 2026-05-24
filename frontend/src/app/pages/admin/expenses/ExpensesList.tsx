import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { 
  PlusCircle, 
  Download,
  Edit,
  Trash2,
  Wheat,
  Stethoscope,
  Users,
  Wrench,
  Zap,
  Droplets,
  Hammer,
  Box,
  FileImage,
  Search,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

const defaultExpenses = [
  { id: 1005, date: '2026-05-23', category: 'Maintenance', amount: 3500, desc: 'Shed repair work', paymentMode: 'Cash', addedBy: 'Admin', hasReceipt: false },
  { id: 1004, date: '2026-05-23', category: 'Animal Feed', amount: 12000, desc: 'Dry fodder and supplements', paymentMode: 'Cheque', addedBy: 'Rahul', hasReceipt: true },
  { id: 1003, date: '2026-05-22', category: 'Electricity', amount: 8500, desc: 'May electricity bill', paymentMode: 'UPI', addedBy: 'Admin', hasReceipt: true },
  { id: 1002, date: '2026-05-21', category: 'Medical', amount: 4200, desc: 'Vaccines and medicines', paymentMode: 'UPI', addedBy: 'Dr. Sharma', hasReceipt: true },
  { id: 1001, date: '2026-05-20', category: 'Animal Feed', amount: 15500, desc: 'Weekly green fodder', paymentMode: 'Bank Transfer', addedBy: 'Admin', hasReceipt: false },
];

const categoryStyles: Record<string, any> = {
  'Animal Feed': { color: 'text-amber-700', bg: 'bg-amber-100' },
  'Medical': { color: 'text-red-700', bg: 'bg-red-100' },
  'Staff Salary': { color: 'text-blue-700', bg: 'bg-blue-100' },
  'Maintenance': { color: 'text-gray-700', bg: 'bg-gray-100' },
  'Electricity': { color: 'text-yellow-700', bg: 'bg-yellow-100' },
  'Water': { color: 'text-cyan-700', bg: 'bg-cyan-100' },
  'Equipment': { color: 'text-slate-700', bg: 'bg-slate-100' },
  'Other': { color: 'text-gray-700', bg: 'bg-gray-100' },
};

export default function ExpensesList() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('expenses');
    if (stored) {
      setExpenses(JSON.parse(stored));
    } else {
      setExpenses(defaultExpenses);
      localStorage.setItem('expenses', JSON.stringify(defaultExpenses));
    }
  }, []);

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      const newExpenses = expenses.filter(e => e.id !== id);
      setExpenses(newExpenses);
      localStorage.setItem('expenses', JSON.stringify(newExpenses));
      toast.success("Expense deleted successfully", { style: { borderRadius: '20px', background: '#E8F5E9', color: '#2E7D32' } });
    }
  };

  const handleExportCSV = () => {
    if (expenses.length === 0) {
      toast.error('No data to export', { style: { borderRadius: '20px', background: '#FDECEA', color: '#C62828' } });
      return;
    }
    
    const headers = ['ID', 'Date', 'Category', 'Description', 'Payment Mode', 'Added By', 'Amount'];
    const rows = filteredExpenses.map(e => [
      `EXP-${e.id}`,
      e.date, 
      e.category, 
      `"${e.desc}"`, 
      e.paymentMode, 
      e.addedBy || 'Admin',
      e.amount
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + '\n' 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `expenses_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CSV Exported Successfully', { style: { borderRadius: '20px', background: '#E8F5E9', color: '#2E7D32' } });
  };

  const filteredExpenses = expenses.filter(exp => {
    const matchesCategory = !activeCategory || exp.category === activeCategory;
    const matchesSearch = !searchQuery || 
      exp.desc?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      exp.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.paymentMode?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = Object.keys(categoryStyles);

  return (
    <div className="font-['Inter',sans-serif] space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Manage Expenses <span className="font-['Noto_Sans_Devanagari'] text-[#757575] font-normal">/ खर्च प्रबंधित करें</span></h1>
          <p className="text-[13px] text-[#757575] mt-1">Dashboard &gt; Expenses</p>
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
            to="/admin/expenses/add"
            className="h-[40px] px-4 rounded-[8px] text-[13px] font-medium text-white bg-[#FF6600] hover:bg-[#E55A00] transition-colors flex items-center shadow-sm"
          >
            <PlusCircle size={16} className="mr-2" />
            Add New Expense
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
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full h-[36px] pl-9 pr-3 rounded-[8px] border border-[#EBEBEB] text-[13px] focus:outline-none focus:ring-1 focus:ring-[#FF6600] focus:border-[#FF6600] transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-hide">
            <span className="text-[12px] font-medium text-gray-500 mr-1 flex items-center"><Filter size={14} className="mr-1"/> Category:</span>
            <button
              onClick={() => setActiveCategory(null)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-[20px] text-[12px] font-medium transition-colors ${
                activeCategory === null 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-white border border-[#EBEBEB] text-gray-600 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-[20px] text-[12px] font-medium transition-colors ${
                  activeCategory === cat 
                    ? 'bg-[#FF6600] text-white border border-[#FF6600]' 
                    : 'bg-white border border-[#EBEBEB] text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EBEBEB] bg-white">
                <th className="py-3 px-5 text-[12px] font-medium text-[#757575] uppercase tracking-wider">ID</th>
                <th className="py-3 px-5 text-[12px] font-medium text-[#757575] uppercase tracking-wider">Date</th>
                <th className="py-3 px-5 text-[12px] font-medium text-[#757575] uppercase tracking-wider">Category</th>
                <th className="py-3 px-5 text-[12px] font-medium text-[#757575] uppercase tracking-wider">Description</th>
                <th className="py-3 px-5 text-[12px] font-medium text-[#757575] uppercase tracking-wider">Mode</th>
                <th className="py-3 px-5 text-[12px] font-medium text-[#757575] uppercase tracking-wider">Added By</th>
                <th className="py-3 px-5 text-[12px] font-medium text-[#757575] uppercase tracking-wider text-right">Amount</th>
                <th className="py-3 px-5 text-[12px] font-medium text-[#757575] uppercase tracking-wider text-center">Receipt</th>
                <th className="py-3 px-5 text-[12px] font-medium text-[#757575] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBEB]">
              {filteredExpenses.map((expense) => {
                const styleInfo = categoryStyles[expense.category] || categoryStyles['Other'];
                
                return (
                  <tr key={expense.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="py-3 px-5 text-[13px] font-medium text-gray-900 whitespace-nowrap">
                      EXP-{expense.id}
                    </td>
                    <td className="py-3 px-5 text-[13px] text-[#757575] whitespace-nowrap">
                      {new Date(expense.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3 px-5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-[20px] text-[11px] font-medium ${styleInfo.bg} ${styleInfo.color}`}>
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-[13px] text-gray-700 max-w-[200px] truncate">
                      {expense.desc}
                    </td>
                    <td className="py-3 px-5 whitespace-nowrap">
                      <span className="text-[12px] font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-[4px]">
                        {expense.paymentMode}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-[13px] text-[#757575] whitespace-nowrap">
                      {expense.addedBy || 'Admin'}
                    </td>
                    <td className="py-3 px-5 text-[13px] font-bold text-gray-900 text-right whitespace-nowrap">
                      ₹ {Number(expense.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-5 text-center whitespace-nowrap">
                      {expense.hasReceipt || expense.receipt ? (
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 cursor-pointer hover:bg-blue-100 transition-colors">
                          <FileImage size={14} />
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#757575] italic">-</span>
                      )}
                    </td>
                    <td className="py-3 px-5 text-right whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-[#757575] hover:text-[#FF6600] hover:bg-[#FFF3E0] rounded-[6px] mr-1 transition-colors">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(expense.id)} className="p-1.5 text-[#757575] hover:text-[#C62828] hover:bg-[#FDECEA] rounded-[6px] transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              
              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[13px] text-[#757575]">
                    <div className="flex flex-col items-center justify-center">
                      <Box size={32} className="text-[#EBEBEB] mb-2" />
                      <p>No expenses found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (Static for UI) */}
        {filteredExpenses.length > 0 && (
          <div className="p-4 border-t border-[#EBEBEB] flex items-center justify-between text-[12px] text-[#757575]">
            <span>Showing 1 to {filteredExpenses.length} of {filteredExpenses.length} entries</span>
            <div className="flex gap-1">
              <button className="px-2 py-1 border border-[#EBEBEB] rounded-[4px] hover:bg-gray-50 disabled:opacity-50">Prev</button>
              <button className="px-2 py-1 border border-[#FF6600] bg-[#FF6600] text-white rounded-[4px]">1</button>
              <button className="px-2 py-1 border border-[#EBEBEB] rounded-[4px] hover:bg-gray-50 disabled:opacity-50">Next</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
