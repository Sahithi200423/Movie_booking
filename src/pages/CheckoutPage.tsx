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
  QrCode,
  AlertCircle,
  Check,
  Copy,
  Zap,
  ShieldCheck
} from 'lucide-react';
import QRCode from 'qrcode';
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

  // Razorpay Sandbox Gateway Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentOrder, setPaymentOrder] = useState<any | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [sandboxTab, setSandboxTab] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [mockQrUrl, setMockQrUrl] = useState<string>('');
  const [selectedBank, setSelectedBank] = useState<'HDFC' | 'ICICI' | 'SBI' | 'AXIS' | 'KOTAK'>('HDFC');
  const [testCardNumber, setTestCardNumber] = useState('4111 2222 3333 4444');
  const [testCardExpiry, setTestCardExpiry] = useState('12/28');
  const [testCardCvv, setTestCardCvv] = useState('123');
  const [testCardName, setTestCardName] = useState('Alex Rivera');
  const [simulatedUpiId, setSimulatedUpiId] = useState('alex.rivera@okhdfcbank');
  const [copiedUpi, setCopiedUpi] = useState(false);
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

  // Fallback if accessed with empty booking state
  if (!activeBooking.movie || !activeBooking.cinema || activeBooking.seats.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-[#090A0F] text-slate-100">
        <ShieldAlert className="w-16 h-16 text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">{t.seats.sessionEmptyTitle}</h2>
        <p className="text-sm text-slate-400 mb-6 max-w-md">
          {t.seats.sessionEmptyDesc}
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-colors"
        >
          {t.nav.movies}
        </Link>
      </div>
    );
  }

  const seatsCount = activeBooking.seats.length;

  // Calculate base ticket breakdown: Exactly ₹5 per seat in demo
  const seatsSubtotal = seatsCount * 5;

  // Group seats by tier for itemized display: Exactly ₹5 per seat in demo
  const seatsByTier = activeBooking.seats.reduce((acc, seat) => {
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

  // Generate live dynamic QR code for UPI simulated payments
  useEffect(() => {
    if (showPaymentModal && paymentOrder) {
      const amt = Number(paymentOrder.amount || totalAmount).toFixed(2);
      const ref = paymentOrder.bookingRef || paymentOrder.bookingId || 'BMS-TICKET';
      const upiPayload = `upi://pay?pa=cinebook@icici&pn=CineBook%20Cinemas&am=${amt}&cu=INR&tn=Order%20${ref}`;
      QRCode.toDataURL(upiPayload, {
        width: 220,
        margin: 1.5,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
        .then(url => setMockQrUrl(url))
        .catch(err => console.warn('QR code generation notice in sandbox modal:', err));
    }
  }, [showPaymentModal, paymentOrder, totalAmount]);

  // Complete Payment with Gateway Verification (In-app modal sandbox fallback)
  const handleCompletePayment = async (statusChoice: 'success' | 'decline', methodUsed?: string) => {
    const showtimeId =
      activeBooking.showtimeId ||
      `show-${activeBooking.movie!.id.substring(0, 8)}-${activeBooking.cinema!.id.substring(0, 8)}-1`;

    const selectedSeatNumbers = activeBooking.seats.map(s => s.id);

    if (statusChoice === 'decline') {
      setShowPaymentModal(false);
      setFormError('Payment was declined or cancelled. Seats have been released back to available.');
      showToast('Payment was cancelled. Seats have been unlocked.', 'info');
      try {
        await releaseSeatsHoldApi(showtimeId, sessionId, selectedSeatNumbers);
      } catch (e) {}
      return;
    }

    if (!paymentOrder) {
      setFormError('Missing active payment session. Please retry checkout.');
      showToast('Payment session expired. Please retry.', 'error');
      return;
    }

    setIsVerifying(true);

    try {
      // In sandbox/mock mode, the server signs the exact mockPaymentId it returns.
      // Do NOT generate a new payment ID here: that makes the server signature invalid.
      const mockPaymentId = paymentOrder.mockPaymentId;
      const signature = paymentOrder.mockSignature;

      if (!mockPaymentId || !signature) {
        throw new Error('Sandbox payment details are missing. Please create a new payment order and try again.');
      }

      // 1. Call backend confirmation endpoint /api/payment/verify
      const verifyRes = await verifyPaymentApi({
        orderId: paymentOrder.order_id || paymentOrder.orderId,
        paymentId: mockPaymentId,
        signature,
        bookingId: paymentOrder.bookingId
      });

      if (verifyRes.success) {
        const confirmedBooking = verifyRes.booking || {
          id: paymentOrder.bookingId,
          bookingId: paymentOrder.bookingRef,
          bookingRef: paymentOrder.bookingRef,
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
          totalAmount: paymentOrder.amount || totalAmount,
          customer: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone
          },
          status: 'confirmed'
        };

        const chosen = methodUsed || sandboxTab;
        const methodDisplay =
          chosen === 'upi'
            ? 'Instant UPI (Simulated)'
            : chosen === 'card'
            ? 'Credit/Debit Card (Simulated)'
            : `NetBanking (${selectedBank}) (Simulated)`;

        (confirmedBooking as any).paymentMethod = methodDisplay;
        (confirmedBooking as any).deliveryPreference = activeBooking.deliveryPreference || 'seat';
        if (!confirmedBooking.addons || confirmedBooking.addons.length === 0) {
          confirmedBooking.addons = Object.entries(activeBooking.addons).map(([addonId, quantity]) => {
            const item = SNACK_ADDONS.find(s => s.id === addonId);
            return {
              id: item?.id || addonId,
              name: item?.name || addonId,
              price: item?.price || 0,
              quantity
            };
          });
        }

        // 2. Ensure targetId is valid and NEVER undefined
        const cb = confirmedBooking as any;
        const targetId =
          verifyRes.bookingId ||
          cb.bookingRef ||
          cb.bookingId ||
          cb.id ||
          paymentOrder.bookingRef ||
          paymentOrder.bookingId ||
          `BMS-${Math.floor(100000 + Math.random() * 900000)}-IN`;

        // 3. Write booking object to localStorage ('current_booking' and 'last_booking')
        try {
          localStorage.setItem('current_booking', JSON.stringify(confirmedBooking));
          localStorage.setItem('last_booking', JSON.stringify(confirmedBooking));
        } catch (e) {
          console.warn('Failed saving booking to localStorage', e);
        }

        saveBooking(confirmedBooking as any);
        resetActiveBooking();
        setShowPaymentModal(false);
        showToast('Payment verified successfully! Redirecting...', 'success');

        // 4. Navigate cleanly using React Router
        navigate(`/confirmation?id=${encodeURIComponent(targetId)}`);
      } else {
        throw new Error(verifyRes.message || 'Payment verification failed');
      }
    } catch (verifyErr: any) {
      console.warn('Payment verification error:', verifyErr);
      setFormError(verifyErr.message || 'Payment verification failed. Seats released back to available.');
      showToast(verifyErr.message || 'Payment verification failed.', 'error');
      setShowPaymentModal(false);
      try {
        await releaseSeatsHoldApi(showtimeId, sessionId, selectedSeatNumbers);
      } catch (e) {}
    } finally {
      setIsVerifying(false);
    }
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

    const movieSlug = activeBooking.movie?.id.includes('kalki') ? 'kalki' : (activeBooking.movie?.id || '').substring(0, 8);
    const cinemaSlug = activeBooking.cinema?.id.includes('pvr') ? 'pvr' : (activeBooking.cinema?.id || '').replace('cin-', '').substring(0, 8);
    const showtimeId =
      activeBooking.showtimeId ||
      `show-${movieSlug}--${cinemaSlug}--1`;

    const selectedSeatNumbers = activeBooking.seats.map(s => s.id);

    // Create payment order directly (the backend atomically verifies and locks seats)

    // Step 2: Call /api/payment/create-order to fetch the real gateway order_id
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

      if (!orderRes || !orderRes.orderId) {
        throw new Error('Failed to generate Razorpay order ID.');
      }
      setPaymentOrder(orderRes);
    } catch (orderErr: any) {
      setFormError(orderErr.message || 'Payment order creation failed.');
      showToast(orderErr.message || 'Payment order creation failed.', 'error');
      setIsProcessing(false);
      return;
    }

    // Step 3: Check whether real functional Razorpay key is present
    const envKey = (import.meta as any).env?.VITE_RAZORPAY_KEY_ID;
    const activeKey = envKey || orderRes.key || orderRes.key_id;
    const isPlaceholder =
      !activeKey ||
      activeKey === 'rzp_test_sampleKey' ||
      activeKey.startsWith('rzp_test_sample') ||
      activeKey === 'sampleKey' ||
      activeKey.includes('placeholder') ||
      activeKey === 'rzp_test_yourKeyHere';

    // If valid real key is present and Razorpay is loaded, proceed with native modal
    if (!isPlaceholder && typeof (window as any).Razorpay !== 'undefined') {
      try {
        const rzpOptions = {
          key: activeKey,
          amount: (orderRes as any).totalInPaise || Math.round(totalAmount * 100),
          currency: orderRes.currency || 'INR',
          name: 'CineBook Cinema',
          description: `${activeBooking.movie?.title} (${selectedSeatNumbers.join(', ')})`,
          image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=128&q=80',
          order_id: orderRes.order_id || orderRes.orderId,
          handler: async function (response: any) {
            setIsVerifying(true);
            try {
              const verifyRes = await verifyPaymentApi({
                orderId: response.razorpay_order_id || orderRes.order_id || orderRes.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                bookingId: orderRes.bookingId
              });

              if (verifyRes.success) {
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
                  orderRes.bookingId ||
                  `BMS-${Math.floor(100000 + Math.random() * 900000)}-IN`;

                try {
                  localStorage.setItem('current_booking', JSON.stringify(confirmedBooking));
                  localStorage.setItem('last_booking', JSON.stringify(confirmedBooking));
                } catch (e) {}

                saveBooking(confirmedBooking as any);
                resetActiveBooking();
                showToast('Payment verified successfully! Redirecting...', 'success');
                navigate(`/confirmation?id=${encodeURIComponent(targetId)}`);
              }
            } catch (verifyErr: any) {
              setFormError(verifyErr.message || 'Payment verification failed.');
              showToast(verifyErr.message || 'Payment verification failed.', 'error');
            } finally {
              setIsVerifying(false);
              setIsProcessing(false);
            }
          },
          prefill: {
            name: customerName,
            email: customerEmail,
            contact: customerPhone
          },
          theme: {
            color: '#2563EB'
          },
          modal: {
            ondismiss: async function () {
              setIsProcessing(false);
              try {
                await releaseSeatsHoldApi(showtimeId, sessionId, selectedSeatNumbers);
              } catch (e) {}
            }
          }
        };

        const rzp = new (window as any).Razorpay(rzpOptions);
        rzp.on('payment.failed', function (response: any) {
          console.warn('Razorpay failed, opening smooth internal sandbox modal:', response);
          setIsProcessing(false);
          setSandboxTab(paymentMethod);
          setShowPaymentModal(true);
        });
        rzp.open();
        return;
      } catch (sdkErr) {
        console.warn('Native Razorpay open error, falling back to internal sandbox modal:', sdkErr);
      }
    }

    // Default / Mock Fallback Mode:
    // Open clean internal sandbox checkout modal directly
    setSandboxTab(paymentMethod);
    setShowPaymentModal(true);
    setIsProcessing(false);
  };

  return (
    <div className={`min-h-screen pb-20 bg-[#090A0F] text-slate-100 ${isRTL ? 'rtl' : 'ltr'}`}>
      
      {/* INLINE TOAST NOTIFICATION BADGE */}
      {toastNotice && (
        <div className="fixed top-20 right-6 z-50 animate-slideIn max-w-sm">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-md text-xs sm:text-sm font-medium ${
              toastNotice.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/40 text-rose-200 shadow-rose-950/50'
                : toastNotice.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200 shadow-emerald-950/50'
                : 'bg-blue-950/90 border-blue-500/40 text-blue-200 shadow-blue-950/50'
            }`}
          >
            {toastNotice.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            ) : toastNotice.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-blue-400 shrink-0" />
            )}
            <span className="flex-1">{toastNotice.message}</span>
            <button
              type="button"
              onClick={() => setToastNotice(null)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 1. TOP HEADER */}
      <div className="border-b border-white/10 bg-[#0E1017]/90 backdrop-blur-md sticky top-18 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/seat-selection"
              className="p-2 rounded-xl border border-white/10 bg-[#14161F] text-slate-400 hover:text-white hover:bg-[#1C1F2B] transition-colors"
              title="Return to seat selection"
            >
              <ChevronLeft className="w-5 h-5 text-blue-400" />
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">{t.checkout.orderSummary}</h1>
              <p className="text-xs text-slate-400">Step 3 of 3: Review and pay</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>100% Secure Checkout</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* PROMINENT DEMO NOTICE */}
        <div className="mb-8 p-4 rounded-2xl border border-blue-500/30 bg-blue-500/10 text-blue-200 text-xs sm:text-sm flex items-start gap-3 shadow-lg">
          <ShieldAlert className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-white text-sm">
              SIMULATION ENVIRONMENT
            </div>
            <p className="text-slate-300 leading-relaxed">
              {t.checkout.demoNotice}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 7 COLS: Concessions, Offers, Contact Form, Payment */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Concessions & Snack Add-ons */}
            <div className="p-6 rounded-2xl border border-white/10 bg-[#14161F]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Popcorn className="w-5 h-5 text-blue-400" />
                  <h3 className="font-bold text-base text-white tracking-tight">Cinema Concessions & Snacks</h3>
                </div>
                <span className="text-xs text-slate-400">Fresh at your seat</span>
              </div>

              <div className="space-y-3">
                {SNACK_ADDONS.map(addon => {
                  const qty = activeBooking.addons[addon.id] || 0;
                  return (
                    <div
                      key={addon.id}
                      className="p-3.5 rounded-xl border border-white/10 bg-[#1C1F2B] flex items-center justify-between gap-3 hover:border-blue-500/40 transition-colors"
                    >
                      <img
                        src={addon.imageUrl}
                        alt={addon.name}
                        className="w-14 h-14 rounded-lg object-cover bg-[#090A0F] shrink-0 shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm text-white truncate">{addon.name}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{addon.description}</p>
                        <span className="text-xs font-bold text-blue-400 mt-1 inline-block">
                          {formatPrice(addon.price)}
                        </span>
                      </div>

                      {/* Quantity Controller */}
                      <div className="flex items-center gap-2 bg-[#14161F] border border-white/10 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => updateAddonQuantity(addon.id, qty - 1)}
                          disabled={qty === 0}
                          className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-white">{qty}</span>
                        <button
                          type="button"
                          onClick={() => updateAddonQuantity(addon.id, qty + 1)}
                          className="w-7 h-7 rounded flex items-center justify-center text-blue-400 hover:text-white hover:bg-white/5 cursor-pointer"
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
            <div className="p-6 rounded-2xl border border-white/10 bg-[#14161F] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-base text-white tracking-tight">{t.checkout.promoCode}</h3>
                </div>
                <span className="text-xs text-slate-400">Offers & Bank Discounts</span>
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
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#1C1F2B] border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm font-mono focus:border-blue-500 outline-none uppercase tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    disabled={!couponInput.trim()}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
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
                  <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                    Available Offers & Discounts:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {availableCoupons.map(c => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => handleApplyCoupon(c.code)}
                        className="px-2.5 py-1.5 rounded-lg border border-dashed border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-mono transition-all text-left flex items-center gap-1.5 cursor-pointer"
                      >
                        <Tag className="w-3 h-3 text-amber-400" />
                        <span className="font-bold">{c.code}</span>
                        <span className="text-[10px] text-slate-400">({c.description})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Customer Contact & Payment Form */}
            <form onSubmit={handleConfirmDemoBooking} className="p-6 rounded-2xl border border-white/10 bg-[#14161F] space-y-5">
              <h3 className="font-bold text-base text-white tracking-tight flex items-center gap-2">
                <span>{t.checkout.contactDetails}</span>
              </h3>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t.checkout.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1F2B] border border-white/10 text-white placeholder-slate-500 text-sm focus:border-blue-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t.checkout.emailAddress} *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1F2B] border border-white/10 text-white placeholder-slate-500 text-sm focus:border-blue-500 outline-none transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Mobile Number (for SMS M-Ticket) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1F2B] border border-white/10 text-white placeholder-slate-500 text-sm focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* 4. Payment Methods */}
              <div className="pt-4 border-t border-white/10">
                <label className="block text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">
                  Select Payment Method:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'bg-blue-600/15 border-blue-500 text-white shadow-md shadow-blue-500/20'
                        : 'bg-[#1C1F2B] border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-emerald-400 mb-2" />
                    <div>
                      <div className="text-xs font-bold text-white">Instant UPI</div>
                      <div className="text-[10px] text-slate-400">GPay, PhonePe, Paytm</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-blue-600/15 border-blue-500 text-white shadow-md shadow-blue-500/20'
                        : 'bg-[#1C1F2B] border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-blue-400 mb-2" />
                    <div>
                      <div className="text-xs font-bold text-white">Credit / Debit Card</div>
                      <div className="text-[10px] text-slate-400">Visa, Mastercard, RuPay</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      paymentMethod === 'netbanking'
                        ? 'bg-blue-600/15 border-blue-500 text-white shadow-md shadow-blue-500/20'
                        : 'bg-[#1C1F2B] border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-purple-400 mb-2" />
                    <div>
                      <div className="text-xs font-bold text-white">Net Banking</div>
                      <div className="text-[10px] text-slate-400">All Indian Banks</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 rounded-full font-bold text-base bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t.checkout.processing}</span>
                    </div>
                  ) : (
                    <>
                      <span>Pay {formatPrice(totalAmount)}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-2">
                  Instant M-Ticket and barcode pass will be generated upon checkout.
                </p>
              </div>
            </form>
          </div>

          {/* RIGHT 5 COLS: Authentic Order Breakdown */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="rounded-2xl border border-white/10 bg-[#14161F] p-6 space-y-6 shadow-xl">
              <h3 className="font-bold text-base text-white pb-3 border-b border-white/10 tracking-tight">
                {t.checkout.orderSummary}
              </h3>

              {/* Movie Details preview */}
              <div className="flex gap-4 items-start">
                <img
                  src={activeBooking.movie.posterUrl}
                  alt={activeBooking.movie.title}
                  className="w-16 aspect-[2/3] rounded-xl object-cover bg-[#090A0F] shadow-md shrink-0 border border-white/10"
                />
                <div>
                  <h4 className="font-bold text-base text-white">{activeBooking.movie.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1C1F2B] text-blue-400 border border-white/10">
                      {activeBooking.format}
                    </span>
                    <span className="text-xs text-slate-400">{activeBooking.movie.duration}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">{activeBooking.cinema.name} • {activeBooking.hall}</span>
                  </p>
                </div>
              </div>

              {/* Session Date & Time */}
              <div className="p-3.5 rounded-xl bg-[#1C1F2B] border border-white/10 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Date</span>
                  <span className="font-bold text-white flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    {activeBooking.date}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Showtime</span>
                  <span className="font-bold text-white flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    {formatTime(activeBooking.time)}
                  </span>
                </div>
              </div>

              {/* Realistic Itemized Seating Breakdown: Base Ticket Price × Quantity */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-400 font-semibold pb-1 border-b border-white/5">
                  <span>Selected Seats ({seatsCount}):</span>
                  <span className="font-mono font-bold text-blue-400">
                    {activeBooking.seats.map(s => s.id).join(', ')}
                  </span>
                </div>

                {Object.entries(seatsByTier).map(([tierKey, data]) => {
                  const label = SEAT_TIER_LABELS[tierKey as keyof typeof SEAT_TIER_LABELS] || tierKey;
                  return (
                    <div key={tierKey} className="flex justify-between text-slate-300 text-xs">
                      <span>{label} ({formatPrice(data.price)} × {data.count})</span>
                      <span className="text-white font-medium">{formatPrice(data.price * data.count)}</span>
                    </div>
                  );
                })}
              </div>

              {/* Concessions summary if any */}
              {snacksSubtotal > 0 && (
                <div className="pt-3 border-t border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-white">
                    <div className="flex items-center gap-1.5">
                      <Popcorn className="w-3.5 h-3.5 text-blue-400" />
                      <span>Concessions Added:</span>
                    </div>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                      {activeBooking.deliveryPreference === 'counter' ? 'Counter Pickup' : 'Deliver to Seat'}
                    </span>
                  </div>
                  {Object.entries(activeBooking.addons).map(([id, qty]) => {
                    const item = SNACK_ADDONS.find(s => s.id === id);
                    if (!item || qty === 0) return null;
                    return (
                      <div key={id} className="flex justify-between text-slate-300 text-[11px] pl-2">
                        <span>{qty}x {item.name}</span>
                        <span className="text-white font-medium">{formatPrice(item.price * qty)}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Cost Calculations & Authentic Breakdown */}
              <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Ticket Subtotal</span>
                  <span className="text-white font-medium">{formatPrice(rawSubtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Promo ({appliedCoupon?.code})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                {/* Convenience Fee (Demo Waiver) */}
                <div className="border border-white/5 rounded-xl p-2.5 bg-[#1C1F2B]">
                  <div
                    onClick={() => setShowFeeDetails(!showFeeDetails)}
                    className="flex justify-between items-center text-slate-300 cursor-pointer"
                  >
                    <span className="flex items-center gap-1">
                      <span>Convenience Fees (Demo Waiver)</span>
                      {showFeeDetails ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                    </span>
                    <span className="text-emerald-400 font-medium">₹0.00</span>
                  </div>

                  {showFeeDetails && (
                    <div className="pt-2 mt-2 border-t border-white/10 space-y-1 text-[11px] text-slate-400">
                      <div className="flex justify-between">
                        <span>Platform & Service Fee (Demo)</span>
                        <span>₹0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Integrated GST (0%)</span>
                        <span>₹0.00</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* BookASmile Demo Notice */}
                <div className="p-3 rounded-xl border border-white/10 bg-[#1C1F2B] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="cursor-pointer text-xs">
                      <div className="font-semibold text-white flex items-center gap-1">
                        <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                        <span>BookASmile Community Initiative</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        (Demo charity support • No extra charges added)
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 shrink-0">
                    ₹0.00
                  </span>
                </div>

                {/* Final Total Amount */}
                <div className="pt-3 border-t border-white/15 flex justify-between items-center">
                  <span className="font-bold text-sm text-white">{t.checkout.totalPayable}</span>
                  <span className="text-2xl font-black text-blue-400 tracking-tight">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#1C1F2B] border border-white/10 text-[11px] text-slate-400 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Instant confirmation & digital barcode pass issued upon checkout.</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* 5. ROBUST SECURE SANDBOX CHECKOUT MODAL (FALLBACK & TEST GATEWAY) */}
      {showPaymentModal && paymentOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-[#14161F] border border-blue-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-slate-100 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-white tracking-tight">
                    Secure Sandbox Checkout
                  </h3>
                  <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Razorpay Mock Mode • Instant Verification</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCompletePayment('decline')}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Cancel simulated payment"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Order Details Preview */}
            <div className="p-4 rounded-2xl bg-[#1C1F2B] border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Order ID:</span>
                <span className="font-mono text-white font-bold">{paymentOrder.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Booking Reference:</span>
                <span className="font-mono text-blue-400 font-bold">{paymentOrder.bookingRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Selected Seats:</span>
                <span className="font-mono text-white">{activeBooking.seats.map(s => s.id).join(', ')}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10 text-sm">
                <span className="text-white font-bold">Total Payable:</span>
                <span className="font-black text-emerald-400 text-base">{formatPrice(paymentOrder.amount || totalAmount)}</span>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-[#1C1F2B] rounded-2xl border border-white/5">
              <button
                type="button"
                onClick={() => setSandboxTab('upi')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  sandboxTab === 'upi'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>UPI / QR</span>
              </button>
              <button
                type="button"
                onClick={() => setSandboxTab('card')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  sandboxTab === 'card'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Test Card</span>
              </button>
              <button
                type="button"
                onClick={() => setSandboxTab('netbanking')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  sandboxTab === 'netbanking'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>NetBanking</span>
              </button>
            </div>

            {/* TAB 1: UPI & LIVE MOCK QR CODE */}
            {sandboxTab === 'upi' && (
              <div className="space-y-4">
                <div className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-inner max-w-[210px] mx-auto border-2 border-slate-200">
                  {mockQrUrl ? (
                    <img src={mockQrUrl} alt="UPI QR Code" className="w-44 h-44 rounded-lg object-contain" />
                  ) : (
                    <div className="w-44 h-44 flex flex-col items-center justify-center text-slate-400">
                      <QrCode className="w-10 h-10 animate-pulse text-blue-600 mb-2" />
                      <span className="text-[10px] text-slate-500">Generating QR...</span>
                    </div>
                  )}
                  <span className="text-[10px] text-slate-800 font-bold uppercase tracking-wider mt-1 text-center">
                    Scan with any UPI App
                  </span>
                </div>

                {/* Virtual UPI ID display with Copy & Edit */}
                <div className="p-3 rounded-xl bg-[#1C1F2B] border border-white/10 flex items-center justify-between text-xs gap-3">
                  <div className="flex-1">
                    <label className="text-[10px] text-slate-400 block mb-1">Simulated VPA / UPI ID</label>
                    <input
                      type="text"
                      value={simulatedUpiId}
                      onChange={(e) => setSimulatedUpiId(e.target.value)}
                      className="w-full bg-transparent font-mono font-bold text-white outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(simulatedUpiId);
                      setCopiedUpi(true);
                      setTimeout(() => setCopiedUpi(false), 2000);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                  >
                    {copiedUpi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Instant 1-Click UPI Payment Button */}
                <button
                  type="button"
                  disabled={isVerifying}
                  onClick={() => handleCompletePayment('success', 'upi')}
                  className="w-full p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-sm transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-white" />
                      <span>Pay via UPI App (Simulated)</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB 2: TEST CARD */}
            {sandboxTab === 'card' && (
              <div className="space-y-4">
                {/* Visual Card Preview */}
                <div className="p-5 rounded-2xl bg-gradient-to-tr from-slate-900 via-blue-950 to-slate-900 border border-blue-500/30 shadow-xl relative overflow-hidden text-white space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-blue-300">Test Debit / Credit Card</span>
                    <span className="text-xs font-black tracking-wider text-amber-400">VISA</span>
                  </div>
                  <div className="w-9 h-7 rounded-md bg-amber-400/80 border border-amber-300 flex items-center justify-center">
                    <div className="w-6 h-4 border border-amber-600/60 rounded-xs" />
                  </div>
                  <div className="font-mono text-base tracking-widest font-bold text-slate-100">
                    {testCardNumber || '4111 2222 3333 4444'}
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-300 pt-1">
                    <div>
                      <span className="text-[9px] uppercase text-slate-400 block">Cardholder</span>
                      <span className="font-semibold">{testCardName || customerName || 'Alex Rivera'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-slate-400 block">Expires</span>
                      <span className="font-semibold">{testCardExpiry || '12/28'}</span>
                    </div>
                  </div>
                </div>

                {/* Pre-filled Editable Form Inputs */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="col-span-2">
                    <label className="text-[11px] text-slate-400 block mb-1">Card Number (Pre-filled Dummy)</label>
                    <input
                      type="text"
                      value={testCardNumber}
                      onChange={(e) => setTestCardNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1F2B] border border-white/10 font-mono text-white text-xs outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-[11px] text-slate-400 block mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={testCardName}
                      onChange={(e) => setTestCardName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1F2B] border border-white/10 text-white text-xs outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 col-span-2 sm:col-span-1">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Expiry</label>
                      <input
                        type="text"
                        value={testCardExpiry}
                        onChange={(e) => setTestCardExpiry(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1F2B] border border-white/10 font-mono text-white text-xs outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={testCardCvv}
                        onChange={(e) => setTestCardCvv(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1F2B] border border-white/10 font-mono text-white text-xs outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Instant 1-Click Card Payment Button */}
                <button
                  type="button"
                  disabled={isVerifying}
                  onClick={() => handleCompletePayment('success', 'card')}
                  className="w-full p-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Simulate Success (1-Click)</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB 3: NETBANKING */}
            {sandboxTab === 'netbanking' && (
              <div className="space-y-4">
                <span className="text-xs text-slate-400 block">
                  Select your bank to simulate authorization:
                </span>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'HDFC', name: 'HDFC Bank' },
                    { id: 'ICICI', name: 'ICICI Bank' },
                    { id: 'SBI', name: 'State Bank of India (SBI)' },
                    { id: 'AXIS', name: 'Axis Bank' },
                    { id: 'KOTAK', name: 'Kotak Mahindra Bank' }
                  ].map(b => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBank(b.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        selectedBank === b.id
                          ? 'bg-purple-600/20 border-purple-500 text-white shadow-md'
                          : 'bg-[#1C1F2B] border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-bold">{b.name}</span>
                      {selectedBank === b.id && <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                    </button>
                  ))}
                </div>

                {/* Instant NetBanking Success Button */}
                <button
                  type="button"
                  disabled={isVerifying}
                  onClick={() => handleCompletePayment('success', 'netbanking')}
                  className="w-full p-4 rounded-2xl bg-purple-600 hover:bg-purple-500 active:scale-[0.98] text-white font-bold text-sm transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Building2 className="w-4 h-4" />
                      <span>Authorize via {selectedBank} (Simulate Success)</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Secondary Action: Cancel / Decline */}
            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              <button
                type="button"
                disabled={isVerifying}
                onClick={() => handleCompletePayment('decline')}
                className="w-full py-2.5 rounded-xl border border-white/10 hover:border-rose-500/30 bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Simulate Payment Declined / Cancel
              </button>
              <p className="text-[10px] text-slate-400 text-center">
                Sandbox Mode: Backend updates seat status to BOOKED and persists transaction.
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
