import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PublicLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    mainRef.current?.focus({ preventScroll: true });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-brand-beige font-sans">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-md bg-white px-4 py-3 font-semibold text-brand-dark shadow-lg transition-transform focus:translate-y-0"
      >
        Skip to main content
      </a>
      <Navbar />
      <main
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        className={`flex-grow outline-none ${!isHome ? 'pt-20 md:pt-24' : ''}`}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
