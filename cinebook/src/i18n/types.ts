export interface TranslationSchema {
  nav: {
    movies: string;
    nowShowing: string;
    comingSoon: string;
    cinemas: string;
    admin: string;
    myTickets: string;
    signIn: string;
    signOut: string;
    searchPlaceholder: string;
    selectCity: string;
    language: string;
    currency: string;
    timeFormat: string;
  };
  home: {
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    exploreNow: string;
    trending: string;
    viewDetails: string;
    bookNow: string;
    filters: string;
    allLanguages: string;
    allGenres: string;
    searchResults: string;
    noMoviesFound: string;
    nowShowingTitle: string;
    comingSoonTitle: string;
    theatersTitle: string;
    watchlist: string;
    addedToWatchlist: string;
  };
  movie: {
    synopsis: string;
    director: string;
    topCast: string;
    availableAudio: string;
    selectCinemaShowtimes: string;
    chooseDate: string;
    today: string;
    tomorrow: string;
    selectSeatsContinue: string;
    reviewsTitle: string;
    writeReview: string;
    submitReview: string;
    yourName: string;
    rating: string;
    yourReview: string;
    noReviewsYet: string;
    reviewSuccess: string;
  };
  seats: {
    auditoriumScreen: string;
    available: string;
    selected: string;
    reserved: string;
    held: string;
    vipRecliner: string;
    premiumPrime: string;
    standard: string;
    maxSeatsNotice: string;
    subtotal: string;
    continueToCheckout: string;
    holdExpiresIn: string;
    holdExpiredNotice: string;
    sessionEmptyTitle: string;
    sessionEmptyDesc: string;
  };
  checkout: {
    orderSummary: string;
    contactDetails: string;
    fullName: string;
    emailAddress: string;
    phone: string;
    promoCode: string;
    apply: string;
    discountApplied: string;
    subtotalLabel: string;
    convenienceFee: string;
    taxes: string;
    totalPayable: string;
    paymentMethod: string;
    cardPayment: string;
    upiPayment: string;
    netBanking: string;
    termsAgreement: string;
    confirmAndPay: string;
    processing: string;
    demoNotice: string;
  };
  tickets: {
    title: string;
    subtitle: string;
    activePasses: string;
    digitalBoardingPass: string;
    validPass: string;
    cancelledPass: string;
    cinemaAndHall: string;
    dateTime: string;
    seatsLabel: string;
    scanInstructions: string;
    printTicket: string;
    cancelTicket: string;
    keepBooking: string;
    confirmCancel: string;
    noTicketsTitle: string;
    noTicketsDesc: string;
  };
  admin: {
    title: string;
    subtitle: string;
    bookingsAudit: string;
    catalogue: string;
    gatekeeper: string;
    scannerTitle: string;
    scanPlaceholder: string;
    verifyButton: string;
    admittedStatus: string;
    addMovie: string;
    deleteMovie: string;
    revenue: string;
    totalBookings: string;
    activeMovies: string;
    totalCinemas: string;
  };
  common: {
    confirm: string;
    cancel: string;
    close: string;
    back: string;
    success: string;
    error: string;
    loading: string;
  };
}

export type SupportedLanguage =
  | 'en'
  | 'hi'
  | 'te'
  | 'ta'
  | 'kn'
  | 'ml'
  | 'bn'
  | 'mr'
  | 'gu'
  | 'pa'
  | 'or'
  | 'ur'
  | 'es'
  | 'fr'
  | 'de'
  | 'ja'
  | 'ko'
  | 'zh';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', direction: 'ltr', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', direction: 'ltr', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', direction: 'ltr', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', direction: 'ltr', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', direction: 'ltr', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', direction: 'ltr', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', direction: 'ltr', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', direction: 'ltr', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', direction: 'ltr', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', direction: 'rtl', flag: '🇵🇰' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', direction: 'ltr', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', direction: 'ltr', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', direction: 'ltr', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '简体中文', direction: 'ltr', flag: '🇨🇳' }
];

export type SupportedCurrency = 'USD' | 'INR' | 'EUR' | 'GBP' | 'JPY';

export interface CurrencyInfo {
  code: SupportedCurrency;
  symbol: string;
  rateAgainstUSD: number; // For demo conversion
  format: (amountInUSD: number) => string;
}
