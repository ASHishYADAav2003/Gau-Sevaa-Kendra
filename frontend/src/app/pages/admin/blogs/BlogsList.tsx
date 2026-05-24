import { useState } from 'react';
import { Link } from 'react-router';
import { 
  Search, 
  PlusCircle, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle, 
  Clock 
} from 'lucide-react';
import toast from 'react-hot-toast';

const mockBlogs = [
  { id: 1, title: 'How Your Donations Help During Monsoon Season', category: 'Updates', author: 'Dr. Rajesh Kumar', date: '2026-05-10', status: 'Published' },
  { id: 2, title: 'Meet Lakshmi: A Story of Recovery and Hope', category: 'Success Stories', author: 'Priya Sharma', date: '2026-05-05', status: 'Published' },
  { id: 3, title: 'New Medical Equipment Arrives', category: 'Updates', author: 'Admin', date: '2026-05-25', status: 'Draft' },
];

export default function BlogsList() {
  const [blogs, setBlogs] = useState(mockBlogs);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if(window.confirm('Are you sure you want to delete this blog post?')) {
      setBlogs(blogs.filter(b => b.id !== id));
      toast.success('Blog post deleted successfully');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Manage Blogs</h1>
        <Link
          to="/admin/blogs/add"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF6600] hover:bg-[#e65c00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6600]"
        >
          <PlusCircle size={16} className="mr-2" />
          Add New Post
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#FF6600] focus:border-[#FF6600] sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <select className="border-gray-300 rounded-md text-sm py-2 px-3 focus:ring-[#FF6600] focus:border-[#FF6600]">
              <option>All Status</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
            <select className="border-gray-300 rounded-md text-sm py-2 px-3 focus:ring-[#FF6600] focus:border-[#FF6600]">
              <option>All Categories</option>
              <option>Updates</option>
              <option>Success Stories</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBlogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-[#FF6600]">
                      {blog.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {blog.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {blog.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {blog.status === 'Published' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle size={12} className="mr-1" />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <Clock size={12} className="mr-1" />
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <Eye size={18} />
                    </button>
                    <button className="text-[#2E7D32] hover:text-green-900 mr-3">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(blog.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredBlogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No blog posts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
