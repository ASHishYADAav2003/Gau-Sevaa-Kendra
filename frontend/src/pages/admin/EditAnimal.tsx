import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, UploadCloud, X } from 'lucide-react';
import { animalApi } from '../../api/services';
import { getApiErrorMessage } from '../../api/client';
import { toDateTimeIso } from '../../utils/format';

const animalStatuses = ['ACTIVE', 'UNDER_TREATMENT', 'ADOPTED', 'DECEASED'];

export default function EditAnimal() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    tagId: '',
    gender: '',
    ageYears: '',
    breed: '',
    rescueDate: '',
    shedLocation: '',
    healthStatus: '',
    status: 'ACTIVE',
    notes: '',
  });

  useEffect(() => {
    if (!id) return;

    const loadAnimal = async () => {
      try {
        const animal = await animalApi.getAdmin(id);
        setFormData({
          name: animal.name || '',
          tagId: animal.tagId || '',
          gender: animal.gender || '',
          ageYears: animal.ageMonths ? String(Math.floor(animal.ageMonths / 12)) : '',
          breed: animal.breed || '',
          rescueDate: animal.rescueDate ? new Date(animal.rescueDate).toISOString().slice(0, 10) : '',
          shedLocation: animal.shedLocation || '',
          healthStatus: animal.healthStatus || '',
          status: animal.status || 'ACTIVE',
          notes: animal.notes || '',
        });
        setExistingImages((animal.images || []).map((image) => image.imageUrl));
      } catch (err) {
        setError(getApiErrorMessage(err, 'Unable to load animal.'));
      } finally {
        setIsLoading(false);
      }
    };

    void loadAnimal();
  }, [id]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files || []);
    if (existingImages.length + files.length + selected.length > 5) {
      setError('An animal can have up to 5 photos.');
      return;
    }
    setFiles([...files, ...selected].slice(0, 5 - existingImages.length));
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, fileIndex) => fileIndex !== index));
  };

  const handleSave = async () => {
    if (!id) return;
    if (!formData.name || !formData.tagId) {
      setError('Animal name and tag ID are required.');
      return;
    }

    setIsSaving(true);
    setError('');
    try {
      await animalApi.update(id, {
        tagId: formData.tagId,
        name: formData.name,
        ageMonths: formData.ageYears ? Number(formData.ageYears) * 12 : null,
        gender: formData.gender || null,
        breed: formData.breed || null,
        healthStatus: formData.healthStatus || null,
        rescueDate: formData.rescueDate ? toDateTimeIso(formData.rescueDate) : null,
        shedLocation: formData.shedLocation || null,
        notes: formData.notes || null,
        status: formData.status as any,
      });

      if (files.length > 0) {
        await animalApi.uploadImages(id, files);
      }

      navigate('/admin/animals');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to update animal.'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading animal...</div>;
  }

  return (
    <div className="max-w-[1000px] pb-12">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 bg-white shadow-sm" title="Go Back">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Edit Animal</h2>
          <p className="text-sm text-gray-500 mt-1">Update backend animal record.</p>
        </div>
      </div>

      {error && <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 mb-6 text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 space-y-8">
          <section>
            <h3 className="text-brand-orange font-medium text-lg mb-4 border-b border-gray-100 pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Animal Name *" value={formData.name} onChange={(value) => setFormData({ ...formData, name: value })} />
              <Field label="Tag / ID Number *" value={formData.tagId} onChange={(value) => setFormData({ ...formData, tagId: value })} />
              <Field label="Breed" value={formData.breed} onChange={(value) => setFormData({ ...formData, breed: value })} />
              <Field label="Gender" value={formData.gender} onChange={(value) => setFormData({ ...formData, gender: value })} />
              <Field label="Approximate Age (years)" type="number" value={formData.ageYears} onChange={(value) => setFormData({ ...formData, ageYears: value })} />
              <div>
                <label className="text-sm font-medium text-gray-700">Rescue Date</label>
                <input type="date" className="input-field mt-1" value={formData.rescueDate} onChange={(e) => setFormData({ ...formData, rescueDate: e.target.value })} />
              </div>
              <Field label="Shed / Location" value={formData.shedLocation} onChange={(value) => setFormData({ ...formData, shedLocation: value })} />
              <Field label="Health Status" value={formData.healthStatus} onChange={(value) => setFormData({ ...formData, healthStatus: value })} />
              <div>
                <label className="text-sm font-medium text-gray-700">Operational Status</label>
                <select className="input-field mt-1" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  {animalStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-brand-orange font-medium text-lg mb-4 border-b border-gray-100 pb-2">Notes</h3>
            <textarea className="input-field min-h-32" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
          </section>

          <section>
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
              <h3 className="text-brand-orange font-medium text-lg">Photos</h3>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{existingImages.length + files.length}/5</span>
            </div>

            {existingImages.length > 0 && (
              <div className="flex flex-wrap gap-4 mb-4">
                {existingImages.map((image) => (
                  <img key={image} src={image} alt={formData.name} className="w-24 h-24 rounded-lg object-cover border border-gray-200" />
                ))}
              </div>
            )}

            <div className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100 transition" onClick={() => fileInputRef.current?.click()}>
              <input type="file" multiple accept="image/jpeg,image/png" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              <UploadCloud className="w-8 h-8 text-brand-orange mb-3" />
              <p className="text-sm font-medium text-gray-800 mb-1">Add more photos</p>
              <p className="text-xs text-gray-500">Existing photos remain attached.</p>
            </div>

            {files.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {files.map((file, index) => (
                  <div key={`${file.name}-${index}`} className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700">
                    <span className="max-w-[180px] truncate">{file.name}</span>
                    <button type="button" onClick={() => removeFile(index)} className="text-red-500"><X className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <p className="text-xs font-medium text-red-500">* Required fields</p>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => navigate('/admin/animals')} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="button" onClick={() => void handleSave()} disabled={isSaving} className="px-6 py-2.5 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition shadow-sm disabled:opacity-60">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input type={type} className="input-field mt-1" value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}
