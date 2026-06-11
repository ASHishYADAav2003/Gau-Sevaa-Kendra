import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart, Send, CheckCircle2 } from 'lucide-react';
import Reveal from '../components/Reveal';

export default function Volunteer() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="bg-brand-beige min-h-screen py-16">
      <Helmet title="Volunteer With Us | Gau Seva Kendra">
        <meta name="description" content="Join our community of passionate volunteers. Dedicate your time and skills to the noble cause of cow protection and care." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-hindi text-brand-dark mb-4">Become a Gau Sevak</h1>
          <p className="text-brand-dark/70 text-lg max-w-2xl mx-auto">
            Your time and dedication can make a world of difference. Join us in our mission to protect and nurture our sacred cows.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-brand-green/10">
            <div className="grid md:grid-cols-5 h-full">
              {/* Left Side: Info & Motivation */}
              <div className="md:col-span-2 bg-gradient-to-br from-brand-green to-[#14532d] p-8 text-white flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-4 font-serif">Why Volunteer?</h3>
                  <ul className="space-y-6">
                    <li className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <Heart className="w-5 h-5 text-[#FDE68A]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-[#FDE68A]">Spiritual Merit</h4>
                        <p className="text-white/80 text-sm mt-1 leading-relaxed">Serving mother cow is considered one of the highest forms of selfless service in Vedic culture.</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <span className="text-[#FDE68A] text-xl">🤝</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-[#FDE68A]">Community</h4>
                        <p className="text-white/80 text-sm mt-1 leading-relaxed">Connect with like-minded individuals who share your compassion for animals and nature.</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <span className="text-[#FDE68A] text-xl">🌱</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-[#FDE68A]">Make an Impact</h4>
                        <p className="text-white/80 text-sm mt-1 leading-relaxed">Directly contribute to the daily well-being, feeding, and medical care of our rescued herd.</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-12 pt-8 border-t border-white/20 text-center">
                  <p className="font-hindi text-2xl text-[#FDE68A] italic">"सेवा परम धर्म"</p>
                  <p className="text-white/70 text-sm mt-2">Service is the supreme duty</p>
                </div>
              </div>

              {/* Right Side: Application Form */}
              <div className="md:col-span-3 p-8 lg:p-12">
                {isSubmitted ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-fade-in-up">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-10 h-10 text-brand-green" />
                    </div>
                    <h3 className="text-3xl font-bold text-brand-dark mb-4">Thank You!</h3>
                    <p className="text-brand-dark/70 text-lg mb-8 max-w-md">
                      Your volunteer application has been received. Our team will review your details and contact you shortly. We look forward to serving with you.
                    </p>
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="text-brand-green font-semibold hover:underline"
                    >
                      Submit another application
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h3 className="text-2xl font-bold text-brand-dark mb-6">Volunteer Application</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="block text-sm font-medium text-brand-dark/80">First Name <span className="text-red-500">*</span></label>
                        <input required type="text" id="firstName" name="firstName" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all bg-gray-50 focus:bg-white outline-none" placeholder="Ram" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="block text-sm font-medium text-brand-dark/80">Last Name</label>
                        <input type="text" id="lastName" name="lastName" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all bg-gray-50 focus:bg-white outline-none" placeholder="Sharma" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-brand-dark/80">Email Address <span className="text-red-500">*</span></label>
                        <input required type="email" id="email" name="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all bg-gray-50 focus:bg-white outline-none" placeholder="ram@example.com" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-brand-dark/80">Phone Number <span className="text-red-500">*</span></label>
                        <input required type="tel" id="phone" name="phone" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all bg-gray-50 focus:bg-white outline-none" placeholder="+91 98765 43210" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="availability" className="block text-sm font-medium text-brand-dark/80">When are you available? <span className="text-red-500">*</span></label>
                      <select required id="availability" name="availability" defaultValue="" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all bg-gray-50 focus:bg-white outline-none appearance-none">
                        <option value="" disabled>Select availability</option>
                        <option value="weekends">Weekends Only</option>
                        <option value="weekdays">Weekdays Only</option>
                        <option value="flexible">Flexible (Anytime)</option>
                        <option value="events">Special Events & Festivals</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="block text-sm font-medium text-brand-dark/80">Why do you want to volunteer? <span className="text-red-500">*</span></label>
                      <textarea required id="message" name="message" rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all bg-gray-50 focus:bg-white outline-none resize-none" placeholder="Tell us a little bit about yourself and your interest in Gau Seva..."></textarea>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-brand-green hover:bg-[#14532d] text-white py-4 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Submit Application
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
