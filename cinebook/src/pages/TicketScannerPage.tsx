import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Scan,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Camera,
  CheckCircle2,
  RefreshCw,
  Search,
  Ticket,
  Clock,
  MapPin,
  Film,
  UserCheck,
  ChevronLeft
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { verifyTicketGateApi, getRecentTicketScansApi } from '../services/api';

interface ValidationResult {
  success: boolean;
  valid: boolean;
  alreadyCheckedIn?: boolean;
  checkedInAt?: string;
  booking?: any;
  message: string;
}

export const TicketScannerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRef = searchParams.get('ref') || '';

  const [bookingRefInput, setBookingRefInput] = useState(initialRef);
  const [isScanning, setIsScanning] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [scanResult, setScanResult] = useState<ValidationResult | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [recentScans, setRecentScans] = useState<any[]>([]);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'reader-qr-camera-element';

  // Sound effects using Web Audio API
  const playSound = (type: 'success' | 'warning' | 'error') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        // High upbeat dual chime
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'warning') {
        // Double pulse warning
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(330, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else {
        // Error buzzer
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch {
      // AudioContext not allowed or muted
    }
  };

  // Perform backend ticket verification
  const verifyTicket = async (queryPayload: { qrData?: string; bookingRef?: string }) => {
    setIsValidating(true);
    setScanResult(null);

    try {
      const data = await verifyTicketGateApi({
        ...queryPayload,
        scannedBy: 'Gate Scanner Terminal #1'
      });
      setScanResult(data as ValidationResult);

      if (data.valid && !data.alreadyCheckedIn) {
        playSound('success');
        if (data.booking) {
          setRecentScans(prev => [data.booking, ...prev.slice(0, 9)]);
        }
      } else if (data.alreadyCheckedIn) {
        playSound('warning');
      } else {
        playSound('error');
      }
    } catch (err: any) {
      playSound('error');
      setScanResult({
        success: false,
        valid: false,
        message: err.message || 'Unable to connect to cinema gate verification service.'
      });
    } finally {
      setIsValidating(false);
    }
  };

  // Start Camera QR Scanner
  const startCamera = async () => {
    setCameraError(null);
    try {
      const qrScanner = new Html5Qrcode(scannerContainerId);
      html5QrCodeRef.current = qrScanner;

      await qrScanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          // Found QR Code
          stopCamera();
          verifyTicket({ qrData: decodedText });
        },
        () => {
          // ignore scan frame ticks
        }
      );

      setIsScanning(true);
    } catch (err: any) {
      console.warn('Camera startup warning:', err);
      setCameraError(
        'Camera permission was denied or no video capture device was found. You can test admission by entering the booking reference below.'
      );
      setIsScanning(false);
    }
  };

  // Stop Camera
  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch {
        // ignore
      }
      html5QrCodeRef.current = null;
    }
    setIsScanning(false);
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  // If URL has ref parameter on load, verify immediately
  useEffect(() => {
    if (initialRef) {
      verifyTicket({ bookingRef: initialRef });
    }
  }, [initialRef]);

  // Load recent scans
  useEffect(() => {
    getRecentTicketScansApi()
      .then(d => {
        if (d.success && d.scans) {
          setRecentScans(d.scans);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen pb-20 bg-slate-50 dark:bg-[#090A0F] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* 1. TOP HEADER */}
      <div className="border-b border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0E1017]/90 backdrop-blur-md sticky top-18 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#14161F] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Return home"
            >
              <ChevronLeft className="w-5 h-5 text-blue-500" />
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <span>Cinema M-Ticket Gate Scanner</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                  LIVE GATE TERMINAL
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Turnstile admission & replay prevention scanner</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => verifyTicket({ bookingRef: 'BMS-849204-KL' })}
              className="px-3 py-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-300 text-xs font-semibold transition-all cursor-pointer hidden sm:inline-flex items-center gap-1.5"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Test Sample Pass (BMS-849204-KL)</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* SCANNER CONTAINER & CONTROLS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 7 COLS: Optical Camera & Manual Input */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Camera Viewport */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#14161F] shadow-xl text-center space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-2 text-left">
                  <Camera className="w-5 h-5 text-blue-500" />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Camera QR Scanner</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Point phone screen at optical reader</p>
                  </div>
                </div>

                {isScanning ? (
                  <button
                    onClick={stopCamera}
                    className="px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition-colors cursor-pointer"
                  >
                    Stop Camera
                  </button>
                ) : (
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 cursor-pointer flex items-center gap-1.5"
                  >
                    <Scan className="w-4 h-4" />
                    <span>Start Camera</span>
                  </button>
                )}
              </div>

              {/* Video Preview Box */}
              <div className="relative w-full aspect-video sm:aspect-square max-h-[320px] rounded-2xl bg-[#090A0F] border border-white/10 overflow-hidden flex items-center justify-center">
                <div id={scannerContainerId} className="w-full h-full" />

                {!isScanning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-[#090A0F]/80">
                    <div className="p-4 rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-400">
                      <Scan className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Camera Standby</div>
                      <p className="text-xs text-slate-400 max-w-xs mt-1">
                        Tap "Start Camera" to scan tickets with your device camera, or use the manual reference search below.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {cameraError && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-left flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{cameraError}</span>
                </div>
              )}
            </div>

            {/* Manual Reference Code Input */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#14161F] shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Manual Reference Validation</h3>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (bookingRefInput.trim()) {
                    verifyTicket({ bookingRef: bookingRefInput.trim() });
                  }
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={bookingRefInput}
                  onChange={(e) => setBookingRefInput(e.target.value.toUpperCase())}
                  placeholder="Enter reference e.g. BMS-849204-KL..."
                  className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-[#1C1F2B] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 font-mono text-sm tracking-wider uppercase focus:border-blue-500 outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={isValidating || !bookingRefInput.trim()}
                  className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30 cursor-pointer flex items-center gap-2"
                >
                  {isValidating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Validate</span>
                  )}
                </button>
              </form>

              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>Quick Test References:</span>
                <button
                  type="button"
                  onClick={() => {
                    setBookingRefInput('BMS-849204-KL');
                    verifyTicket({ bookingRef: 'BMS-849204-KL' });
                  }}
                  className="text-blue-500 hover:underline font-mono cursor-pointer"
                >
                  BMS-849204-KL
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT 5 COLS: Verification Verdict Card */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Status Feedback Banner */}
            {scanResult ? (
              <div
                className={`p-6 rounded-3xl border shadow-2xl space-y-5 transition-all animate-fadeIn ${
                  scanResult.valid && !scanResult.alreadyCheckedIn
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-100'
                    : scanResult.alreadyCheckedIn
                    ? 'bg-amber-950/30 border-amber-500/50 text-amber-100'
                    : 'bg-rose-950/30 border-rose-500/50 text-rose-100'
                }`}
              >
                {/* Result Header Badge */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                      scanResult.valid && !scanResult.alreadyCheckedIn
                        ? 'bg-emerald-500 text-white'
                        : scanResult.alreadyCheckedIn
                        ? 'bg-amber-500 text-white'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {scanResult.valid && !scanResult.alreadyCheckedIn ? (
                      <CheckCircle2 className="w-7 h-7" />
                    ) : scanResult.alreadyCheckedIn ? (
                      <AlertTriangle className="w-7 h-7" />
                    ) : (
                      <XCircle className="w-7 h-7" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-lg tracking-tight">
                      {scanResult.valid && !scanResult.alreadyCheckedIn
                        ? 'ADMISSION GRANTED'
                        : scanResult.alreadyCheckedIn
                        ? 'ALREADY CHECKED IN'
                        : 'ADMISSION REJECTED'}
                    </h3>
                    <p className="text-xs opacity-80">{scanResult.message}</p>
                  </div>
                </div>

                {/* Booking details if available */}
                {scanResult.booking && (
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="text-slate-400">Reference:</span>
                      <span className="font-mono font-bold text-white text-sm">
                        {scanResult.booking.bookingRef}
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <Film className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-white">
                          {scanResult.booking.showtime?.movie?.title || scanResult.booking.movieTitle}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                          <span>{scanResult.booking.showtime?.screen?.theatre?.name || scanResult.booking.cinemaName} • {scanResult.booking.showtime?.screen?.name || scanResult.booking.hall}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-400">Reserved Seats:</span>
                      <span className="font-mono font-bold text-emerald-400 text-sm">
                        {scanResult.booking.seatIds || (scanResult.booking.seats || []).map((s: any) => s.id || s).join(', ')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-400">Ticket Holder:</span>
                      <span className="font-semibold text-white">
                        {scanResult.booking.customerName || scanResult.booking.customer?.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-400">Showtime:</span>
                      <span className="text-white flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        {scanResult.booking.showtime?.date || scanResult.booking.date} at {scanResult.booking.showtime?.time || scanResult.booking.time}
                      </span>
                    </div>

                    {scanResult.checkedInAt && (
                      <div className="pt-2 border-t border-white/10 text-[11px] text-amber-300 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Verified at: {new Date(scanResult.checkedInAt).toLocaleTimeString()}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#14161F] text-center space-y-3 shadow-xl">
                <ShieldCheck className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Ready for Scanning</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Scan customer mobile QR pass or enter reference code to verify authenticity and admission status.
                </p>
              </div>
            )}

            {/* Recent Scans Activity Log */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#14161F] shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                  Recent Gate Admissions
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">Terminal #1</span>
              </div>

              {recentScans.length > 0 ? (
                <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                  {recentScans.map((b, idx) => (
                    <div
                      key={b.id || idx}
                      className="p-3 rounded-xl bg-slate-100 dark:bg-[#1C1F2B] border border-slate-200 dark:border-white/5 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-bold text-slate-900 dark:text-white truncate">
                          {b.customerName || b.customer?.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {b.showtime?.movie?.title || b.movieTitle} • Seats: <span className="text-emerald-600 dark:text-emerald-400 font-mono">{b.seatIds}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold shrink-0">
                        CHECKED IN
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic text-center py-4">
                  No tickets checked in during this session yet.
                </div>
              )}
            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default TicketScannerPage;
