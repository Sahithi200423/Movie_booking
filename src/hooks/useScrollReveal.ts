import { useEffect, useRef } from 'react';

/**
 * CineBook V3 Scroll Reveal Hook
 * Observes container elements and adds `.is-revealed` when scrolled into view.
 * Uses passive IntersectionObserver with zero layout thrashing.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.15) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const element = ref.current;
    if (!element) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      element.classList.add('is-revealed');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return ref;
}

export default useScrollReveal;
