import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const publicLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About Us' },
  { path: '/campaigns', label: 'Campaigns' },
  { path: '/donate', label: 'Donation' },
  { path: '/volunteer', label: 'Volunteer' },
  { path: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav aria-label="Primary navigation" className={`fixed w-full top-0 z-50 transition-all duration-500 ${scrolled || !isHome ? 'bg-[#FDF0D5] py-2 shadow-[0_10px_40px_rgba(217,164,65,0.15)]' : 'bg-transparent py-4 border-b border-white/10'}`}>
      {/* Golden feature strip at the bottom of the navbar */}
      {(scrolled || !isHome) && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#D9A441] via-[#FDE68A] to-[#8B5E34]"></div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-500 ${scrolled ? 'h-16 md:h-20' : 'h-20 md:h-24'}`}>
          <div className="flex items-center shrink-0 h-full">
            <Link to="/" className="flex items-center gap-3 relative group h-full">
              <div className="absolute inset-0 bg-brand-orange/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img
                src="/logo.webp"
                alt="Gau Seva Kendra"
                width="380"
                height="380"
                decoding="async"
                className={`w-auto h-full max-h-full object-contain transition-all duration-500 relative z-10`} 
              />
            </Link>
          </div>
          
          <div className="hidden lg:flex lg:space-x-6 xl:space-x-8 items-center flex-1 justify-center pl-4 lg:pl-8">
            {publicLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                aria-current={location.pathname === link.path ? 'page' : undefined}
                className={`relative group font-medium text-sm xl:text-base transition-all duration-300 inline-block hover:-translate-y-0.5 ${(scrolled || !isHome) ? 'text-brand-dark/80 hover:text-brand-orange' : 'text-white/90 hover:text-brand-orange'} ${location.pathname === link.path ? ((scrolled || !isHome) ? 'text-brand-orange font-bold' : 'text-brand-orange font-bold') : ''}`}
              >
                {link.label}
                <span className={`absolute bottom-[-4px] left-1/2 -translate-x-1/2 h-[2px] bg-brand-orange transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">

            <Link to="/donate" aria-label="Donate Now" className="bg-brand-orange hover:bg-[#b3832d] text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full font-bold flex items-center gap-1.5 md:gap-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange hover:shadow-[0_0_20px_rgba(217,164,65,0.6)] transform hover:scale-105 transition-all duration-300">
              <Heart className="h-4 w-4 fill-white" aria-hidden="true" />
              Donate
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              type="button"
              className={`lg:hidden p-2 rounded-md ${(scrolled || !isHome || mobileMenuOpen) ? 'text-brand-dark' : 'text-white'}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-brand-orange/10 flex flex-col p-4 z-40 max-h-[80vh] overflow-y-auto">
          {publicLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              onClick={() => setMobileMenuOpen(false)}
              aria-current={location.pathname === link.path ? 'page' : undefined}
              className={`block px-4 py-3 rounded-lg text-base font-semibold transition-colors ${location.pathname === link.path ? 'bg-brand-orange/10 text-brand-orange' : 'text-brand-dark hover:bg-gray-50 hover:text-brand-orange'}`}
            >
              {link.label}
            </Link>
          ))}

        </div>
      )}
    </nav>
  );
}
