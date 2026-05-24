import { Award, Target, Users, Heart, Shield, TrendingUp } from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";

export default function About() {
  const team = [
    { name: "Dr. Rajesh Kumar", role: "Founder & Chief Veterinarian", image: "https://images.unsplash.com/photo-1700665537604-412e89a285c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx2ZXRlcmluYXJ5JTIwY2FyZSUyMGFuaW1hbHN8ZW58MXx8fHwxNzc4OTM4OTY4fDA&ixlib=rb-4.1.0&q=80&w=1080" },
    { name: "Priya Sharma", role: "Operations Manager", image: "https://images.unsplash.com/photo-1733783489145-f3d3ee7a9ccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXRlcmluYXJ5JTIwY2FyZSUyMGFuaW1hbHN8ZW58MXx8fHwxNzc4OTM4OTY4fDA&ixlib=rb-4.1.0&q=80&w=1080" },
    { name: "Amit Patel", role: "Rescue Coordinator", image: "https://images.unsplash.com/photo-1644675272883-0c4d582528d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHx2ZXRlcmluYXJ5JTIwY2FyZSUyMGFuaW1hbHN8ZW58MXx8fHwxNzc4OTM4OTY4fDA&ixlib=rb-4.1.0&q=80&w=1080" },
    { name: "Sunita Verma", role: "Volunteer Coordinator", image: "https://images.unsplash.com/photo-1725409796872-8b41e8eca929?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHx2ZXRlcmluYXJ5JTIwY2FyZSUyMGFuaW1hbHN8ZW58MXx8fHwxNzc4OTM4OTY4fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  ];

  const milestones = [
    { year: "2015", event: "Gau Seva Kendra founded with 20 rescued cows" },
    { year: "2017", event: "Expanded to 500 animals, built medical facility" },
    { year: "2019", event: "Launched transparency dashboard and online donations" },
    { year: "2021", event: "Rescued 1,000th animal, expanded to 10-acre facility" },
    { year: "2023", event: "Opened second shelter, trained 100+ volunteers" },
    { year: "2026", event: "2,500+ animals under care, 5,000+ active donors" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 fill-white" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Dedicated to protecting and caring for cows and animals since 2015
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 mb-4">
                Gau Seva Kendra was founded in 2015 by Dr. Rajesh Kumar, a veterinarian who witnessed the
                suffering of abandoned and injured cows in rural areas. What started as a small shelter for
                20 cows has grown into a comprehensive animal welfare organization caring for over 2,500 animals.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                Our mission has always been clear: provide unconditional care, medical treatment, and a safe
                sanctuary for animals in need, while maintaining complete transparency with our donors and supporters.
              </p>
              <p className="text-lg text-gray-700">
                Today, we operate two shelters across Uttar Pradesh, employ a dedicated team of veterinarians
                and caregivers, and work with hundreds of volunteers who share our passion for animal welfare.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1769466100846-86239ba740aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3clMjBzaGVsdGVyJTIwcmVzY3VlfGVufDF8fHx8MTc3ODkzODk2OHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Our shelter"
                className="w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Our Mission & Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mission</h3>
              <p className="text-gray-600">
                To rescue, rehabilitate, and provide lifetime care for abandoned, injured, and neglected animals
                while promoting animal welfare awareness in communities.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Compassion</h3>
              <p className="text-gray-600">
                Every animal deserves dignity, care, and love. We treat each rescued animal with the utmost
                compassion and respect throughout their healing journey.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Transparency</h3>
              <p className="text-gray-600">
                Complete financial transparency is our commitment. Every rupee donated is tracked and publicly
                reported to ensure accountability and build trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-orange-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <div className="text-2xl font-bold text-orange-600 mb-2">{milestone.year}</div>
                      <p className="text-gray-700">{milestone.event}</p>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-orange-600 rounded-full border-4 border-white shadow"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Our Team</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="h-64 overflow-hidden">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-sm text-orange-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Award className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Certifications & Recognition</h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">80G Certified</h3>
                <p className="opacity-90">Tax exemption certificate for donors</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">Government Recognized</h3>
                <p className="opacity-90">Registered under Animal Welfare Board</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">NGO Darpan</h3>
                <p className="opacity-90">Verified and listed on NITI Aayog portal</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
