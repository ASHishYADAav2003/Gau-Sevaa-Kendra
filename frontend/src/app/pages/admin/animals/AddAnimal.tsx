import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  UploadCloud, 
  X, 
  Loader2, 
  RefreshCw,
  IndianRupee,
  Save,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddAnimal() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    nameEn: '',
    nameHi: '',
    tagId: '',
    species: 'Cow',
    gender: 'Female',
    age: '',
    rescueDate: new Date().toISOString().split('T')[0],
    rescueLocation: '',
    healthStatus: 'Healthy',
    urgencyLevel: 'Stable',
    monthlyCost: '',
    storyEn: '',
    storyHi: '',
    isFeatured: false,
    isActive: true
  });

  const generateTagId = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setFormData(prev => ({ ...prev, tagId: `GSK-${randomNum}` }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (photos.length + newFiles.length > 5) {
        toast.error('Max 5 photos allowed', { style: { borderRadius: '20px', background: '#FDECEA', color: '#C62828' } });
        return;
      }
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPhotos(prev => [...prev, ...newFiles]);
      setPhotoPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newAnimal = {
        id: Date.now(),
        nameEn: formData.nameEn,
        nameHi: formData.nameHi,
        tagId: formData.tagId,
        species: formData.species,
        healthStatus: formData.healthStatus,
        urgencyLevel: formData.urgencyLevel,
        cost: Number(formData.monthlyCost || 0),
        photo: photoPreviews.length > 0 ? photoPreviews[0] : 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=150&q=80'
      };
      
      const existingStr = localStorage.getItem('animals');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      localStorage.setItem('animals', JSON.stringify([newAnimal, ...existing]));
      
      toast.success('Animal saved successfully!', { style: { borderRadius: '20px', background: '#E8F5E9', color: '#2E7D32' } });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate('/admin/animals');
    } catch (error) {
      toast.error('Failed to save animal.', { style: { borderRadius: '20px', background: '#FDECEA', color: '#C62828' } });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-['Inter',sans-serif] max-w-5xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-gray-900">Add New Animal <span className="font-['Noto_Sans_Devanagari'] text-[#757575] font-normal">/ नया पशु जोड़ें</span></h1>
        <p className="text-[13px] text-[#757575] mt-1">Dashboard &gt; Animals &gt; Add New</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[12px] border border-[#EBEBEB] shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 md:p-8 space-y-10">
          
          {/* SECTION A — Basic Information */}
          <section>
            <h2 className="text-[16px] font-medium text-[#FF6600] mb-4 pb-2 border-b border-[#EBEBEB]">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Animal Name (English) *</label>
                <input
                  type="text"
                  name="nameEn"
                  required
                  value={formData.nameEn}
                  onChange={handleChange}
                  className="block w-full h-[40px] px-3 rounded-[8px] border border-[#EBEBEB] text-[13px] focus:outline-none focus:ring-1 focus:ring-[#FF6600] focus:border-[#FF6600] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Animal Name in Hindi (हिन्दी नाम) *</label>
                <input
                  type="text"
                  name="nameHi"
                  required
                  value={formData.nameHi}
                  onChange={handleChange}
                  className="block w-full h-[40px] px-3 rounded-[8px] border border-[#EBEBEB] text-[13px] font-['Noto_Sans_Devanagari'] focus:outline-none focus:ring-1 focus:ring-[#FF6600] focus:border-[#FF6600] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Tag / ID Number *</label>
                <div className="flex rounded-[8px] overflow-hidden border border-[#EBEBEB] focus-within:ring-1 focus-within:ring-[#FF6600] focus-within:border-[#FF6600] transition-colors">
                  <input
                    type="text"
                    name="tagId"
                    required
                    value={formData.tagId}
                    onChange={handleChange}
                    className="flex-1 h-[40px] px-3 border-none text-[13px] focus:ring-0"
                    placeholder="GSK-XXXX"
                  />
                  <button
                    type="button"
                    onClick={generateTagId}
                    className="px-4 bg-[#FFF3E0] text-[#FF6600] border-l border-[#EBEBEB] text-[13px] font-medium flex items-center hover:bg-[#FFE0B2] transition-colors"
                  >
                    <RefreshCw size={14} className="mr-1.5" /> Auto Generate
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Species *</label>
                <select
                  name="species"
                  required
                  value={formData.species}
                  onChange={handleChange}
                  className="block w-full h-[40px] px-3 rounded-[8px] border border-[#EBEBEB] text-[13px] focus:outline-none focus:ring-1 focus:ring-[#FF6600] focus:border-[#FF6600] transition-colors bg-white"
                >
                  <option value="Cow">🐄 Cow (गाय)</option>
                  <option value="Bull">🐂 Bull (बैल)</option>
                  <option value="Calf">🐃 Calf (बछड़ा)</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-2">Gender *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center justify-center p-3 rounded-[8px] border cursor-pointer transition-all ${formData.gender === 'Male' ? 'border-[#FF6600] bg-[#FFF3E0] text-[#FF6600]' : 'border-[#EBEBEB] text-gray-700 hover:border-gray-300'}`}>
                      <input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} className="sr-only" />
                      <span className="text-xl mr-2">♂</span>
                      <span className="text-[13px] font-medium">Male</span>
                    </label>
                    <label className={`flex items-center justify-center p-3 rounded-[8px] border cursor-pointer transition-all ${formData.gender === 'Female' ? 'border-[#FF6600] bg-[#FFF3E0] text-[#FF6600]' : 'border-[#EBEBEB] text-gray-700 hover:border-gray-300'}`}>
                      <input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} className="sr-only" />
                      <span className="text-xl mr-2">♀</span>
                      <span className="text-[13px] font-medium">Female</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1">Approximate Age</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="age"
                        min="0"
                        step="0.1"
                        value={formData.age}
                        onChange={handleChange}
                        className="block w-full h-[40px] px-3 pr-12 rounded-[8px] border border-[#EBEBEB] text-[13px] focus:outline-none focus:ring-1 focus:ring-[#FF6600] focus:border-[#FF6600] transition-colors"
                      />
                      <span className="absolute inset-y-0 right-3 flex items-center text-[13px] text-[#757575] pointer-events-none">years</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1">Rescue Date *</label>
                    <input
                      type="date"
                      name="rescueDate"
                      required
                      value={formData.rescueDate}
                      onChange={handleChange}
                      className="block w-full h-[40px] px-3 rounded-[8px] border border-[#EBEBEB] text-[13px] focus:outline-none focus:ring-1 focus:ring-[#FF6600] focus:border-[#FF6600] transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Rescue Location</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <MapPin size={16} className="text-[#757575]" />
                  </div>
                  <input
                    type="text"
                    name="rescueLocation"
                    value={formData.rescueLocation}
                    onChange={handleChange}
                    className="block w-full h-[40px] pl-9 pr-3 rounded-[8px] border border-[#EBEBEB] text-[13px] focus:outline-none focus:ring-1 focus:ring-[#FF6600] focus:border-[#FF6600] transition-colors"
                    placeholder="Where was the animal rescued from?"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION B — Health & Care */}
          <section>
            <h2 className="text-[16px] font-medium text-[#FF6600] mb-4 pb-2 border-b border-[#EBEBEB]">Health & Care</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="md:col-span-2">
                <label className="block text-[13px] font-medium text-gray-700 mb-3">Health Status *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 'Critical', color: 'border-[#C62828] bg-[#FDECEA] text-[#C62828]' },
                    { id: 'Under Treatment', color: 'border-[#F57C00] bg-[#FFF3E0] text-[#F57C00]' },
                    { id: 'Recovering', color: 'border-[#FBC02D] bg-[#FFFDE7] text-[#FBC02D]' },
                    { id: 'Healthy', color: 'border-[#2E7D32] bg-[#E8F5E9] text-[#2E7D32]' }
                  ].map((status) => (
                    <div 
                      key={status.id}
                      onClick={() => setFormData(p => ({ ...p, healthStatus: status.id }))}
                      className={`relative p-3 rounded-[8px] border cursor-pointer transition-all flex items-center justify-center ${formData.healthStatus === status.id ? `border-2 ${status.color.split(' ')[0]} ${status.color.split(' ')[1]}` : 'border-[#EBEBEB] hover:border-gray-300'}`}
                    >
                      <span className={`text-[13px] font-medium ${formData.healthStatus === status.id ? status.color.split(' ')[2] : 'text-gray-700'}`}>{status.id}</span>
                      {formData.healthStatus === status.id && (
                        <CheckCircle2 size={16} className={`absolute top-1 right-1 ${status.color.split(' ')[2]}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-2">Urgency Level</label>
                <div className="flex gap-2">
                  {[
                    { id: 'Urgent', style: 'bg-[#C62828] text-white border-[#C62828]', off: 'bg-white text-[#757575] border-[#EBEBEB]' },
                    { id: 'Moderate', style: 'bg-[#F57C00] text-white border-[#F57C00]', off: 'bg-white text-[#757575] border-[#EBEBEB]' },
                    { id: 'Stable', style: 'bg-[#2E7D32] text-white border-[#2E7D32]', off: 'bg-white text-[#757575] border-[#EBEBEB]' }
                  ].map(level => (
                    <button
                      type="button"
                      key={level.id}
                      onClick={() => setFormData(p => ({ ...p, urgencyLevel: level.id }))}
                      className={`px-4 py-1.5 rounded-[20px] text-[12px] font-medium border transition-colors ${formData.urgencyLevel === level.id ? level.style : level.off}`}
                    >
                      {level.id}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Monthly Care Cost (Rs.) *</label>
                <div className="flex rounded-[8px] overflow-hidden border border-[#EBEBEB] focus-within:ring-1 focus-within:ring-[#FF6600] focus-within:border-[#FF6600] transition-colors w-full md:w-2/3">
                  <div className="flex items-center justify-center px-3 bg-[#F5F5F0] border-r border-[#EBEBEB] text-[#757575]">
                    ₹
                  </div>
                  <input
                    type="number"
                    name="monthlyCost"
                    required
                    value={formData.monthlyCost}
                    onChange={handleChange}
                    className="flex-1 h-[40px] px-3 border-none text-[13px] focus:ring-0"
                    placeholder="2500"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION C — Story & Description */}
          <section>
            <h2 className="text-[16px] font-medium text-[#FF6600] mb-4 pb-2 border-b border-[#EBEBEB]">Story & Description</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[13px] font-medium text-gray-700">Animal Story in English</label>
                  <span className="text-[11px] text-[#757575]">{formData.storyEn.length}/500</span>
                </div>
                <textarea
                  name="storyEn"
                  maxLength={500}
                  value={formData.storyEn}
                  onChange={handleChange}
                  className="block w-full min-h-[100px] p-3 rounded-[8px] border border-[#EBEBEB] text-[13px] focus:outline-none focus:ring-1 focus:ring-[#FF6600] focus:border-[#FF6600] transition-colors resize-y"
                  placeholder="Describe how the animal was rescued, its current condition..."
                ></textarea>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[13px] font-medium text-gray-700">Animal Story in Hindi</label>
                  <span className="text-[11px] text-[#757575]">{formData.storyHi.length}/500</span>
                </div>
                <textarea
                  name="storyHi"
                  maxLength={500}
                  value={formData.storyHi}
                  onChange={handleChange}
                  className="block w-full min-h-[100px] p-3 rounded-[8px] border border-[#EBEBEB] text-[13px] font-['Noto_Sans_Devanagari'] focus:outline-none focus:ring-1 focus:ring-[#FF6600] focus:border-[#FF6600] transition-colors resize-y"
                  placeholder="पशु की कहानी और वर्तमान स्थिति..."
                ></textarea>
              </div>
            </div>
          </section>

          {/* SECTION D — Photos */}
          <section>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#EBEBEB]">
              <h2 className="text-[16px] font-medium text-[#FF6600]">Photos</h2>
              <span className="bg-[#EBEBEB] text-gray-700 text-[11px] font-medium px-2 py-0.5 rounded-[20px]">{photos.length}/5</span>
            </div>
            
            <div className="relative border-2 border-dashed border-[#EBEBEB] rounded-[12px] p-8 flex flex-col items-center justify-center text-center hover:border-[#FF6600] hover:bg-[#FFF3E0]/30 transition-colors bg-[#F5F5F0]">
              <input 
                type="file" 
                multiple 
                accept="image/jpeg, image/png, image/webp" 
                onChange={handlePhotoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud size={32} className="text-[#FF6600] mb-3" />
              <p className="text-[14px] font-medium text-gray-900">Drop photos here or click to browse</p>
              <p className="text-[12px] text-[#757575] mt-1">JPG, PNG up to 5MB each · Max 5 photos</p>
            </div>

            {photoPreviews.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-6">
                {photoPreviews.map((preview, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-[8px] border border-[#EBEBEB] overflow-hidden group shadow-sm">
                    <img src={preview} alt="upload" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removePhoto(idx)}
                      className="absolute top-1 right-1 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-[#C62828] opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-[#C62828] hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SECTION E — Visibility Settings */}
          <section>
            <h2 className="text-[16px] font-medium text-[#FF6600] mb-4 pb-2 border-b border-[#EBEBEB]">Visibility Settings</h2>
            <div className="flex flex-col sm:flex-row gap-8">
              
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="sr-only" />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${formData.isFeatured ? 'bg-[#FF6600]' : 'bg-[#EBEBEB]'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.isFeatured ? 'translate-x-4' : ''}`}></div>
                </div>
                <div className="ml-3">
                  <span className="block text-[13px] font-medium text-gray-900 leading-none">Feature on Homepage</span>
                  <span className="block text-[11px] text-[#757575] mt-1">Highlight this rescue case</span>
                </div>
              </label>

              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="sr-only" />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${formData.isActive ? 'bg-[#FF6600]' : 'bg-[#EBEBEB]'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.isActive ? 'translate-x-4' : ''}`}></div>
                </div>
                <div className="ml-3">
                  <span className="block text-[13px] font-medium text-gray-900 leading-none">Show on Public Site</span>
                  <span className="block text-[11px] text-[#757575] mt-1">Make visible to donors</span>
                </div>
              </label>

            </div>
          </section>

        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-white border-t border-[#EBEBEB] p-4 px-6 md:px-8 flex items-center justify-between z-10">
          <span className="text-[12px] text-[#C62828] font-medium">* Required fields</span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/animals')}
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
                <><Save size={16} className="mr-2" /> Save Animal</>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
