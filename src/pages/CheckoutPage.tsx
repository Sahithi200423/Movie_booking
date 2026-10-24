import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  ShieldAlert,
  CreditCard,
  Popcorn,
  Plus,
  Minus,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Lock,
  ArrowRight,
  Info,
  Tag,
  X,
  Heart,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Building2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useTranslation } from '../context/LanguageContext';
import { SNACK_ADDONS, SEAT_TIER_LABELS } from '../data/mockData';
import {
  validateCouponApi,
  getCouponsApi,
  createPaymentOrderApi,
  verifyPaymentApi,
  releaseSeatsHoldApi
} from '../services/api';
import { generateCanonicalShowtimeId, formatToISODate } from '../utils/dateUtils';
import { IS_PORTFOLIO_DEMO_MODE, DEMO_NOTICE_TEXT, DEMO_TICKET_WATERMARK } from '../config/demoMode';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBooking, updateAddonQuantity, saveBooking, resetActiveBooking, sessionId } = useBooking();
  const { t, formatPrice, formatTime, isRTL } = useTranslation();

  const [customerName, setCustomerName] = useState('Alex Rivera');
  const [customerEmail, setCustomerEmail] = useState('alex.rivera@example.com');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [toastNotice, setToastNotice] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'error' | 'success' | 'info' = 'info') => {
    setToastNotice({ message, type });
    setTimeout(() => {
      setToastNotice(prev => (prev?.message === message ? null : prev));
    }, 4500);
  };

  // Fee breakdown collapse
  const [showFeeDetails, setShowFeeDetails] = useState(false);

  // Coupon State
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    calculatedDiscount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [availableCoupons, setAvailableCoupons] = useState<Array<{ code: string; description: string; minSubtotal: number }>>([
    { code: 'ICICI20', description: '20% off up to ₹150 on ICICI Bank Cards', minSubtotal: 200 },
    { code: 'BMSWELCOME', description: 'Flat ₹100 off on your tickets', minSubtotal: 250 },
    { code: 'KOTAK50', description: 'Buy 1 Get 1 (50% off on 2+ tickets)', minSubtotal: 400 }
  ]);

  useEffect(() => {
    getCouponsApi()
      .then(res => {
        if (res.success && res.coupons && res.coupons.length > 0) {
          setAvailableCoupons(res.coupons);
        }
      })
      .catch(() => {
        // Keep initial fallback coupons
      });
  }, []);

  const seatsCount = activeBooking.seats?.length || 0;

  // Calculate base ticket breakdown: Exactly ₹5 per seat in demo
  const seatsSubtotal = seatsCount * 5;

  // Group seats by tier for itemized display: Exactly ₹5 per seat in demo
  const seatsByTier = (activeBooking.seats || []).reduce((acc, seat) => {
    if (!acc[seat.tier]) {
      acc[seat.tier] = { count: 0, price: 5, seats: [] };
    }
    acc[seat.tier].count += 1;
    acc[seat.tier].seats.push(seat.id);
    return acc;
  }, {} as Record<string, { count: number; price: number; seats: string[] }>);

  // Snacks subtotal
  const snacksSubtotal = Object.entries(activeBooking.addons).reduce((sum, [addonId, qty]) => {
    const item = SNACK_ADDONS.find(s => s.id === addonId);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const rawSubtotal = seatsSubtotal + snacksSubtotal;

  // No convenience fees, platform fees, taxes added on top, or hidden charges in demo
  const totalConvenienceFee = 0;

  // BookASmile donation: ₹0 in demo
  const donationAmount = 0;

  // Coupon discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.min(150, Math.round((rawSubtotal * appliedCoupon.discountValue) / 100));
    } else {
      discountAmount = Math.min(rawSubtotal, appliedCoupon.discountValue);
    }
  }

  const discountedTicketSubtotal = Math.max(0, rawSubtotal - discountAmount);
  const totalAmount = Math.round((discountedTicketSubtotal + totalConvenienceFee + donationAmount) * 100) / 100;

  const handleApplyCoupon = async (codeToApply?: string) => {
    const targetCode = (codeToApply || couponInput).trim().toUpperCase();
    if (!targetCode) return;

    setCouponError(null);

    try {
      const res = await validateCouponApi(targetCode, rawSubtotal);
      if (res.success && res.coupon) {
        setAppliedCoupon(res.coupon);
        setCouponInput('');
        return;
      }
    } catch {
      const found = availableCoupons.find(c => c.code.toUpperCase() === targetCode);
      if (found) {
        if (rawSubtotal >= found.minSubtotal) {
          const isPercent = found.code === 'ICICI20' || found.code === 'KOTAK50';
          const discountVal = found.code === 'ICICI20' ? 20 : found.code === 'KOTAK50' ? 50 : 100;
          const calculated = isPercent ? Math.min(150, Math.round((rawSubtotal * discountVal) / 100)) : 100;
          setAppliedCoupon({
            code: found.code,
            description: found.description,
            discountType: isPercent ? 'percentage' : 'fixed',
            discountValue: discountVal,
            calculatedDiscount: calculated
          });
          setCouponInput('');
          return;
        } else {
          setCouponError(`Order subtotal must be at least ₹${found.minSubtotal} for this promo.`);
          return;
        }
      }
      setCouponError('Invalid promo code. Try ICICI20, BMSWELCOME, or KOTAK50.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  // Helper to dynamically load Razorpay Checkout SDK if not yet initialized
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise(resolve => {
      if (typeof (window as any).Razorpay !== 'undefined') {
        return resolve(true);
      }
      const existing = document.querySelector('script[src*="checkout.razorpay.com"]');
      if (existing) {
        existing.addEventListener('load', () => resolve(true));
        existing.addEventListener('error', () => resolve(false));
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleConfirmDemoBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim()) {
      setFormError('Please enter your full name and email address for ticket delivery.');
      showToast('Please enter your full name and email.', 'error');
      return;
    }

    setFormError(null);
    setIsProcessing(true);

    const addonsList = Object.entries(activeBooking.addons).map(([addonId, quantity]) => {
      const item = SNACK_ADDONS.find(s => s.id === addonId)!;
      return {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity
      };
    });

    const showtimeId =
      activeBooking.showtimeId ||
      generateCanonicalShowtimeId(
        activeBooking.movie?.id || '',
        activeBooking.cinema?.id || '',
        activeBooking.date || formatToISODate(new Date()),
        activeBooking.time || '04:30 PM'
      );

    const selectedSeatNumbers = activeBooking.seats.map(s => s.id);

    // =========================================================================
    // PORTFOLIO DEMO MODE: Safe simulated booking flow
    // Disables real Razorpay order creation and payment API requests.
    // Uses isolated browser-local state and generates a sample demo ticket.
    // =========================================================================
    if (IS_PORTFOLIO_DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800)); // Graceful brief simulation

      const demoBookingRef = `DEMO-VIP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const demoBooking: any = {
        id: demoBookingRef,
        bookingId: demoBookingRef,
        bookingRef: demoBookingRef,
        movieId: activeBooking.movie!.id,
        movieTitle: activeBooking.movie!.title,
        moviePoster: activeBooking.movie!.posterUrl,
        movieDuration: activeBooking.movie!.duration,
        movieAgeRating: activeBooking.movie!.ageRating,
        cinemaId: activeBooking.cinema!.id,
        cinemaName: activeBooking.cinema!.name,
        cinemaAddress: activeBooking.cinema!.address,
        hall: activeBooking.hall,
        format: activeBooking.format,
        date: activeBooking.date,
        time: activeBooking.time,
        seats: activeBooking.seats,
        seatsCount: activeBooking.seats.length,
        addons: addonsList,
        deliveryPreference: activeBooking.deliveryPreference || 'seat',
        subtotal: rawSubtotal,
        convenienceFee: 0,
        tax: 0,
        totalAmount,
        customer: {
          name: customerName.trim(),
          email: customerEmail.trim().toLowerCase(),
          phone: customerPhone.trim()
        },
        paymentMethod: `Demo Showcase (${paymentMethod === 'upi' ? 'Instant UPI' : paymentMethod === 'card' ? 'Credit/Debit Card' : 'Net Banking'} Simulation)`,
        bookedAt: new Date().toISOString(),
        status: 'confirmed',
        isDemo: true,
        demoNotice: DEMO_NOTICE_TEXT,
        qrCodeData: JSON.stringify({
          demo: true,
          notice: DEMO_TICKET_WATERMARK,
          ref: demoBookingRef,
          movie: activeBooking.movie!.title,
          seats: selectedSeatNumbers.join(', '),
          cinema: activeBooking.cinema!.name,
          date: activeBooking.date,
          time: activeBooking.time
        }),
        qrToken: `DEMO-PASS-${demoBookingRef}`
      };

      try {
        localStorage.setItem('current_booking', JSON.stringify(demoBooking));
        localStorage.setItem('last_booking', JSON.stringify(demoBooking));
      } catch (e) {}

      saveBooking(demoBooking);
      resetActiveBooking();
      showToast('Demo booking confirmed! Loading holographic M-ticket...', 'success');
      navigate(`/confirmation?id=${encodeURIComponent(demoBookingRef)}`);
      return;
    }

    // Step 1: Ensure Razorpay Checkout SDK is ready (Preserved for Live/Production use)
    const isScriptReady = await loadRazorpayScript();
    if (!isScriptReady || typeof (window as any).Razorpay === 'undefined') {
      const errorMsg = 'Unable to initialize Razorpay checkout gateway. Please verify your network connection and retry.';
      setFormError(errorMsg);
      showToast(errorMsg, 'error');
      setIsProcessing(false);
      return;
    }

    // Step 2: Create server-side order with Razorpay
    let orderRes: any;
    try {
      orderRes = await createPaymentOrderApi({
        showtimeId,
        date: activeBooking.date,
        time: activeBooking.time,
        movieId: activeBooking.movie?.id,
        cinemaId: activeBooking.cinema?.id,
        seatIds: selectedSeatNumbers,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: customerPhone.trim(),
        addons: addonsList,
        deliveryPreference: activeBooking.deliveryPreference || 'seat',
        donationAmount: 0.0,
        discountAmount: 0.0,
        provider: 'RAZORPAY',
        sessionId
      });

      if (!orderRes || (!orderRes.orderId && !orderRes.order_id)) {
        throw new Error(orderRes?.message || 'Payment gateway order creation failed.');
      }
    } catch (orderErr: any) {
      const errorMsg = orderErr.message || 'Payment order creation failed.';
      setFormError(errorMsg);
      showToast(errorMsg, 'error');
      setIsProcessing(false);
      return;
    }

    // Step 3: Launch legitimate Razorpay Checkout modal
    const envKey = (import.meta as any).env?.VITE_RAZORPAY_KEY_ID;
    const activeKey = envKey || orderRes.key || orderRes.key_id;
    const targetOrderId = orderRes.order_id || orderRes.orderId;

    let isPaymentCompleted = false;

    try {
      const rzpOptions: any = {
        key: activeKey,
        amount: orderRes.totalInPaise || Math.round(totalAmount * 100),
        currency: orderRes.currency || 'INR',
        name: 'CineBook Cinema',
        description: `${activeBooking.movie?.title} (${selectedSeatNumbers.join(', ')})`,
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=128&q=80',
        order_id: targetOrderId,
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          setIsProcessing(true);
          try {
            // Strictly call backend confirmation endpoint /api/payment/verify with Razorpay's authentic credentials
            const verifyRes = await verifyPaymentApi({
              orderId: response.razorpay_order_id || targetOrderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              bookingId: orderRes.bookingId || orderRes.bookingRef
            });

            if (verifyRes.success) {
              isPaymentCompleted = true;
              const confirmedBooking = verifyRes.booking || {
                id: orderRes.bookingId,
                bookingId: orderRes.bookingRef,
                bookingRef: orderRes.bookingRef,
                movieId: activeBooking.movie!.id,
                movieTitle: activeBooking.movie!.title,
                moviePoster: activeBooking.movie!.posterUrl,
                movieDuration: activeBooking.movie!.duration,
                movieAgeRating: activeBooking.movie!.ageRating,
                cinemaId: activeBooking.cinema!.id,
                cinemaName: activeBooking.cinema!.name,
                cinemaAddress: activeBooking.cinema!.address,
                hall: activeBooking.hall,
                format: activeBooking.format,
                date: activeBooking.date,
                time: activeBooking.time,
                seats: activeBooking.seats,
                totalAmount: orderRes.amount || totalAmount,
                customer: {
                  name: customerName,
                  email: customerEmail,
                  phone: customerPhone
                },
                status: 'confirmed'
              };

              (confirmedBooking as any).paymentMethod = 'Razorpay (Verified)';
              (confirmedBooking as any).deliveryPreference = activeBooking.deliveryPreference || 'seat';
              if (!confirmedBooking.addons || confirmedBooking.addons.length === 0) {
                confirmedBooking.addons = addonsList;
              }

              const cb = confirmedBooking as any;
              const targetId =
                verifyRes.bookingId ||
                cb.bookingRef ||
                cb.bookingId ||
                cb.id ||
                orderRes.bookingRef ||
                orderRes.bookingId;

              try {
                localStorage.setItem('current_booking', JSON.stringify(confirmedBooking));
                localStorage.setItem('last_booking', JSON.stringify(confirmedBooking));
              } catch (e) {}

              saveBooking(confirmedBooking as any);
              resetActiveBooking();
              showToast('Payment verified successfully! Redirecting...', 'success');
              navigate(`/confirmation?id=${encodeURIComponent(targetId)}`);
            } else {
              throw new Error(verifyRes.message || 'Payment verification failed.');
            }
          } catch (verifyErr: any) {
            const errorMsg = verifyErr.message || 'Payment verification failed. Seats released.';
            setFormError(errorMsg);
            showToast(errorMsg, 'error');
            try {
              await releaseSeatsHoldApi(showtimeId, sessionId, selectedSeatNumbers);
            } catch (e) {}
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone
        },
        theme: {
          color: '#C7A675'
        },
        modal: {
          ondismiss: async function () {
            setIsProcessing(false);
            if (isPaymentCompleted) {
              return;
            }
            try {
              await releaseSeatsHoldApi(showtimeId, sessionId, selectedSeatNumbers);
            } catch (e) {}
          }
        }
      };

      const rzp = new (window as any).Razorpay(rzpOptions);
      rzp.on('payment.failed', async function (failedResponse: any) {
        setIsProcessing(false);
        const description = failedResponse?.error?.description || 'Payment was declined or failed at gateway.';
        setFormError(description);
        showToast(description, 'error');
        try {
          await releaseSeatsHoldApi(showtimeId, sessionId, selectedSeatNumbers);
        } catch (e) {}
      });
      rzp.open();
    } catch (sdkErr: any) {
      setIsProcessing(false);
      const errMsg = sdkErr?.message || 'Failed to initialize payment gateway.';
      setFormError(errMsg);
      showToast(errMsg, 'error');
      try {
        await releaseSeatsHoldApi(showtimeId, sessionId, selectedSeatNumbers);
      } catch (e) {}
    }
  };

  // Fallback if accessed with empty booking state (checked after all React Hooks)
  if (!activeBooking.movie || !activeBooking.cinema || (activeBooking.seats && activeBooking.seats.length === 0)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-[#08090B] text-[#F3F0E8]">
        <ShieldAlert className="w-16 h-16 text-[#C7A675] mb-4" />
        <h2 className="text-2xl font-bold font-display text-[#F3F0E8] mb-2">{t.seats.sessionEmptyTitle}</h2>
        <p className="text-sm text-[#A8ADB4] mb-6 max-w-md">
          {t.seats.sessionEmptyDesc}
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 rounded-full bg-[#C7A675] hover:bg-[#DFC49D] text-[#08090B] font-bold text-sm shadow-lg shadow-[#C7A675]/25 transition-all"
        >
          {t.nav.movies}
        </Link>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-20 bg-[#08090B] text-[#F3F0E8] ${isRTL ? 'rtl' : 'ltr'}`}>
      
      {/* INLINE TOAST NOTIFICATION BADGE */}
      {toastNotice && (
        <div className="fixed top-20 right-6 z-50 animate-slideIn max-w-sm">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-md text-xs sm:text-sm font-medium ${
              toastNotice.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/40 text-rose-200 shadow-rose-950/50'
                : toastNotice.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200 shadow-emerald-950/50'
                : 'bg-[#15171B]/95 border-[#C7A675]/40 text-[#F3F0E8] shadow-black/80'
            }`}
          >
            {toastNotice.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            ) : toastNotice.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-[#C7A675] shrink-0" />
            )}
            <span className="flex-1">{toastNotice.message}</span>
            <button
              type="button"
              onClick={() => setToastNotice(null)}
              className="text-[#A8ADB4] hover:text-[#F3F0E8] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 1. TOP HEADER */}
      <div className="border-b border-[#C7A675]/20 bg-[#08090B]/95 backdrop-blur-md sticky top-18 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/seat-selection"
              className="p-2 rounded-xl border border-white/10 bg-[#15171B] text-[#A8ADB4] hover:text-[#F3F0E8] hover:bg-white/10 transition-colors"
              title="Return to seat selection"
            >
              <ChevronLeft className="w-5 h-5 text-[#C7A675]" />
            </Link>
            <div>
              <h1 className="text-xl font-bold font-display tracking-tight text-[#F3F0E8]">{t.checkout.orderSummary}</h1>
              <p className="text-xs text-[#A8ADB4]">Step 3 of 3: Review and pay</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C7A675]/10 border border-[#C7A675]/30 text-[#C7A675] text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>100% Secure Checkout</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* PROMINENT DEMO NOTICE */}
        <div className="mb-8 p-4 rounded-2xl border border-[#C7A675]/30 bg-[#15171B] text-[#F3F0E8] text-xs sm:text-sm flex items-start gap-3 shadow-lg">
          <ShieldAlert className="w-5 h-5 text-[#C7A675] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-[#F3F0E8] text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C7A675] animate-ping" />
              SIMULATION ENVIRONMENT
            </div>
            <p className="text-[#A8ADB4] leading-relaxed">
              {t.checkout.demoNotice}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 7 COLS: Concessions, Offers, Contact Form, Payment */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Concessions & Snack Add-ons */}
            <div className="p-6 rounded-2xl border border-white/10 bg-[#0D0E12]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Popcorn className="w-5 h-5 text-[#C7A675]" />
                  <h3 className="font-bold font-display text-base text-[#F3F0E8] tracking-tight">Cinema Concessions & Snacks</h3>
                </div>
                <span className="text-xs text-[#A8ADB4]">Fresh at your seat</span>
              </div>

              <div className="space-y-3">
                {SNACK_ADDONS.map(addon => {
                  const qty = activeBooking.addons[addon.id] || 0;
                  return (
                    <div
                      key={addon.id}
                      className="p-3.5 rounded-xl border border-white/10 bg-[#15171B] flex items-center justify-between gap-3 hover:border-[#C7A675]/40 transition-colors"
                    >
                      <img
                        src={addon.imageUrl}
                        alt={addon.name}
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2256%22%20height%3D%2256%22%20viewBox%3D%220%200%2056%2056%22%3E%3Crect%20fill%3D%22%2315171B%22%20width%3D%2256%22%20height%3D%2256%22%2F%3E%3Ctext%20x%3D%2228%22%20y%3D%2232%22%20fill%3D%22%23C7A675%22%20font-size%3D%2210%22%20text-anchor%3D%22middle%22%3EF%26B%3C%2Ftext%3E%3C%2Fsvg%3E';
                        }}
                        className="w-14 h-14 rounded-lg object-cover bg-[#08090B] shrink-0 shadow-sm border border-white/10"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm text-[#F3F0E8] truncate">{addon.name}</h4>
                        <p className="text-[11px] text-[#A8ADB4] line-clamp-1 mt-0.5">{addon.description}</p>
                        <span className="text-xs font-bold font-mono text-[#C7A675] mt-1 inline-block">
                          {formatPrice(addon.price)}
                        </span>
                      </div>

                      {/* Quantity Controller */}
                      <div className="flex items-center gap-2 bg-[#08090B] border border-white/10 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => updateAddonQuantity(addon.id, qty - 1)}
                          disabled={qty === 0}
                          className="w-7 h-7 rounded flex items-center justify-center text-[#A8ADB4] hover:text-[#F3F0E8] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-5 text-center text-xs font-mono font-bold text-[#F3F0E8]">{qty}</span>
                        <button
                          type="button"
                          onClick={() => updateAddonQuantity(addon.id, qty + 1)}
                          className="w-7 h-7 rounded flex items-center justify-center text-[#C7A675] hover:text-[#DFC49D] hover:bg-white/5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Authentic Promo Codes Section */}
            <div className="p-6 rounded-2xl border border-white/10 bg-[#0D0E12] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#C7A675]" />
                  <h3 className="font-bold font-display text-base text-[#F3F0E8] tracking-tight">{t.checkout.promoCode}</h3>
                </div>
                <span className="text-xs text-[#A8ADB4]">Offers & Bank Discounts</span>
              </div>

              {appliedCoupon ? (
                <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-bold font-mono tracking-wider">{appliedCoupon.code}</span>
                      <span className="mx-1">•</span>
                      <span>Discount Applied (-{formatPrice(discountAmount)})</span>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="p-1 rounded-lg hover:bg-emerald-500/20 text-emerald-400 transition-colors cursor-pointer"
                    title="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter code (e.g. ICICI20, BMSWELCOME)..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#15171B] border border-white/10 text-[#F3F0E8] placeholder-[#71767F] text-xs sm:text-sm font-mono focus:border-[#C7A675] outline-none uppercase tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    disabled={!couponInput.trim()}
                    className="px-5 py-2.5 rounded-xl bg-[#C7A675] hover:bg-[#DFC49D] disabled:opacity-40 text-[#08090B] font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                  >
                    {t.checkout.apply}
                  </button>
                </div>
              )}

              {couponError && (
                <p className="text-xs text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>{couponError}</span>
                </p>
              )}

              {/* Quick Coupon Chips */}
              {!appliedCoupon && availableCoupons.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-[#A8ADB4] block mb-2">
                    Available Offers & Discounts:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {availableCoupons.map(c => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => handleApplyCoupon(c.code)}
                        className="px-2.5 py-1.5 rounded-lg border border-dashed border-[#C7A675]/40 bg-[#C7A675]/10 hover:bg-[#C7A675]/20 text-[#DFC49D] text-xs font-mono transition-all text-left flex items-center gap-1.5 cursor-pointer"
                      >
                        <Tag className="w-3 h-3 text-[#C7A675]" />
                        <span className="font-bold">{c.code}</span>
                        <span className="text-[10px] text-[#A8ADB4]">({c.description})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Customer Contact & Payment Form */}
            <form onSubmit={handleConfirmDemoBooking} className="p-6 rounded-2xl border border-white/10 bg-[#0D0E12] space-y-5">
              <div className="flex items-center justify-between pb-1">
                <h3 className="font-bold font-display text-base text-[#F3F0E8] tracking-tight flex items-center gap-2">
                  <span>{t.checkout.contactDetails}</span>
                </h3>
                {IS_PORTFOLIO_DEMO_MODE && (
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C7A675] px-2.5 py-0.5 rounded-full bg-[#15171B] border border-[#C7A675]/30">
                    DEMO SIMULATION
                  </span>
                )}
              </div>

              {IS_PORTFOLIO_DEMO_MODE && (
                <div className="p-3.5 rounded-xl bg-[#C7A675]/10 border border-[#C7A675]/30 text-[#DFC49D] text-xs flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#C7A675] shrink-0" />
                  <div>
                    <span className="font-bold text-[#F3F0E8] block">Portfolio Demo — No real tickets or payments are issued.</span>
                    <span className="text-[11px] text-[#A8ADB4]">
                      Experience simulated instant confirmation and holographic M-ticket with zero charges.
                    </span>
                  </div>
                </div>
              )}

              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#A8ADB4] mb-1.5">
                    {t.checkout.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#15171B] border border-white/10 text-[#F3F0E8] placeholder-[#71767F] text-sm focus:border-[#C7A675] outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A8ADB4] mb-1.5">
                    {t.checkout.emailAddress} *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#15171B] border border-white/10 text-[#F3F0E8] placeholder-[#71767F] text-sm focus:border-[#C7A675] outline-none transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#A8ADB4] mb-1.5">
                    Mobile Number (for SMS M-Ticket) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#15171B] border border-white/10 text-[#F3F0E8] placeholder-[#71767F] text-sm focus:border-[#C7A675] outline-none transition-colors"
                  />
                </div>
              </div>

              {/* 4. Payment Methods */}
              <div className="pt-4 border-t border-white/10">
                <label className="block text-xs uppercase font-bold text-[#A8ADB4] tracking-wider mb-3">
                  Select Payment Method:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'bg-[#C7A675]/15 border-[#C7A675] text-[#F3F0E8] shadow-md shadow-[#C7A675]/20'
                        : 'bg-[#15171B] border-white/10 text-[#A8ADB4] hover:border-white/20'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-[#C7A675] mb-2" />
                    <div>
                      <div className="text-xs font-bold text-[#F3F0E8]">Instant UPI</div>
                      <div className="text-[10px] text-[#A8ADB4]">{IS_PORTFOLIO_DEMO_MODE ? 'GPay, PhonePe (Demo)' : 'GPay, PhonePe, Paytm'}</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-[#C7A675]/15 border-[#C7A675] text-[#F3F0E8] shadow-md shadow-[#C7A675]/20'
                        : 'bg-[#15171B] border-white/10 text-[#A8ADB4] hover:border-white/20'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#C7A675] mb-2" />
                    <div>
                      <div className="text-xs font-bold text-[#F3F0E8]">Credit / Debit Card</div>
                      <div className="text-[10px] text-[#A8ADB4]">{IS_PORTFOLIO_DEMO_MODE ? 'Visa, RuPay (Demo)' : 'Visa, Mastercard, RuPay'}</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      paymentMethod === 'netbanking'
                        ? 'bg-[#C7A675]/15 border-[#C7A675] text-[#F3F0E8] shadow-md shadow-[#C7A675]/20'
                        : 'bg-[#15171B] border-white/10 text-[#A8ADB4] hover:border-white/20'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-[#C7A675] mb-2" />
                    <div>
                      <div className="text-xs font-bold text-[#F3F0E8]">Net Banking</div>
                      <div className="text-[10px] text-[#A8ADB4]">{IS_PORTFOLIO_DEMO_MODE ? 'Indian Banks (Demo)' : 'All Indian Banks'}</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  data-cursor={IS_PORTFOLIO_DEMO_MODE ? 'DEMO BOOK' : 'PAY'}
                  className="w-full py-4 rounded-full font-bold text-base bg-[#C7A675] hover:bg-[#DFC49D] active:scale-[0.99] text-[#08090B] shadow-xl shadow-[#C7A675]/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all btn-tactile"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-[#08090B] border-t-transparent rounded-full animate-spin" />
                      <span>{IS_PORTFOLIO_DEMO_MODE ? 'Generating Demo Pass...' : t.checkout.processing}</span>
                    </div>
                  ) : (
                    <>
                      <span>
                        {IS_PORTFOLIO_DEMO_MODE
                          ? `Try Demo Booking • ${formatPrice(totalAmount)}`
                          : `Pay ${formatPrice(totalAmount)}`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-[11px] text-[#A8ADB4] text-center mt-2">
                  {IS_PORTFOLIO_DEMO_MODE
                    ? 'Portfolio Demo — Simulated holographic M-ticket will be generated without real charge.'
                    : 'Instant M-Ticket and barcode pass will be generated upon checkout.'}
                </p>
              </div>
            </form>
          </div>

          {/* RIGHT 5 COLS: Authentic Order Breakdown */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="rounded-2xl border border-white/10 bg-[#0D0E12] p-6 space-y-6 shadow-xl">
              <h3 className="font-bold font-display text-base text-[#F3F0E8] pb-3 border-b border-white/10 tracking-tight">
                {t.checkout.orderSummary}
              </h3>

              {/* Movie Details preview */}
              <div className="flex gap-4 items-start">
                <img
                  src={activeBooking.movie.posterUrl}
                  alt={activeBooking.movie.title}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22150%22%20height%3D%22225%22%20viewBox%3D%220%200%20150%20225%22%3E%3Crect%20fill%3D%22%2315171B%22%20width%3D%22150%22%20height%3D%22225%22%2F%3E%3Ctext%20x%3D%2275%22%20y%3D%22115%22%20fill%3D%22%23C7A675%22%20font-size%3D%2212%22%20font-weight%3D%22bold%22%20text-anchor%3D%22middle%22%3ECINEBOOK%3C%2Ftext%3E%3C%2Fsvg%3E';
                  }}
                  className="w-16 aspect-[2/3] rounded-xl object-cover bg-[#08090B] shadow-md shrink-0 border border-[#C7A675]/30"
                />
                <div>
                  <h4 className="font-bold font-display text-base text-[#F3F0E8]">{activeBooking.movie.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#15171B] text-[#C7A675] border border-[#C7A675]/30">
                      {activeBooking.format}
                    </span>
                    <span className="text-xs text-[#A8ADB4]">{activeBooking.movie.duration}</span>
                  </div>
                  <p className="text-xs text-[#A8ADB4] mt-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#C7A675] shrink-0" />
                    <span className="truncate">{activeBooking.cinema.name} • {activeBooking.hall}</span>
                  </p>
                </div>
              </div>

              {/* Session Date & Time */}
              <div className="p-3.5 rounded-xl bg-[#15171B] border border-white/10 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#A8ADB4] block text-[10px] uppercase font-bold tracking-wider font-mono">Date</span>
                  <span className="font-bold text-[#F3F0E8] flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-[#C7A675]" />
                    {activeBooking.date}
                  </span>
                </div>
                <div>
                  <span className="text-[#A8ADB4] block text-[10px] uppercase font-bold tracking-wider font-mono">Showtime</span>
                  <span className="font-bold text-[#F3F0E8] flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-[#C7A675]" />
                    {formatTime(activeBooking.time)}
                  </span>
                </div>
              </div>

              {/* Realistic Itemized Seating Breakdown: Base Ticket Price × Quantity */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-[#A8ADB4] font-semibold pb-1 border-b border-white/5">
                  <span>Selected Seats ({seatsCount}):</span>
                  <span className="font-mono font-bold text-[#C7A675]">
                    {activeBooking.seats.map(s => s.id).join(', ')}
                  </span>
                </div>

                {Object.entries(seatsByTier).map(([tierKey, data]) => {
                  const label = SEAT_TIER_LABELS[tierKey as keyof typeof SEAT_TIER_LABELS] || tierKey;
                  return (
                    <div key={tierKey} className="flex justify-between text-[#A8ADB4] text-xs">
                      <span>{label} ({formatPrice(data.price)} × {data.count})</span>
                      <span className="text-[#F3F0E8] font-medium font-mono">{formatPrice(data.price * data.count)}</span>
                    </div>
                  );
                })}
              </div>

              {/* Concessions summary if any */}
              {snacksSubtotal > 0 && (
                <div className="pt-3 border-t border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-[#F3F0E8]">
                    <div className="flex items-center gap-1.5">
                      <Popcorn className="w-3.5 h-3.5 text-[#C7A675]" />
                      <span>Concessions Added:</span>
                    </div>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold bg-[#C7A675]/15 text-[#C7A675] border border-[#C7A675]/30">
                      {activeBooking.deliveryPreference === 'counter' ? 'Counter Pickup' : 'Deliver to Seat'}
                    </span>
                  </div>
                  {Object.entries(activeBooking.addons).map(([id, qty]) => {
                    const item = SNACK_ADDONS.find(s => s.id === id);
                    if (!item || qty === 0) return null;
                    return (
                      <div key={id} className="flex justify-between text-[#A8ADB4] text-[11px] pl-2">
                        <span>{qty}x {item.name}</span>
                        <span className="text-[#F3F0E8] font-medium font-mono">{formatPrice(item.price * qty)}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Cost Calculations & Authentic Breakdown */}
              <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
                <div className="flex justify-between text-[#A8ADB4]">
                  <span>Ticket Subtotal</span>
                  <span className="text-[#F3F0E8] font-medium font-mono">{formatPrice(rawSubtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Promo ({appliedCoupon?.code})</span>
                    <span className="font-mono">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                {/* Convenience Fee (Demo Waiver) */}
                <div className="border border-white/5 rounded-xl p-2.5 bg-[#15171B]">
                  <div
                    onClick={() => setShowFeeDetails(!showFeeDetails)}
                    className="flex justify-between items-center text-[#A8ADB4] cursor-pointer"
                  >
                    <span className="flex items-center gap-1">
                      <span>Convenience Fees (Demo Waiver)</span>
                      {showFeeDetails ? <ChevronUp className="w-3.5 h-3.5 text-[#A8ADB4]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#A8ADB4]" />}
                    </span>
                    <span className="text-emerald-400 font-medium font-mono">₹0.00</span>
                  </div>

                  {showFeeDetails && (
                    <div className="pt-2 mt-2 border-t border-white/10 space-y-1 text-[11px] text-[#71767F]">
                      <div className="flex justify-between">
                        <span>Platform & Service Fee (Demo)</span>
                        <span className="font-mono">₹0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Integrated GST (0%)</span>
                        <span className="font-mono">₹0.00</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* BookASmile Demo Notice */}
                <div className="p-3 rounded-xl border border-white/10 bg-[#15171B] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="cursor-pointer text-xs">
                      <div className="font-semibold text-[#F3F0E8] flex items-center gap-1">
                        <Heart className="w-3 h-3 text-[#C7A675] fill-[#C7A675]" />
                        <span>BookASmile Community Initiative</span>
                      </div>
                      <div className="text-[10px] text-[#A8ADB4]">
                        (Demo charity support • No extra charges added)
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold font-mono text-emerald-400 shrink-0">
                    ₹0.00
                  </span>
                </div>

                {/* Final Total Amount */}
                <div className="pt-3 border-t border-white/15 flex justify-between items-center">
                  <span className="font-bold text-sm text-[#F3F0E8]">{t.checkout.totalPayable}</span>
                  <span className="text-2xl font-bold font-mono text-[#C7A675] tracking-tight">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#15171B] border border-white/10 text-[11px] text-[#A8ADB4] flex items-center gap-2">
                <Info className="w-4 h-4 text-[#C7A675] shrink-0" />
                <span>Instant confirmation & digital barcode pass issued upon checkout.</span>
              </div>
            </div>
          </div>

        </div>
      </main>



    </div>
  );
};
