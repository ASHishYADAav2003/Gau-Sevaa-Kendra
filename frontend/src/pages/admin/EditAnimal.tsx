import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RefreshCw, MapPin, UploadCloud, X, ArrowLeft } from 'lucide-react';

export default function EditAnimal() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    nameEn: '',
    nameHi: '',
    tag: '',
    species: 'Cow (गाय)',
    gender: 'Female',
    age: '',
    rescueDate: '',
    rescueLocation: '',
    healthStatus: 'Healthy',
    urgencyLevel: 'Stable',
    cost: '2500',
    storyEn: '',
    storyHi: '',
    featureHomepage: false,
    showPublic: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem('animalsList');
    if (saved) {
      const allAnimals = JSON.parse(saved);
      const animal = allAnimals.find((a: any) => a.id === id);
      if (animal) {
        if (animal.rawFormData) {
          setFormData(animal.rawFormData);
        } else {
          // Fallback if rawFormData isn't saved (e.g. for mocked initial data)
          let speciesFull = 'Cow (गाय)';
          if (animal.species === 'Bull') speciesFull = 'Bull (सांड)';
          if (animal.species === 'Calf') speciesFull = 'Calf (बछड़ा)';
          
          // try to convert "18 May 2026" to "2026-05-18" for input type="date"
          let formattedDate = animal.rescueDate;
          try {
            const d = new Date(animal.rescueDate);
            if (!isNaN(d.getTime())) {
              formattedDate = d.toISOString().split('T')[0];
            }
          } catch (e) {}

          setFormData({
            nameEn: animal.nameEn || '',
            nameHi: animal.nameHi || '',
            tag: animal.tag || '',
            species: speciesFull,
            gender: 'Female', // Default, not saved in mock
            age: '', // not saved in mock
            rescueDate: formattedDate,
            rescueLocation: '', // not saved in mock
            healthStatus: animal.healthStatus || 'Healthy',
            urgencyLevel: 'Stable', // not saved in mock
            cost: animal.cost?.toString() || '2500',
            storyEn: '', // not saved in mock
            storyHi: '', // not saved in mock
            featureHomepage: animal.isStarred || false,
            showPublic: true,
          });
        }
        if (animal.photos && animal.photos.length > 0) {
          setPhotos(animal.photos);
        }
      } else {
        alert("Animal not found!");
        navigate('/admin/animals');
      }
    } else {
        navigate('/admin/animals');
    }
  }, [id, navigate]);

  const handleAutoGenerate = () => {
    setFormData({ ...formData, tag: `GSK-${Math.floor(1000 + Math.random() * 9000)}` });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 5) {
      alert('You can only upload up to 5 photos.');
      return;
    }
    const newPhotos = files.filter(f => f.size <= 5 * 1024 * 1024).map(f => URL.createObjectURL(f));
    setPhotos([...photos, ...newPhotos].slice(0, 5));
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!formData.nameEn || !formData.nameHi || !formData.tag) {
      alert('Please fill out all required fields.');
      return;
    }

    const dateObj = new Date(formData.rescueDate);
    const formattedDate = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    let speciesSimple = 'Cow';
    if (formData.species.includes('Bull')) speciesSimple = 'Bull';
    if (formData.species.includes('Calf')) speciesSimple = 'Calf';

    const updatedAnimal = {
      id: id,
      nameEn: formData.nameEn,
      nameHi: formData.nameHi,
      tag: formData.tag,
      species: speciesSimple,
      healthStatus: formData.healthStatus,
      rescueDate: formattedDate !== 'Invalid Date' ? formattedDate : formData.rescueDate,
      cost: Number(formData.cost),
      isStarred: formData.featureHomepage,
      photos: photos,
      rawFormData: formData
    };

    const saved = localStorage.getItem('animalsList');
    if (saved) {
      let existing = JSON.parse(saved);
      existing = existing.map((a: any) => a.id === id ? updatedAnimal : a);
      localStorage.setItem('animalsList', JSON.stringify(existing));
    }
    
    navigate('/admin/animals');
  };

  return (
    <div className="max-w-[1000px] pb-12">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 bg-white shadow-sm" title="Go Back">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Edit Animal <span className="text-gray-400 font-normal">/ पशु संपादित करें</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">Dashboard &gt; Animals &gt; Edit</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8">
          
          {/* Basic Information Section */}
          <div className="mb-8">
            <h3 className="text-brand-orange font-medium text-lg mb-4 border-b border-gray-100 pb-2">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Animal Name (English) <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="w-full text-sm border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/20"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({...formData, nameEn: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Animal Name in Hindi (हिन्दी नाम) <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="w-full text-sm border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/20"
                  value={formData.nameHi}
                  onChange={(e) => setFormData({...formData, nameHi: e.target.value})}
                />
              </div>

              <div className="space-y-1 relative">
                <label className="text-sm font-medium text-gray-700">Tag / ID Number <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="GSK-XXXX"
                    className="w-full text-sm border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/20"
                    value={formData.tag}
                    onChange={(e) => setFormData({...formData, tag: e.target.value})}
                  />
                  <button 
                    type="button" 
                    onClick={handleAutoGenerate}
                    className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-orange-50 text-brand-orange rounded-lg text-sm font-medium hover:bg-orange-100 transition"
                  >
                    <RefreshCw className="w-4 h-4" /> Auto Generate
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Species <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    className="w-full text-sm border border-gray-200 rounded-lg px-4 py-2.5 appearance-none focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/20 bg-white"
                    value={formData.species}
                    onChange={(e) => setFormData({...formData, species: e.target.value})}
                  >
                    <option>🐄 Cow (गाय)</option>
                    <option>🐂 Bull (सांड)</option>
                    <option>🐃 Calf (बछड़ा)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Gender <span className="text-red-500">*</span></label>
                <div className="flex gap-4 h-[42px]">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, gender: 'Male'})}
                    className={`flex-1 flex items-center justify-center gap-2 border rounded-lg text-sm transition ${
                      formData.gender === 'Male' 
                        ? 'border-brand-orange bg-orange-50/50 text-brand-orange font-medium' 
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">♂</span> Male
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, gender: 'Female'})}
                    className={`flex-1 flex items-center justify-center gap-2 border rounded-lg text-sm transition ${
                      formData.gender === 'Female' 
                        ? 'border-brand-orange bg-orange-50/50 text-brand-orange font-medium' 
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">♀</span> Female
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Approximate Age</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      className="w-full text-sm border border-gray-200 rounded-lg pl-4 pr-12 py-2.5 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/20"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">years</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Rescue Date <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    className="w-full text-sm border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/20"
                    value={formData.rescueDate}
                    onChange={(e) => setFormData({...formData, rescueDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Rescue Location</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Where was the animal rescued from?"
                    className="w-full text-sm border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/20"
                    value={formData.rescueLocation}
                    onChange={(e) => setFormData({...formData, rescueLocation: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Health & Care Section */}
          <div className="mb-8">
            <h3 className="text-brand-orange font-medium text-lg mb-4 border-b border-gray-100 pb-2">Health & Care</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Health Status <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Critical', 'Under Treatment', 'Recovering', 'Healthy'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({...formData, healthStatus: status})}
                      className={`py-2.5 px-4 rounded-lg border text-sm font-medium transition flex items-center justify-center gap-2 ${
                        formData.healthStatus === status 
                          ? 'border-green-600 bg-green-50 text-green-700' 
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {status}
                      {formData.healthStatus === status && (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Urgency Level</label>
                  <div className="flex gap-3">
                    {['Urgent', 'Moderate', 'Stable'].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setFormData({...formData, urgencyLevel: level})}
                        className={`py-1.5 px-5 rounded-full border text-sm font-medium transition ${
                          formData.urgencyLevel === level 
                            ? (level === 'Urgent' ? 'bg-red-600 border-red-600 text-white' : level === 'Stable' ? 'bg-green-700 border-green-700 text-white' : 'bg-orange-500 border-orange-500 text-white')
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Monthly Care Cost (Rs.) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-0 top-0 bottom-0 flex items-center px-4 bg-gray-50 border border-gray-200 border-r-0 rounded-l-lg text-gray-500 font-medium">₹</span>
                    <input 
                      type="text" 
                      className="w-full text-sm border border-gray-200 rounded-lg pl-12 pr-4 py-2.5 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/20"
                      value={formData.cost}
                      onChange={(e) => setFormData({...formData, cost: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Story & Description Section */}
          <div className="mb-8">
            <h3 className="text-brand-orange font-medium text-lg mb-4 border-b border-gray-100 pb-2">Story & Description</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1 relative">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-gray-700">Animal Story in English</label>
                  <span className="text-xs text-gray-400">{formData.storyEn.length}/500</span>
                </div>
                <textarea 
                  placeholder="Describe how the animal was rescued, its current condition..."
                  className="w-full text-sm border border-gray-200 rounded-lg p-4 h-32 resize-none focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/20"
                  maxLength={500}
                  value={formData.storyEn}
                  onChange={(e) => setFormData({...formData, storyEn: e.target.value})}
                ></textarea>
              </div>
              <div className="space-y-1 relative">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-gray-700">Animal Story in Hindi</label>
                  <span className="text-xs text-gray-400">{formData.storyHi.length}/500</span>
                </div>
                <textarea 
                  placeholder="पशु की कहानी और वर्तमान स्थिति..."
                  className="w-full text-sm border border-gray-200 rounded-lg p-4 h-32 resize-none focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/20"
                  maxLength={500}
                  value={formData.storyHi}
                  onChange={(e) => setFormData({...formData, storyHi: e.target.value})}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Photos Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
              <h3 className="text-brand-orange font-medium text-lg">Photos</h3>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{photos.length}/5</span>
            </div>
            
            <div 
              className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100 transition relative"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                multiple 
                accept="image/jpeg, image/png" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <div className="w-12 h-12 bg-orange-50 text-brand-orange rounded-full flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-gray-800 mb-1">Drop photos here or click to browse</p>
              <p className="text-xs text-gray-500">JPG, PNG up to 5MB each · Max 5 photos</p>
            </div>

            {photos.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {photos.map((photo, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <img src={photo} alt={`Upload ${i+1}`} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 bg-white/90 text-red-500 rounded-full p-1 hover:bg-red-50 transition shadow-sm z-10"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Visibility Settings Section */}
          <div>
            <h3 className="text-brand-orange font-medium text-lg mb-4 border-b border-gray-100 pb-2">Visibility Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div 
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${formData.featureHomepage ? 'bg-brand-orange' : 'bg-gray-200'}`}
                  onClick={() => setFormData({...formData, featureHomepage: !formData.featureHomepage})}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${formData.featureHomepage ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Feature on Homepage</p>
                  <p className="text-xs text-gray-500 mt-0.5">Highlight this rescue case</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div 
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${formData.showPublic ? 'bg-brand-orange' : 'bg-gray-200'}`}
                  onClick={() => setFormData({...formData, showPublic: !formData.showPublic})}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${formData.showPublic ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Show on Public Site</p>
                  <p className="text-xs text-gray-500 mt-0.5">Make visible to donors</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <p className="text-xs font-medium text-red-500">* Required fields</p>
          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={() => navigate('/admin/animals')}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={handleSave}
              className="px-6 py-2.5 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-[#e06612] transition shadow-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
              Save Animal
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
