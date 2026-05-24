import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    'header.tagline': 'गौ सेवा केंद्र',
    'nav.home': 'Home',
    'nav.animals': 'Our Animals',
    'nav.transparency': 'Transparency',
    'nav.about': 'About Us',
    'nav.volunteer': 'Volunteer',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.donate': 'Donate Now',

    // Home
    'home.hero.title': 'Serve Cows, Save Lives',
    'home.hero.subtitle': 'गौ सेवा ही धर्म है',
    'home.hero.description': 'Join us in protecting and caring for cows and animals in need. Every contribution helps provide food, medical care, and shelter to those who cannot speak for themselves.',
    'home.hero.donate': 'Donate Now',
    'home.hero.sponsor': 'Sponsor an Animal',
    'home.hero.animalsCount': '2,500+ Animals Under Our Care',
    'home.hero.animalsSubtext': 'Providing love, care, and dignity',

    // Stats
    'stats.rescued': 'Animals Rescued',
    'stats.donors': 'Active Donors',
    'stats.expenses': 'Monthly Expenses',
    'stats.treatments': 'Treatments Done',

    // Mission
    'mission.title': 'Our Mission & Vision',
    'mission.subtitle': 'Committed to animal welfare with complete transparency and compassion',
    'mission.protection.title': 'Protection',
    'mission.protection.desc': 'Rescue and protect abandoned, injured, and neglected cows and animals, providing them with a safe sanctuary.',
    'mission.medical.title': 'Medical Care',
    'mission.medical.desc': 'Provide comprehensive veterinary treatment, vaccinations, and ongoing healthcare to ensure animal wellbeing.',
    'mission.transparency.title': 'Transparency',
    'mission.transparency.desc': 'Complete financial transparency with detailed expense tracking, ensuring every rupee serves our animals.',

    // Animals
    'animals.title': 'Meet Our Animals',
    'animals.subtitle': 'Every animal has a story. Help us give them a happy ending.',
    'animals.monthlyExpense': 'Monthly Expense',
    'animals.sponsor': 'Sponsor',
    'animals.viewProfile': 'View Profile',
    'animals.search': 'Search by name or story...',
    'animals.all': 'All Animals',
    'animals.healthy': 'Healthy',
    'animals.recovering': 'Recovering',
    'animals.critical': 'Critical',
    'animals.showing': 'Showing',
    'animals.animals': 'animals',
    'animals.sponsored': 'Sponsored',
    'animals.sponsorNow': 'Sponsor Now',

    // Donations
    'donate.title': 'Make a Donation',
    'donate.description': 'Your generosity helps us provide food, medical care, and shelter to animals in need. Every contribution makes a real difference.',
    'donate.selectAmount': 'Select Donation Amount',
    'donate.customAmount': 'Enter custom amount',
    'donate.monthly': 'Make this a monthly donation',
    'donate.monthlyDesc': 'Help us provide consistent care to our animals',
    'donate.paymentMethod': 'Payment Method',
    'donate.complete': 'Complete Donation',
    'donate.thankyou': 'Thank You for Your Donation!',
    'donate.received': 'Your donation of',
    'donate.hasBeenReceived': 'has been received.',

    // Transparency
    'transparency.title': 'Financial Transparency',
    'transparency.subtitle': 'Complete visibility into every rupee donated. Track how your contributions are making a difference.',
    'transparency.totalDonations': 'Total Donations',
    'transparency.totalExpenses': 'Total Expenses',
    'transparency.currentBalance': 'Current Balance',
    'transparency.score': 'Transparency Score',
    'transparency.monthlyOverview': 'Monthly Overview',
    'transparency.expenseCategories': 'Expense Categories',
    'transparency.recentExpenses': 'Recent Expenses',

    // Footer
    'footer.about': 'Dedicated to protecting and caring for cows and other animals in need. Every donation makes a difference.',
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact Us',
    'footer.support': 'Support Our Cause',
    'footer.supportDesc': 'Your contribution helps us provide food, medical care, and shelter to animals in need.',
    'footer.copyright': 'All rights reserved. | Built with ❤️ for animal welfare',

    // Common
    'common.readMore': 'Read More',
    'common.learnMore': 'Learn More',
    'common.viewAll': 'View All',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
  },
  hi: {
    // Header
    'header.tagline': 'Gau Seva Kendra',
    'nav.home': 'होम',
    'nav.animals': 'हमारे पशु',
    'nav.transparency': 'पारदर्शिता',
    'nav.about': 'हमारे बारे में',
    'nav.volunteer': 'स्वयंसेवक',
    'nav.blog': 'ब्लॉग',
    'nav.contact': 'संपर्क करें',
    'nav.donate': 'दान करें',

    // Home
    'home.hero.title': 'गौ सेवा करें, जीवन बचाएं',
    'home.hero.subtitle': 'Serve Cows, Save Lives',
    'home.hero.description': 'जरूरतमंद गायों और पशुओं की सुरक्षा और देखभाल में हमारे साथ जुड़ें। हर योगदान उन्हें भोजन, चिकित्सा देखभाल और आश्रय प्रदान करने में मदद करता है जो अपने लिए बोल नहीं सकते।',
    'home.hero.donate': 'अभी दान करें',
    'home.hero.sponsor': 'पशु प्रायोजित करें',
    'home.hero.animalsCount': '2,500+ पशु हमारी देखभाल में',
    'home.hero.animalsSubtext': 'प्यार, देखभाल और सम्मान प्रदान करना',

    // Stats
    'stats.rescued': 'बचाए गए पशु',
    'stats.donors': 'सक्रिय दानदाता',
    'stats.expenses': 'मासिक खर्च',
    'stats.treatments': 'उपचार किए गए',

    // Mission
    'mission.title': 'हमारा मिशन और विजन',
    'mission.subtitle': 'पूर्ण पारदर्शिता और करुणा के साथ पशु कल्याण के लिए प्रतिबद्ध',
    'mission.protection.title': 'संरक्षण',
    'mission.protection.desc': 'परित्यक्त, घायल और उपेक्षित गायों और पशुओं को बचाना और उनकी रक्षा करना, उन्हें सुरक्षित अभयारण्य प्रदान करना।',
    'mission.medical.title': 'चिकित्सा देखभाल',
    'mission.medical.desc': 'पशुओं की भलाई सुनिश्चित करने के लिए व्यापक पशु चिकित्सा उपचार, टीकाकरण और निरंतर स्वास्थ्य देखभाल प्रदान करना।',
    'mission.transparency.title': 'पारदर्शिता',
    'mission.transparency.desc': 'विस्तृत खर्च ट्रैकिंग के साथ पूर्ण वित्तीय पारदर्शिता, यह सुनिश्चित करते हुए कि प्रत्येक रुपया हमारे पशुओं की सेवा करता है।',

    // Animals
    'animals.title': 'हमारे पशुओं से मिलें',
    'animals.subtitle': 'हर पशु की एक कहानी है। उन्हें खुशहाल अंत देने में हमारी मदद करें।',
    'animals.monthlyExpense': 'मासिक खर्च',
    'animals.sponsor': 'प्रायोजित करें',
    'animals.viewProfile': 'प्रोफ़ाइल देखें',
    'animals.search': 'नाम या कहानी से खोजें...',
    'animals.all': 'सभी पशु',
    'animals.healthy': 'स्वस्थ',
    'animals.recovering': 'ठीक हो रहे',
    'animals.critical': 'गंभीर',
    'animals.showing': 'दिखा रहे हैं',
    'animals.animals': 'पशु',
    'animals.sponsored': 'प्रायोजित',
    'animals.sponsorNow': 'अभी प्रायोजित करें',

    // Donations
    'donate.title': 'दान करें',
    'donate.description': 'आपकी उदारता जरूरतमंद पशुओं को भोजन, चिकित्सा देखभाल और आश्रय प्रदान करने में मदद करती है। हर योगदान वास्तविक बदलाव लाता है।',
    'donate.selectAmount': 'दान राशि चुनें',
    'donate.customAmount': 'कस्टम राशि दर्ज करें',
    'donate.monthly': 'इसे मासिक दान बनाएं',
    'donate.monthlyDesc': 'हमारे पशुओं को निरंतर देखभाल प्रदान करने में मदद करें',
    'donate.paymentMethod': 'भुगतान विधि',
    'donate.complete': 'दान पूर्ण करें',
    'donate.thankyou': 'आपके दान के लिए धन्यवाद!',
    'donate.received': 'आपका दान',
    'donate.hasBeenReceived': 'प्राप्त हो गया है।',

    // Transparency
    'transparency.title': 'वित्तीय पारदर्शिता',
    'transparency.subtitle': 'दान किए गए प्रत्येक रुपये में पूर्ण दृश्यता। ट्रैक करें कि आपके योगदान कैसे बदलाव ला रहे हैं।',
    'transparency.totalDonations': 'कुल दान',
    'transparency.totalExpenses': 'कुल खर्च',
    'transparency.currentBalance': 'वर्तमान शेष',
    'transparency.score': 'पारदर्शिता स्कोर',
    'transparency.monthlyOverview': 'मासिक अवलोकन',
    'transparency.expenseCategories': 'खर्च श्रेणियां',
    'transparency.recentExpenses': 'हाल के खर्च',

    // Footer
    'footer.about': 'जरूरतमंद गायों और अन्य पशुओं की सुरक्षा और देखभाल के लिए समर्पित। हर दान एक बदलाव लाता है।',
    'footer.quickLinks': 'त्वरित लिंक',
    'footer.contact': 'हमसे संपर्क करें',
    'footer.support': 'हमारे उद्देश्य का समर्थन करें',
    'footer.supportDesc': 'आपका योगदान हमें जरूरतमंद पशुओं को भोजन, चिकित्सा देखभाल और आश्रय प्रदान करने में मदद करता है।',
    'footer.copyright': 'सर्वाधिकार सुरक्षित। | पशु कल्याण के लिए ❤️ के साथ निर्मित',

    // Common
    'common.readMore': 'और पढ़ें',
    'common.learnMore': 'अधिक जानें',
    'common.viewAll': 'सभी देखें',
    'common.back': 'वापस',
    'common.next': 'आगे',
    'common.submit': 'जमा करें',
    'common.cancel': 'रद्द करें',
    'common.close': 'बंद करें',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
