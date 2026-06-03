import { Helmet } from 'react-helmet-async';
import { Heart, Shield, Leaf, Activity, Users, CheckCircle2 } from 'lucide-react';
import Reveal from '../components/Reveal';

export default function About() {
  return (
    <div className="flex flex-col bg-brand-beige">
      <Helmet>
        <title>About Us | Gau Seva Kendra</title>
        <meta name="description" content="Learn about our mission, how beautifully we raise animals, and our rescue operations for cows, dogs, buffaloes, and calves." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-dark via-[#1a2f23] to-[#2c4731]">
        {/* Subtle background patterns */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-orange/30 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-green/30 rounded-full blur-[100px]"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center flex flex-col items-center">
          <Reveal className="flex flex-col items-center">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-orange font-medium mb-8">
              <Heart className="w-4 h-4 fill-brand-orange" /> Every contribution saves a life
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 font-hindi leading-tight drop-shadow-lg">
              Our Sacred Mission of <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-[#fcd34d]">Compassion</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-serif leading-relaxed drop-shadow-md max-w-3xl mx-auto mb-12">
              We are dedicated to the rescue, care, and beautiful upbringing of our voiceless animal friends. But we cannot do this alone. Your generosity is the lifeline that provides them with food, medicine, and a safe sanctuary.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 w-full max-w-2xl">
              <a href="/donate" className="group relative bg-gradient-to-r from-brand-orange to-orange-600 text-white px-10 py-5 rounded-full font-bold text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,88,12,0.6)] hover:-translate-y-1 flex items-center justify-center gap-3 overflow-hidden flex-1">
                <span className="absolute inset-0 w-full h-full bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></span>
                <Heart className="w-6 h-6 fill-white relative z-10 motion-safe:animate-pulse" /> 
                <span className="relative z-10">Donate Now & Save Lives</span>
              </a>
              <a href="/volunteer" className="group border-2 border-white/30 bg-white/5 backdrop-blur-sm hover:bg-white/15 text-white px-10 py-5 rounded-full font-bold text-lg transition-all duration-300 hover:border-white/60 flex items-center justify-center gap-3 flex-1">
                <Users className="w-6 h-6 group-hover:scale-110 transition-transform" /> 
                <span>Join as Volunteer</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Gaushaala Section (How we raise animals) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6">Life at the Gaushaala</h2>
            <div className="w-24 h-1 bg-brand-orange mb-8 rounded-full"></div>
            <p className="max-w-3xl text-lg text-brand-dark/80 font-serif">
              Our gaushaala is currently home to over <strong className="text-brand-orange text-2xl">150+ cows</strong>. We believe in providing a holistic, beautiful, and natural environment for all our residents. Here, every animal is treated with the utmost respect and love.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <Reveal delay={200} className="order-2 md:order-1">
            <div className="space-y-8">
              {[
                {
                  title: "Nutritious Diet",
                  desc: "We provide organic green fodder, jaggery, and nutrient-rich grains tailored to each animal's health needs.",
                  icon: <Leaf className="w-8 h-8 text-brand-green" />
                },
                {
                  title: "Open & Clean Spaces",
                  desc: "Our shelters are spacious, well-ventilated, and cleaned multiple times a day to ensure a hygienic living space.",
                  icon: <CheckCircle2 className="w-8 h-8 text-brand-orange" />
                },
                {
                  title: "Medical Attention",
                  desc: "On-site veterinary doctors provide regular checkups, vaccinations, and round-the-clock emergency care.",
                  icon: <Activity className="w-8 h-8 text-red-500" />
                },
                {
                  title: "Unconditional Love",
                  desc: "Every animal receives daily affection, grooming, and human interaction to help them heal emotionally.",
                  icon: <Heart className="w-8 h-8 text-pink-500" />
                }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6 items-start">
                  <div className="bg-white p-4 rounded-full shadow-md border border-brand-green/10 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-brand-dark mb-2">{item.title}</h3>
                    <p className="text-brand-dark/70 text-lg">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={400} className="order-1 md:order-2">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img 
                src="https://images.unsplash.com/photo-1544298711-2d93e15777bd?auto=format&fit=crop&q=80" 
                alt="Cows in gaushaala" 
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 to-transparent flex items-end p-8">
                <p className="text-white text-xl font-medium">A sanctuary of peace and protection.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Rescues Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6">Our Rescue Operations</h2>
            <div className="w-24 h-1 bg-brand-green mx-auto mb-8 rounded-full"></div>
            <p className="max-w-3xl mx-auto text-lg text-brand-dark/80 font-serif">
              While our heart lies in serving the sacred cow, compassion knows no bounds. We actively rescue and rehabilitate various animals in distress. Whether it is an injured dog, a stranded buffalo, or an orphaned calf, our doors are always open.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Cows",
                count: "120+ Rescued",
                image: "https://images.unsplash.com/photo-1570044570183-fa496e579308?auto=format&fit=crop&q=80",
                color: "from-[#e2a85c]"
              },
              {
                title: "Calves",
                count: "45+ Rescued",
                image: "https://images.unsplash.com/photo-1629237691653-f7253507d4b4?auto=format&fit=crop&q=80",
                color: "from-[#d38b5d]"
              },
              {
                title: "Buffaloes",
                count: "30+ Rescued",
                image: "https://images.unsplash.com/photo-1596784347781-b257121683cb?auto=format&fit=crop&q=80",
                color: "from-[#8b9d77]"
              },
              {
                title: "Dogs",
                count: "80+ Rescued",
                image: "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80",
                color: "from-[#b07d66]"
              }
            ].map((animal, idx) => (
              <Reveal key={idx} delay={idx * 150}>
                <div className="group relative h-96 rounded-2xl overflow-hidden shadow-lg cursor-pointer">
                  <img 
                    src={animal.image} 
                    alt={animal.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${animal.color} via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300`}></div>
                  <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-3xl font-bold text-white mb-1 drop-shadow-md">{animal.title}</h3>
                    <p className="text-white/90 font-medium drop-shadow-sm flex items-center gap-2">
                      <Shield className="w-4 h-4" /> {animal.count}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-20 bg-brand-dark text-center relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        
        <Reveal className="relative z-10 max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Be a Part of Our Journey</h2>
          <p className="text-xl text-white/80 mb-10 font-serif">
            Help us provide a loving home to more animals. Your support ensures they receive the care they truly deserve.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/donate" className="bg-brand-orange hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_15px_rgba(234,88,12,0.5)] flex items-center justify-center gap-2">
              <Heart className="w-5 h-5" /> Donate to Help
            </a>
            <a href="/volunteer" className="bg-transparent border-2 border-white/30 hover:border-white text-white hover:bg-white/10 px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2">
              <Users className="w-5 h-5" /> Become a Volunteer
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
