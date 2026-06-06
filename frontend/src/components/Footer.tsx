import { Link } from 'react-router-dom';
import { Heart, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import Reveal from './Reveal';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-green text-white">
      <div className="absolute inset-0">
        <img src="/beautiful-cow.png" alt="" className="h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-brand-green/80" />
      </div>

      <Reveal className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 rounded-lg bg-white p-2 mb-5">
              <img src="/logo.jpeg" alt="Gau Seva Kendra Logo" className="h-14 w-auto object-contain" />
            </Link>
            <p className="max-w-md text-sm leading-7 text-white/75">
              A donation and care management platform for animal rescue, campaign transparency, expenses, and secure donor receipts.
            </p>
            <Link to="/donate" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-orange px-5 py-3 text-sm font-bold text-white hover:bg-orange-700">
              Donate Securely <Heart className="h-4 w-4 fill-white" />
            </Link>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-brand-orange">Explore</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/campaigns" className="hover:text-white">Campaigns</Link></li>
              <li><Link to="/donate" className="hover:text-white">Donate</Link></li>
              <li><Link to="/about" className="hover:text-white">About</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-brand-orange">Legal & Trust</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li><Link to="/terms" className="hover:text-white">Terms and Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/refund" className="hover:text-white">Refund Policy</Link></li>
              <li><Link to="/donate" className="hover:text-white">Tax Receipt Flow</Link></li>
            </ul>
            <div className="mt-5 flex items-start gap-2 rounded-lg bg-white/10 p-3 text-xs text-white/70">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
              <span>Payments are created and verified through backend APIs before receipts are shown.</span>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-brand-orange">Contact</h3>
            <ul className="space-y-4 text-sm text-white/80">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />
                <span>Gau Seva Kendra<br />Vrindavan, Uttar Pradesh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-brand-orange" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-brand-orange" />
                <span>info@gausevakendra.org</span>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 shrink-0 text-green-300" />
                <span>Emergency support via contact page</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-xs text-white/60 flex flex-col md:flex-row justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} Gau Seva Kendra. All Rights Reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/terms" className="hover:text-white">Terms</Link>
            <Link to="/privacy" className="hover:text-white">Privacy</Link>
            <Link to="/refund" className="hover:text-white">Refunds</Link>
            <Link to="/admin" className="hover:text-white">Admin</Link>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
