import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  Clock,
  Calendar,
  MapPin,
  Ticket,
  ChevronLeft,
  ChevronRight,
  Tv,
  Users,
  CheckCircle2,
  Film,
  Heart,
  Globe,
  MessageSquare,
  Send,
  Sparkles,
  Play,
  X,
  ThumbsUp,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { MOVIES, SHOWTIMES_SCHEDULE, getCinemasForCity } from '../data/mockData';
import { useBooking } from '../context/BookingContext';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import type { Cinema, Review } from '../types';
import {
  getMovieReviewsApi,
  submitMovieReviewApi,
  getFavoritesApi,
  toggleFavoriteApi,
  resolveShowtimeApi
} from '../services/api';
import { formatToISODate, generateCanonicalShowtimeId } from '../utils/dateUtils';
import { useMovieBackdropColor } from '../hooks/useMovieBackdropColor';
import { use3DTilt } from '../hooks/use3DTilt';

const RATING_DESCRIPTIONS: Record<number, string> = {
  1: 'Disappointing (1/10)',
  2: 'Poor (2/10)',
  3: 'Weak (3/10)',
  4: 'Below Average (4/10)',
  5: 'Average (5/10)',
  6: 'Decent (6/10)',
  7: 'Good (7/10)',
  8: 'Great (8/10)',
  9: 'Excellent (9/10)',
  10: 'Masterpiece (10/10)'
};

