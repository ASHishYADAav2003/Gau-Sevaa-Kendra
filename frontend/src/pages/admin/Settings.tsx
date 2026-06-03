import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, ShieldCheck } from 'lucide-react';

export default function AdminSettings() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      alertEmail: 'admin@gausevakendra.org',
      enableAlerts: true,
      alertThreshold: '1000',
      registration80G: '',
      validity80G: '',
      legalDeclaration: 'Donations are eligible for 80G tax exemption. Official registration pending.',
    }
  });

  const [isSaved, setIsSaved] = useState(false);

  const onSubmit = (data: any) => {
    console.log("Saving settings...", data);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Compliance Settings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4 border-b pb-4">
            <ShieldCheck className="text-brand-green w-5 h-5" />
            <h3 className="text-lg font-bold text-gray-800">Compliance & 80G Placeholders</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">80G Registration Number</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Leave blank if pending"
                {...register('registration80G')}
              />
              <p className="text-xs text-gray-500 mt-1">Appears on generated tax receipts.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Approval Validity Dates</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g. 01-04-2026 to 31-03-2029"
                {...register('validity80G')}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Legal Declaration Text</label>
              <textarea 
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
                {...register('legalDeclaration')}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Email Alerts */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-4">Donation Alerts</h3>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4 text-brand-green rounded" {...register('enableAlerts')} />
              <span className="text-sm font-medium text-gray-700">Enable Email Alerts for New Donations</span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alert Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  {...register('alertEmail')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alert Threshold (₹)</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  {...register('alertThreshold')}
                />
                <p className="text-xs text-gray-500 mt-1">Only notify for amounts equal or greater than this.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          {isSaved && <span className="text-brand-green font-medium flex items-center">Settings saved!</span>}
          <button type="submit" className="bg-brand-green hover:bg-brand-lightGreen text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition">
            <Save className="w-4 h-4" /> Save Configuration
          </button>
        </div>

      </form>
    </div>
  );
}
