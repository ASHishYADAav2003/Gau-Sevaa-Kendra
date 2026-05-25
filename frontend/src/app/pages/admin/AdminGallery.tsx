import { useState, useEffect } from 'react';
import { Search, PlusCircle, Trash2, Image as ImageIcon, Eye, EyeOff, X } from 'lucide-react';
import toast from 'react-hot-toast';

type GalleryImage = {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  caption?: string | null;
  isPublished: boolean;
  createdAt: string;
};

const GALLERY_STORAGE_KEY = 'gau_gallery';

const defaultGallery: GalleryImage[] = [
  {
    id: 'seed-1',
    title: 'Morning Feeding',
    imageUrl: 'https://images.unsplash.com/photo-1772948260139-d5a6418e143d?w=600&q=80',
    category: 'Daily Care',
    caption: 'Volunteers feeding cows at sunrise',
    isPublished: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-2',
    title: 'Shelter Life',
    imageUrl: 'https://images.unsplash.com/photo-1673229266917-89abfa3ebc58?w=600&q=80',
    category: 'Shelter',
    caption: 'Peaceful moments at the gaushala',
    isPublished: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-3',
    title: 'Rescue Day',
    imageUrl: 'https://images.unsplash.com/photo-1769466100846-86239ba740aa?w=600&q=80',
    category: 'Rescue',
    caption: 'New arrivals receiving care',
    isPublished: true,
    createdAt: new Date().toISOString(),
  },
];

function loadLocalGallery(): GalleryImage[] {
  try {
    const raw = localStorage.getItem(GALLERY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalGallery(images: GalleryImage[]) {
  localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(images));
}

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    imageUrl: '',
    category: 'General',
    caption: '',
    isPublished: true,
  });

  const fetchGallery = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gallery');
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setImages(data);
        } else {
          const local = loadLocalGallery();
          const seeded = local.length > 0 ? local : defaultGallery;
          setImages(seeded);
          if (local.length === 0) saveLocalGallery(seeded);
        }
      } else {
        const local = loadLocalGallery();
        setImages(local.length > 0 ? local : defaultGallery);
      }
    } catch {
      const local = loadLocalGallery();
      setImages(local.length > 0 ? local : defaultGallery);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.imageUrl.trim()) {
      toast.error('Title and image URL are required');
      return;
    }

    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const created = await res.json();
        setImages((prev) => [created, ...prev]);
        toast.success('Image added to gallery');
      } else {
        throw new Error('API failed');
      }
    } catch {
      const newImage: GalleryImage = {
        id: `local-${Date.now()}`,
        ...form,
        caption: form.caption || null,
        createdAt: new Date().toISOString(),
      };
      const updated = [newImage, ...images];
      setImages(updated);
      saveLocalGallery(updated);
      toast.success('Image saved locally');
    }

    setForm({ title: '', imageUrl: '', category: 'General', caption: '', isPublished: true });
    setShowAddModal(false);
  };

  const togglePublish = async (img: GalleryImage) => {
    const next = !img.isPublished;
    try {
      const res = await fetch(`/api/gallery/${img.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: next }),
      });
      if (res.ok) {
        const updated = await res.json();
        setImages((prev) => prev.map((i) => (i.id === img.id ? updated : i)));
      } else {
        throw new Error();
      }
    } catch {
      const updated = images.map((i) => (i.id === img.id ? { ...i, isPublished: next } : i));
      setImages(updated);
      saveLocalGallery(updated);
    }
    toast.success(next ? 'Image published' : 'Image hidden');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this gallery image?')) return;
    try {
      await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    } catch {
      /* local fallback */
    }
    const updated = images.filter((i) => i.id !== id);
    setImages(updated);
    saveLocalGallery(updated);
    toast.success('Image removed');
  };

  const categories = [...new Set(images.map((i) => i.category))];

  const filtered = images.filter((img) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      img.title.toLowerCase().includes(q) ||
      (img.caption || '').toLowerCase().includes(q);
    const matchesCategory = categoryFilter ? img.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 font-['Inter',sans-serif]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ImageIcon className="w-7 h-7 text-[#FF6600]" />
            Photo Gallery
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {images.length} images · {images.filter((i) => i.isPublished).length} published
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-[#FF6600] hover:bg-[#e65c00]"
        >
          <PlusCircle size={16} className="mr-2" />
          Add Image
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search gallery..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-[#FF6600] focus:border-[#FF6600]"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border-gray-300 rounded-md text-sm py-2 px-3 focus:ring-[#FF6600] focus:border-[#FF6600]"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-gray-500">Loading gallery...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No gallery images yet.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 text-[#FF6600] font-medium hover:underline"
            >
              Add your first image
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((img) => (
              <div
                key={img.id}
                className={`rounded-lg overflow-hidden border bg-white shadow-sm ${
                  !img.isPublished ? 'opacity-70' : ''
                }`}
              >
                <div className="relative aspect-video bg-gray-100">
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1772948260139-d5a6418e143d?w=400&q=80';
                    }}
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-black/60 text-white">
                    {img.category}
                  </span>
                  {!img.isPublished && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-800 text-white">
                      Hidden
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate">{img.title}</h3>
                  {img.caption && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{img.caption}</p>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <button
                      onClick={() => togglePublish(img)}
                      className="inline-flex items-center text-sm text-gray-600 hover:text-[#FF6600]"
                    >
                      {img.isPublished ? (
                        <>
                          <EyeOff size={16} className="mr-1" /> Hide
                        </>
                      ) : (
                        <>
                          <Eye size={16} className="mr-1" /> Publish
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(img.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add Gallery Image</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF6600] focus:border-[#FF6600]"
                  placeholder="e.g. Morning Feeding"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF6600] focus:border-[#FF6600]"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF6600] focus:border-[#FF6600]"
                >
                  <option>General</option>
                  <option>Daily Care</option>
                  <option>Shelter</option>
                  <option>Rescue</option>
                  <option>Events</option>
                  <option>Medical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                <textarea
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF6600] focus:border-[#FF6600]"
                  placeholder="Optional description"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="rounded text-[#FF6600] focus:ring-[#FF6600]"
                />
                <span className="text-sm text-gray-700">Publish immediately</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#FF6600] text-white rounded-md text-sm font-medium hover:bg-[#e65c00]"
                >
                  Add Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
