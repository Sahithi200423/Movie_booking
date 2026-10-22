import { useRef, useEffect } from 'react';

interface MagneticOptions {
  maxDisplacement?: number;
  damping?: number;
  disabled?: boolean;
}

/**
 * CineBook V3 Subtle Magnetic Hover Hook
 * Smoothly shifts an interactive button toward the cursor when hovered.
 * Automatically respects prefers-reduced-motion and touch devices.
 */
export function useMagnetic<T extends HTMLElement = HTMLButtonElement>(options: MagneticOptions = {}) {
  const { maxDisplacement = 6, disabled = false } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    if (disabled || typeof window === 'undefined') return;

    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isFinePointer || prefersReducedMotion) return;

    const element = ref.current;
    if (!element) return;

    let isHovered = false;

    const handlePointerMove = (e: PointerEvent) => {
      if (!isHovered) return;
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);

      const moveX = Math.max(-maxDisplacement, Math.min(maxDisplacement, deltaX * maxDisplacement));
      const moveY = Math.max(-maxDisplacement, Math.min(maxDisplacement, deltaY * maxDisplacement));

      element.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    };

    const handlePointerEnter = () => {
      isHovered = true;
      element.style.transition = 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)';
    };

    const handlePointerLeave = () => {
      isHovered = false;
      element.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      element.style.transform = 'translate3d(0, 0, 0)';
    };

    element.addEventListener('pointerenter', handlePointerEnter);
    element.addEventListener('pointermove', handlePointerMove);
    element.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      element.removeEventListener('pointerenter', handlePointerEnter);
      element.removeEventListener('pointermove', handlePointerMove);
      element.removeEventListener('pointerleave', handlePointerLeave);
      element.style.transform = '';
      element.style.transition = '';
    };
  }, [maxDisplacement, disabled]);

  return ref;
}

export default useMagnetic;
