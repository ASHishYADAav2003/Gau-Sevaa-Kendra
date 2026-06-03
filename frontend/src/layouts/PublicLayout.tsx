import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PublicLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-brand-beige font-sans">
      <Navbar />
      <main className={`flex-grow ${!isHome ? 'pt-20 md:pt-24' : ''}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
