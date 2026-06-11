import { Helmet } from 'react-helmet-async';
import { MapPin, Building, FileText, HeartHandshake } from 'lucide-react';
import Reveal from '../components/Reveal';

export default function Contact() {
  return (
    <div className="min-h-screen bg-brand-beige pt-24 pb-16">
      <Helmet title="Contact Us | Ganpati Gaushala Seva Foundation">
        <meta name="description" content="Get in touch with Ganpati Gaushala Seva Foundation for donations, volunteering, or general inquiries." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-brand-orange"></div>
            <span className="text-brand-orange font-medium tracking-widest uppercase text-sm">Get in Touch</span>
            <div className="h-px w-12 bg-brand-orange"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#4A3B32] font-serif mb-6">Contact Us</h1>
          <p className="text-[#6B5A4E] text-lg font-light leading-relaxed">
            We welcome your questions, blessings, and support. Reach out to us to learn more about our mission or to schedule a visit to the sanctuary.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
          
          {/* Foundation Details Card */}
          <Reveal delay={200}>
            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-xl border border-brand-orange/20 relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full blur-3xl"></div>
              
              <div className="flex items-center gap-4 mb-8 border-b border-brand-orange/10 pb-6">
                <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center">
                  <Building className="w-8 h-8 text-brand-orange" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#4A3B32] font-serif leading-tight">Ganpati Gaushala Seva Foundation</h2>
                  <p className="text-[#6B5A4E] text-sm mt-1 uppercase tracking-wider">Registered NGO</p>
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-brand-orange/10 rounded-lg">
                    <FileText className="w-5 h-5 text-brand-orange" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#4A3B32] mb-1">Corporate Identity Number (CIN)</h3>
                    <p className="text-[#6B5A4E] font-medium font-mono text-sm">U88900RJ2025NPL109316</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-brand-orange/10 rounded-lg">
                    <MapPin className="w-5 h-5 text-brand-orange" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#4A3B32] mb-1">Registered Address</h3>
                    <p className="text-[#6B5A4E] leading-relaxed text-sm md:text-base">
                      H.NO.29, KHATIPURA,<br/>
                      PO: JAGAR, JAGAR,<br/>
                      KARAULI, HINDAUN,<br/>
                      RAJASTHAN, INDIA, 322236
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-brand-orange/10">
                <div className="bg-gradient-to-r from-brand-orange/10 to-transparent p-4 rounded-xl flex items-center gap-3">
                  <HeartHandshake className="w-6 h-6 text-brand-orange flex-shrink-0" />
                  <p className="text-[#4A3B32] text-sm font-medium italic">
                    Your visit brings immense joy to our residents. All are welcome to experience the divine peace of the gaushala.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Quick Contact Form or Extra Info */}
          <Reveal delay={400}>
            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-xl border border-brand-orange/20 h-full">
              <h3 className="text-2xl font-bold text-[#4A3B32] mb-6 font-serif">Our Location</h3>
              
              <div className="w-full h-[300px] md:h-[350px] rounded-2xl overflow-hidden shadow-inner border border-brand-orange/20 relative group">
                <div className="absolute inset-0 bg-brand-orange/10 mix-blend-multiply pointer-events-none group-hover:opacity-0 transition-opacity duration-500 z-10"></div>
                <iframe 
                  src="https://maps.google.com/maps?q=Khatipura,+Jagar,+Hindaun,+Rajasthan+322236&t=&z=13&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ganpati Gaushala Location"
                  className="relative z-0 filter contrast-[1.05] saturate-[1.2]"
                ></iframe>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </div>
  );
}
