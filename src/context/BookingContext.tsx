import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Movie, Cinema, Seat, BookingRecord } from '../types';
import { CITIES, CINEMAS, MOVIES } from '../data/mockData';


interface ActiveBooking {
  movie: Movie | null;
  cinema: Cinema | null;
  date: string;
  time: string;
  format: string;
  hall: string;
  language?: string;
  showtimeId?: string;
  seats: Seat[];
  addons: Record<string, number>;
  deliveryPreference?: 'seat' | 'counter';
}

interface BookingContextType {
  currentCity: string;
  setCity: (city: string) => void;
  sessionId: string;
  activeBooking: ActiveBooking;
  setActiveMovie: (movie: Movie) => void;
  setActiveShowtime: (data: { cinema: Cinema; date: string; time: string; format: string; hall: string; language?: string; showtimeId?: string }) => void;
  toggleSeat: (seat: Seat) => void;
  updateAddonQuantity: (addonId: string, quantity: number) => void;
  setDeliveryPreference: (pref: 'seat' | 'counter') => void;
  resetActiveBooking: () => void;
  myBookings: BookingRecord[];
  saveBooking: (booking: BookingRecord) => void;
  syncBookings: (bookings: BookingRecord[]) => void;
  cancelBooking: (
    bookingId: string,
    refundDetails?: {
      refundStatus?: any;
      refundAmount?: number;
      cancellationFee?: number;
      refundId?: string;
    }
  ) => void;
}

