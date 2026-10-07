import React, { createContext, useContext, useState } from 'react';
import type { SupportedLanguage, LanguageOption } from '../types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
];

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  availableLanguages: LanguageOption[];
  t: (key: string) => string;
}

// Foundation dictionary for initial landing & navigation
const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    'brand.tagline': 'Every Ticket ₹5 • Instant Reservations',
    'nav.movies': 'Movies',
    'nav.theatres': 'Theatres',
    'nav.tickets': 'My Tickets',
    'nav.signin': 'Sign In',
    'hero.title': 'Experience Blockbuster Cinema',
    'hero.subtitle': 'Book movie tickets at an incredible flat ₹5 per seat across India’s best multiplexes.',
    'section.now_showing': 'Now Showing',
    'section.coming_soon': 'Coming Soon',
    'search.placeholder': 'Search movies, genres, or theatres...',
    'auth.demo_mode': 'Demo Mode Active',
  },
  te: {
    'brand.tagline': 'ప్రతి టికెట్ కేవలం ₹5 • తక్షణ రిజర్వేషన్లు',
    'nav.movies': 'సినిమాలు',
    'nav.theatres': 'థియేటర్లు',
    'nav.tickets': 'నా టిక్కెట్లు',
    'nav.signin': 'లాగిన్',
    'hero.title': 'బ్లాక్‌బస్టర్ సినిమా అనుభూతిని పొందండి',
    'hero.subtitle': 'కేవలం ₹5లకే భారతదేశంలోని ఉత్తమ మల్టీప్లెక్స్‌లలో సినిమా టిక్కెట్లను బుక్ చేసుకోండి.',
    'section.now_showing': 'ఇప్పుడు ప్రదర్శించబడుతున్నాయి',
    'section.coming_soon': 'త్వరలో రాబోయేవి',
    'search.placeholder': 'సినిమాలు లేదా థియేటర్లను శోధించండి...',
    'auth.demo_mode': 'డెమో మోడ్ సక్రియం',
  },
  ta: {
    'brand.tagline': 'ஒவ்வொரு டிக்கெட்டும் ₹5 • உடனடி முன்பதிவு',
    'nav.movies': 'திரைப்படங்கள்',
    'nav.theatres': 'திரையரங்குகள்',
    'nav.tickets': 'என் டிக்கெட்டுகள்',
    'nav.signin': 'உள்நுழைக',
    'hero.title': 'பிளாக்பஸ்டர் சினிமா அனுபவம்',
    'hero.subtitle': 'வெறும் ₹5க்கு இந்தியாவின் முன்னணி திரையரங்குகளில் டிக்கெட்டுகளை முன்பதிவு செய்யுங்கள்.',
    'section.now_showing': 'இப்போது திரையிடப்படுகிறது',
    'section.coming_soon': 'விரைவில் வருகிறது',
    'search.placeholder': 'திரைப்படங்கள் அல்லது திரையரங்குகளைத் தேடுங்கள்...',
    'auth.demo_mode': 'டெமோ பயன்முறை செயலில் உள்ளது',
  },
  ml: {
    'brand.tagline': 'ഓരോ ടിക്കറ്റിനും ₹5 • തത്സമയ റിസർവേഷൻ',
    'nav.movies': 'സിനിമകൾ',
    'nav.theatres': 'തിയേറ്ററുകൾ',
    'nav.tickets': 'എന്റെ ടിക്കറ്റുകൾ',
    'nav.signin': 'ലോഗിൻ',
    'hero.title': 'ബ്ലോക്ക്ബസ്റ്റർ സിനിമാ അനുഭവം',
    'hero.subtitle': 'വെറും ₹5 നിരക്കിൽ മികച്ച തീയറ്ററുകളിൽ സിനിമ ടിക്കറ്റുകൾ ബുക്ക് ചെയ്യൂ.',
    'section.now_showing': 'ഇപ്പോൾ പ്രദർശിപ്പിക്കുന്നു',
    'section.coming_soon': 'ഉടൻ വരുന്നു',
    'search.placeholder': 'സിനിമകൾ തിരയുക...',
    'auth.demo_mode': 'ഡെമോ മോഡ്',
  },
  kn: {
    'brand.tagline': 'ಪ್ರತಿ ಟಿಕೆಟ್ ಕೇವಲ ₹5 • ತಕ್ಷಣದ ಬುಕಿಂಗ್',
    'nav.movies': 'ಚಲನಚಿತ್ರಗಳು',
    'nav.theatres': 'ಚಿತ್ರಮಂದಿರಗಳು',
    'nav.tickets': 'ನನ್ನ ಟಿಕೆಟ್‌ಗಳು',
    'nav.signin': 'ಲಾಗಿನ್',
    'hero.title': 'ಬ್ಲಾಕ್‌ಬಸ್ಟರ್ ಸಿನಿಮಾ ಅನುಭವಿಸಿ',
    'hero.subtitle': 'ಕೇವಲ ₹5 ಗೆ ಭಾರತದ ಅತ್ಯುತ್ತಮ ಮಲ್ಟಿಪ್ಲೆಕ್ಸ್‌ಗಳಲ್ಲಿ ಚಲನಚಿತ್ರ ಟಿಕೆಟ್‌ಗಳನ್ನು ಬುಕ್ ಮಾಡಿ.',
    'section.now_showing': 'ಈಗ ಪ್ರದರ್ಶನಗೊಳ್ಳುತ್ತಿದೆ',
    'section.coming_soon': 'ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ',
    'search.placeholder': 'ಚಲನಚಿತ್ರಗಳನ್ನು ಹುಡುಕಿ...',
    'auth.demo_mode': 'ಡೆಮೊ ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ',
  },
  hi: {
    'brand.tagline': 'हर टिकट मात्र ₹5 • त्वरित बुकिंग',
    'nav.movies': 'फ़िल्में',
    'nav.theatres': 'सिनेमाघर',
    'nav.tickets': 'मेरे टिकट',
    'nav.signin': 'साइन इन',
    'hero.title': 'ब्लॉकबस्टर सिनेमा का आनंद लें',
    'hero.subtitle': 'भारत के शीर्ष मल्टीप्लेक्सों में मात्र ₹5 में मूवी टिकट बुक करें।',
    'section.now_showing': 'अब सिनेमाघरों में',
    'section.coming_soon': 'जल्द आ रही हैं',
    'search.placeholder': 'फ़िल्में या सिनेमाघर खोजें...',
    'auth.demo_mode': 'डेमो मोड सक्रिय',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('cinebook_lang') as SupportedLanguage;
    return saved && TRANSLATIONS[saved] ? saved : 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('cinebook_lang', lang);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, availableLanguages: SUPPORTED_LANGUAGES, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
