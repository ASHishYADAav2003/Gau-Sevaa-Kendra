import { useState, useEffect } from 'react';
import { Search, Download, Plus, Filter, Edit, Trash2, FileText, X } from 'lucide-react';

export default function ExpensesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // State for Form View
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    desc: '',
    mode: 'Cash',
    amount: ''
  });

  // Initial mock data
  const initialExpenses = [
    { id: 'EXP-1779588336287', date: '23 May 2026', category: 'Maintenance', desc: 'ma', mode: 'Cash', addedBy: 'Admin', amount: 654, hasReceipt: false },
    { id: 'EXP-1005', date: '23 May 2026', category: 'Maintenance', desc: 'Shed repair work', mode: 'Cash', addedBy: 'Admin', amount: 3500, hasReceipt: false },
    { id: 'EXP-1004', date: '23 May 2026', category: 'Animal Feed', desc: 'Dry fodder and supplements', mode: 'Cheque', addedBy: 'Rahul', amount: 12000, hasReceipt: true },
    { id: 'EXP-1003', date: '22 May 2026', category: 'Electricity', desc: 'May electricity bill', mode: 'UPI', addedBy: 'Admin', amount: 8500, hasReceipt: true },
    { id: 'EXP-1002', date: '21 May 2026', category: 'Medical', desc: 'Vaccines and medicines', mode: 'UPI', addedBy: 'Dr. Sharma', amount: 4200, hasReceipt: true },
    { id: 'EXP-1001', date: '20 May 2026', category: 'Animal Feed', desc: 'Weekly green fodder', mode: 'Bank Transfer', addedBy: 'Admin', amount: 15500, hasReceipt: false },
  ];

  // State for data with localStorage persistence
  const [expenses, setExpenses] = useState<any[]>(() => {
    const saved = localStorage.getItem('gauseva_expenses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialExpenses;
      }
    }
    return initialExpenses;
  });

  // Save to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem('gauseva_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const categories = ['All', 'Animal Feed', 'Medical', 'Staff Salary', 'Maintenance'];

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'Maintenance': return 'bg-gray-100 text-gray-700';
      case 'Animal Feed': return 'bg-orange-50 text-orange-600';
      case 'Electricity': return 'bg-yellow-50 text-yellow-600';
      case 'Medical': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Modal state for viewing receipts
  const [viewingReceipt, setViewingReceipt] = useState<string | null>(null);

  // 1. Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Category', 'Description', 'Mode', 'Added By', 'Amount', 'Has Receipt'];
    const csvContent = [
      headers.join(','),
      ...expenses.map(e => `"${e.id}","${e.date}","${e.category}","${e.desc}","${e.mode}","${e.addedBy}",${e.amount},${e.hasReceipt}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'expenses_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. Delete Expense
  const handleDelete = (id: string) => {
    if (window.confirm(`Are you sure you want to delete expense ${id}?`)) {
      setExpenses(expenses.filter(e => e.id !== id));
    }
  };

  // 3. View Receipt
  const handleViewReceipt = (expense: any) => {
    if (expense.receiptUrl) {
      setViewingReceipt(expense.receiptUrl);
    } else {
      alert(`Viewing receipt document for ${expense.id}\n(No local file attached to this mock record)`);
    }
  };

  // 4. Open Form
  const openForm = (expense?: any) => {
    if (expense) {
      setEditingExpense(expense);
      // Try to parse the '23 May 2026' into an ISO string for the date input
      let parsedDate = new Date().toISOString().split('T')[0];
      try {
        const d = new Date(expense.date);
        if(!isNaN(d.getTime())) parsedDate = d.toISOString().split('T')[0];
      } catch(e) {}
      
      setFormData({
        date: parsedDate,
        category: expense.category,
        desc: expense.desc,
        mode: expense.mode,
        amount: expense.amount.toString()
      });
      setReceiptFile(null); // Clear file state
    } else {
      setEditingExpense(null);
      setFormData({ 
        date: new Date().toISOString().split('T')[0], 
        category: '', 
        desc: '', 
        mode: 'Cash', 
        amount: '' 
      });
      setReceiptFile(null); // Clear file state
    }
    setIsFormOpen(true);
  };

  // 5. Submit Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format the incoming ISO date "2026-06-01" to "01 Jun 2026"
    const formattedDate = new Date(formData.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    
    const finishSubmit = (base64Url?: string) => {
      if (editingExpense) {
        // Edit existing
        setExpenses(expenses.map(exp => exp.id === editingExpense.id ? { 
          ...exp, 
          ...formData,
          date: formattedDate,
          amount: Number(formData.amount),
          hasReceipt: base64Url ? true : exp.hasReceipt,
          receiptUrl: base64Url || exp.receiptUrl
        } : exp));
      } else {
        // Add new
        const newExpense = {
          id: `EXP-${Date.now().toString().slice(-4)}`,
          date: formattedDate,
          category: formData.category,
          desc: formData.desc,
          mode: formData.mode,
          addedBy: 'Admin', // Hardcoded for now
          amount: Number(formData.amount),
          hasReceipt: !!base64Url,
          receiptUrl: base64Url
        };
        setExpenses([newExpense, ...expenses]);
      }
      setIsFormOpen(false);
    };

    if (receiptFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        finishSubmit(reader.result as string);
      };
      reader.readAsDataURL(receiptFile);
    } else {
      finishSubmit();
    }
  };

  // Filtering
  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = exp.desc.toLowerCase().includes(searchTerm.toLowerCase()) || exp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || exp.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const renderList = () => (
    <div className="max-w-[1400px] relative">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Manage Expenses <span className="text-gray-400 font-normal">/ खर्च प्रबंधित करें</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">Dashboard &gt; Expenses</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition text-sm font-medium shadow-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => openForm()} className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-[#e06612] transition text-sm font-medium shadow-sm">
            <Plus className="w-4 h-4" /> Add New Expense
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col xl:flex-row gap-4 justify-between items-center bg-white">
          <div className="relative w-full xl:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search expenses by ID or description..." 
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 hide-scrollbar">
            <div className="flex items-center gap-2 text-sm text-gray-500 mr-2 shrink-0">
              <Filter className="w-4 h-4" /> Category:
            </div>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition border ${
                  activeCategory === cat 
                    ? 'bg-[#1a3626] text-white border-[#1a3626]' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-semibold text-gray-400 tracking-wider uppercase">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Mode</th>
                <th className="px-6 py-4">Added By</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-center">Receipt</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">No expenses found matching your criteria.</td>
                </tr>
              ) : filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{expense.id}</td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{expense.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold ${getCategoryColor(expense.category)}`}>
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{expense.desc}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 rounded bg-gray-100 text-gray-600 text-[11px] font-medium">
                      {expense.mode}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{expense.addedBy}</td>
                  <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">₹ {expense.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    {expense.hasReceipt ? (
                      <button onClick={() => handleViewReceipt(expense)} className="mx-auto w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 hover:bg-blue-100 transition focus:outline-none">
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => openForm(expense)} className="text-gray-400 hover:text-gray-700 transition focus:outline-none">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(expense.id)} className="text-gray-400 hover:text-red-500 transition focus:outline-none">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer Pagination Info */}
        <div className="p-4 border-t border-gray-100 text-xs text-gray-500">
          Showing 1 to {filteredExpenses.length} of {expenses.length} entries
        </div>

      </div>

      {/* Receipt Viewer Modal Overlay */}
      {viewingReceipt && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-orange" />
                Receipt Preview
              </h3>
              <button onClick={() => setViewingReceipt(null)} className="text-gray-400 hover:text-gray-700 transition p-1 bg-gray-200/50 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-auto flex-1 flex items-center justify-center bg-gray-100">
              <img src={viewingReceipt} alt="Uploaded Receipt" className="max-w-full h-auto max-h-[70vh] rounded-lg shadow-sm border border-gray-200" />
            </div>
          </div>
        </div>
      )}

    </div>
  );

  const renderForm = () => (
    <div className="max-w-[1000px] mx-auto pb-12">
      {/* Form Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          {editingExpense ? 'Edit Expense' : 'Add New Expense'} <span className="text-gray-400 font-normal">/ {editingExpense ? 'खर्च संपादित करें' : 'नया खर्च जोड़ें'}</span>
        </h2>
        <p className="text-sm text-gray-500 mt-1">Dashboard &gt; Expenses &gt; {editingExpense ? 'Edit' : 'Add New'}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit}>
          
          {/* Expense Details Section */}
          <div className="p-6 md:p-8 border-b border-gray-100">
            <h3 className="text-brand-orange font-semibold text-lg mb-6 border-b border-gray-100 pb-2">Expense Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input 
                  type="date" 
                  required
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (Rs.) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                    className="w-full pl-8 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Expense Category *</label>
              <select 
                required
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green bg-white cursor-pointer"
              >
                <option value="" disabled>Select a category</option>
                <option value="Animal Feed">Animal Feed</option>
                <option value="Medical">Medical</option>
                <option value="Staff Salary">Staff Salary</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Electricity">Electricity</option>
                <option value="Water">Water</option>
                <option value="Equipment">Equipment</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Description & Payment Section */}
          <div className="p-6 md:p-8 border-b border-gray-100">
            <h3 className="text-brand-orange font-semibold text-lg mb-6 border-b border-gray-100 pb-2">Description & Payment</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (English) *</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.desc}
                  onChange={e => setFormData({...formData, desc: e.target.value})}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green resize-none"
                  placeholder="What was this expense for?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Hindi)</label>
                <textarea 
                  rows={3}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green resize-none"
                  placeholder="यह खर्च किस लिए था?"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Payment Mode *</label>
              <div className="flex flex-wrap gap-3">
                {['Cash', 'UPI', 'Bank Transfer', 'Cheque'].map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setFormData({...formData, mode})}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition border ${
                      formData.mode === mode 
                        ? 'bg-[#1a3626] text-white border-[#1a3626]' 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Receipt or Bill Section */}
          <div className="p-6 md:p-8 border-b border-gray-100">
            <h3 className="text-brand-orange font-semibold text-lg mb-6 border-b border-gray-100 pb-2">Receipt or Bill</h3>
            
            <div className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 p-8 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-3">
                <FileText className="w-6 h-6 text-brand-orange" />
              </div>
              <p className="font-semibold text-gray-800 text-sm mb-1">Upload Receipt Photo (Optional)</p>
              <p className="text-xs text-gray-500 mb-4">JPG, PNG up to 5MB</p>
              
              <input 
                type="file" 
                id="receipt" 
                className="hidden" 
                accept=".jpg,.jpeg,.png"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setReceiptFile(e.target.files[0]);
                  }
                }}
              />
              
              {receiptFile ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="max-w-[200px] truncate">{receiptFile.name}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setReceiptFile(null)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <label htmlFor="receipt" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 cursor-pointer transition">
                  Browse Files
                </label>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 md:p-8 bg-gray-50/30 flex items-center justify-between">
            <span className="text-xs text-red-500">* Required fields</span>
            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={() => setIsFormOpen(false)}
                className="px-6 py-2.5 border border-gray-200 bg-white rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition shadow-sm"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-6 py-2.5 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-[#e06612] transition shadow-sm flex items-center gap-2"
              >
                Save Expense
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );

  return isFormOpen ? renderForm() : renderList();
}
