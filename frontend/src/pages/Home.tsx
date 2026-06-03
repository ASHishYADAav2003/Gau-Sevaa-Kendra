import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Heart, ArrowRight, Leaf, Home, Users, Plus, ChevronLeft, ChevronRight, Sparkles, Sun, Star, Shield } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Reveal from '../components/Reveal';

const StaggeredText = ({ text, delayPerWord }: { text: string, delayPerWord: number }) => {
  const words = text.split(' ');
  return (
    <>
      {words.map((word, i) => (
        <span 
          key={i} 
          className="inline-block motion-safe:animate-golden-glow-fade mr-3 md:mr-4 last:mr-0 text-transparent bg-clip-text bg-gradient-to-br from-[#FDF0D5] via-[#D9A441] to-[#8B5E34]" 
          style={{ animationDelay: `${i * delayPerWord}s` }}
        >
          {word}
        </span>
      ))}
    </>
  );
};

export default function HomePage() {
  const [featuredAnimals, setFeaturedAnimals] = useState<any[]>([]);
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('animalsList');
    if (saved) {
      const allAnimals = JSON.parse(saved);
      const featured = allAnimals.filter((a: any) => a.isStarred === true);
      setFeaturedAnimals(featured);
    }
    
    const handleScroll = () => {
      setScrollPos(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const defaultAnimals = [
    { nameEn: 'Gauri', rescueDate: '12 May 2024', status: 'Recovered', story: 'Rescued from a harsh environment, Gauri is a magnificent white cow whose majestic horns and gentle demeanor command respect and spread peace.', photos: ['/gauri.jpg'] },
    { nameEn: 'Mohan', rescueDate: '18 April 2024', status: 'Healing', story: 'Mohan is a strong, majestic black buffalo who was rescued from an overworked farm. He is now enjoying his well-deserved rest in our lush green fields.', photos: ['/mohan.jpg'] },
    { nameEn: 'Radha', rescueDate: '02 June 2024', status: 'Recovered', story: 'Rescued from a busy local fair, Radha arrived exhausted. Now she stands proudly in her traditional red harness, radiating strength and health.', photos: ['/radha.jpg'] },
    { nameEn: 'Shyam', rescueDate: '25 March 2024', status: 'Adopted', story: 'A playful bull who found his forever home in a loving sanctuary after being treated for minor injuries.', photos: ['https://images.unsplash.com/photo-1629237691653-f7253507d4b4?auto=format&fit=crop&q=80'] },
    { nameEn: 'Kanha', rescueDate: '10 May 2024', status: 'Healing', story: 'Rescued from wandering the busy city streets, Kanha is now resting peacefully in our lush green pastures.', photos: ['https://images.unsplash.com/photo-1544605963-c7f8a370e0a5?auto=format&fit=crop&q=80'] },
  ];

  const displayAnimals = featuredAnimals.length > 0 ? [...featuredAnimals, ...defaultAnimals].slice(0, 5) : defaultAnimals;

  return (
    <div className="flex flex-col bg-brand-beige selection:bg-brand-orange selection:text-white">
      <Helmet>
        <title>Gau Seva Kendra | Premium Cow Protection & Sanctuary</title>
        <meta name="description" content="Join Gau Seva Kendra in providing medical care, shelter, and nutritious food to rescued cows. Discover the spiritual beauty of cow protection." />
      </Helmet>
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Parallax Background Image */}
        <div 
          className="absolute inset-0 z-0 scale-110" 
          style={{ transform: `translateY(${scrollPos * 0.4}px) scale(1.05)` }}
        >
          <img 
            src="/hero-cow-calf.png" 
            alt="Cinematic Cow and Calf Background" 
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle Fog and Soft Sun rays */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-black/20 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D9A441]/20 via-transparent to-transparent mix-blend-screen pointer-events-none"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
        </div>

        {/* Floating Leaves Animation */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden opacity-40">
           <div className="absolute top-1/4 left-1/4 animate-[spin_10s_linear_infinite]"><Leaf className="text-brand-orange/40 w-4 h-4 transform -translate-x-[20vw] translate-y-[10vh] animate-[slide-in-right_15s_linear_infinite]" /></div>
           <div className="absolute top-1/3 right-1/4 animate-[spin_15s_linear_infinite]"><Leaf className="text-brand-green/40 w-6 h-6 transform translate-x-[20vw] translate-y-[20vh] animate-[slide-in-right_20s_linear_infinite_reverse]" /></div>
        </div>

        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-8 flex flex-col items-start text-left">
              <Reveal>
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-brand-orange/30 bg-black/20 backdrop-blur-md mb-8 shadow-[0_0_15px_rgba(217,164,65,0.2)]">
                  <Sparkles className="w-4 h-4 text-brand-orange animate-pulse" />
                  <span className="text-brand-beige/90 text-sm font-medium tracking-wide uppercase font-sans">A Sacred Journey of Compassion</span>
                </div>

                <h1 lang="sa" className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold font-hindi leading-[1.1] mb-6 sanskrit-text drop-shadow-2xl">
                  <StaggeredText text="गावो विश्वस्य मातरः" delayPerWord={0.15} />
                </h1>
                
                <p className="text-xl md:text-2xl text-brand-beige/90 mb-10 max-w-2xl font-serif leading-relaxed font-light drop-shadow-md border-l-2 border-brand-orange pl-6">
                  Experience the divine joy of nurturing gentle souls. We provide luxurious care, healing, and endless love to our sacred mother cows.
                </p>

                <div className="flex flex-wrap items-center gap-6">
                  <Link to="/donate" className="group relative overflow-hidden bg-gradient-to-r from-brand-orange to-[#b3832d] hover:from-[#b3832d] hover:to-[#8B5E34] text-white px-10 py-4 rounded-full font-semibold text-lg transition-all duration-500 shadow-[0_0_40px_rgba(217,164,65,0.4)] hover:shadow-[0_0_60px_rgba(217,164,65,0.7)] flex items-center gap-3 transform hover:-translate-y-1">
                    <span className="absolute inset-0 w-full h-full bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-out"></span>
                    <Heart className="h-5 w-5 fill-white relative z-10 group-hover:scale-110 transition-transform" />
                    <span className="relative z-10 tracking-wide">Offer Your Devotion</span>
                  </Link>
                  <Link to="/about" className="group relative text-brand-beige px-6 py-4 font-medium text-lg transition-all duration-300 flex items-center gap-2 hover:text-white">
                    <span className="relative z-10 underline decoration-brand-orange/50 underline-offset-8 decoration-2 group-hover:decoration-brand-orange transition-colors">Discover Our Soul</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform text-brand-orange" />
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Glassmorphism Donation / Impact Card */}
            <div className="lg:col-span-4 hidden lg:block">
              <Reveal delay={600}>
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-orange via-[#FDF0D5] to-brand-green"></div>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-white font-serif text-xl">Live Impact</h3>
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-orange"></span>
                      </span>
                      <span className="text-white/70 text-sm">Real-time</span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex flex-col border-b border-white/10 pb-4">
                      <span className="text-white/60 text-sm mb-1 uppercase tracking-wider">Cows Sheltered</span>
                      <span className="text-4xl font-light text-brand-orange font-serif">1,248</span>
                    </div>
                    <div className="flex flex-col border-b border-white/10 pb-4">
                      <span className="text-white/60 text-sm mb-1 uppercase tracking-wider">Medical Treatments</span>
                      <span className="text-4xl font-light text-brand-orange font-serif">5,830</span>
                    </div>
                    <div className="pt-2">
                      <p className="text-brand-beige/80 text-sm leading-relaxed italic">
                        "The purity of their gaze washes away all earthly sorrows."
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SACRED MISSION SECTION (Luxury Storytelling) */}
      <section className="py-32 relative overflow-hidden bg-brand-beige">
        {/* Subtle glowing orb in background */}
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal className="relative z-10">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                <div className="absolute inset-0 bg-brand-dark/10 group-hover:bg-transparent transition duration-700 z-10"></div>
                <img 
                  src="/sanctuary-landscape.jpeg" 
                  alt="Sacred Cow" 
                  className="w-full h-[400px] md:h-[600px] object-cover transform group-hover:scale-105 transition-transform duration-[1.5s] ease-in-out"
                />
                <div className="absolute bottom-0 left-0 w-full p-10 bg-gradient-to-t from-brand-dark/90 to-transparent z-20">
                  <Shield className="w-12 h-12 text-brand-orange mb-4" />
                  <p className="text-brand-beige text-xl font-serif italic">Sanctuary of Peace</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200} className="flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-12 bg-brand-orange"></div>
                <span className="text-brand-orange font-medium tracking-widest uppercase text-sm">Our Dharma</span>
              </div>
              
              <h2 lang="sa" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-hindi text-brand-dark mb-6 md:mb-8 leading-tight sanskrit-text">
                न हि गोसमं <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-orange">पित्रम्</span>
              </h2>
              
              <div className="space-y-6 text-lg text-brand-dark/70 font-serif leading-loose">
                <p>
                  Gau Seva Kendra is not merely a shelter; it is a sacred temple dedicated to the welfare, rescue, and rehabilitation of abandoned cows. Here, every hoofprint is a blessing, and every gentle moo is a mantra of peace.
                </p>
                <p>
                  We believe that caring for these gentle creatures elevates the human spirit, purifying our society and nurturing the environment. Through world-class medical care, premium organic feeding, and boundless love, we restore their divine dignity.
                </p>
              </div>

            </Reveal>
          </div>
        </div>
      </section>

      {/* 3. PREMIUM SERVICES SECTION */}
      <section className="pt-24 pb-12 bg-brand-beige relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-[#4A3B32] font-hindi mb-6">Our Sacred Duties</h2>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-24 bg-gradient-to-r from-transparent to-brand-orange"></div>
              <Star className="w-6 h-6 text-brand-orange fill-brand-orange" />
              <div className="h-px w-24 bg-gradient-to-l from-transparent to-brand-orange"></div>
            </div>
            <p className="text-[#6B5A4E] max-w-2xl mx-auto text-lg font-serif">Providing unparalleled luxury and devotion to the mother cow, ensuring her ultimate comfort and healing.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Divine Shelter", desc: "Spacious, climate-controlled havens designed for ultimate comfort and tranquility.", icon: "🕌" },
              { title: "Medical Excellence", desc: "State-of-the-art veterinary care, surgeries, and holistic healing therapies.", icon: "⚕️" },
              { title: "Organic Nutrition", desc: "Curated diets of premium organic fodder, fresh herbs, and pure mineral water.", icon: "🌾" },
              { title: "Soulful Care", desc: "Daily grooming, devotional music, and gentle affection from dedicated sewadars.", icon: "🙏" }
            ].map((service, i) => (
              <Reveal key={i} delay={i * 150}>
                <div className="group bg-white/60 backdrop-blur-sm hover:bg-white/90 border border-brand-orange/20 hover:border-brand-orange/50 rounded-3xl p-10 h-full flex flex-col items-center text-center transition-all duration-500 shadow-lg hover:-translate-y-4 hover:shadow-[0_20px_40px_rgba(217,164,65,0.15)]">
                  <div className="w-20 h-20 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-4xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 group-hover:bg-brand-orange/20 transition-all duration-500">
                    {service.icon}
                  </div>
                  <h3 className="font-bold text-2xl text-[#4A3B32] mb-4 font-serif">{service.title}</h3>
                  <p className="text-[#6B5A4E] leading-relaxed font-light">{service.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. IMPACT STATS */}
      <section className="bg-white/40 border-y border-brand-orange/10 text-[#4A3B32] py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-beige to-transparent opacity-50 pointer-events-none"></div>
        <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 text-center md:divide-x divide-brand-orange/20">
            <div className="flex flex-col items-center justify-center">
              <div className="mb-4 p-4 rounded-full bg-brand-orange/10 border border-brand-orange/20">
                <Home className="w-8 h-8 text-brand-orange" />
              </div>
              <div className="text-5xl font-bold font-serif mb-2 bg-clip-text text-transparent bg-gradient-to-br from-[#D9A441] to-[#8B5E34]">1,248</div>
              <div className="text-sm tracking-widest uppercase text-[#6B5A4E]/80 font-medium">Sacred Residents</div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="mb-4 p-4 rounded-full bg-brand-orange/10 border border-brand-orange/20">
                <Heart className="w-8 h-8 text-brand-orange" />
              </div>
              <div className="text-5xl font-bold font-serif mb-2 bg-clip-text text-transparent bg-gradient-to-br from-[#D9A441] to-[#8B5E34]">3,500+</div>
              <div className="text-sm tracking-widest uppercase text-[#6B5A4E]/80 font-medium">Lives Rescued</div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="mb-4 p-4 rounded-full bg-brand-orange/10 border border-brand-orange/20">
                <Plus className="w-8 h-8 text-brand-orange" />
              </div>
              <div className="text-5xl font-bold font-serif mb-2 bg-clip-text text-transparent bg-gradient-to-br from-[#D9A441] to-[#8B5E34]">8,920</div>
              <div className="text-sm tracking-widest uppercase text-[#6B5A4E]/80 font-medium">Medical Interventions</div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="mb-4 p-4 rounded-full bg-brand-orange/10 border border-brand-orange/20">
                <Sun className="w-8 h-8 text-brand-orange" />
              </div>
              <div className="text-5xl font-bold font-serif mb-2 bg-clip-text text-transparent bg-gradient-to-br from-[#D9A441] to-[#8B5E34]">450+</div>
              <div className="text-sm tracking-widest uppercase text-[#6B5A4E]/80 font-medium">Devoted Volunteers</div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 5. RESCUED ANIMALS (EMOTIONAL CAROUSEL) */}
      <section className="pt-16 pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col items-center text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-dark font-hindi mb-6">Souls We've Touched</h2>
          <p className="text-brand-dark/70 max-w-2xl text-lg font-serif">Meet the beautiful residents of our ashram. Each one carries a story of resilience, healing, and profound grace.</p>
        </Reveal>

        <Reveal>
          <div className="relative group/carousel">
            <button className="absolute left-0 top-1/2 -translate-y-1/2 -ml-6 z-20 bg-white/80 backdrop-blur-md rounded-full p-4 shadow-xl text-brand-green hover:bg-brand-orange hover:text-white transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 transform -translate-x-4 group-hover/carousel:translate-x-0">
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 overflow-hidden px-4 py-8">
              {displayAnimals.slice(0, 3).map((animal, i) => (
                <div key={i} className="group relative bg-white rounded-3xl overflow-hidden shadow-lg border border-brand-orange/10 transform transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl">
                  <div className="relative h-72 overflow-hidden">
                    <img src={animal.photos && animal.photos.length > 0 ? animal.photos[0] : 'https://images.unsplash.com/photo-1570044570183-fa496e579308?auto=format&fit=crop&q=80'} alt={animal.nameEn} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent opacity-80"></div>
                    <div className="absolute top-4 right-4 bg-brand-beige/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-green tracking-wide">
                      {animal.status}
                    </div>
                    <div className="absolute bottom-4 left-6">
                      <h3 className="font-bold text-2xl text-white font-serif">{animal.nameEn}</h3>
                      <p className="text-xs text-white/70 uppercase tracking-widest mt-1">Rescued: {animal.rescueDate}</p>
                    </div>
                  </div>
                  <div className="p-6 bg-white">
                    <p className="text-brand-dark/70 text-sm leading-relaxed mb-6 italic line-clamp-3">"{animal.story}"</p>
                    <button className="w-full py-3 border border-brand-orange/30 text-brand-orange rounded-xl font-medium hover:bg-brand-orange hover:text-white transition-colors duration-300 flex justify-center items-center gap-2">
                      Sponsor {animal.nameEn} <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="absolute right-0 top-1/2 -translate-y-1/2 -mr-6 z-20 bg-white/80 backdrop-blur-md rounded-full p-4 shadow-xl text-brand-green hover:bg-brand-orange hover:text-white transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 transform translate-x-4 group-hover/carousel:translate-x-0">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="text-center mt-12">
            <Link to="/campaigns" className="inline-flex items-center gap-3 bg-brand-green text-white px-8 py-4 rounded-full font-semibold hover:bg-brand-dark transition-colors duration-300 shadow-lg">
              View All Residents <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* 6. EMOTIONAL DONATION EXPERIENCE */}
      <section className="py-24 relative bg-brand-beige overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1544605963-c7f8a370e0a5?auto=format&fit=crop&q=80" className="w-full h-full object-cover opacity-10" alt="Emotional background" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-beige via-brand-beige/95 to-brand-orange/10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white/40 backdrop-blur-2xl border border-brand-orange/20 rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 shadow-[0_20px_60px_-15px_rgba(217,164,65,0.1)] flex flex-col lg:flex-row items-center gap-10 md:gap-16">
            
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-5xl font-bold text-[#4A3B32] mb-4 md:mb-6 font-serif leading-tight">
                Be the Light in <br/><span className="text-brand-orange italic">Their Darkness</span>
              </h2>
              <p className="text-[#6B5A4E] text-lg mb-8 leading-relaxed font-light">
                Many arrive at our doors broken, starved, and forgotten. Your monthly devotion ensures they never have to suffer again. Join our circle of compassion.
              </p>
              
              <div className="bg-white/60 border border-brand-orange/20 rounded-2xl p-6 mb-8 shadow-sm">
                <div className="flex justify-between text-[#4A3B32] text-sm mb-3 font-medium tracking-wide uppercase">
                  <span>Current Goal: Medical Wing Expansion</span>
                  <span className="text-brand-orange font-bold">75%</span>
                </div>
                <div className="h-2 w-full bg-brand-orange/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#D9A441] to-[#FDE68A] w-3/4 rounded-full shadow-[0_0_10px_rgba(217,164,65,0.4)]"></div>
                </div>
                <p className="text-[#6B5A4E]/70 text-xs mt-3 italic">₹7,50,000 raised of ₹10,00,000</p>
              </div>
            </div>

            <div className="lg:w-1/2 w-full bg-white/90 backdrop-blur-xl border border-brand-orange/10 rounded-[2rem] p-8 shadow-2xl relative">
              <div className="absolute -top-6 -right-6 bg-gradient-to-br from-brand-orange to-[#b3832d] text-white w-24 h-24 rounded-full flex items-center justify-center font-bold text-center leading-tight shadow-xl transform rotate-12 border-4 border-white">
                Tax<br/>Exempt<br/>80G
              </div>
              <h3 className="text-2xl font-bold text-[#4A3B32] mb-6 font-serif">Select Your Devotion</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {['₹1,100', '₹2,100', '₹5,100', '₹11,000'].map((amount, i) => (
                  <button key={i} className={`py-4 rounded-xl font-bold text-lg transition-all duration-300 border-2 ${amount === '₹2,100' ? 'border-brand-orange bg-brand-orange/10 text-brand-orange shadow-md scale-105' : 'border-brand-orange/20 bg-white text-[#4A3B32] hover:border-brand-orange/40 hover:bg-brand-orange/5'}`}>
                    {amount}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-4 mb-8 bg-brand-orange/5 p-4 rounded-xl border border-brand-orange/10">
                <input type="checkbox" id="monthly" className="w-5 h-5 text-brand-orange rounded border-brand-orange/30 focus:ring-brand-orange" defaultChecked />
                <label htmlFor="monthly" className="font-medium text-[#4A3B32] cursor-pointer flex-1">
                  Make this a <span className="text-brand-orange font-bold">Monthly Blessing</span>
                </label>
              </div>

              <Link to="/donate" className="w-full bg-gradient-to-r from-brand-orange to-[#b3832d] hover:from-[#b3832d] hover:to-[#8B5E34] text-white py-5 rounded-xl font-bold text-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(217,164,65,0.3)] hover:shadow-none group">
                <Heart className="w-6 h-6 fill-white group-hover:scale-110 transition-transform" /> Give with Love
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 7. CINEMATIC VOLUNTEER SECTION */}
      <section className="relative py-32 overflow-hidden border-t border-brand-orange/10 bg-[#FDF0D5]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1544298711-2d93e15777bd?auto=format&fit=crop&q=80" 
            alt="Volunteers" 
            className="w-full h-full object-cover opacity-[0.07] scale-105 transform hover:scale-110 transition-transform duration-[20s]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FDF0D5] via-transparent to-[#FDF0D5]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-[100px]"></div>
        </div>
        
        <Reveal className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <Sparkles className="w-12 h-12 text-brand-orange mx-auto mb-6 animate-pulse" />
          <h2 lang="sa" className="text-4xl md:text-5xl font-bold text-[#4A3B32] mb-6 font-hindi sanskrit-text drop-shadow-sm">सेवा हि परमो धर्मः</h2>
          <p className="text-[#6B5A4E] text-2xl font-serif mb-12 font-light leading-relaxed">
            True spirituality lies in selfless service. Touch a life, heal a soul, and find your own inner peace amidst our divine herds.
          </p>
          <Link to="/volunteer" className="inline-flex items-center gap-3 bg-gradient-to-r from-brand-orange to-[#b3832d] text-white px-10 py-5 rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(217,164,65,0.4)] transition-all duration-500 hover:-translate-y-1 group">
            Become a Volunteer <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </Link>
        </Reveal>
      </section>

      {/* 8. MODERN BLOG SECTION */}
      <section className="py-32 bg-brand-beige">
        <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px w-12 bg-brand-orange"></div>
                <span className="text-brand-orange font-medium tracking-widest uppercase text-sm">Divine Insights</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-brand-dark font-serif">Stories of Grace</h2>
            </div>
            <Link to="/blog" className="inline-flex items-center gap-2 text-brand-green font-bold hover:text-brand-orange transition-colors">
              Read All Chronicles <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { category: 'Spirituality', title: 'The Profound Connection Between Cows, Nature, and Inner Peace', img: '/temple-cows.jpeg' },
              { category: 'Rescue Mission', title: 'A Second Chance: The Rescue and Rehabilitation of Little Krishna', img: '/calf-rescue.jpeg' },
              { category: 'Health & Care', title: 'Healing Hands: The Importance of Expert Veterinary Care', img: '/vet-care.jpeg' },
            ].map((blog, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative h-80 rounded-3xl overflow-hidden mb-6 shadow-lg">
                  <img src={blog.img} alt={blog.title} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500"></div>
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold text-brand-dark tracking-wider uppercase">
                    {blog.category}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-2xl text-brand-dark mb-4 font-serif leading-snug group-hover:text-brand-orange transition-colors duration-300">{blog.title}</h3>
                  <div className="flex items-center gap-4 text-sm font-medium text-brand-dark/50">
                    <span>May 20, 2026</span>
                    <span className="w-1 h-1 rounded-full bg-brand-orange"></span>
                    <span>5 min read</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

    </div>
  );
}
