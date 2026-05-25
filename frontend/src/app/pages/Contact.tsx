import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        }, 5000);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Mail className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              We'd love to hear from you. Reach out with any questions or concerns.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Contact Information */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                      <p className="text-gray-600">
                        Gau Seva Kendra<br />
                        Village Rampur, Mathura Road<br />
                        District Mathura, Uttar Pradesh<br />
                        PIN: 281001, India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                      <p className="text-gray-600">
                        Main Office: +91 6938574125<br />
                        Emergency Rescue: +91 6938574125<br />
                        WhatsApp: +91 6938574125
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <p className="text-gray-600">
                        General Inquiries: Gauseva@gmail.com<br />
                        Donations: Gauseva@gmail.com<br />
                        Volunteer: Gauseva@gmail.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Visiting Hours</h3>
                      <p className="text-gray-600">
                        Monday - Saturday: 9:00 AM - 5:00 PM<br />
                        Sunday: 10:00 AM - 4:00 PM<br />
                        Emergency: 24/7
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-600 to-orange-700 text-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold mb-4">Emergency Animal Rescue</h3>
                <p className="mb-4 opacity-90">
                  If you've found an injured or abandoned animal that needs immediate help, call our emergency line:
                </p>
                <a
                  href="tel:+916938574125"
                  className="block w-full bg-white text-orange-600 text-center px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors font-bold text-lg"
                >
                  📞 +91 6938574125
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h3>
                    <p className="text-gray-600">
                      Thank you for reaching out. We'll get back to you within 24-48 hours.
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subject *
                          </label>
                          <select
                            required
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          >
                            <option value="">Select a subject</option>
                            <option value="general">General Inquiry</option>
                            <option value="donation">Donation Question</option>
                            <option value="volunteer">Volunteer Opportunity</option>
                            <option value="sponsorship">Animal Sponsorship</option>
                            <option value="rescue">Report Animal in Need</option>
                            <option value="visit">Schedule a Visit</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message *
                        </label>
                        <textarea
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          rows={6}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Tell us how we can help..."
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-orange-600 text-white px-8 py-4 rounded-lg hover:bg-orange-700 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
                      >
                        <Send className="w-5 h-5" />
                        Send Message
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Find Us on the Map</h2>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-gray-200 h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Google Maps Integration</p>
                <p className="text-gray-500 text-sm mt-2">
                  Village Rampur, Mathura, Uttar Pradesh - 281001
                </p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I visit the shelter?",
                a: "Yes! We welcome visitors during our regular hours (Mon-Sat: 9 AM - 5 PM, Sun: 10 AM - 4 PM). Please call ahead to schedule your visit."
              },
              {
                q: "How can I report an injured animal?",
                a: "Call our emergency rescue line at +91 6938574125 (available 24/7) or fill out the contact form above with 'Report Animal in Need' as the subject."
              },
              {
                q: "Do you accept animal food donations?",
                a: "Yes, we accept fodder, grains, and other animal food items. Please contact us to coordinate delivery or pickup."
              },
              {
                q: "Can I volunteer for a single day?",
                a: "Absolutely! We welcome both one-time and regular volunteers. Fill out the volunteer registration form on our Volunteer page."
              },
            ].map((faq, index) => (
              <details key={index} className="bg-white rounded-lg shadow-md p-6">
                <summary className="font-semibold text-gray-900 cursor-pointer">
                  {faq.q}
                </summary>
                <p className="mt-3 text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
