import { useState } from 'react';
import { useNavigate } from 'react-router';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  UploadCloud, 
  X, 
  Loader2, 
  CheckCircle2,
  Save
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddBlog() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    titleEn: '',
    titleHi: '',
    slug: '',
    category: 'Updates',
    author: 'Admin User',
    contentEn: '',
    contentHi: '',
    isPublished: true
  });

  const generateSlug = (text: string) => {
    return text.toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const titleEn = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      titleEn,
      slug: generateSlug(titleEn)
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleContentEnChange = (content: string) => {
    setFormData(prev => ({ ...prev, contentEn: content }));
  };

  const handleContentHiChange = (content: string) => {
    setFormData(prev => ({ ...prev, contentHi: content }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFeaturedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    setFeaturedImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent, asDraft: boolean = false) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(asDraft ? 'Draft saved successfully!' : 'Blog post published!');
      navigate('/admin/blogs');
    } catch (error) {
      toast.error('Failed to save blog post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Blog Post</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new article for the website blog.</p>
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6600]"
          >
            <Save size={16} className="mr-2" />
            Save as Draft
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF6600] hover:bg-[#e65c00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6600]"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin mr-2" /> : <CheckCircle2 size={16} className="mr-2" />}
            Publish Now
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">English Content</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title (English) *</label>
                <input
                  type="text"
                  required
                  value={formData.titleEn}
                  onChange={handleTitleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#FF6600] focus:outline-none focus:ring-[#FF6600]"
                  placeholder="Enter post title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Content *</label>
                <div className="mt-1 border rounded-md">
                  <ReactQuill 
                    theme="snow" 
                    value={formData.contentEn} 
                    onChange={handleContentEnChange} 
                    modules={quillModules}
                    className="h-64 mb-12"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 font-devanagari">Hindi Content (हिन्दी)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title in Hindi *</label>
                <input
                  type="text"
                  required
                  name="titleHi"
                  value={formData.titleHi}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-devanagari focus:border-[#FF6600] focus:outline-none focus:ring-[#FF6600]"
                  placeholder="हिन्दी शीर्षक"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Content in Hindi *</label>
                <div className="mt-1 border rounded-md font-devanagari">
                  <ReactQuill 
                    theme="snow" 
                    value={formData.contentHi} 
                    onChange={handleContentHiChange} 
                    modules={quillModules}
                    className="h-64 mb-12"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Post Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="mt-2 flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="isPublished" 
                      checked={formData.isPublished} 
                      onChange={handleChange} 
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF6600]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6600]"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {formData.isPublished ? 'Publish Now' : 'Save as Draft'}
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">URL Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-[#FF6600] focus:outline-none focus:ring-[#FF6600]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#FF6600] focus:border-[#FF6600] sm:text-sm"
                >
                  <option value="Updates">Updates</option>
                  <option value="Success Stories">Success Stories</option>
                  <option value="Health & Care">Health & Care</option>
                  <option value="Volunteers">Volunteers</option>
                  <option value="Transparency">Transparency</option>
                  <option value="Rescue Operations">Rescue Operations</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Author</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#FF6600] focus:outline-none focus:ring-[#FF6600]"
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Featured Image</h2>
            
            {!imagePreview ? (
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-[#FF6600] hover:bg-orange-50 transition-colors">
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label htmlFor="featured-image" className="relative cursor-pointer bg-transparent rounded-md font-medium text-[#FF6600] hover:text-[#e65c00] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#FF6600]">
                      <span>Upload a file</span>
                      <input id="featured-image" name="featured-image" type="file" accept="image/*" className="sr-only" onChange={handlePhotoUpload} />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                </div>
              </div>
            ) : (
              <div className="relative rounded-md overflow-hidden border border-gray-200">
                <img src={imagePreview} alt="Featured Preview" className="w-full h-auto object-cover" />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-md"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
