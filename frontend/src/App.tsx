import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import PublicLayout from './layouts/PublicLayout';
import Home from './pages/Home';

const Donate = lazy(() => import('./pages/Donate'));
const ThankYou = lazy(() => import('./pages/ThankYou'));
const Volunteer = lazy(() => import('./pages/Volunteer'));
const Campaigns = lazy(() => import('./pages/Campaigns'));
const CampaignDetail = lazy(() => import('./pages/CampaignDetail'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));
const DonationsList = lazy(() => import('./pages/admin/DonationsList'));
const ExpensesList = lazy(() => import('./pages/admin/ExpensesList'));
const AnimalsList = lazy(() => import('./pages/admin/AnimalsList'));
const AddAnimal = lazy(() => import('./pages/admin/AddAnimal'));
const EditAnimal = lazy(() => import('./pages/admin/EditAnimal'));
const AdminCampaigns = lazy(() => import('./pages/admin/CampaignsList'));

function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-live="polite">
      <span className="sr-only">Loading page</span>
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-brand-orange/25 border-t-brand-orange" aria-hidden="true" />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="donate" element={<Donate />} />
              <Route path="thank-you/:donationId" element={<ThankYou />} />
              <Route path="volunteer" element={<Volunteer />} />
              <Route path="campaigns" element={<Campaigns />} />
              <Route path="campaigns/:slug" element={<CampaignDetail />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="terms" element={<Terms />} />
              <Route path="privacy" element={<PrivacyPolicy />} />
              <Route path="refund" element={<RefundPolicy />} />
            </Route>

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="donations" element={<DonationsList />} />
              <Route path="expenses" element={<ExpensesList />} />
              <Route path="animals" element={<AnimalsList />} />
              <Route path="animals/add" element={<AddAnimal />} />
              <Route path="animals/edit/:id" element={<EditAnimal />} />
              <Route path="campaigns" element={<AdminCampaigns />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}

export default App;