export const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentCity, setActiveMovieAndShowtime } = useBooking();
  const { t, formatTime, isRTL } = useTranslation();
  const { user } = useAuth();

  const cityCinemas = useMemo(() => getCinemasForCity(currentCity), [currentCity]);

  const movie = useMemo(() => {
    return MOVIES.find(m => m.id === id) || null;
  }, [id]);

  // Dynamic movie-adaptive color extraction
  const { colors } = useMovieBackdropColor(movie);

  // 3D Perspective Tilt on Movie Poster Card
  const {
    cardRef: posterCardRef,
    glareRef: posterGlareRef,
    onMouseMove: onPosterMouseMove,
    onMouseEnter: onPosterMouseEnter,
    onMouseLeave: onPosterMouseLeave,
    onFocus: onPosterFocus,
    onBlur: onPosterBlur,
  } = use3DTilt({
    maxTiltDeg: 6,
    perspective: 1000,
    scale: 1.025,
    glare: true,
    returnSpeed: 450,
  });

  // Parallax depth on hero backdrop (automatically disabled on mobile / touch / prefers-reduced-motion)
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    if (isTouch || prefersReduced || isMobile) {
      return;
    }

    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        const currentY = window.scrollY;
        if (currentY <= 700) {
          setScrollY(currentY);
        }
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Generate rolling dates for upcoming week (All scheduled dates have active shows)
  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 8; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const isoDate = formatToISODate(d);
      dates.push({
        id: isoDate,
        label: `${dayName}, ${monthDay}`,
        dayName,
        monthDay,
        hasShows: true
      });
    }
    return dates;
  }, []);

  const [selectedDate, setSelectedDate] = useState(availableDates[0].id);
  const [isResolvingShow, setIsResolvingShow] = useState(false);
  const [selectedCinema, setSelectedCinema] = useState<Cinema>(() => cityCinemas[0]);
  const [selectedShowtimeItem, setSelectedShowtimeItem] = useState(SHOWTIMES_SCHEDULE[1]); // Default 01:45 PM
  const [selectedAudioLanguage, setSelectedAudioLanguage] = useState<string>(movie?.language || 'Hindi');

  // Sync cinema when city changes
  useEffect(() => {
    if (cityCinemas.length > 0) {
      setSelectedCinema(cityCinemas[0]);
    }
  }, [cityCinemas]);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewRating, setReviewRating] = useState<number>(9);
  const [reviewHoverRating, setReviewHoverRating] = useState<number | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewName, setReviewName] = useState(user?.name || 'Cinema Enthusiast');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewFeedback, setReviewFeedback] = useState<string | null>(null);
  const [reviewFeedbackType, setReviewFeedbackType] = useState<'success' | 'error' | null>(null);

  // Dynamic movie rating & vote count updated live upon submission
  const [dynamicRating, setDynamicRating] = useState<number | null>(null);
  const [dynamicVotesCount, setDynamicVotesCount] = useState<string | null>(null);

  // Compute live average rating from reviews array or dynamic rating
  const averageRating = useMemo(() => {
    if (dynamicRating !== null) return dynamicRating;
    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
      return Math.round((sum / reviews.length) * 10) / 10;
    }
    return movie?.rating ?? 8.5;
  }, [dynamicRating, reviews, movie]);

  // Display votes count string
  const displayVotesCount = useMemo(() => {
    if (dynamicVotesCount) return dynamicVotesCount;
    if (reviews.length > 0) return `${reviews.length} reviews`;
    return movie?.votesCount || '0 reviews';
  }, [dynamicVotesCount, reviews.length, movie]);

  // Positive recommendation rate (% of reviews >= 7)
  const recommendationRate = useMemo(() => {
    if (reviews.length === 0) return 92;
    const positive = reviews.filter(r => r.rating >= 7).length;
    return Math.round((positive / reviews.length) * 100);
  }, [reviews]);

  // Auto-fill reviewer name if user signs in
  useEffect(() => {
    if (user?.name) {
      setReviewName(user.name);
    }
  }, [user?.name]);

  // Watchlist state
  const [isFavorite, setIsFavorite] = useState(false);

  // Trailer Modal & Cast Carousel
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const castScrollRef = useRef<HTMLDivElement>(null);

  const scrollCast = (direction: 'left' | 'right') => {
    if (castScrollRef.current) {
      const offset = direction === 'left' ? -350 : 350;
      castScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Close trailer modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowTrailerModal(false);
    };
    if (showTrailerModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showTrailerModal]);

  // Load reviews & favorite status
  useEffect(() => {
    if (!id) return;

    // Fetch reviews from API
    getMovieReviewsApi(id)
      .then(res => {
        if (res.success && res.reviews) {
          setReviews(res.reviews);
          if (res.movieRating !== undefined) {
            setDynamicRating(res.movieRating);
          }
          if (res.votesCount) {
            setDynamicVotesCount(res.votesCount);
          }
        }
      })
      .catch(() => {
        // Fallback reviews
        setReviews([
          {
            id: 'rev-default-1',
            movieId: id,
            userName: 'Rahul S.',
            rating: 9.5,
            comment: 'Stunning visual masterpiece! The sound engineering in IMAX was breathtaking.',
            createdAt: '2 hours ago'
          },
          {
            id: 'rev-default-2',
            movieId: id,
            userName: 'Priya M.',
            rating: 9.0,
            comment: 'Top-tier performances and stellar direction. Must watch in cinemas!',
            createdAt: 'Yesterday'
          }
        ]);
      });

    // Check favorite status
    const currentUser = user?.email || 'demo@cinebook.com';
    getFavoritesApi(currentUser)
      .then(res => {
        if (res.success && res.favorites) {
          setIsFavorite(res.favorites.includes(id));
        }
      })
      .catch(() => {});
  }, [id, user?.email]);

  const handleToggleFavorite = async () => {
    if (!id) return;
    const currentUser = user?.email || 'demo@cinebook.com';
    try {
      const res = await toggleFavoriteApi(currentUser, id);
      if (res.success) {
        setIsFavorite(res.isFavorite);
      }
    } catch {
      setIsFavorite(prev => !prev);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!reviewComment.trim()) {
      setReviewFeedback('Please write a comment sharing your thoughts on the movie.');
      setReviewFeedbackType('error');
      return;
    }

    if (reviewRating < 1 || reviewRating > 10) {
      setReviewFeedback('Rating must be between 1 and 10 stars.');
      setReviewFeedbackType('error');
      return;
    }

    setIsSubmittingReview(true);
    setReviewFeedback(null);
    setReviewFeedbackType(null);

    try {
      const res = await submitMovieReviewApi(id, {
        userName: reviewName.trim() || user?.name || 'Verified Moviegoer',
        rating: reviewRating,
        comment: reviewComment.trim(),
        userEmail: user?.email
      });

      if (res.success && res.review) {
        setReviews(prev => [res.review, ...prev]);
        if (res.movieRating !== undefined) {
          setDynamicRating(res.movieRating);
        }
        if (res.votesCount) {
          setDynamicVotesCount(res.votesCount);
        }
        setReviewComment('');
        setReviewFeedback('Thank you! Your verified rating and review have been published.');
        setReviewFeedbackType('success');
      } else {
        setReviewFeedback(res.message || 'Failed to submit review.');
        setReviewFeedbackType('error');
      }
    } catch (err: unknown) {
      setReviewFeedback((err as Error).message || 'Failed to submit review.');
      setReviewFeedbackType('error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (!movie) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <Film className="w-16 h-16 text-slate-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Movie Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">The requested movie could not be found or has concluded its run.</p>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400"
        >
          {t.nav.movies}
        </Link>
      </div>
    );
  }

  const handleProceedToSeats = async () => {
    setIsResolvingShow(true);
    try {
      // Determine target ISO date
      const dateObj = availableDates.find(d => d.id === selectedDate || d.label === selectedDate);
      const targetIsoDate = dateObj ? dateObj.id : (selectedDate.match(/^\d{4}-\d{2}-\d{2}$/) ? selectedDate : formatToISODate(new Date()));

      let showtimeId = generateCanonicalShowtimeId(movie.id, selectedCinema.id, targetIsoDate, selectedShowtimeItem.time);

      try {
        const resolved = await resolveShowtimeApi({
          requestedId: showtimeId,
          movieId: movie.id,
          movieTitle: movie.title,
          cinemaId: selectedCinema.id,
          cinemaName: selectedCinema.name,
          city: currentCity,
          address: selectedCinema.address,
          date: targetIsoDate,
          time: selectedShowtimeItem.time,
          format: selectedShowtimeItem.format,
          hall: selectedShowtimeItem.hall,
          language: selectedAudioLanguage
        });
        if (resolved && resolved.showtimeId) {
          showtimeId = resolved.showtimeId;
        }
      } catch (resolveErr) {
        console.warn('Could not resolve showtime via backend API, using structured ID:', resolveErr);
      }

      setActiveMovieAndShowtime(movie, {
        cinema: selectedCinema,
        date: targetIsoDate,
        time: selectedShowtimeItem.time,
        format: selectedShowtimeItem.format,
        hall: selectedShowtimeItem.hall,
        language: selectedAudioLanguage,
        showtimeId
      });
      navigate(`/seat-selection?showtimeId=${encodeURIComponent(showtimeId)}`);
    } finally {
      setIsResolvingShow(false);
    }
  };

  return (
    <div className={`min-h-screen pb-20 bg-[var(--cinema-bg-base)] text-slate-900 dark:text-slate-100 ${isRTL ? 'rtl' : 'ltr'}`}>
      
      {/* 1. CINEMATIC HERO SECTION WITH DYNAMIC PARALLAX & AMBIENT BACKDROP */}
      <section className="relative w-full overflow-hidden border-b border-slate-200/60 dark:border-white/10 pt-4 sm:pt-6 pb-10 sm:pb-14 transition-colors duration-500">
        
        {/* Layer A: Authentic Movie Backdrop with Parallax Depth & Multi-Layer Gradients */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0" aria-hidden="true">
          
          {/* A1. High-Resolution Cinematic Backdrop Image with Subtle Parallax Depth */}
          <div
            className="absolute -top-12 -bottom-12 -left-4 -right-4 transition-transform duration-100 ease-out transform-gpu"
            style={{
              transform: scrollY > 0 ? `translate3d(0, ${Math.round(scrollY * 0.22)}px, 0)` : 'none',
              willChange: scrollY > 0 ? 'transform' : 'auto',
            }}
          >
            <img
              src={movie.backdropUrl || movie.posterUrl}
              alt=""
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover object-top md:object-[center_20%] opacity-30 dark:opacity-50 brightness-95 dark:brightness-85 contrast-105 saturate-125 filter blur-[0.5px] scale-105"
            />
          </div>

          {/* A2. Dynamic Movie-Adaptive Ambient Mesh Spotlight */}
          <div
            className="absolute inset-0 opacity-60 dark:opacity-85 transition-all duration-700 transform-gpu"
            style={{
              background:
                colors?.meshGradient ||
                `radial-gradient(ellipse 90% 60% at 50% -10%, ${colors?.glow || 'rgba(59, 130, 246, 0.25)'} 0%, transparent 75%)`,
            }}
          />

          {/* A3. Off-Axis Secondary Atmospheric Aura */}
          <div
            className="absolute -top-24 -right-24 w-[32rem] h-[32rem] rounded-full blur-[120px] opacity-25 dark:opacity-40 transition-all duration-700 pointer-events-none"
            style={{
              backgroundColor: colors?.secondary || '#8B5CF6',
            }}
          />

          {/* A4. Directional Horizontal Fade (Guarantees 100% WCAG AAA Text Contrast in Both Dark & Light) */}
          <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[var(--cinema-bg-base)] via-[var(--cinema-bg-base)]/90 via-55% to-transparent" />
          
          {/* Mobile Overlay: Solid contrast gradient for compact viewports */}
          <div className="md:hidden absolute inset-0 bg-gradient-to-b from-[var(--cinema-bg-base)]/80 via-[var(--cinema-bg-base)]/95 to-[var(--cinema-bg-base)]" />

          {/* A5. Top and Bottom Seamless Vignettes */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[var(--cinema-bg-base)]/90 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[var(--cinema-bg-base)] via-[var(--cinema-bg-base)]/80 to-transparent" />
        </div>

        {/* Layer B: Main Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Navigation & Action Row */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl backdrop-blur-md bg-white/80 dark:bg-[#1C1F2B]/90 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:border-blue-500/50 transition-all shadow-sm cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              <span>{t.nav.movies}</span>
            </Link>

            <button
              onClick={() => setShowTrailerModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md bg-blue-600/90 hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-600/25 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
              style={{
                boxShadow: `0 8px 24px -4px ${colors.glow}`,
              }}
            >
              <Play className="w-3.5 h-3.5 fill-white text-white" />
              <span>Watch Trailer</span>
            </button>
          </div>

          {/* Movie Presentation Grid (3D Poster + Details Column) */}
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
            
            {/* Left: 3D Perspective Tilt Movie Poster Card */}
            <div className="perspective-1000 w-52 sm:w-64 lg:w-72 shrink-0 mx-auto md:mx-0 relative select-none">
              
              {/* Dynamic Back-Glow Halo matching movie ambient palette */}
              <div
                className="absolute -inset-3 rounded-3xl opacity-35 dark:opacity-50 blur-2xl transition-all duration-700 pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${colors.primary} 0%, ${colors.glow} 50%, transparent 80%)`,
                }}
                aria-hidden="true"
              />

              {/* 3D Tilt Card */}
              <div
                ref={posterCardRef}
                onMouseMove={onPosterMouseMove}
                onMouseEnter={onPosterMouseEnter}
                onMouseLeave={onPosterMouseLeave}
                onFocus={onPosterFocus}
                onBlur={onPosterBlur}
                className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-200 dark:border-white/15 bg-white dark:bg-[#14161F] group cursor-pointer preserve-3d transition-colors duration-300"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  loading="eager"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Subtle Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity pointer-events-none" />

                {/* Specular Glare Reflection */}
                <div
                  ref={posterGlareRef}
                  className="absolute inset-0 pointer-events-none opacity-0 z-20 transition-opacity"
                  aria-hidden="true"
                />

                {/* Play Trailer Overlay on Poster */}
                <button
                  onClick={() => setShowTrailerModal(true)}
                  className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer backdrop-blur-[2px] z-20"
                  title="Watch Official Trailer"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-600/50 group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-white text-white ml-0.5" />
                  </div>
                </button>

                {/* Watchlist toggle overlay */}
                <button
                  onClick={handleToggleFavorite}
                  className={`absolute top-3 right-3 z-30 p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-lg ${
                    isFavorite
                      ? 'bg-rose-500 text-white'
                      : 'bg-black/70 text-slate-200 hover:text-rose-400 hover:bg-black/90'
                  }`}
                  style={{ transform: 'translateZ(24px)' }}
                  title={isFavorite ? 'Remove from Watchlist' : 'Add to Watchlist'}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Right: Details Column with Adaptive Dark/Light Typography */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-blue-600 text-white shadow-sm">
                  {movie.status === 'now_showing' ? t.nav.nowShowing : t.nav.comingSoon}
                </span>
                <span className="px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-white dark:bg-[#1C1F2B] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 shadow-sm dark:shadow-none">
                  {movie.ageRating}
                </span>
                <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20">
                  Original: {movie.language}
                </span>
              </div>

              {/* Audio Dub Language Selector */}
              {movie.languages && movie.languages.length > 0 && (
                <div className="pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                    Available Audio Tracks ({movie.languages.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                    {movie.languages.map(lang => (
                      <button
                        key={lang}
                        onClick={() => setSelectedAudioLanguage(lang)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          selectedAudioLanguage === lang
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 scale-102 font-bold'
                            : 'bg-white dark:bg-[#1C1F2B] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-700 shadow-sm dark:shadow-none'
                        }`}
                      >
                        {lang} {lang === movie.language && '(Original)'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Movie Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {movie.title}
              </h1>

              {/* Tagline */}
              <p className="text-base text-blue-600 dark:text-blue-300 font-semibold italic">
                "{movie.tagline}"
              </p>

              {/* Ratings & Metadata Bar */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm pt-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-500 dark:text-amber-400 bg-white dark:bg-[#14161F] px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                  <Star className="w-4 h-4 fill-amber-500 dark:fill-amber-400 text-amber-500 dark:text-amber-400" />
                  <span>{averageRating.toFixed(1)}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">({displayVotesCount})</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white dark:bg-[#1C1F2B] px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 shadow-sm dark:shadow-none">
                  <Clock className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  <span>{movie.duration}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white dark:bg-[#1C1F2B] px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 shadow-sm dark:shadow-none">
                  <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  <span>Released {movie.releaseDate}</span>
                </div>
                <button
                  onClick={() => setShowTrailerModal(true)}
                  className="flex items-center gap-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-white px-3.5 py-1.5 rounded-xl border border-blue-500/30 text-sm font-semibold transition-colors cursor-pointer shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Watch Trailer</span>
                </button>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                {movie.genre.map(g => (
                  <span
                    key={g}
                    className="px-3.5 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#1C1F2B] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 shadow-sm dark:shadow-none"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Storyline Synopsis */}
              <div className="pt-2">
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-1">
                  {t.movie.synopsis}
                </h3>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-zinc-300 max-w-3xl">
                  {movie.synopsis}
                </p>
              </div>

              {/* Director */}
              <div className="text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-200">Directed by:</span> {movie.director}
              </div>

              {/* Audience Reaction Metrics */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-gradient-to-r dark:from-blue-950/40 dark:via-[#14161F] dark:to-emerald-950/30 border border-slate-200 dark:border-white/10 shadow-lg mt-4 text-left backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-inner">
                      <ThumbsUp className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                          {movie.recommendPercent || 89}%
                        </span>
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          would recommend
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                          ({movie.recommendVotes || '52,400+ votes'})
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Verified audience sentiment from real cinema ticket holders
                      </p>
                    </div>
                  </div>

                  {/* Sentiment tags */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium">
                      🍿 Visual Spectacle
                    </span>
                    <span className="text-[11px] px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium">
                      ⚡ Edge-of-the-seat
                    </span>
                    <span className="text-[11px] px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium">
                      🎶 Stellar BGM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT CONTAINER (Cast, Showtimes & Reviews) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 3. CAST & CREW (Horizontal Scrolling Carousel) */}
        <section className="pt-10 sm:pt-14 pb-8 border-b border-slate-200/60 dark:border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                <span>Cast & Crew</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">({movie.cast.length})</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Actors and technical crew behind the production</p>
            </div>

            {/* Carousel navigation buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollCast('left')}
                className="w-9 h-9 rounded-full bg-white dark:bg-[#1C1F2B] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-blue-500 transition-colors cursor-pointer shadow-sm"
                title="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollCast('right')}
                className="w-9 h-9 rounded-full bg-white dark:bg-[#1C1F2B] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-blue-500 transition-colors cursor-pointer shadow-sm"
                title="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={castScrollRef}
            className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-3"
          >
            {movie.cast.map(c => (
              <div
                key={c.name}
                className="min-w-[170px] sm:min-w-[190px] max-w-[190px] flex flex-col items-center text-center p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#14161F] shadow-sm hover:border-blue-500/40 hover:-translate-y-1 transition-all group shrink-0"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-slate-200 dark:border-white/15 group-hover:border-blue-500 transition-colors shadow-md mb-3">
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate w-full" title={c.name}>
                  {c.name}
                </h4>
                <p className="text-xs text-blue-600 dark:text-blue-400 truncate w-full mt-0.5" title={c.role}>
                  {c.role}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. SHOWTIMES & THEATRE BOOKING PANEL */}
        <section id="showtimes" className="pt-10 sm:pt-14 scroll-mt-24">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Ticket className="w-6 h-6 text-blue-500" />
                <span>Select Cinema & Showtimes</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Showing auditoriums and available sessions in {currentCity}
              </p>
            </div>
          </div>

          {/* Date Picker Bar */}
          <div className="mb-8">
            <label className="block text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider mb-3">
              1. Choose Date:
            </label>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
              {availableDates.map(date => (
                <button
                  key={date.id}
                  onClick={() => setSelectedDate(date.id)}
                  className={`flex flex-col items-center justify-center min-w-[105px] py-3 px-4 rounded-xl border transition-all cursor-pointer ${
                    selectedDate === date.id || selectedDate === date.label
                      ? 'bg-blue-600 text-white font-bold border-blue-400 shadow-md shadow-blue-600/25 scale-102'
                      : 'bg-white dark:bg-[#1C1F2B] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs uppercase tracking-tight">{date.dayName}</span>
                  <span className="text-sm font-black mt-0.5">{date.monthDay}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Personality Empty State if no shows scheduled */}
          {availableDates.find(d => d.id === selectedDate || d.label === selectedDate)?.hasShows === false ? (
            <div className="p-12 text-center rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#14161F] shadow-sm my-6">
              <Calendar className="w-12 h-12 text-blue-500 mx-auto mb-3 opacity-80" />
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">No Screenings Scheduled Yet</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-md mx-auto">
                No screenings scheduled yet for {availableDates.find(d => d.id === selectedDate)?.label || selectedDate}. Check tomorrow's schedule or explore other theatres nearby in {currentCity}!
              </p>
              <button
                onClick={() => setSelectedDate(availableDates[0].id)}
                className="mt-5 px-5 py-2.5 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white cursor-pointer transition-colors shadow-sm"
              >
                Switch to Today's Shows
              </button>
            </div>
          ) : (
            /* Cinema Theatres List */
            <div className="space-y-6">
              <label className="block text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                2. Choose Theatre & Session:
              </label>

              {cityCinemas.map(cinema => (
                <div
                  key={cinema.id}
                  className={`p-6 rounded-2xl border transition-all ${
                    selectedCinema.id === cinema.id
                      ? 'border-blue-500 bg-blue-50/20 dark:bg-[#14161F] shadow-sm'
                      : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#14161F] hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-white/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-base text-slate-900 dark:text-white">{cinema.name}</h4>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#1C1F2B] text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-white/10 font-semibold">
                          {cinema.distance}
                        </span>
                        {/* Cinema Timezone Badge */}
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20 flex items-center gap-1 font-medium">
                          <Globe className="w-2.5 h-2.5" />
                          <span>{cinema.timezone || 'Asia/Kolkata'}</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                        <span>{cinema.address}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedCinema(cinema)}
                      className={`text-xs px-3.5 py-1.5 rounded-xl border font-semibold transition-all cursor-pointer ${
                        selectedCinema.id === cinema.id
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-100 dark:bg-[#1C1F2B] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {selectedCinema.id === cinema.id ? 'Selected Theatre ✓' : 'Select Theatre'}
                    </button>
                  </div>

                  {/* Showtimes for this cinema with Live Urgency & Status Tags */}
                  <div className="pt-4">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tv className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Available Showtimes:</span>
                      </div>
                      <div className="hidden sm:flex items-center gap-3 text-[11px]">
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Available
                        </span>
                        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Fast Filling
                        </span>
                        <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> Almost Full
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {SHOWTIMES_SCHEDULE.map(st => {
                        const isSelected =
                          selectedCinema.id === cinema.id &&
                          selectedShowtimeItem.time === st.time &&
                          selectedShowtimeItem.format === st.format;

                        return (
                          <button
                            key={st.time + st.format}
                            onClick={() => {
                              setSelectedCinema(cinema);
                              setSelectedShowtimeItem(st);
                            }}
                            className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer group ${
                              isSelected
                                ? 'bg-blue-600 text-white font-bold border-blue-400 shadow-md shadow-blue-600/25'
                                : 'bg-slate-50 dark:bg-[#1C1F2B] border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:border-blue-400'
                            }`}
                          >
                            <span className="text-sm font-black tracking-tight">{formatTime(st.time)}</span>
                            
                            <div className="flex items-center gap-1 text-[10px] uppercase font-bold mt-0.5">
                              <span className={isSelected ? 'text-white' : 'text-blue-600 dark:text-blue-400'}>
                                {st.format}
                              </span>
                            </div>

                            <span className={`text-[10px] mt-0.5 truncate max-w-full ${isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                              {st.subtitles}
                            </span>

                            {/* Urgency Status Tag */}
                            <div className="mt-2 pt-2 border-t border-slate-200 dark:border-white/10 w-full flex items-center justify-between">
                              {st.availability === 'fast_filling' ? (
                                <span className={`text-[10px] font-bold ${isSelected ? 'text-amber-200' : 'text-amber-600 dark:text-amber-400'}`}>
                                  Fast Filling
                                </span>
                              ) : st.availability === 'almost_full' ? (
                                <span className={`text-[10px] font-bold ${isSelected ? 'text-orange-200' : 'text-orange-500 dark:text-orange-400'}`}>
                                  Almost Full
                                </span>
                              ) : (
                                <span className={`text-[10px] font-bold ${isSelected ? 'text-emerald-200' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                  Available
                                </span>
                              )}

                              {st.cancellable ? (
                                <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                                  Cancellable
                                </span>
                              ) : (
                                <span className="text-[9px] px-1 py-0.2 rounded bg-slate-500/10 text-slate-500 font-medium">
                                  Non-ref
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sticky/Fixed Booking Action Bar */}
          {availableDates.find(d => d.id === selectedDate || d.label === selectedDate)?.hasShows !== false && (
            <div className="mt-8 p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#14161F] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1.5 justify-center sm:justify-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Ready to choose seats</span>
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {selectedCinema.name} • {availableDates.find(d => d.id === selectedDate)?.label || selectedDate} at {formatTime(selectedShowtimeItem.time)}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Format: <span className="text-blue-600 dark:text-blue-400 font-medium">{selectedShowtimeItem.format}</span> ({selectedShowtimeItem.hall}) • {selectedShowtimeItem.subtitles}
                </div>
              </div>

              <button
                onClick={handleProceedToSeats}
                disabled={isResolvingShow}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isResolvingShow ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Resolving Showtime...</span>
                  </>
                ) : (
                  <>
                    <Ticket className="w-4 h-4 fill-white" />
                    <span>Select Seats</span>
                  </>
                )}
              </button>
            </div>
          )}
        </section>

        {/* 5. AUDIENCE REVIEWS & RATINGS */}
        <section className="mt-14 pt-8 border-t border-slate-200/60 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                <span>{t.movie.reviewsTitle} ({reviews.length})</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Verified cinema audience feedback, genuine critical scores, and community impressions
              </p>
            </div>
          </div>

          {/* Reviews Rating Overview Banner */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-gradient-to-br dark:from-[#14161F] dark:via-[#161925] dark:to-[#1A1D2B] mb-8 shadow-sm dark:shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Average Score */}
              <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/10 pb-4 md:pb-0 md:pr-6">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex flex-col items-center justify-center shadow-md shadow-amber-500/10 shrink-0">
                  <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
                  <span className="font-black text-amber-600 dark:text-amber-400 text-base leading-none mt-1 font-mono">
                    {averageRating.toFixed(1)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 dark:text-white text-base">Audience Score</span>
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                      / 10
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Based on {reviews.length} audience reviews
                  </p>
                </div>
              </div>

              {/* Recommendation Rate */}
              <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/10 pb-4 md:pb-0 md:pr-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex flex-col items-center justify-center shadow-md shadow-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <ThumbsUp className="w-6 h-6" />
                  <span className="font-black text-emerald-600 dark:text-emerald-400 text-base leading-none mt-1 font-mono">
                    {recommendationRate}%
                  </span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white text-base">Recommended</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {recommendationRate}% of viewers rated this film 7 or higher
                  </p>
                </div>
              </div>

              {/* Live Realtime Sync */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex flex-col items-center justify-center shadow-md shadow-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="font-black text-blue-600 dark:text-blue-400 text-[10px] leading-none mt-1 uppercase tracking-wider font-mono">
                    LIVE
                  </span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white text-base">Instant Feedback</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Your rating immediately updates the live movie score
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 5 Cols: Submit Review Form */}
            <div className="lg:col-span-5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#14161F] space-y-5 shadow-sm dark:shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <span>Write a Movie Review</span>
                </h4>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Scale: 1 – 10
                </span>
              </div>

              {reviewFeedback && (
                <div
                  className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs transition-all ${
                    reviewFeedbackType === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-300'
                  }`}
                >
                  {reviewFeedbackType === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                  <span>{reviewFeedback}</span>
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1C1F2B] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-200 text-xs outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Interactive 1 to 10 Star Rating Selector */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Rating (1 to 10 Stars)
                    </label>
                    <span className="font-bold text-amber-500 dark:text-amber-400 text-xs px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 font-mono">
                      ★ {(reviewHoverRating ?? reviewRating).toFixed(1)} / 10
                    </span>
                  </div>

                  {/* 10 Interactive Star Buttons */}
                  <div className="grid grid-cols-10 gap-1 p-2 rounded-xl bg-slate-50 dark:bg-[#1C1F2B] border border-slate-200 dark:border-white/10">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((starVal) => {
                      const activeScore = reviewHoverRating ?? reviewRating;
                      const isHighlighted = starVal <= activeScore;
                      return (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => setReviewRating(starVal)}
                          onMouseEnter={() => setReviewHoverRating(starVal)}
                          onMouseLeave={() => setReviewHoverRating(null)}
                          className={`py-2 px-0.5 flex flex-col items-center justify-center rounded-lg transition-all duration-150 cursor-pointer ${
                            isHighlighted
                              ? 'bg-amber-400/20 text-amber-500 dark:text-amber-400 scale-105 shadow-sm shadow-amber-400/10'
                              : 'text-slate-400 dark:text-slate-600 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
                          }`}
                          title={`${starVal}/10: ${RATING_DESCRIPTIONS[starVal]}`}
                        >
                          <Star
                            className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform ${
                              isHighlighted
                                ? 'fill-amber-400 text-amber-500 dark:text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                                : 'text-slate-400 dark:text-slate-600'
                            }`}
                          />
                          <span className="text-[10px] font-mono font-bold mt-1">
                            {starVal}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Rating Description Label */}
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center justify-between px-1">
                    <span className="text-amber-600 dark:text-amber-300/90 font-medium">
                      {RATING_DESCRIPTIONS[Math.round(reviewHoverRating ?? reviewRating)]}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      Tap any star to rate
                    </span>
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Written Review / Feedback
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {reviewComment.trim().length} chars
                    </span>
                  </div>
                  <textarea
                    required
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your thoughts on the story, acting, direction, cinematography, and overall cinema experience..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1C1F2B] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-200 text-xs outline-none focus:border-blue-500 resize-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview || !reviewComment.trim()}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-blue-600/25 active:scale-[0.99]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingReview ? 'Publishing Review...' : 'Submit Verified Review'}</span>
                </button>
              </form>
            </div>

            {/* Right 7 Cols: Reviews List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Audience Feedback ({reviews.length})
                </span>
                <span className="text-xs text-amber-500 dark:text-amber-400 font-semibold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  Average: {averageRating.toFixed(1)} / 10
                </span>
              </div>

              {reviews.length === 0 ? (
                <div className="p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#14161F] text-center space-y-2 shadow-sm">
                  <MessageSquare className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto" />
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">No reviews yet</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Be the first verified moviegoer to leave a review and rating for {movie.title}!
                  </p>
                </div>
              ) : (
                reviews.map(r => (
                  <div
                    key={r.id}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#14161F] space-y-3 hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-sm dark:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                          {r.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">{r.userName}</span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded font-medium">
                              Verified
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                            {r.createdAt}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-amber-500 dark:text-amber-400 font-bold text-xs bg-slate-50 dark:bg-[#1C1F2B] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm font-mono">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{r.rating.toFixed(1)} / 10</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed italic bg-slate-50 dark:bg-white/[0.02] p-3 rounded-xl border border-slate-200 dark:border-white/5">
                      "{r.comment}"
                    </p>
                  </div>
                ))
              )}
            </div>

          </div>
        </section>

      </div>

      {/* 6. TRAILER LIGHTBOX MODAL */}
      {showTrailerModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setShowTrailerModal(false)}
        >
          <div
            className="relative w-full max-w-4xl bg-[#14161F] border border-white/15 rounded-3xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#090A0F]/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base leading-tight">
                    {movie.title}
                  </h3>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                    Official Theatrical Trailer
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowTrailerModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Close trailer (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`${movie.trailerUrl || 'https://www.youtube.com/embed/kQDd1AhGIHk'}?autoplay=1`}
                title={`${movie.title} Trailer`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
