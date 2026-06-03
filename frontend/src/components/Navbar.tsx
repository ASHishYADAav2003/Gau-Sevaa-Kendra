import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';



export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${scrolled || !isHome ? 'bg-[#FDF0D5] py-2 shadow-[0_10px_40px_rgba(217,164,65,0.15)]' : 'bg-transparent py-4 border-b border-white/10'}`}>
      {/* Golden feature strip at the bottom of the navbar */}
      {(scrolled || !isHome) && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#D9A441] via-[#FDE68A] to-[#8B5E34]"></div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-500 ${scrolled ? 'h-14' : 'h-16'}`}>
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 relative group">
              <div className="absolute inset-0 bg-brand-orange/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img 
                src="/logo.jpeg" 
                alt="Gau Seva Kendra Logo" 
                className={`w-auto object-contain rounded-full mix-blend-multiply contrast-[1.1] brightness-[1.05] transition-all duration-500 relative z-10 ${scrolled ? 'h-12 md:h-14' : 'h-14 md:h-16'}`} 
              />
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center flex-1 justify-center">
            {[
              { path: '/', label: 'Home' },
              { path: '/about', label: 'About Us' },
              { path: '/work', label: 'Our Work' },
              { path: '/animals', label: 'Animals' },
              { path: '/donate', label: 'Donation' },
              { path: '/volunteer', label: 'Volunteer' },
              { path: '/blog', label: 'Blog' },
              { path: '/contact', label: 'Contact' },
            ].map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`relative group font-medium text-sm transition-all duration-300 inline-block hover:-translate-y-0.5 ${(scrolled || !isHome) ? 'text-brand-dark/80 hover:text-brand-orange' : 'text-white/90 hover:text-brand-orange'} ${location.pathname === link.path ? ((scrolled || !isHome) ? 'text-brand-orange font-bold' : 'text-brand-orange font-bold') : ''}`}
              >
                {link.label}
                <span className={`absolute bottom-[-4px] left-1/2 -translate-x-1/2 h-[2px] bg-brand-orange transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button aria-label="Switch Language" className={`hidden sm:block text-sm font-semibold border px-3 py-1.5 rounded-full transition-all focus:outline-none hover:-translate-y-0.5 ${(scrolled || !isHome) ? 'text-brand-dark/70 border-brand-orange/30 hover:border-brand-orange hover:text-brand-orange' : 'text-white/80 border-white/30 hover:border-white hover:text-white'}`}>
              EN | HI
            </button>
            <Link to="/donate" aria-label="Donate Now" className="bg-brand-orange hover:bg-[#b3832d] text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full font-bold flex items-center gap-1.5 md:gap-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange hover:shadow-[0_0_20px_rgba(217,164,65,0.6)] transform hover:scale-105 transition-all duration-300">
              <Heart className="h-4 w-4 fill-white" aria-hidden="true" />
              Donate
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              className={`md:hidden p-2 rounded-md ${(scrolled || !isHome || mobileMenuOpen) ? 'text-brand-dark' : 'text-white'}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-brand-orange/10 flex flex-col p-4 z-40 max-h-[80vh] overflow-y-auto">
          {[
            { path: '/', label: 'Home' },
            { path: '/about', label: 'About Us' },
            { path: '/work', label: 'Our Work' },
            { path: '/animals', label: 'Animals' },
            { path: '/donate', label: 'Donation' },
            { path: '/volunteer', label: 'Volunteer' },
            { path: '/blog', label: 'Blog' },
            { path: '/contact', label: 'Contact' },
          ].map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className={`block px-4 py-3 rounded-lg text-base font-semibold transition-colors ${location.pathname === link.path ? 'bg-brand-orange/10 text-brand-orange' : 'text-brand-dark hover:bg-gray-50 hover:text-brand-orange'}`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 pt-4 border-t border-gray-100 px-4">
            <button className="w-full py-2.5 border border-brand-orange/30 text-brand-orange rounded-lg font-semibold hover:bg-brand-orange hover:text-white transition-colors">
              Language: EN | HI
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
