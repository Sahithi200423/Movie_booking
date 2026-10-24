import React, { useEffect, useState, useRef } from 'react';

/**
 * CineBook V3 Luxury Champagne Custom Cursor
 * - Precision center dot (zero-lag direct position tracking)
 * - Fluid champagne aura ring (smooth inertia lerp follow)
 * - Interactive magnetic hover states with dynamic action labels
 * - 100% Non-blocking: pointer-events: none on all cursor elements
 * - Safe native-cursor fallback: native arrow is preserved if cursor is inactive or on touch
 * - Cross-device resilience: Works on standard laptops, touchscreen laptops, and trackpads
 * - Mobile exclusion: Automatically disables on touch events with zero interference
 */
export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [cursorText, setCursorText] = useState<string | null>(null);
  const [isClicking, setIsClicking] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Position tracking refs for animation loop
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isVisibleRef = useRef(false);
  const animFrameId = useRef<number | null>(null);
  const isLoopRunningRef = useRef(false);
  const isHoveringRef = useRef(false);
  const cursorTextRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Immediately skip on touch-only mobile devices to eliminate any touch drag latency
    const isTouchOnly = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouchOnly) return;

    // Start render loop only on demand
    const startRenderLoop = () => {
      if (isLoopRunningRef.current) return;
      isLoopRunningRef.current = true;
      animFrameId.current = requestAnimationFrame(render);
    };

    // Smooth inertia render loop for outer champagne aura ring
    const render = () => {
      if (isVisibleRef.current) {
        const dx = mousePos.current.x - ringPos.current.x;
        const dy = mousePos.current.y - ringPos.current.y;
        const dist = Math.abs(dx) + Math.abs(dy);

        if (dist > 0.15) {
          const lerp = 0.22;
          ringPos.current.x += dx * lerp;
          ringPos.current.y += dy * lerp;

          if (ringRef.current) {
            ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
          }
          animFrameId.current = requestAnimationFrame(render);
          return;
        } else {
          // Snap to rest position and stop loop
          ringPos.current.x = mousePos.current.x;
          ringPos.current.y = mousePos.current.y;
          if (ringRef.current) {
            ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
          }
        }
      }

      isLoopRunningRef.current = false;
    };

    // Handler for pointer movements (dynamically discriminates mouse/pen vs touch)
    const onPointerMove = (e: PointerEvent) => {
      // 1. If it's a touch event (mobile screen tap/drag), keep custom cursor hidden
      if (e.pointerType === 'touch') {
        if (isVisibleRef.current) {
          isVisibleRef.current = false;
          setIsVisible(false);
          document.documentElement.classList.remove('custom-cursor-active');
        }
        return;
      }

      // 2. Mouse or pen on laptop/desktop: activate custom cursor
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
        ringPos.current.x = e.clientX;
        ringPos.current.y = e.clientY;
        document.documentElement.classList.add('custom-cursor-active');
      }

      // Position center dot immediately with zero lag
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Wake up the inertia render loop if sleeping
      startRenderLoop();

      // Check element under pointer for interactive attributes (only trigger state if changed)
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          'a, button, [role="button"], input, select, textarea, label, [data-cursor], .cursor-pointer'
        );

        const isInteractiveNow = Boolean(interactive);
        const nextText = interactive ? interactive.getAttribute('data-cursor') || null : null;

        if (isInteractiveNow !== isHoveringRef.current) {
          isHoveringRef.current = isInteractiveNow;
          setIsHoveringInteractive(isInteractiveNow);
        }

        if (nextText !== cursorTextRef.current) {
          cursorTextRef.current = nextText;
          setCursorText(nextText);
        }
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      setIsClicking(true);
    };

    const onPointerUp = () => setIsClicking(false);

    const onMouseLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
      document.documentElement.classList.remove('custom-cursor-active');
    };

    const onMouseEnter = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      ringPos.current.x = e.clientX;
      ringPos.current.y = e.clientY;
      isVisibleRef.current = true;
      setIsVisible(true);
      document.documentElement.classList.add('custom-cursor-active');
      startRenderLoop();
    };

    const onWindowBlur = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
      document.documentElement.classList.remove('custom-cursor-active');
    };

    // Register passive window listeners
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('blur', onWindowBlur);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('blur', onWindowBlur);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
      isLoopRunningRef.current = false;
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, []); // Run once on mount

  return (
    <>
      {/* Precision Champagne Center Dot (Zero-lag hardware-accelerated tracking) */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className={`cinebook-cursor-dot fixed top-0 left-0 pointer-events-none select-none z-[999999] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-150 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${isHoveringInteractive ? 'w-2 h-2 bg-[#DFC49D]' : 'w-1.5 h-1.5 bg-[#C7A675]'}`}
        style={{
          boxShadow: '0 0 10px rgba(199, 166, 117, 0.9), 0 0 20px rgba(199, 166, 117, 0.4)',
          pointerEvents: 'none'
        }}
      />

      {/* Fluid Champagne Aura Ring (Smooth inertia tracking with scale reactions) */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`cinebook-cursor-ring fixed top-0 left-0 pointer-events-none select-none z-[999998] -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-200 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${
          isClicking
            ? 'w-7 h-7 scale-90 border-2 border-[#DFC49D] bg-[#C7A675]/30 shadow-[0_0_25px_rgba(199,166,117,0.5)]'
            : isHoveringInteractive
            ? 'w-12 h-12 scale-110 border border-[#DFC49D] bg-[#C7A675]/15 shadow-[0_0_30px_rgba(199,166,117,0.35)]'
            : 'w-9 h-9 border border-[#C7A675]/50 bg-[#C7A675]/8 shadow-[0_0_18px_rgba(199,166,117,0.2)]'
        }`}
        style={{ pointerEvents: 'none' }}
      >
        {cursorText && (
          <span className="text-[9px] font-extrabold tracking-widest uppercase font-mono text-[#08090B] bg-[#C7A675] px-1.5 py-0.5 rounded-full shadow-md animate-fade-in whitespace-nowrap select-none pointer-events-none">
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
};

export default CustomCursor;
