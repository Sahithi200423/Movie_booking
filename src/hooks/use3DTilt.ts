import { useRef, useEffect, useCallback } from 'react';

export interface TiltOptions {
  /** Maximum tilt angle in degrees (default: 7, user requested 6–8) */
  maxTiltDeg?: number;
  /** Perspective distance in px (default: 1000) */
  perspective?: number;
  /** Scale multiplier on hover (default: 1.025) */
  scale?: number;
  /** Whether to render specular lighting reflection (default: true) */
  glare?: boolean;
  /** Transition return speed in ms (default: 450) */
  returnSpeed?: number;
  /** Disabled flag */
  disabled?: boolean;
}

export interface Use3DTiltReturn {
  cardRef: React.RefObject<HTMLDivElement | null>;
  glareRef: React.RefObject<HTMLDivElement | null>;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
}

/**
 * High-performance 60fps/120fps 3D Perspective Tilt hook.
 *
 * Direct DOM style manipulation via requestAnimationFrame prevents React re-renders.
 * Automatically disables on touch devices and respects prefers-reduced-motion.
 */
export function use3DTilt(options: TiltOptions = {}): Use3DTiltReturn {
  const {
    maxTiltDeg = 7,
    perspective = 1000,
    scale = 1.025,
    glare = true,
    returnSpeed = 450,
    disabled = false
  } = options;

  const cardRef = useRef<HTMLDivElement | null>(null);
  const glareRef = useRef<HTMLDivElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rafId = useRef<number | null>(null);
  const willChangeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check touch / pointer capability
  const isTouchDevice = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }, []);

  // Check prefers-reduced-motion
  const prefersReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || isTouchDevice() || prefersReducedMotion()) return;

    const el = cardRef.current;
    if (!el) return;

    // Use latest client coordinates in animation frame
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;
      const rect = rectRef.current || cardRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Normalization (-1 to 1)
      const px = Math.min(Math.max((x - rect.width / 2) / (rect.width / 2), -1), 1);
      const py = Math.min(Math.max((y - rect.height / 2) / (rect.height / 2), -1), 1);

      // Subtle rotation around axes
      const rotX = -py * maxTiltDeg;
      const rotY = px * maxTiltDeg;

      // Apply 3D transform without lag
      cardRef.current.style.transform = `perspective(${perspective}px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(${scale}, ${scale}, 1)`;

      // Specular Glare reflection
      if (glare && glareRef.current) {
        const glareX = Math.round((x / rect.width) * 100);
        const glareY = Math.round((y / rect.height) * 100);
        glareRef.current.style.opacity = '1';
        glareRef.current.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.05) 40%, transparent 70%)`;
      }
    });
  }, [disabled, isTouchDevice, prefersReducedMotion, maxTiltDeg, perspective, scale, glare]);

  const onMouseEnter = useCallback(() => {
    if (disabled || isTouchDevice() || prefersReducedMotion()) return;

    if (willChangeTimeout.current) {
      clearTimeout(willChangeTimeout.current);
    }

    const el = cardRef.current;
    if (!el) return;

    // Cache rect once per hover session to prevent layout thrashing
    rectRef.current = el.getBoundingClientRect();

    // Only apply will-change during active mouse session
    el.style.willChange = 'transform, box-shadow';
    // Snappy transition for tracking mouse
    el.style.transition = 'transform 0.08s ease-out, box-shadow 0.3s ease';

    if (glare && glareRef.current) {
      glareRef.current.style.transition = 'opacity 0.2s ease-out';
    }
  }, [disabled, isTouchDevice, prefersReducedMotion, glare]);

  const onMouseLeave = useCallback(() => {
    rectRef.current = null;
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    const el = cardRef.current;
    if (!el) return;

    // Smooth return transition
    el.style.transition = `transform ${returnSpeed}ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow ${returnSpeed}ms ease`;
    el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;

    if (glare && glareRef.current) {
      glareRef.current.style.transition = `opacity ${returnSpeed}ms ease`;
      glareRef.current.style.opacity = '0';
    }

    // Release willChange after resting animation completes
    willChangeTimeout.current = setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.style.willChange = 'auto';
      }
    }, returnSpeed + 50);
  }, [perspective, returnSpeed, glare]);

  // Keyboard accessibility support
  const onFocus = useCallback(() => {
    if (disabled || prefersReducedMotion()) return;
    const el = cardRef.current;
    if (!el) return;
    el.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease';
    el.style.transform = `perspective(${perspective}px) translateY(-6px) scale3d(1.015, 1.015, 1)`;
  }, [disabled, prefersReducedMotion, perspective]);

  const onBlur = useCallback(() => {
    onMouseLeave();
  }, [onMouseLeave]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (willChangeTimeout.current) clearTimeout(willChangeTimeout.current);
    };
  }, []);

  return {
    cardRef,
    glareRef,
    onMouseMove,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
  };
}
