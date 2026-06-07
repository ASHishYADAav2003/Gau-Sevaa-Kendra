import { Navigate, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useEffect, useState } from 'react';
import { LayoutDashboard, Heart, IndianRupee, Banknote, Settings, LogOut, ChevronLeft, Target, Menu } from 'lucide-react';

export default function AdminLayout() {
  const { isAuthenticated, isCheckingSession, checkSession, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center text-sm font-medium text-gray-500">
        Checking secure admin session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const menuSections = [
    {
      title: 'MAIN',
      items: [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Animals', path: '/admin/animals', icon: Heart },
        { name: 'Campaigns', path: '/admin/campaigns', icon: Target },
        { name: 'Donations', path: '/admin/donations', icon: IndianRupee },
        { name: 'Expenses', path: '/admin/expenses', icon: Banknote },
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { name: 'Settings', path: '/admin/settings', icon: Settings },
      ]
    }
  ];

  const currentPathName = menuSections.flatMap(s => s.items).find(i => 
    i.path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(i.path)
  )?.name || 'Dashboard';

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-[#1a3626] flex flex-col fixed h-full z-50 text-white/80 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="h-16 flex items-center px-6 mb-4 mt-2">
          <div className="flex items-center gap-3">
            <div className="bg-brand-orange p-1.5 rounded-md">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h2 className="text-white font-bold leading-tight">Gau Seva Kendra</h2>
              <p className="text-[10px] text-white/60">गौ सेवा केंद्र</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="ml-auto md:hidden text-white/40 hover:text-white">
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto pb-4 custom-scrollbar">
          {menuSections.map((section, idx) => (
            <div key={section.title} className={idx !== 0 ? 'mt-6' : ''}>
              <h3 className="px-6 text-[11px] font-semibold text-white/40 tracking-wider mb-2">
                {section.title}
              </h3>
              <ul className="space-y-1 px-3">
                {section.items.map((link) => {
                  const Icon = link.icon;
                  const isActive = link.path === '/admin' 
                    ? location.pathname === '/admin' 
                    : location.pathname.startsWith(link.path);
                  
                  return (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          isActive 
                            ? 'bg-brand-orange text-white shadow-sm' 
                            : 'hover:bg-white/5 hover:text-white text-white/70'
                        }`}
                      >
                        <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-white' : 'text-white/50'}`} />
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        
        <div className="p-4 mt-auto">
          <button 
            onClick={() => void logout()}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-400 hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen max-w-full">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 md:px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3 md:gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-gray-500 hover:text-gray-700 transition" title="Open Menu">
              <Menu className="w-6 h-6" />
            </button>
            <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 transition" title="Go Back">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-tight">
                {currentPathName}
              </h1>
              <p className="text-xs text-gray-500">Admin / {currentPathName}</p>
            </div>
          </div>
        </header>
        <div className="p-6 md:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
