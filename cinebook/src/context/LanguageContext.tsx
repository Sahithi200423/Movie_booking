import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
  type SupportedCurrency,
  type TranslationSchema
} from '../i18n/types';
import { TRANSLATIONS } from '../i18n';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  direction: 'ltr' | 'rtl';
  isRTL: boolean;
  t: TranslationSchema;
  currency: SupportedCurrency;
  setCurrency: (curr: SupportedCurrency) => void;
  formatPrice: (amountInUSD: number) => string;
  timeFormat: '12h' | '24h';
  setTimeFormat: (fmt: '12h' | '24h') => void;
  formatTime: (timeStr: string, cinemaTimezone?: string) => string;
  formatCinemaDate: (dateStr: string) => string;
}

const CURRENCY_RATES: Record<SupportedCurrency, { symbol: string; rate: number; prefix: boolean }> = {
  INR: { symbol: '₹', rate: 1.0, prefix: true },
  USD: { symbol: '$', rate: 0.012, prefix: true },
  EUR: { symbol: '€', rate: 0.011, prefix: false },
  GBP: { symbol: '£', rate: 0.0095, prefix: true },
  JPY: { symbol: '¥', rate: 1.85, prefix: true }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('cinebook_language') as SupportedLanguage;
    if (saved && TRANSLATIONS[saved]) return saved;
    return 'en';
  });

  const [currency, setCurrencyState] = useState<SupportedCurrency>(() => {
    const saved = localStorage.getItem('cinebook_currency') as SupportedCurrency;
    if (saved && CURRENCY_RATES[saved]) return saved;
    return 'INR';
  });

  const [timeFormat, setTimeFormatState] = useState<'12h' | '24h'>(() => {
    const saved = localStorage.getItem('cinebook_time_format') as '12h' | '24h';
    return saved === '24h' ? '24h' : '12h';
  });

  const currentLangInfo = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  const direction = currentLangInfo.direction;

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    localStorage.setItem('cinebook_language', language);
  }, [language, direction]);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
  };

  const setCurrency = (curr: SupportedCurrency) => {
    setCurrencyState(curr);
    localStorage.setItem('cinebook_currency', curr);
  };

  const setTimeFormat = (fmt: '12h' | '24h') => {
    setTimeFormatState(fmt);
    localStorage.setItem('cinebook_time_format', fmt);
  };

  // Convert and format price based on selected currency
  const formatPrice = (amountInINR: number): string => {
    const info = CURRENCY_RATES[currency];
    const converted = amountInINR * info.rate;
    
    // For INR and whole numbers, render crisp whole rupees
    const isWhole = Number.isInteger(converted);
    const formattedNum = isWhole
      ? Math.round(converted).toLocaleString('en-IN')
      : converted.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return info.prefix ? `${info.symbol}${formattedNum}` : `${formattedNum} ${info.symbol}`;
  };

  // Format showtime into 12h or 24h
  const formatTime = (timeStr: string, _cinemaTimezone?: string): string => {
    if (!timeStr) return '';
    if (timeFormat === '12h') {
      return timeStr; // Default format is already 12h: e.g. "07:45 PM"
    }
    // Convert 12h to 24h
    try {
      const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (!match) return timeStr;
      let hours = parseInt(match[1], 10);
      const minutes = match[2];
      const period = match[3].toUpperCase();
      if (period === 'PM' && hours < 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      return `${hours.toString().padStart(2, '0')}:${minutes}`;
    } catch {
      return timeStr;
    }
  };

  const formatCinemaDate = (dateStr: string): string => {
    try {
      if (!dateStr) return '';
      const isoMatch = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
      let date: Date;
      if (isoMatch) {
        const year = parseInt(isoMatch[1], 10);
        const month = parseInt(isoMatch[2], 10) - 1;
        const day = parseInt(isoMatch[3], 10);
        // Set at 12:00:00 noon to avoid any timezone boundary offset rollbacks
        date = new Date(year, month, day, 12, 0, 0);
      } else {
        date = new Date(dateStr);
      }
      if (isNaN(date.getTime())) return dateStr;
      return new Intl.DateTimeFormat(language, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        timeZone: 'Asia/Kolkata'
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        direction,
        isRTL: direction === 'rtl',
        t,
        currency,
        setCurrency,
        formatPrice,
        timeFormat,
        setTimeFormat,
        formatTime,
        formatCinemaDate
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
