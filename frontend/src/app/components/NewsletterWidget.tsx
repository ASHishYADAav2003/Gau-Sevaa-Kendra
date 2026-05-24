import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function NewsletterWidget() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Email address is required');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const existingStr = localStorage.getItem('newsletter_subscribers');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      
      if (existing.some((sub: any) => sub.email === email.trim())) {
        throw new Error('409');
      }
      
      const newSubscriber = {
        id: Date.now(),
        email: email.trim(),
        date: new Date().toISOString()
      };
      
      localStorage.setItem('newsletter_subscribers', JSON.stringify([newSubscriber, ...existing]));

      setIsSuccess(true);
    } catch (error: any) {
      if (error.message === '409') {
        setErrorMessage('This email is already subscribed!');
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-r from-[#FF6600] to-[#cc5200] text-white py-12 border-t border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 font-devanagari">
          Subscribe to Our Newsletter / हमारे न्यूज़लेटर से जुड़ें
        </h2>
        <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
          Get updates about our animals, events & donation impact.
        </p>
        
        {isSuccess ? (
          <div className="bg-white/10 border border-white/30 rounded-lg p-6 max-w-md mx-auto backdrop-blur-sm animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col items-center">
              <CheckCircle2 className="w-10 h-10 text-green-300 mb-3" />
              <p className="text-lg font-medium text-white text-center font-devanagari">
                🙏 Subscribed! Thank you for joining Gau Seva Kendra family.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Enter your email address"
                  className={`w-full px-5 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#FF6600] focus:ring-white transition-colors ${
                    errorMessage ? 'border-2 border-red-500 bg-red-50' : 'border-none'
                  }`}
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#1B5E20] text-white px-8 py-3 rounded-lg hover:bg-green-800 transition-colors font-semibold shadow-md whitespace-nowrap flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed font-devanagari"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Subscribe / सदस्य बनें'
                )}
              </button>
            </div>
            {errorMessage && (
              <div className="mt-2 text-left">
                <p className="text-sm text-red-200 bg-red-900/40 inline-block px-3 py-1 rounded-md border border-red-500/50">
                  {errorMessage}
                </p>
              </div>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
