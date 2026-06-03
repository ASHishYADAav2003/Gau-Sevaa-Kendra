import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import Donate from './pages/Donate';
import Volunteer from './pages/Volunteer';
import Blog from './pages/Blog';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminSettings from './pages/admin/Settings';
import DonationsList from './pages/admin/DonationsList';
import ExpensesList from './pages/admin/ExpensesList';
import VolunteersList from './pages/admin/VolunteersList';
import AnimalsList from './pages/admin/AnimalsList';
import AddAnimal from './pages/admin/AddAnimal';
import EditAnimal from './pages/admin/EditAnimal';
import NewsletterList from './pages/admin/NewsletterList';
import RefundPolicy from './pages/RefundPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="donate" element={<Donate />} />
            <Route path="volunteer" element={<Volunteer />} />
            <Route path="blog" element={<Blog />} />
            <Route path="campaigns" element={<div className="p-12 text-center text-2xl font-bold">Campaigns List (Coming Soon)</div>} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="terms" element={<Terms />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="refund" element={<RefundPolicy />} />
          </Route>

          {/* Admin Authentication */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="donations" element={<DonationsList />} />
            <Route path="expenses" element={<ExpensesList />} />
            <Route path="volunteers" element={<VolunteersList />} />
            <Route path="animals" element={<AnimalsList />} />
            <Route path="animals/add" element={<AddAnimal />} />
            <Route path="animals/edit/:id" element={<EditAnimal />} />
            <Route path="campaigns" element={<div className="p-6 text-xl">Campaigns Management (Coming Soon)</div>} />
            <Route path="newsletter" element={<NewsletterList />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
