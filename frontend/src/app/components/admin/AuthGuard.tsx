import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login', { state: { from: location } });
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate, location]);

  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center text-[#FF6600]">Loading...</div>;
  }

  return <>{children}</>;
}
