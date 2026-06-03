import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Phone, Mail, MessageCircle, Globe, Camera, Video, Send } from 'lucide-react';
import Reveal from './Reveal';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const saved = localStorage.getItem('gauseva_newsletter');
    const subscribers = saved ? JSON.parse(saved) : [];
    
    // Check if already subscribed
    if (subscribers.some((s: any) => s.email === email)) {
      alert('You are already subscribed!');
      setEmail('');
      return;
    }

    const newSubscriber = {
      id: Date.now().toString(),
      email,
      subscribedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    localStorage.setItem('gauseva_newsletter', JSON.stringify([...subscribers, newSubscriber]));
    setSubscribed(true);
    setEmail('');
    
    // Hide message after 5 seconds
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="relative text-white py-16 overflow-hidden">
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url('/beautiful-cow.png')` }}
      >
        <div className="absolute inset-0 bg-brand-green/80"></div>
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          
          <div className="md:col-span-1 lg:col-span-1">
            <Link to="/" className="flex flex-col items-start gap-2 mb-6 bg-white p-2 rounded-xl inline-block w-fit">
              <img src="/logo.jpeg" alt="Gau Seva Kendra Logo" className="h-16 w-auto object-contain" />
            </Link>
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              We are committed to the protection, care and well-being of cows. Together, let's create a more compassionate world.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition">
                <Camera className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition">
                <Video className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-brand-orange font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/work" className="hover:text-white transition">Our Work</Link></li>
              <li><Link to="/animals" className="hover:text-white transition">Animals</Link></li>
              <li><Link to="/donate" className="hover:text-white transition">Donation</Link></li>
              <li><Link to="/volunteer" className="hover:text-white transition">Volunteer</Link></li>
              <li><Link to="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-brand-orange font-semibold mb-6">Our Services</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li><Link to="/services" className="hover:text-white transition">Rescue & Shelter</Link></li>
              <li><Link to="/services" className="hover:text-white transition">Medical Care</Link></li>
              <li><Link to="/services" className="hover:text-white transition">Food & Nutrition</Link></li>
              <li><Link to="/services" className="hover:text-white transition">Adoption</Link></li>
              <li><Link to="/services" className="hover:text-white transition">Emergency Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-brand-orange font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm text-white/80">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <span>123, Gau Seva Marg,<br/>Vrindavan, Uttar Pradesh - 281121</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-orange shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-orange shrink-0" />
                <span>info@gausevakendra.org</span>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-green-400 shrink-0" />
                <span>WhatsApp Us</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-brand-orange font-semibold mb-6">Newsletter</h3>
            <p className="text-sm text-white/80 mb-4">Subscribe to get updates and our latest news.</p>
            {subscribed ? (
              <div className="bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-2 rounded-md text-sm">
                Thank you for subscribing!
              </div>
            ) : (
              <form className="flex" onSubmit={handleSubscribe}>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Your email address" 
                  className="bg-white text-brand-dark px-4 py-2 w-full rounded-l-md focus:outline-none text-sm"
                />
                <button 
                  type="submit" 
                  className="bg-brand-orange hover:bg-[#c66e2c] px-4 py-2 rounded-r-md transition flex items-center justify-center"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </form>
            )}
          </div>

        </div>
        
        <div className="mt-16 pt-8 border-t border-white/10 text-xs text-white/60 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Gau Seva Kendra. All Rights Reserved.</p>
          
          <div className="flex gap-4 md:gap-6">
            <Link to="/terms" className="hover:text-white transition">Terms</Link>
            <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/refund" className="hover:text-white transition">Refund Policy</Link>
          </div>

          <div className="flex items-center gap-4">
            <p className="flex items-center gap-1">Made with <Heart className="h-3 w-3 text-red-500 fill-red-500"/> for Gau Seva</p>
            <Link to="/admin" className="hover:text-white transition bg-white/10 px-3 py-1.5 rounded flex items-center gap-1">
              Admin Login
            </Link>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
