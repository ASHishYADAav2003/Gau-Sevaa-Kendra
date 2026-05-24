import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  UploadCloud, 
  X, 
  Loader2, 
  IndianRupee,
  Save,
  Wheat,
  Stethoscope,
  Users,
  Wrench,
  Zap,
  Droplets,
  Hammer,
  Box
} from 'lucide-react';
import toast from 'react-hot-toast';

const categories = [
  { id: 'Animal Feed', name: 'Animal Feed (चारा)', icon: Wheat, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200' },
  { id: 'Medical', name: 'Medical (चिकित्सा)', icon: Stethoscope, color: 'text-red-500', bg: 'bg-red-100', border: 'border-red-200' },
  { id: 'Staff Salary', name: 'Staff Salary (वेतन)', icon: Users, color: 'text-blue-500', bg: 'bg-blue-100', border: 'border-blue-200' },
  { id: 'Maintenance', name: 'Maintenance (रखरखाव)', icon: Wrench, color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-200' },
  { id: 'Electricity', name: 'Electricity (बिजली)', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-100', border: 'border-yellow-200' },
  { id: 'Water', name: 'Water (पानी)', icon: Droplets, color: 'text-cyan-500', bg: 'bg-cyan-100', border: 'border-cyan-200' },
  { id: 'Equipment', name: 'Equipment (उपकरण)', icon: Hammer, color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' },
  { id: 'Other', name: 'Other (अन्य)', icon: Box, color: 'text-gray-400', bg: 'bg-gray-100', border: 'border-gray-200' },
];

export default function AddExpense() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [receiptPhoto, setReceiptPhoto] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'Animal Feed',
    amount: '',
    descriptionEn: '',
    descriptionHi: '',
    paymentMode: 'Cash'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentModeChange = (mode: string) => {
    setFormData(prev => ({ ...prev, paymentMode: mode }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB', { style: { borderRadius: '20px', background: '#FDECEA', color: '#C62828' } });
        return;
      }
      setReceiptPhoto(file);
      setReceiptPreview(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    setReceiptPhoto(null);
    if (receiptPreview) {
      URL.revokeObjectURL(receiptPreview);
      setReceiptPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newExpense = {
        id: Date.now(),
        date: formData.date,
        category: formData.category,
        amount: Number(formData.amount),
        desc: formData.descriptionEn,
        paymentMode: formData.paymentMode,
        receipt: receiptPreview
      };
      
      const existingStr = localStorage.getItem('expenses');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      localStorage.setItem('expenses', JSON.stringify([newExpense, ...existing]));

      toast.success(`Expense added successfully!`, { style: { borderRadius: '20px', background: '#E8F5E9', color: '#2E7D32' } });
      navigate('/admin/expenses');
    } catch (error) {
      toast.error('Failed to save expense.', { style: { borderRadius: '20px', background: '#FDECEA', color: '#C62828' } });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-['Inter',sans-serif] max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-gray-900">Add New Expense <span className="font-['Noto_Sans_Devanagari'] text-[#757575] font-normal">/ नया खर्च जोड़ें</span></h1>
        <p className="text-[13px] text-[#757575] mt-1">Dashboard &gt; Expenses &gt; Add New</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[12px] border border-[#EBEBEB] shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 md:p-8 space-y-10">
          
          {/* SECTION A — Expense Details */}
          <section>
            <h2 className="text-[16px] font-medium text-[#FF6600] mb-4 pb-2 border-b border-[#EBEBEB]">Expense Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="block w-full h-[40px] px-3 rounded-[8px] border border-[#EBEBEB] text-[13px] focus:outline-none focus:ring-1 focus:ring-[#FF6600] focus:border-[#FF6600] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Amount (Rs.) *</label>
                <div className="flex rounded-[8px] overflow-hidden border border-[#EBEBEB] focus-within:ring-1 focus-within:ring-[#FF6600] focus-within:border-[#FF6600] transition-colors">
                  <div className="flex items-center justify-center px-3 bg-[#F5F5F0] border-r border-[#EBEBEB] text-[#757575]">
                    ₹
                  </div>
                  <input
                    type="number"
                    name="amount"
                    required
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    className="flex-1 h-[40px] px-3 border-none text-[13px] focus:ring-0 font-medium"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[13px] font-medium text-gray-700 mb-3">Expense Category *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = formData.category === cat.id;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                      className={`flex flex-col items-center justify-center p-3 border rounded-[8px] transition-all h-[80px] ${
                        isSelected 
                          ? `border-[#FF6600] bg-[#FFF3E0] shadow-[0_0_0_1px_#FF6600]` 
                          : `border-[#EBEBEB] hover:border-gray-300 hover:bg-gray-50`
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${isSelected ? 'bg-white' : cat.bg}`}>
                        <Icon size={16} className={isSelected ? 'text-[#FF6600]' : cat.color} />
                      </div>
                      <span className={`text-[11px] text-center leading-tight ${isSelected ? 'text-[#FF6600] font-medium' : 'text-gray-600'}`}>
                        {cat.name.split(' (')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </section>

          {/* SECTION B — Description & Payment */}
          <section>
            <h2 className="text-[16px] font-medium text-[#FF6600] mb-4 pb-2 border-b border-[#EBEBEB]">Description & Payment</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Description (English) *</label>
                <textarea
                  name="descriptionEn"
                  required
                  rows={2}
                  value={formData.descriptionEn}
                  onChange={handleChange}
                  className="block w-full p-3 rounded-[8px] border border-[#EBEBEB] text-[13px] focus:outline-none focus:ring-1 focus:ring-[#FF6600] focus:border-[#FF6600] transition-colors resize-y"
                  placeholder="What was this expense for?"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Description (Hindi)</label>
                <textarea
                  name="descriptionHi"
                  rows={2}
                  value={formData.descriptionHi}
                  onChange={handleChange}
                  className="block w-full p-3 rounded-[8px] border border-[#EBEBEB] text-[13px] font-['Noto_Sans_Devanagari'] focus:outline-none focus:ring-1 focus:ring-[#FF6600] focus:border-[#FF6600] transition-colors resize-y"
                  placeholder="यह खर्च किस लिए था?"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Payment Mode *</label>
              <div className="flex flex-wrap gap-2">
                {['Cash', 'UPI', 'Bank Transfer', 'Cheque'].map((mode) => (
                  <button
                    type="button"
                    key={mode}
                    onClick={() => handlePaymentModeChange(mode)}
                    className={`px-5 py-2 rounded-[20px] text-[12px] font-medium border transition-colors ${
                      formData.paymentMode === mode 
                        ? 'bg-[#1B3A2D] text-white border-[#1B3A2D]' 
                        : 'bg-white text-gray-600 border-[#EBEBEB] hover:bg-gray-50'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION C — Receipt */}
          <section>
            <h2 className="text-[16px] font-medium text-[#FF6600] mb-4 pb-2 border-b border-[#EBEBEB]">Receipt or Bill</h2>
            
            {!receiptPreview ? (
              <div className="relative border-2 border-dashed border-[#EBEBEB] rounded-[12px] p-8 flex flex-col items-center justify-center text-center hover:border-[#FF6600] hover:bg-[#FFF3E0]/30 transition-colors bg-[#F5F5F0]">
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/webp" 
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud size={32} className="text-[#FF6600] mb-3" />
                <p className="text-[14px] font-medium text-gray-900">Upload Receipt Photo (Optional)</p>
                <p className="text-[12px] text-[#757575] mt-1">JPG, PNG up to 5MB</p>
              </div>
            ) : (
              <div className="relative rounded-[8px] overflow-hidden border border-[#EBEBEB] inline-block shadow-sm">
                <img src={receiptPreview} alt="Receipt Preview" className="h-48 w-auto object-contain bg-[#F5F5F0]" />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-[#C62828] shadow-sm hover:bg-[#C62828] hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </section>

        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-white border-t border-[#EBEBEB] p-4 px-6 md:px-8 flex items-center justify-between z-10">
          <span className="text-[12px] text-[#C62828] font-medium">* Required fields</span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/expenses')}
              className="px-5 h-[40px] rounded-[8px] border border-[#EBEBEB] text-[13px] font-medium text-gray-700 hover:bg-[#F5F5F0] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 h-[40px] rounded-[8px] bg-[#FF6600] hover:bg-[#E55A00] text-white text-[13px] font-medium transition-colors disabled:opacity-70 flex items-center shadow-sm"
            >
              {isLoading ? (
                <><Loader2 size={16} className="animate-spin mr-2" /> Saving...</>
              ) : (
                <><Save size={16} className="mr-2" /> Save Expense</>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