const defaultActiveBooking: ActiveBooking = {
  movie: null,
  cinema: null,
  date: '',
  time: '',
  format: '',
  hall: '',
  showtimeId: undefined,
  seats: [],
  addons: {}
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCity, setCurrentCity] = useState<string>(() => {
    return localStorage.getItem('cinebook_city') || CITIES[0];
  });

  const [sessionId] = useState<string>(() => {
    let id = sessionStorage.getItem('cinebook_session_id');
    if (!id) {
      id = 'sess-' + Math.random().toString(36).substring(2, 10) + '-' + Date.now().toString(36);
      sessionStorage.setItem('cinebook_session_id', id);
    }
    return id;
  });

  const [activeBooking, setActiveBooking] = useState<ActiveBooking>(() => {
    try {
      const saved = sessionStorage.getItem('cinebook_active_booking');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return defaultActiveBooking;
  });

  const [myBookings, setMyBookings] = useState<BookingRecord[]>(() => {
    try {
      const saved = localStorage.getItem('cinebook_my_bookings');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Pre-populate with 1 realistic completed demo booking so the user can immediately experience "My Bookings" & ticket layout!
    const sampleBooking: BookingRecord = {
      bookingId: 'CB-9482-TX',
      movieId: MOVIES[0].id,
      movieTitle: MOVIES[0].title,
      moviePoster: MOVIES[0].posterUrl,
      movieDuration: MOVIES[0].duration,
      movieAgeRating: MOVIES[0].ageRating,
      cinemaId: CINEMAS[0].id,
      cinemaName: CINEMAS[0].name,
      cinemaAddress: CINEMAS[0].address,
      hall: 'IMAX Auditorium',
      format: 'IMAX 3D',
      date: 'Tomorrow, Oct 1',
      time: '07:45 PM',
      seats: [
        { id: 'C6', row: 'C', number: 6, tier: 'PREMIUM', price: 14.50 },
        { id: 'C7', row: 'C', number: 7, tier: 'PREMIUM', price: 14.50 }
      ],
      addons: [
        { id: 'combo-duo', name: 'Blockbuster Duo Combo', price: 16.50, quantity: 1 }
      ],
      subtotal: 45.50,
      convenienceFee: 2.50,
      tax: 2.20,
      totalAmount: 50.20,
      customer: {
        name: 'Alex Morgan',
        email: 'alex.morgan@cinebook.demo',
        phone: '+1 (555) 234-8901'
      },
      paymentMethod: 'Demo Apple Pay',
      bookedAt: new Date().toISOString(),
      status: 'confirmed'
    };
    return [sampleBooking];
  });

  useEffect(() => {
    localStorage.setItem('cinebook_city', currentCity);
  }, [currentCity]);

  useEffect(() => {
    sessionStorage.setItem('cinebook_active_booking', JSON.stringify(activeBooking));
  }, [activeBooking]);

  useEffect(() => {
    localStorage.setItem('cinebook_my_bookings', JSON.stringify(myBookings));
  }, [myBookings]);

  const setCity = (city: string) => {
    setCurrentCity(city);
  };

  const setActiveMovie = (movie: Movie) => {
    setActiveBooking(prev => ({
      ...prev,
      movie,
      seats: [], // Reset seats if changing movie
      addons: {}
    }));
  };

  const setActiveShowtime = ({
    cinema,
    date,
    time,
    format,
    hall,
    language,
    showtimeId
  }: {
    cinema: Cinema;
    date: string;
    time: string;
    format: string;
    hall: string;
    language?: string;
    showtimeId?: string;
  }) => {
    setActiveBooking(prev => ({
      ...prev,
      cinema,
      date,
      time,
      format,
      hall,
      language: language || prev.movie?.language || 'English',
      showtimeId,
      seats: [] // Clear seats when showtime changes
    }));
  };

  const toggleSeat = (seat: Seat) => {
    setActiveBooking(prev => {
      const exists = prev.seats.some(s => s.id === seat.id);
      let updatedSeats: Seat[];
      if (exists) {
        updatedSeats = prev.seats.filter(s => s.id !== seat.id);
      } else {
        // Max 8 seats per booking safeguard
        if (prev.seats.length >= 8) {
          console.warn('Maximum 8 seats allowed per booking transaction.');
          return prev;
        }
        updatedSeats = [...prev.seats, seat];
      }
      return {
        ...prev,
        seats: updatedSeats
      };
    });
  };

  const updateAddonQuantity = (addonId: string, quantity: number) => {
    setActiveBooking(prev => {
      const newAddons = { ...prev.addons };
      if (quantity <= 0) {
        delete newAddons[addonId];
      } else {
        newAddons[addonId] = quantity;
      }
      return {
        ...prev,
        addons: newAddons
      };
    });
  };

  const setDeliveryPreference = (pref: 'seat' | 'counter') => {
    setActiveBooking(prev => ({
      ...prev,
      deliveryPreference: pref
    }));
  };

  const resetActiveBooking = () => {
    setActiveBooking(defaultActiveBooking);
    sessionStorage.removeItem('cinebook_active_booking');
  };

  const saveBooking = (booking: BookingRecord) => {
    setMyBookings(prev => {
      const id = (booking.bookingId || booking.id || '').toUpperCase();
      const filtered = prev.filter(b => (b.bookingId || b.id || '').toUpperCase() !== id);
      return [booking, ...filtered];
    });
  };

  const syncBookings = (backendBookings: BookingRecord[]) => {
    if (!Array.isArray(backendBookings)) return;
    setMyBookings(prev => {
      const map = new Map<string, BookingRecord>();
      for (const b of prev) {
        const key = (b.bookingId || b.id || '').toUpperCase();
        if (key) map.set(key, b);
      }
      for (const b of backendBookings) {
        const key = (b.bookingId || b.id || '').toUpperCase();
        if (key) map.set(key, b);
      }
      return Array.from(map.values()).sort(
        (a, b) => new Date(b.bookedAt || 0).getTime() - new Date(a.bookedAt || 0).getTime()
      );
    });
  };

  const cancelBooking = (
    bookingId: string,
    refundDetails?: {
      refundStatus?: any;
      refundAmount?: number;
      cancellationFee?: number;
      refundId?: string;
    }
  ) => {
    const target = bookingId.toUpperCase();
    setMyBookings(prev =>
      prev.map(b =>
        (b.bookingId || b.id || '').toUpperCase() === target
          ? {
              ...b,
              status: 'cancelled',
              refundStatus: refundDetails?.refundStatus || 'REFUNDED',
              refundAmount:
                refundDetails?.refundAmount !== undefined
                  ? refundDetails.refundAmount
                  : Math.round(b.totalAmount * 0.9 * 100) / 100,
              cancellationFee:
                refundDetails?.cancellationFee !== undefined
                  ? refundDetails.cancellationFee
                  : Math.round(b.totalAmount * 0.1 * 100) / 100,
              refundId: refundDetails?.refundId
            }
          : b
      )
    );
  };

  return (
    <BookingContext.Provider
      value={{
        currentCity,
        setCity,
        sessionId,
        activeBooking,
        setActiveMovie,
        setActiveShowtime,
        toggleSeat,
        updateAddonQuantity,
        setDeliveryPreference,
        resetActiveBooking,
        myBookings,
        saveBooking,
        syncBookings,
        cancelBooking
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
