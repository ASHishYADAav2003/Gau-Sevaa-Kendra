import { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router';
import { 
  LayoutDashboard, 
  Heart, 
  Receipt, 
  IndianRupee, 
  Users, 
  FileText, 
  Mail, 
  Image as ImageIcon,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Globe
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const navGroups = [
    {
      label: 'MAIN',
      links: [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Animals', path: '/admin/animals', icon: Heart, badge: '48' },
        { name: 'Donations', path: '/admin/donations', icon: IndianRupee, badge: '12' },
        { name: 'Expenses', path: '/admin/expenses', icon: Receipt },
      ]
    },
    {
      label: 'MANAGE',
      links: [
        { name: 'Volunteers', path: '/admin/volunteers', icon: Users, badge: '5' },
        { name: 'Blog', path: '/admin/blogs', icon: FileText },
        { name: 'Newsletter', path: '/admin/newsletter', icon: Mail },
        { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
      ]
    },
    {
      label: 'SYSTEM',
      links: [
        { name: 'Settings', path: '/admin/settings', icon: Settings },
      ]
    }
  ];

  // Helper to format path into breadcrumb
  const getPageTitle = () => {
    const path = location.pathname.replace('/admin', '');
    if (!path || path === '/dashboard') return { title: 'Dashboard', breadcrumb: 'Admin / Dashboard' };
    
    const parts = path.split('/').filter(Boolean);
    const title = parts[parts.length - 1].charAt(0).toUpperCase() + parts[parts.length - 1].slice(1);
    
    return {
      title,
      breadcrumb: `Admin / ${parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' / ')}`
    };
  };

  const { title, breadcrumb } = getPageTitle();

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex font-['Inter',sans-serif]">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-[#1B3A2D] flex flex-col transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-[60px]' : 'w-[220px]'} 
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-[64px] flex items-center justify-between px-3 border-b border-white/10 shrink-0">
          <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'gap-3 overflow-hidden'}`}>
            <div className="w-9 h-9 rounded-[8px] bg-[#FF6600] flex items-center justify-center text-xl shrink-0">
              🐄
            </div>
            {!isCollapsed && (
              <div className="flex flex-col whitespace-nowrap">
                <span className="text-[14px] font-medium text-white leading-tight">Gau Seva Kendra</span>
                <span className="text-[11px] text-white/65 font-['Noto_Sans_Devanagari'] leading-tight">गौ सेवा केंद्र</span>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button 
              onClick={() => setIsCollapsed(true)} 
              className="hidden lg:flex text-white/50 hover:text-white transition-colors shrink-0"
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          {isCollapsed && (
            <div className="flex justify-center mb-4">
              <button 
                onClick={() => setIsCollapsed(false)} 
                className="text-white/50 hover:text-white transition-colors p-2"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {navGroups.map((group, idx) => (
            <div key={idx} className="mb-6">
              {!isCollapsed && (
                <div className="px-5 mb-2">
                  <span className="text-[10px] uppercase text-white/35 font-medium tracking-wider">{group.label}</span>
                </div>
              )}
              <ul className="space-y-1 px-2">
                {group.links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.path}>
                      <NavLink
                        to={link.path}
                        title={isCollapsed ? link.name : undefined}
                        className={({ isActive }) => 
                          `flex items-center relative h-[40px] rounded-[8px] transition-all duration-150 ${
                            isCollapsed ? 'justify-center px-0' : 'px-3 gap-3'
                          } ${
                            isActive 
                              ? 'bg-[#FF6600] text-white' 
                              : 'text-white/65 hover:bg-white/10 hover:text-white'
                          }`
                        }
                      >
                        <Icon size={18} className="shrink-0" />
                        {!isCollapsed && (
                          <span className="text-[13px] whitespace-nowrap flex-1">{link.name}</span>
                        )}
                        {!isCollapsed && link.badge && (
                          <span className="bg-[#FF6600] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[20px] ml-auto shrink-0 leading-none">
                            {link.badge}
                          </span>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/10 shrink-0">
          <div className={`flex items-center ${isCollapsed ? 'justify-center flex-col gap-3' : 'justify-between'}`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#2E7D32] border border-[#FF6600] flex items-center justify-center text-white text-xs font-bold shrink-0">
                AD
              </div>
              {!isCollapsed && (
                <div className="flex flex-col whitespace-nowrap overflow-hidden">
                  <span className="text-[13px] text-white font-medium truncate">Admin User</span>
                  <span className="text-[11px] text-white/50">Super Admin</span>
                </div>
              )}
            </div>
            <button 
              onClick={handleLogout}
              title={isCollapsed ? "Logout" : undefined}
              className={`text-white/65 hover:text-[#FF6600] transition-colors p-1.5 rounded-md hover:bg-white/5 ${isCollapsed ? '' : 'shrink-0'}`}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-[64px] bg-white border-b border-[#EBEBEB] flex items-center justify-between px-4 sm:px-6 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Menu size={20} />
            </button>
            
            <div className="flex flex-col">
              <h2 className="text-[15px] font-medium text-gray-900 leading-tight">{title}</h2>
              <span className="text-[12px] text-[#757575] leading-tight">{breadcrumb}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 text-[#757575] hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
              <Search size={18} />
            </button>
            
            <button className="p-2 text-[#757575] hover:bg-gray-100 rounded-full transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6600] rounded-full border border-white"></span>
            </button>
            
            <div className="h-6 w-px bg-[#EBEBEB] mx-1 hidden sm:block"></div>
            
            <div className="hidden sm:flex items-center gap-1 bg-[#F5F5F0] rounded-[20px] p-1 border border-[#EBEBEB]">
              <button className="px-2.5 py-1 text-[11px] font-medium rounded-[16px] bg-white text-gray-900 shadow-sm">EN</button>
              <button className="px-2.5 py-1 text-[11px] font-medium rounded-[16px] text-[#757575] hover:text-gray-900 font-['Noto_Sans_Devanagari']">हिं</button>
            </div>
            
            <div className="ml-2 w-8 h-8 rounded-full bg-[#2E7D32] border border-[#EBEBEB] flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity">
              AD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          <Outlet />
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
        aside .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255,255,255,0.1);
        }
      `}</style>
    </div>
  );
}
