import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { ShieldCheck, Lock, ArrowLeft, User, CheckCircle2 } from 'lucide-react';
import { authApi } from '../../api/services';
import { getApiErrorMessage } from '../../api/client';

export default function AdminLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setAdmin, isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await authApi.login({
        username: data.username,
        password: data.password
      });

      setAdmin(response.admin);
      navigate('/admin');
    } catch (err: any) {
      setError(getApiErrorMessage(err, 'Invalid username or password'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans bg-[#FBF6EE]">
      {/* Left Panel - Brand Story */}
      <div className="relative hidden lg:flex flex-col w-1/2 bg-[#1B3625] text-[#FBF6EE] p-12 lg:p-20 overflow-hidden justify-between">
        {/* Subtle decorative cow silhouette */}
        <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none">
          <svg width="600" height="600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,8c-0.28,0-0.54,0.07-0.78,0.18c-0.65-1.54-2.14-2.65-3.93-2.82V5c0-0.55-0.45-1-1-1H9.86l-0.34-0.9C9.15,2.02,8.08,1.25,6.86,1.25c-0.12,0-0.24,0.01-0.36,0.03C5.16,1.52,4.07,2.5,3.78,3.83L3.19,6.5H2C0.9,6.5,0,7.4,0,8.5v3c0,0.85,0.54,1.58,1.3,1.88v6.12C1.3,20.33,2.01,21,2.88,21h0.25c0.86,0,1.57-0.67,1.57-1.5v-1.12h14.6v1.12c0,0.83,0.71,1.5,1.57,1.5h0.25c0.86,0,1.57-0.67,1.57-1.5v-6.12c0.76-0.3,1.3-1.03,1.3-1.88v-3C24,7.4,23.1,6.5,22,6.5h-1.19l-0.59-2.67C19.93,2.5,18.84,1.52,17.5,1.28c-0.12-0.02-0.24-0.03-0.36-0.03c-1.22,0-2.29,0.77-2.66,1.85l-0.34,0.9h-3.41v0.34c-1.79,0.17-3.28,1.28-3.93,2.82C6.54,8.07,6.28,8,6,8C4.34,8,3,9.34,3,11s1.34,3,3,3c1.66,0,3-1.34,3-3c0-0.28-0.04-0.55-0.11-0.81l2.3-1.01l2.3,1.01C13.44,10.45,13.4,10.72,13.4,11c0,1.66,1.34,3,3,3s3-1.34,3-3C19.4,9.34,18.06,8,16.4,8z" transform="scale(0.8) translate(3, 3)" />
          </svg>
        </div>

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center text-[#D9A441] hover:text-[#FBF6EE] transition-colors mb-16 font-semibold">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>

          <div className="flex items-center gap-4 mb-10">
            <div>
              <img src="/logo_transparent.png" alt="Logo" className="object-contain h-24 w-24 md:h-32 md:w-32 drop-shadow-xl" />
            </div>
            <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-xs font-bold tracking-wider uppercase text-green-400">Platform Online</span>
            </div>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold font-serif leading-tight mb-6">
            Preserving the divine, <br/>
            <span className="text-[#D9A441] italic">empowering the seva.</span>
          </h1>
          <p className="text-lg text-[#FBF6EE]/70 max-w-lg leading-relaxed font-light">
            You are the backbone of this sacred mission. Log in to oversee rescue operations, manage transparent campaigns, and ensure every contribution reaches its divine purpose.
          </p>
        </div>


      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-24 relative">
        <div className="lg:hidden mb-8">
          <Link to="/" className="inline-flex items-center text-[#1B3625] font-semibold">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl lg:text-4xl font-extrabold font-serif text-[#1B3625] mb-3">Admin Portal</h2>
            <p className="text-[#1B3625]/70">Enter your credentials to access the command center.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#1B3625]/10">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium flex items-start">
                  <ShieldCheck className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-xs font-bold text-[#1B3625] uppercase tracking-wider mb-2">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-[#1B3625]/40" />
                  </div>
                  <input
                    type="text"
                    {...register('username', { required: 'Username is required' })}
                    className="block w-full pl-12 pr-4 py-3.5 bg-[#FBF6EE]/50 border border-[#1B3625]/20 rounded-xl text-[#1B3625] placeholder-[#1B3625]/40 focus:bg-white focus:ring-2 focus:ring-[#1B3625] focus:border-transparent transition-all sm:text-sm"
                    placeholder="Enter your username"
                  />
                </div>
                {errors.username && <p className="mt-2 text-xs text-red-600 font-medium">{errors.username.message as string}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1B3625] uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#1B3625]/40" />
                  </div>
                  <input
                    type="password"
                    {...register('password', { required: 'Password is required' })}
                    className="block w-full pl-12 pr-4 py-3.5 bg-[#FBF6EE]/50 border border-[#1B3625]/20 rounded-xl text-[#1B3625] placeholder-[#1B3625]/40 focus:bg-white focus:ring-2 focus:ring-[#1B3625] focus:border-transparent transition-all sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="mt-2 text-xs text-red-600 font-medium">{errors.password.message as string}</p>}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-4 px-4 rounded-xl text-sm font-bold text-white bg-[#1B3625] hover:bg-[#122418] shadow-lg shadow-[#1B3625]/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#FBF6EE] focus:ring-[#1B3625] disabled:opacity-70 transition-all uppercase tracking-wider"
                >
                  <ShieldCheck className="w-5 h-5 mr-2" />
                  {isLoading ? 'Authenticating...' : 'Sign In to Admin Portal'}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-10 space-y-4">
            <h4 className="text-xs font-bold text-[#1B3625]/50 uppercase tracking-wider">Dashboard Highlights</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center text-sm font-medium text-[#1B3625]/80">
                <CheckCircle2 className="w-4 h-4 text-[#1B3625]/40 mr-2" />
                Real-time Donations
              </div>
              <div className="flex items-center text-sm font-medium text-[#1B3625]/80">
                <CheckCircle2 className="w-4 h-4 text-[#1B3625]/40 mr-2" />
                Animal Health Records
              </div>
              <div className="flex items-center text-sm font-medium text-[#1B3625]/80">
                <CheckCircle2 className="w-4 h-4 text-[#1B3625]/40 mr-2" />
                Campaign Management
              </div>
              <div className="flex items-center text-sm font-medium text-[#1B3625]/80">
                <CheckCircle2 className="w-4 h-4 text-[#1B3625]/40 mr-2" />
                Automated Receipts
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
