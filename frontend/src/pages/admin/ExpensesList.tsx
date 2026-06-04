import { useEffect, useMemo, useState } from 'react';
import { Download, Edit, Filter, Plus, Search, Trash2, X } from 'lucide-react';
import { expenseApi } from '../../api/services';
import { downloadBlob, getApiErrorMessage } from '../../api/client';
import type { Expense, ExpenseCategory } from '../../api/types';
import { formatDate, formatInr, toDateTimeIso } from '../../utils/format';

const categories: Array<{ value: ExpenseCategory | ''; label: string }> = [
  { value: '', label: 'All' },
  { value: 'FODDER', label: 'Fodder' },
  { value: 'MEDICINE', label: 'Medicine' },
  { value: 'STAFF', label: 'Staff' },
  { value: 'TRANSPORT', label: 'Transport' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'UTILITIES', label: 'Utilities' },
  { value: 'INFRASTRUCTURE', label: 'Infrastructure' },
  { value: 'OTHER', label: 'Other' },
];

const emptyForm = {
  expenseDate: new Date().toISOString().slice(0, 10),
  amount: '',
  category: 'FODDER' as ExpenseCategory,
  vendorName: '',
  notes: '',
  attachmentUrl: '',
};

export default function ExpensesList() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<ExpenseCategory | ''>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadExpenses = async () => {
    setIsLoading(true);
    try {
      const result = await expenseApi.list({
        pageSize: 100,
        category: category || undefined,
      });
      setExpenses(result.items);
      setError('');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load expenses.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadExpenses();
  }, [category]);

  const filteredExpenses = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return expenses.filter((expense) => {
      const haystack = [
        expense.id,
        expense.category,
        expense.vendorName,
        expense.notes,
        expense.animal?.name,
        expense.campaign?.titleEn,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [expenses, searchTerm]);

  const totalAmountPaise = useMemo(
    () => filteredExpenses.reduce((sum, expense) => sum + expense.amountPaise, 0),
    [filteredExpenses],
  );

  const openCreateForm = () => {
    setEditingExpense(null);
    setFormData(emptyForm);
    setMessage('');
    setError('');
    setIsFormOpen(true);
  };

  const openEditForm = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      expenseDate: expense.expenseDate ? new Date(expense.expenseDate).toISOString().slice(0, 10) : emptyForm.expenseDate,
      amount: String(expense.amountPaise / 100),
      category: expense.category,
      vendorName: expense.vendorName || '',
      notes: expense.notes || '',
      attachmentUrl: expense.attachmentUrl || '',
    });
    setMessage('');
    setError('');
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingExpense(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      const payload = {
        expenseDate: toDateTimeIso(formData.expenseDate),
        amount: Number(formData.amount),
        category: formData.category,
        vendorName: formData.vendorName || null,
        notes: formData.notes || null,
        attachmentUrl: formData.attachmentUrl || null,
      };

      if (editingExpense) {
        await expenseApi.update(editingExpense.id, payload);
        setMessage('Expense updated.');
      } else {
        await expenseApi.create(payload);
        setMessage('Expense added.');
      }

      closeForm();
      await loadExpenses();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to save expense.'));
    }
  };

  const handleDelete = async (expense: Expense) => {
    if (!window.confirm(`Delete expense ${expense.id}? This cannot be undone.`)) return;

    setError('');
    setMessage('');
    try {
      await expenseApi.delete(expense.id);
      setMessage('Expense deleted.');
      await loadExpenses();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to delete expense.'));
    }
  };

  const handleExport = async () => {
    try {
      const blob = await expenseApi.export();
      downloadBlob(blob, `expenses-${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to export expenses.'));
    }
  };

  return (
    <div className="max-w-[1400px] relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Expenses</h2>
          <p className="text-sm text-gray-500 mt-1">
            {filteredExpenses.length} records · {formatInr(totalAmountPaise)} in current view
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => void handleExport()} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition text-sm font-medium shadow-sm">
            <Download className="w-4 h-4" /> Export XLSX
          </button>
          <button onClick={openCreateForm} className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-700 transition text-sm font-medium shadow-sm">
            <Plus className="w-4 h-4" /> Add Expense
          </button>
        </div>
      </div>

      {message && <div className="rounded-lg bg-green-50 border border-green-100 px-4 py-3 mb-6 text-sm text-green-700">{message}</div>}
      {error && <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 mb-6 text-sm text-red-700">{error}</div>}

      {isFormOpen && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h3>
            <button onClick={closeForm} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input required type="date" className="input-field" value={formData.expenseDate} onChange={(event) => setFormData({ ...formData, expenseDate: event.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
              <input required type="number" min="0.01" step="0.01" className="input-field" value={formData.amount} onChange={(event) => setFormData({ ...formData, amount: event.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select required className="input-field" value={formData.category} onChange={(event) => setFormData({ ...formData, category: event.target.value as ExpenseCategory })}>
                {categories.filter((item) => item.value).map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
              <input className="input-field" value={formData.vendorName} onChange={(event) => setFormData({ ...formData, vendorName: event.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Attachment URL</label>
              <input className="input-field" placeholder="Optional bill/receipt URL" value={formData.attachmentUrl} onChange={(event) => setFormData({ ...formData, attachmentUrl: event.target.value })} />
              <p className="text-xs text-gray-500 mt-1">Backend currently stores an attachment URL; file upload routes are not implemented yet.</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea className="input-field min-h-28" value={formData.notes} onChange={(event) => setFormData({ ...formData, notes: event.target.value })} />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3">
              <button type="button" onClick={closeForm} className="px-5 py-2.5 border border-gray-200 bg-white rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2.5 bg-brand-green text-white rounded-lg text-sm font-medium hover:bg-brand-lightGreen transition">
                {editingExpense ? 'Update Expense' : 'Save Expense'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col xl:flex-row gap-4 justify-between items-center bg-white">
          <div className="relative w-full xl:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses by ID, vendor, note, animal, or campaign..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0">
            <div className="flex items-center gap-2 text-sm text-gray-500 mr-2 shrink-0">
              <Filter className="w-4 h-4" /> Category:
            </div>
            {categories.map((item) => (
              <button
                key={item.value || 'all'}
                onClick={() => setCategory(item.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition border ${
                  category === item.value
                    ? 'bg-[#1a3626] text-white border-[#1a3626]'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1050px]">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-semibold text-gray-400 tracking-wider uppercase">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4">Notes</th>
                <th className="px-6 py-4">Linked To</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Attachment</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {isLoading ? (
                <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-500">Loading expenses...</td></tr>
              ) : filteredExpenses.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-500">No expenses found.</td></tr>
              ) : filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{formatDate(expense.expenseDate)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold bg-orange-50 text-orange-700">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{expense.vendorName || '-'}</td>
                  <td className="px-6 py-4 text-gray-700 max-w-md">
                    <span className="line-clamp-2">{expense.notes || '-'}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {expense.animal?.name || expense.campaign?.titleEn || '-'}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">{formatInr(expense.amountPaise)}</td>
                  <td className="px-6 py-4">
                    {expense.attachmentUrl ? (
                      <a href={expense.attachmentUrl} target="_blank" rel="noreferrer" className="text-brand-orange hover:underline">Open</a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => openEditForm(expense)} className="text-gray-400 hover:text-gray-700 transition" title="Edit expense">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => void handleDelete(expense)} className="text-gray-400 hover:text-red-500 transition" title="Delete expense">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 text-xs text-gray-500">
          Showing {filteredExpenses.length} of {expenses.length} entries
        </div>
      </div>
    </div>
  );
}
