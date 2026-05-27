import { Outlet, Link, useLocation } from "react-router";
import { Heart, Menu, X, Phone, Mail, MapPin, Languages, Lock } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useSettings, phoneToTel, whatsappLink } from "../context/SettingsContext";
import NewsletterWidget from "./NewsletterWidget";

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { settings } = useSettings();

  const navLinks = [
    { path: "/", label: t('nav.home') },
    { path: "/animals", label: t('nav.animals') },
    { path: "/about", label: t('nav.about') },
    { path: "/volunteer", label: t('nav.volunteer') },
    { path: "/blog", label: t('nav.blog') },
    { path: "/contact", label: t('nav.contact') },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {settings.maintenanceMode && (
        <div className="bg-amber-500 text-white text-center py-2 px-4 text-sm font-medium">
          {settings.organizationName} is currently under scheduled maintenance. Some features may be limited.
        </div>
      )}
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        {/* Top Bar */}
        <div className="bg-orange-600 text-white py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <a href={`tel:${phoneToTel(settings.phone)}`} className="flex items-center gap-1 hover:text-orange-100">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">{settings.phone}</span>
              </a>
              <a href={`mailto:${settings.email}`} className="flex items-center gap-1 hover:text-orange-100">
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">{settings.email}</span>
              </a>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="flex items-center gap-1 hover:text-orange-100 text-xs font-semibold"
              >
                <Languages className="w-4 h-4" />
                <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-orange-100 p-2 rounded-full">
                <Heart className="w-6 h-6 text-orange-600 fill-orange-600" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">{settings.organizationName}</div>
                <div className="text-xs text-gray-600">{settings.tagline}</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? "text-orange-600"
                      : "text-gray-700 hover:text-orange-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/donate"
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
              >
                {t('nav.donate')}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 px-4 text-sm font-medium ${
                    isActive(link.path)
                      ? "text-orange-600 bg-orange-50"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/donate"
                onClick={() => setMobileMenuOpen(false)}
                className="block mt-2 mx-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 text-center text-sm font-medium"
              >
                {t('nav.donate')}
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Newsletter Widget */}
      <NewsletterWidget />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-orange-500 fill-orange-500" />
                <span className="text-white font-bold">{settings.organizationName}</span>
              </div>
              <p className="text-sm text-gray-400">
                {t('footer.about')}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">{t('footer.quickLinks')}</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/animals" className="hover:text-orange-500">{t('nav.animals')}</Link></li>
                <li><Link to="/volunteer" className="hover:text-orange-500">{t('nav.volunteer')}</Link></li>
                <li><Link to="/blog" className="hover:text-orange-500">{t('nav.blog')}</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-semibold mb-4">{t('footer.contact')}</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span>{settings.address}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{settings.phone}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{settings.email}</span>
                </li>
              </ul>
            </div>

            {/* Donate */}
            <div>
              <h3 className="text-white font-semibold mb-4">{t('footer.support')}</h3>
              <p className="text-sm text-gray-400 mb-4">
                {t('footer.supportDesc')}
              </p>
              <Link
                to="/donate"
                className="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
              >
                {t('nav.donate')}
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-gray-400 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; 2026 {settings.organizationName}. {t('footer.copyright')}</p>
            <Link to="/admin/login" className="flex items-center gap-1 text-gray-500 hover:text-white transition-colors">
              <Lock className="w-4 h-4" /> Admin Portal
            </Link>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float Button */}
      <a
        href={whatsappLink(settings.whatsapp)}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-40"
        aria-label="Contact on WhatsApp"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
}
