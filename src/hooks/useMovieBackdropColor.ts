/**
 * CineBook Version 2.0 — useMovieBackdropColor Hook
 * 
 * Subscribes to the active movie, extracts or matches optimal cinematic ambient
 * colors, and dynamically updates CSS theme variables with smooth transitions.
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import type { Movie } from '../types';
import {
  type ExtractedMovieColors,
  getMovieFallbackPalette,
  extractColorsFromImageUrl,
} from '../utils/colorExtractor';

export interface UseMovieBackdropColorResult {
  colors: ExtractedMovieColors;
  isLoading: boolean;
}

export function useMovieBackdropColor(
  movie: Movie | null | undefined,
  syncCssVariables: boolean = true
): UseMovieBackdropColorResult {
  // Compute immediate curated fallback (0ms latency, zero layout shift)
  const fallback = useMemo(() => getMovieFallbackPalette(movie), [movie?.id, movie?.genre]);

  const [colors, setColors] = useState<ExtractedMovieColors>(fallback);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const activeMovieIdRef = useRef<string | undefined>(movie?.id);

  // Sync state whenever movie changes
  useEffect(() => {
    activeMovieIdRef.current = movie?.id;
    setColors(fallback);

    const imageUrl = movie?.backdropUrl || movie?.posterUrl;
    if (!imageUrl) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    extractColorsFromImageUrl(imageUrl, fallback)
      .then((extracted) => {
        if (isMounted && activeMovieIdRef.current === movie?.id) {
          setColors(extracted);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setColors(fallback);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [movie?.id, movie?.backdropUrl, movie?.posterUrl, fallback]);

  // Synchronize CSS custom properties to document root for seamless global reaction
  useEffect(() => {
    if (!syncCssVariables || typeof document === 'undefined') return;

    const root = document.documentElement;
    root.style.setProperty('--movie-ambient-primary', colors.primary);
    root.style.setProperty('--movie-ambient-secondary', colors.secondary);
    root.style.setProperty('--movie-ambient-glow', colors.glow);
    root.style.setProperty('--movie-ambient-mesh', colors.meshGradient);

    return () => {
      // Optional: Clean up on unmount or allow previous values to persist gracefully
    };
  }, [colors, syncCssVariables]);

  return { colors, isLoading };
}
