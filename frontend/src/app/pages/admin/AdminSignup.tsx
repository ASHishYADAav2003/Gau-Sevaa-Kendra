import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Eye, EyeOff, Loader2, User, Mail, Phone, Lock, Heart, IndianRupee, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSignup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    secretKey: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    else if (formData.fullName.trim().length < 3) newErrors.fullName = 'Min 3 characters required';

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile Number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Must be exactly 10 digits';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8 || !/[A-Z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      newErrors.password = 'Min 8 chars, 1 uppercase, 1 number';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.secretKey.trim()) {
      newErrors.secretKey = 'Admin Secret Key is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = () => {
    const { password } = formData;
    if (!password) return { label: '', color: '' };
    if (password.length < 6) return { label: 'Weak', color: 'text-[#C62828] bg-[#FDECEA]' };
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return { label: 'Strong', color: 'text-[#2E7D32] bg-[#E8F5E9]' };
    return { label: 'Fair', color: 'text-[#F57C00] bg-[#FFF3E0]' };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (formData.secretKey !== 'GAUSEVA2026') {
        throw new Error('Invalid Admin Secret Key');
      }

      toast.success('Account created! Redirecting...', {
        style: {
          borderRadius: '20px',
          background: '#E8F5E9',
          color: '#2E7D32',
        },
      });
      setTimeout(() => {
        navigate('/admin/login');
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong', {
        style: {
          borderRadius: '20px',
          background: '#FDECEA',
          color: '#C62828',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const strength = getPasswordStrength();

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

      {/* Right Panel - Signup Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md bg-white rounded-[12px] p-8 border border-[#EBEBEB]">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#FF6600] flex items-center justify-center text-3xl shadow-sm mb-4">
              🐄
            </div>
            <h2 className="text-2xl font-medium text-gray-900">Admin Signup</h2>
            <p className="text-sm text-[#757575] mt-1 font-['Noto_Sans_Devanagari']">गौ सेवा केंद्र Admin Portal</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-[#757575]" />
                </div>
                <input
                  name="fullName"
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`block w-full h-[40px] pl-10 pr-3 rounded-[8px] border text-[13px] placeholder-[#757575] focus:outline-none focus:ring-1 transition-all ${errors.fullName ? 'border-[#C62828] focus:border-[#C62828] focus:ring-[#C62828]' : 'border-[#EBEBEB] focus:border-[#FF6600] focus:ring-[#FF6600]'}`}
                />
              </div>
              {errors.fullName && <p className="mt-1 text-[11px] text-[#C62828] pl-1">{errors.fullName}</p>}
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-[#757575]" />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full h-[40px] pl-10 pr-3 rounded-[8px] border text-[13px] placeholder-[#757575] focus:outline-none focus:ring-1 transition-all ${errors.email ? 'border-[#C62828] focus:border-[#C62828] focus:ring-[#C62828]' : 'border-[#EBEBEB] focus:border-[#FF6600] focus:ring-[#FF6600]'}`}
                />
              </div>
              {errors.email && <p className="mt-1 text-[11px] text-[#C62828] pl-1">{errors.email}</p>}
            </div>

            <div>
              <div className="relative flex">
                <div className="flex-shrink-0 flex items-center justify-center px-3 border border-r-0 border-[#EBEBEB] rounded-l-[8px] bg-gray-50 text-[13px] text-[#757575] h-[40px]">
                  <Phone size={14} className="mr-1" />
                  +91
                </div>
                <input
                  name="mobile"
                  type="tel"
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`block w-full h-[40px] pl-3 pr-3 rounded-r-[8px] border text-[13px] placeholder-[#757575] focus:outline-none focus:ring-1 transition-all ${errors.mobile ? 'border-[#C62828] focus:border-[#C62828] focus:ring-[#C62828]' : 'border-[#EBEBEB] focus:border-[#FF6600] focus:ring-[#FF6600]'}`}
                />
              </div>
              {errors.mobile && <p className="mt-1 text-[11px] text-[#C62828] pl-1">{errors.mobile}</p>}
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
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full h-[40px] pl-10 pr-10 rounded-[8px] border text-[13px] placeholder-[#757575] focus:outline-none focus:ring-1 transition-all ${errors.password ? 'border-[#C62828] focus:border-[#C62828] focus:ring-[#C62828]' : 'border-[#EBEBEB] focus:border-[#FF6600] focus:ring-[#FF6600]'}`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#757575] hover:text-gray-900 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="flex justify-between items-center mt-1 pl-1">
                {errors.password ? (
                  <p className="text-[11px] text-[#C62828]">{errors.password}</p>
                ) : (
                  <div className="w-full"></div>
                )}
                {formData.password && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-[20px] font-medium ${strength.color}`}>
                    {strength.label}
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-[#757575]" />
                </div>
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full h-[40px] pl-10 pr-10 rounded-[8px] border text-[13px] placeholder-[#757575] focus:outline-none focus:ring-1 transition-all ${errors.confirmPassword ? 'border-[#C62828] focus:border-[#C62828] focus:ring-[#C62828]' : 'border-[#EBEBEB] focus:border-[#FF6600] focus:ring-[#FF6600]'}`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#757575] hover:text-gray-900 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-[11px] text-[#C62828] pl-1">{errors.confirmPassword}</p>}
            </div>

            <div className="pt-2 border-t border-[#EBEBEB]">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-[#FF6600]" />
                </div>
                <input
                  name="secretKey"
                  type={showSecretKey ? 'text' : 'password'}
                  placeholder="Admin Secret Key"
                  value={formData.secretKey}
                  onChange={handleChange}
                  className={`block w-full h-[40px] pl-10 pr-10 rounded-[8px] border bg-[#FFF3E0]/30 text-[13px] placeholder-[#757575] focus:outline-none focus:ring-1 transition-all ${errors.secretKey ? 'border-[#C62828] focus:border-[#C62828] focus:ring-[#C62828]' : 'border-[#EBEBEB] focus:border-[#FF6600] focus:ring-[#FF6600]'}`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#757575] hover:text-gray-900 transition-colors"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                >
                  {showSecretKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="flex justify-between items-center mt-1 pl-1">
                {errors.secretKey ? (
                  <p className="text-[11px] text-[#C62828]">{errors.secretKey}</p>
                ) : (
                  <p className="text-[11px] text-[#757575]">Contact your organization for this key</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center h-[40px] rounded-[8px] bg-[#FF6600] hover:bg-[#E55A00] text-white text-[14px] font-medium transition-all mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Creating Account...
                </>
              ) : (
                'Create Admin Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/admin/login" className="text-[13px] font-medium text-[#FF6600] hover:text-[#E55A00] transition-colors">
              Already have an account? Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
