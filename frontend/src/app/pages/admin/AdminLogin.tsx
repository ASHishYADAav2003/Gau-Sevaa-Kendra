import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowLeft, Heart, IndianRupee, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    if (authError) setAuthError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setAuthError('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setAuthError('Invalid email format');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('adminToken', data.token);
      toast.success('Login successful', {
        style: {
          borderRadius: '20px',
          background: '#E8F5E9',
          color: '#2E7D32',
        },
      });
      navigate('/admin/dashboard');
    } catch (error: any) {
      setAuthError(error?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F5F5F0] font-['Inter',sans-serif]">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1B3A2D] relative overflow-hidden items-center justify-center p-12">
        {/* Saffron Accent Shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#FF6600] rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF6600] rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/3 translate-y-1/3"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="text-8xl mb-6">🐄</div>
          <h1 className="text-4xl font-medium text-white mb-2">Gau Seva Kendra</h1>
          <h2 className="text-2xl text-white/80 font-['Noto_Sans_Devanagari'] mb-12">गौ सेवा केंद्र</h2>
          
          <div className="flex flex-col gap-4 w-full max-w-sm">
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-[12px] backdrop-blur-sm border border-white/10">
              <div className="w-10 h-10 rounded-full bg-[#FF6600]/20 flex items-center justify-center text-[#FF6600]">
                <Heart size={20} fill="currentColor" />
              </div>
              <span className="text-white font-medium text-lg">48 Animals Rescued</span>
            </div>
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-[12px] backdrop-blur-sm border border-white/10">
              <div className="w-10 h-10 rounded-full bg-[#2E7D32]/20 flex items-center justify-center text-[#4CAF50]">
                <IndianRupee size={20} />
              </div>
              <span className="text-white font-medium text-lg">₹12L+ Donations</span>
            </div>
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-[12px] backdrop-blur-sm border border-white/10">
              <div className="w-10 h-10 rounded-full bg-[#F57C00]/20 flex items-center justify-center text-[#F57C00]">
                <Users size={20} fill="currentColor" />
              </div>
              <span className="text-white font-medium text-lg">200+ Donors</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white rounded-[12px] p-8 border border-[#EBEBEB]">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#FF6600] flex items-center justify-center text-3xl shadow-sm mb-4">
              🐄
            </div>
            <h2 className="text-2xl font-medium text-gray-900">Admin Login</h2>
            <p className="text-sm text-[#757575] mt-1 font-['Noto_Sans_Devanagari']">गौ सेवा केंद्र Admin Portal</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-[#757575]" />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full h-[40px] pl-10 pr-3 rounded-[8px] border border-[#EBEBEB] text-[13px] placeholder-[#757575] focus:border-[#FF6600] focus:outline-none focus:ring-1 focus:ring-[#FF6600] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-[#757575]" />
                </div>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full h-[40px] pl-10 pr-10 rounded-[8px] border border-[#EBEBEB] text-[13px] placeholder-[#757575] focus:border-[#FF6600] focus:outline-none focus:ring-1 focus:ring-[#FF6600] transition-all"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#757575] hover:text-gray-900 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 rounded-[4px] border-[#EBEBEB] text-[#FF6600] focus:ring-[#FF6600]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-[13px] text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-[13px]">
                <a href="#" className="font-medium text-[#2E7D32] hover:text-[#1B5E20] transition-colors">
                  Forgot Password?
                </a>
              </div>
            </div>

            {authError && (
              <div className="bg-[#FDECEA] border-l-4 border-[#C62828] p-3 rounded-r-[8px]">
                <p className="text-[13px] text-[#C62828] font-medium">{authError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center h-[40px] rounded-[8px] bg-[#FF6600] hover:bg-[#E55A00] text-white text-[14px] font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/admin/signup" className="text-[13px] font-medium text-[#FF6600] hover:text-[#E55A00] transition-colors">
              Need an account? Sign up
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <Link to="/" className="flex items-center text-[13px] text-[#757575] hover:text-gray-900 transition-colors">
            <ArrowLeft size={14} className="mr-2" />
            Back to Website
          </Link>
        </div>
      </div>
    </div>
  );
}
