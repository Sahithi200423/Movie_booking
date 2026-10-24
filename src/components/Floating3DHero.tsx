import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import {
  Ticket,
  Play,
  Sparkles,
  ArrowDown,
  ShieldCheck,
  Zap,
  Film
} from 'lucide-react';
import type { Movie } from '../types';
import { useTranslation } from '../context/LanguageContext';
import { useBooking } from '../context/BookingContext';
import { useMagnetic } from '../hooks/useMagnetic';

interface Floating3DHeroProps {
  movies: Movie[];
  activeMovie: Movie;
  onSelectMovie: (movie: Movie) => void;
  onOpenTrailer: (title: string) => void;
}

/**
 * CineBook V3 — Premium Floating 3D Homepage Hero
 * Inspired by AURAL Luxury Hardware:
 * - Autonomous continuous floating (8-12px over 4-6s) & slow rotation on mobile and desktop
 * - Realistic red metallic clearcoat materials, rounded chamfered edges & perforation cutouts
 * - Mouse-driven tilt on desktop + non-blocking touch interaction on mobile (touch-action: pan-y)
 * - Oversized CINEBOOK background typography with subtle parallax
 * - Theatrical deep charcoal background with cinematic crimson & cobalt specular lighting
 * - IntersectionObserver to pause render loop off-screen for maximum mobile battery performance
 * - Graceful animated CSS 3D fallback for devices without WebGL
 * - Full support for dark/light themes and prefers-reduced-motion
 */
export const Floating3DHero: React.FC<Floating3DHeroProps> = ({
  movies,
  activeMovie,
  onSelectMovie,
  onOpenTrailer
}) => {
  const navigate = useNavigate();
  const { setActiveMovie } = useBooking();
  const { t, isRTL } = useTranslation();

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const bookBtnRef = useMagnetic<HTMLButtonElement>({ maxDisplacement: 6 });
  const trailerBtnRef = useMagnetic<HTMLButtonElement>({ maxDisplacement: 5 });

  // WebGL & Motion state
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Detect compact mobile viewport (< 480px) to use zero-overhead CSS 3D ticket for smooth 60fps scrolling
  const [isCompactDevice, setIsCompactDevice] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 480;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkCompact = () => {
      setIsCompactDevice(window.innerWidth < 480);
    };
    window.addEventListener('resize', checkCompact, { passive: true });
    return () => window.removeEventListener('resize', checkCompact);
  }, []);

  // Check reduced-motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(media.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, []);

  // Parallax mouse / touch offsets (-1 to 1)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Generate dynamic ticket canvas texture for the active movie
  const createTicketTexture = useCallback((movie: Movie): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);
    ctx.scale(1280 / 2048, 720 / 1152);

    // 1. Luxury Dark Charcoal / Obsidian Base Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGrad.addColorStop(0, '#15171B');
    bgGrad.addColorStop(0.4, '#0E1014');
    bgGrad.addColorStop(1, '#08090B');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Subtle Luxury Geometric Micro-Grid
    ctx.strokeStyle = 'rgba(199, 166, 117, 0.035)';
    ctx.lineWidth = 1.5;
    for (let x = 0; x < canvas.width; x += 56) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 56) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // 3. Cinematic Warm Champagne Specular Radial Glow
    const radial = ctx.createRadialGradient(
      canvas.width * 0.35,
      canvas.height * 0.45,
      40,
      canvas.width * 0.35,
      canvas.height * 0.45,
      850
    );
    radial.addColorStop(0, 'rgba(199, 166, 117, 0.22)');
    radial.addColorStop(0.5, 'rgba(165, 131, 82, 0.08)');
    radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 4. Champagne Metallic Foil Outer Border
    ctx.strokeStyle = '#C7A675';
    ctx.lineWidth = 12;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    ctx.strokeStyle = 'rgba(243, 240, 232, 0.22)';
    ctx.lineWidth = 2;
    ctx.strokeRect(58, 58, canvas.width - 116, canvas.height - 116);

    // 5. Perforation Dividing Line between Ticket Body and Stub (at x = 1450)
    const stubX = 1450;
    ctx.strokeStyle = 'rgba(199, 166, 117, 0.4)';
    ctx.lineWidth = 5;
    ctx.setLineDash([20, 14]);
    ctx.beginPath();
    ctx.moveTo(stubX, 40);
    ctx.lineTo(stubX, canvas.height - 40);
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // 6. Header: CINEBOOK VIP PREMIERE PASS
    ctx.fillStyle = '#C7A675';
    ctx.font = 'bold 34px "Outfit", "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '8px';
    ctx.fillText('✦ CINEBOOK LUXURY PASS • VIP EXPERIENCE ✦', 100, 130);

    // 7. Cinema & Hall Info
    ctx.fillStyle = '#A8ADB4';
    ctx.font = '500 26px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('PVR INOX • AUDITORIUM 1 • 4K LASER DOLBY ATMOS', 100, 180);

    // 8. Main Movie Title (Large & Bold with Subtitle Drop)
    ctx.fillStyle = '#F3F0E8';
    ctx.font = '800 86px "Cinzel", "Outfit", serif';
    ctx.letterSpacing = '3px';
    const cleanTitle = movie.title.toUpperCase();
    ctx.fillText(cleanTitle, 100, 310);

    // 9. Movie Details: Rating, Genre, Duration
    ctx.fillStyle = '#C7A675';
    ctx.font = 'bold 34px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`★ ${movie.rating.toFixed(1)} / 10`, 100, 390);

    ctx.fillStyle = '#A8ADB4';
    ctx.font = '500 30px "Plus Jakarta Sans", sans-serif';
    const genres = movie.genre.slice(0, 3).join(' • ');
    ctx.fillText(`${genres}  |  ${movie.duration}  |  ${movie.ageRating || 'UA'}`, 340, 390);

    // 10. Luxury Feature Pills (IMAX 3D, ₹5 PRICE, 10-MIN HOLD)
    const pills = [
      { text: 'IMAX 3D LASER', bg: '#1A1D24', border: '#C7A675', color: '#DFC49D' },
      { text: '₹5 FLAT TICKET GUARANTEE', bg: '#231E18', border: '#C7A675', color: '#F3F0E8' },
      { text: 'VERIFIED CONCURRENCY SEAT HOLD', bg: '#131920', border: 'rgba(255, 255, 255, 0.2)', color: '#A8ADB4' }
    ];

    let pillX = 100;
    pills.forEach(pill => {
      ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
      const textWidth = ctx.measureText(pill.text).width;
      const pillWidth = textWidth + 48;
      const pillHeight = 58;
      const pillY = 460;

      ctx.fillStyle = pill.bg;
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 29);
      ctx.fill();

      ctx.strokeStyle = pill.border;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = pill.color;
      ctx.fillText(pill.text, pillX + 24, pillY + 39);

      pillX += pillWidth + 24;
    });

    // 11. Seat Number and Time Grid Box
    ctx.fillStyle = 'rgba(21, 23, 27, 0.75)';
    ctx.strokeStyle = 'rgba(199, 166, 117, 0.25)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(100, 560, 1260, 320, 24);
    ctx.fill();
    ctx.stroke();

    // Section 1: SEAT NUMBER
    ctx.fillStyle = '#A8ADB4';
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('ALLOCATED SEATS', 140, 620);
    ctx.fillStyle = '#F3F0E8';
    ctx.font = '800 62px "Outfit", monospace';
    ctx.fillText('A1, A2 • VIP RECLINER', 140, 710);
    ctx.fillStyle = '#C7A675';
    ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Front Row Prime Audio Zone', 140, 770);

    // Section 2: SHOWTIME & DATE
    ctx.fillStyle = '#A8ADB4';
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('DATE & TIME', 760, 620);
    ctx.fillStyle = '#F3F0E8';
    ctx.font = '800 50px "Outfit", sans-serif';
    ctx.fillText('TODAY • 04:30 PM', 760, 700);
    ctx.fillStyle = '#DFC49D';
    ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Doors open 15 min prior', 760, 770);

    // Section 3: PRICE TAG
    ctx.fillStyle = '#A8ADB4';
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('PRICE PER TICKET', 1140, 620);
    ctx.fillStyle = '#C7A675';
    ctx.font = '800 66px "Outfit", sans-serif';
    ctx.fillText('₹5.00', 1140, 710);
    ctx.fillStyle = '#A8ADB4';
    ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('All Taxes Incl.', 1140, 770);

    // 12. Bottom Barcode across main ticket
    ctx.fillStyle = '#F3F0E8';
    const barcodeStartX = 100;
    const barcodeY = 930;
    const barcodeHeight = 120;
    const barWidths = [
      4, 8, 4, 12, 6, 4, 16, 8, 4, 6, 12, 4, 8, 16, 4, 4, 8, 12, 6, 8, 4, 16, 8, 4,
      12, 4, 8, 4, 16, 8, 4, 6, 12, 4, 8, 16, 4, 4, 8, 12, 6, 8, 4, 16, 8, 4, 12, 6,
      4, 16, 8, 4, 8, 12, 4, 6, 12, 8, 4, 16, 4, 8, 4, 12, 6, 4, 16, 8, 4, 6, 12, 4
    ];

    let curBx = barcodeStartX;
    barWidths.forEach((w, idx) => {
      if (idx % 2 === 0) {
        ctx.fillRect(curBx, barcodeY, w, barcodeHeight);
      }
      curBx += w + 6;
    });

    ctx.fillStyle = '#A8ADB4';
    ctx.font = 'bold 22px monospace';
    ctx.letterSpacing = '6px';
    ctx.fillText(`CINEBOOK-SECURE-TOKEN • #${movie.id.toUpperCase()}-2026-X99`, 100, 1090);

    // 13. STUB SECTION (Right of perforation at x = 1450)
    ctx.save();
    ctx.translate(1500, 0);

    // Stub Title & Brand
    ctx.fillStyle = '#C7A675';
    ctx.font = 'bold 30px "Outfit", sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('STUB CHECK', 20, 130);

    ctx.fillStyle = '#F3F0E8';
    ctx.font = '800 44px "Cinzel", "Outfit", serif';
    ctx.fillText(cleanTitle.slice(0, 14), 20, 210);

    // Stub Details Box
    ctx.fillStyle = '#A8ADB4';
    ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('AUDITORIUM 1', 20, 270);
    ctx.fillText('ROW A • SEAT 1, 2', 20, 310);
    ctx.fillText('TIME: 04:30 PM', 20, 350);

    // Stub Hologram Seal Graphic
    const sealX = 230;
    const sealY = 560;
    const sealRad = 150;
    const sealGrad = ctx.createLinearGradient(sealX - sealRad, sealY - sealRad, sealX + sealRad, sealY + sealRad);
    sealGrad.addColorStop(0, '#DFC49D');
    sealGrad.addColorStop(0.5, '#C7A675');
    sealGrad.addColorStop(1, '#8A6834');
    ctx.fillStyle = sealGrad;
    ctx.beginPath();
    ctx.arc(sealX, sealY, sealRad, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#08090B';
    ctx.beginPath();
    ctx.arc(sealX, sealY, sealRad - 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#DFC49D';
    ctx.font = 'bold 36px "Cinzel", "Outfit", serif';
    ctx.textAlign = 'center';
    ctx.fillText('★ VIP ★', sealX, sealY - 10);
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('₹5 VERIFIED', sealX, sealY + 30);
    ctx.textAlign = 'start'; // reset

    // Stub Mini Barcode
    const stubBarcodeY = 820;
    let sBx = 40;
    for (let i = 0; i < 35; i++) {
      const bw = (i % 3 === 0) ? 8 : 4;
      ctx.fillStyle = '#F3F0E8';
      ctx.fillRect(sBx, stubBarcodeY, bw, 130);
      sBx += bw + 8;
    }

    ctx.fillStyle = '#A8ADB4';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('SCAN FOR ENTRY', 120, 1000);

    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
    return texture;
  }, []);

  // WebGL 3D Scene Initialization & Physics Engine (Tablets & Desktop >= 480px)
  useEffect(() => {
    if (!canvasRef.current || isCompactDevice) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let ticketMesh: THREE.Mesh | null = null;
    let shadowMesh: THREE.Mesh | null = null;
    let pointLightRed: THREE.PointLight | null = null;
    let pointLightBlue: THREE.PointLight | null = null;
    let amberUnderLight: THREE.PointLight | null = null;
    let dirLight: THREE.DirectionalLight | null = null;
    let animationFrameId: number;
    let observer: IntersectionObserver | null = null;
    let isVisible = true;

    try {
      // 1. Performance-Optimized Renderer Setup
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });

      // Adaptive DPR: capped at 1.5 for mobile and 1.75 for desktop to avoid heavy fillrate bottleneck
      const isSmallScreen = (containerRef.current?.clientWidth || window.innerWidth) < 640;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmallScreen ? 1.5 : 1.75));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      // 2. Scene & Camera Setup
      scene = new THREE.Scene();

      const width = canvasRef.current.clientWidth || 800;
      const height = canvasRef.current.clientHeight || 500;
      camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
      camera.position.set(0, 0, 7.6);

      // 3. Lighting Setup: Luxury Theatrical Champagne, Warm Ivory & Specular
      const ambientLight = new THREE.AmbientLight(0x22242b, 2.2);
      scene.add(ambientLight);

      // Main Warm Champagne Specular Rim Light
      pointLightRed = new THREE.PointLight(0xc7a675, 6.5, 24);
      pointLightRed.position.set(4.5, 2.5, 3.5);
      scene.add(pointLightRed);

      // Soft Warm Ivory Balance Light
      pointLightBlue = new THREE.PointLight(0xf3f0e8, 3.8, 18);
      pointLightBlue.position.set(-4.5, -1.5, 3.0);
      scene.add(pointLightBlue);

      // Warm Champagne Under-Glow
      amberUnderLight = new THREE.PointLight(0xdfc49d, 2.8, 14);
      amberUnderLight.position.set(0, -3.2, 2.8);
      scene.add(amberUnderLight);

      // Directional Overhead Key Light
      dirLight = new THREE.DirectionalLight(0xfff8ec, 2.0);
      dirLight.position.set(0, 6, 4);
      scene.add(dirLight);

      // 4. Ticket Geometry with Chamfered Edges & Notches
      // Ticket dimensions: width = 5.2, height = 2.92, depth = 0.08
      const ticketWidth = 5.2;
      const ticketHeight = 2.92;
      const ticketDepth = 0.08;
      const radius = 0.18;

      const shape = new THREE.Shape();
      const x = -ticketWidth / 2;
      const y = -ticketHeight / 2;
      const w = ticketWidth;
      const h = ticketHeight;

      shape.moveTo(x + radius, y);
      shape.lineTo(x + w - radius, y);
      shape.quadraticCurveTo(x + w, y, x + w, y + radius);

      // Perforation notch on right edge
      const notchY = y + h * 0.5;
      shape.lineTo(x + w, notchY - 0.15);
      shape.absarc(x + w, notchY, 0.15, -Math.PI / 2, Math.PI / 2, true);
      shape.lineTo(x + w, y + h - radius);

      shape.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
      shape.lineTo(x + radius, y + h);
      shape.quadraticCurveTo(x, y + h, x, y + h - radius);

      // Perforation notch on left edge
      shape.lineTo(x, notchY + 0.15);
      shape.absarc(x, notchY, 0.15, Math.PI / 2, -Math.PI / 2, true);
      shape.lineTo(x, y + radius);
      shape.quadraticCurveTo(x, y, x + radius, y);

      const extrudeSettings = {
        depth: ticketDepth,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 1,
        bevelSize: 0.02,
        bevelThickness: 0.02
      };

      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geometry.center();
      geometry.computeBoundingBox();

      // Normalize UV mapping for ticket front face [0, 1]
      if (geometry.boundingBox) {
        const bbox = geometry.boundingBox;
        const sizeX = bbox.max.x - bbox.min.x;
        const sizeY = bbox.max.y - bbox.min.y;
        const pos = geometry.attributes.position;
        const uvs = geometry.attributes.uv;
        for (let i = 0; i < pos.count; i++) {
          const u = (pos.getX(i) - bbox.min.x) / sizeX;
          const v = (pos.getY(i) - bbox.min.y) / sizeY;
          uvs.setXY(i, u, v);
        }
        uvs.needsUpdate = true;
      }

      // 5. Materials Setup (Luxury Champagne Foil & Obsidian Base)
      const frontTexture = createTicketTexture(activeMovie);
      frontTexture.wrapS = THREE.ClampToEdgeWrapping;
      frontTexture.wrapT = THREE.ClampToEdgeWrapping;

      // Front face material with clearcoat metallic finish & iridescence
      const frontMaterial = new THREE.MeshPhysicalMaterial({
        map: frontTexture,
        metalness: 0.28,
        roughness: 0.2,
        clearcoat: 0.95,
        clearcoatRoughness: 0.08,
        reflectivity: 0.95,
        iridescence: 0.35,
        iridescenceIOR: 1.35
      });

      // Side chamfered edge material: metallic champagne gold
      const sideMaterial = new THREE.MeshStandardMaterial({
        color: 0xc7a675,
        metalness: 0.88,
        roughness: 0.22
      });

      ticketMesh = new THREE.Mesh(geometry, [frontMaterial, sideMaterial]);
      ticketMesh.frustumCulled = true;
      scene.add(ticketMesh);

      // 6. Floating Contact Shadow on Floor Plane
      const shadowCanvas = document.createElement('canvas');
      shadowCanvas.width = 256;
      shadowCanvas.height = 256;
      const sCtx = shadowCanvas.getContext('2d');
      if (sCtx) {
        const rad = sCtx.createRadialGradient(128, 128, 20, 128, 128, 120);
        rad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
        rad.addColorStop(0.4, 'rgba(199, 166, 117, 0.16)');
        rad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        sCtx.fillStyle = rad;
        sCtx.fillRect(0, 0, 256, 256);
      }
      const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
      const shadowGeo = new THREE.PlaneGeometry(6.6, 2.9);
      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.55,
        depthWrite: false
      });
      shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.rotation.x = -Math.PI / 2;
      shadowMesh.position.y = -2.1;
      scene.add(shadowMesh);

      // 7. Responsive Camera Framing for 320px to 1440px
      const handleResize = () => {
        if (!containerRef.current || !renderer || !camera) return;
        const newWidth = containerRef.current.clientWidth;
        const newHeight = containerRef.current.clientHeight;

        camera.aspect = newWidth / newHeight;

        // Breakpoint-calibrated camera distances
        if (newWidth < 360) {
          // Compact Mobile (320-359px)
          camera.position.z = 10.6;
          camera.position.y = 0.08;
        } else if (newWidth < 480) {
          // Standard Mobile (360-479px)
          camera.position.z = 9.4;
          camera.position.y = 0.05;
        } else if (newWidth < 768) {
          // Large Mobile / Phablets (480-767px)
          camera.position.z = 8.6;
          camera.position.y = 0;
        } else if (newWidth < 1024) {
          // Tablets (768-1023px)
          camera.position.z = 8.2;
          camera.position.y = 0;
        } else {
          // Desktop (1024px+)
          camera.position.z = 7.6;
          camera.position.y = 0;
        }
        camera.updateProjectionMatrix();

        const dpr = Math.min(window.devicePixelRatio || 1, newWidth < 640 ? 1.75 : 2.0);
        renderer.setPixelRatio(dpr);
        renderer.setSize(newWidth, newHeight);
      };

      handleResize();
      window.addEventListener('resize', handleResize);

      // 8. IntersectionObserver: Pause render loop when scrolled off-screen
      const startTime = performance.now();
      let isAnimating = false;
      const animate = () => {
        if (!isVisible) {
          isAnimating = false;
          return;
        }
        isAnimating = true;
        animationFrameId = requestAnimationFrame(animate);

        const elapsedTime = (performance.now() - startTime) * 0.001;

        // Parallax user interaction smoothing (mouse or touch drag)
        const mouse = mouseRef.current;
        mouse.x += (mouse.targetX - mouse.x) * 0.06;
        mouse.y += (mouse.targetY - mouse.y) * 0.06;

        if (ticketMesh) {
          if (!reducedMotion) {
            // (A) Continuous gentle vertical floating (8-12px over ~5 seconds)
            // Period = 5.0 seconds -> 2*PI / 5.0 = 1.256 rad/s
            const floatY = Math.sin(elapsedTime * 1.25) * 0.18;
            ticketMesh.position.y = floatY;

            // (B) Subtle automatic tilting (strictly limited to 10-15 degrees, zero 360-spin)
            // 10 deg = 0.174 rad, 12 deg = 0.209 rad, 14 deg = 0.244 rad
            const autoPitch = Math.sin(elapsedTime * 0.85) * 0.08;  // ~4.6° gentle pitch nod
            const autoYaw = Math.sin(elapsedTime * 0.6) * 0.18;     // ~10.3° subtle horizontal sway
            const autoRoll = Math.cos(elapsedTime * 0.8) * 0.025;   // ~1.4° micro roll

            // (C) Subtle desktop mouse parallax (capped so total tilt never exceeds ~14°)
            const mousePitch = mouse.y * 0.06;
            const mouseYaw = mouse.x * 0.08;

            const targetRotX = THREE.MathUtils.clamp(autoPitch + mousePitch, -0.20, 0.20);
            const targetRotY = THREE.MathUtils.clamp(autoYaw + mouseYaw, -0.24, 0.24);
            const targetRotZ = autoRoll - mouse.x * 0.02;

            ticketMesh.rotation.x = targetRotX;
            ticketMesh.rotation.y = targetRotY;
            ticketMesh.rotation.z = targetRotZ;

            // (D) Soft moving floor shadow tracking vertical float and gentle sway
            if (shadowMesh) {
              const shadowScale = 1.0 - floatY * 0.6;
              shadowMesh.scale.set(shadowScale, shadowScale, shadowScale);
              shadowMat.opacity = Math.max(0.2, 0.52 - floatY * 0.3);
              shadowMesh.position.x = targetRotY * 0.3;
            }
          } else {
            // Accessible static presentation when reduced motion is preferred
            ticketMesh.position.y = 0;
            ticketMesh.rotation.x = mouse.y * 0.15;
            ticketMesh.rotation.y = mouse.x * 0.2;
            ticketMesh.rotation.z = 0;
            if (shadowMesh) {
              shadowMesh.scale.set(1, 1, 1);
              shadowMat.opacity = 0.5;
            }
          }
        }

        // Dynamic specular lighting glints sweep across metallic face
        if (pointLightRed) {
          pointLightRed.position.x = 4.5 + Math.sin(elapsedTime * 0.8) * 1.5 + mouse.x * 2.0;
          pointLightRed.position.y = 2.5 + Math.cos(elapsedTime * 0.9) * 1.2 - mouse.y * 1.8;
        }

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      };

      animate();

      if (typeof window !== 'undefined' && 'IntersectionObserver' in window && containerRef.current) {
        observer = new IntersectionObserver(
          ([entry]) => {
            const wasVisible = isVisible;
            isVisible = entry.isIntersecting;
            if (!wasVisible && isVisible && !isAnimating) {
              animate();
            }
          },
          { threshold: 0.05 }
        );
        observer.observe(containerRef.current);
      }

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
        if (observer) observer.disconnect();
        if (renderer) renderer.dispose();
        geometry.dispose();
        frontMaterial.dispose();
        frontTexture.dispose();
        sideMaterial.dispose();
        shadowGeo.dispose();
        shadowMat.dispose();
        shadowTexture.dispose();
      };
    } catch (err) {
      console.warn('WebGL notice, activating CSS 3D fallback:', err);
      setWebglSupported(false);
    }
  }, [activeMovie, createTicketTexture, reducedMotion, isCompactDevice]);

  // Pointer / Mouse Move Handler for Desktop Tilt
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    mouseRef.current.targetX = Math.max(-1, Math.min(1, x));
    mouseRef.current.targetY = Math.max(-1, Math.min(1, y));
  };

  const handlePointerLeave = () => {
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
    setIsHovered(false);
  };

  const handleBookNow = () => {
    setActiveMovie(activeMovie);
    navigate(`/movie/${activeMovie.id}`);
  };

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#08090B] text-[#F3F0E8] select-none ${
        isRTL ? 'rtl' : 'ltr'
      }`}
    >
      {/* 1. CINEMATIC BACKGROUND ATMOSPHERE WITH LUXURY GRADIENTS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep Charcoal & Obsidian Radial Ambient Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#1A1D24_0%,#111317_50%,#08090B_100%)]" />

        {/* Theatrical Warm Champagne Glow (Right Rim) - GPU-friendly zero-cost radial gradient */}
        <div className="absolute -top-32 right-0 w-[550px] sm:w-[750px] h-[550px] sm:h-[750px] rounded-full bg-[radial-gradient(circle,rgba(199,166,117,0.14)_0%,transparent_70%)] pointer-events-none" />

        {/* Theatrical Warm Ivory Glow (Left Bottom Accent) - GPU-friendly zero-cost radial gradient */}
        <div className="absolute -bottom-32 left-0 w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] rounded-full bg-[radial-gradient(circle,rgba(243,240,232,0.08)_0%,transparent_70%)] pointer-events-none" />

        {/* Floating Subtle Decorative Film Elements */}
        <div className="absolute top-12 left-8 opacity-15 hidden sm:block animate-pulse">
          <Film className="w-10 h-10 text-[#C7A675]" />
        </div>
        <div className="absolute bottom-16 right-8 opacity-15 hidden sm:block animate-pulse" style={{ animationDelay: '1.5s' }}>
          <Film className="w-10 h-10 text-[#A8ADB4]" />
        </div>

        {/* Subtle Luxury Geometric Grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(199,166,117,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(199,166,117,0.15) 1px, transparent 1px)',
            backgroundSize: '56px 56px'
          }}
        />
      </div>

      {/* 2. OVERSIZED "CINEBOOK" TYPOGRAPHY BEHIND OBJECT (FLOMERA INSPIRED) */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0"
        aria-hidden="true"
      >
        <span
          className="text-[20vw] sm:text-[17vw] font-bold tracking-[0.2em] uppercase text-transparent select-none whitespace-nowrap transition-transform duration-700 ease-out font-display"
          style={{
            WebkitTextStroke: '1.5px rgba(199, 166, 117, 0.10)',
            textShadow: '0 0 80px rgba(199, 166, 117, 0.06)',
            transform: `translate3d(${-mouseRef.current.x * 25}px, ${-mouseRef.current.y * 15}px, 0)`
          }}
        >
          CINEBOOK
        </span>
      </div>

      {/* 3. MAIN HERO VIEWPORT CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12 pb-12 sm:pb-20 flex flex-col items-center">
        
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase bg-[#15171B]/90 border border-[#C7A675]/25 text-[#C7A675] backdrop-blur-xl shadow-lg shadow-black/50 mb-3 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-[#C7A675] animate-pulse" />
          <span>CINEBOOK V3 • LUXURY CINEMA</span>
        </div>

        {/* Featured Movie Title & Quick Tagline */}
        <div className="text-center max-w-3xl space-y-2 mb-1 sm:mb-3">
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#F3F0E8] tracking-tight uppercase drop-shadow-md">
            {activeMovie.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#A8ADB4] font-medium tracking-widest uppercase">
            {activeMovie.genre.join(' • ')}  |  {activeMovie.duration}  |  
            <span className="text-[#C7A675] font-bold ml-1.5">★ {activeMovie.rating.toFixed(1)} / 10</span>
          </p>

          {/* Mobile Companion Badges */}
          <div className="flex md:hidden items-center justify-center gap-2 pt-1.5">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#15171B] border border-[#C7A675]/30 text-[#C7A675]">
              <ShieldCheck className="w-3 h-3 text-[#C7A675]" />
              10-Min Concurrency Lock
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#15171B] border border-white/10 text-[#F3F0E8]">
              <Zap className="w-3 h-3 text-[#DFC49D]" />
              ₹5 Flat Guarantee
            </span>
          </div>
        </div>

        {/* 4. 3D FLOATING TICKET STAGE */}
        <div
          ref={containerRef}
          role="button"
          tabIndex={0}
          data-cursor="TICKET"
          aria-label={`Interactive 3D VIP Ticket for ${activeMovie.title}. Click or tap to view showtimes and book for ₹5.`}
          onClick={handleBookNow}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleBookNow();
            }
          }}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onMouseEnter={() => setIsHovered(true)}
          className="relative w-full max-w-4xl h-[280px] xs:h-[310px] sm:h-[400px] md:h-[480px] lg:h-[510px] flex items-center justify-center select-none cursor-pointer pointer-events-auto group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C7A675] rounded-3xl"
          style={{ touchAction: 'pan-y' }}
        >
          {(!isCompactDevice && webglSupported) ? (
            /* Three.js Hardware-Accelerated 3D Canvas (Tablets & Desktop) */
            <canvas
              ref={canvasRef}
              className="w-full h-full block focus:outline-none pointer-events-none transition-transform duration-300 group-hover:scale-[1.02] group-active:scale-[0.98]"
              style={{
                filter: isHovered ? 'drop-shadow(0 20px 45px rgba(199, 166, 117, 0.35))' : 'none',
                transition: 'filter 0.5s ease, transform 0.3s ease'
              }}
            />
          ) : (
            /* High-Performance Hardware-Accelerated CSS 3D Ticket for Mobile & Non-WebGL */
            <div
              className="w-[94%] max-w-[540px] aspect-[1.85/1] rounded-3xl p-5 sm:p-7 border border-[#C7A675]/50 bg-gradient-to-br from-[#1E2128] via-[#15171B] to-[#08090B] shadow-2xl flex flex-col justify-between transition-all duration-300 group-hover:scale-[1.02] group-hover:border-[#C7A675] relative overflow-hidden"
              style={{
                animation: reducedMotion ? 'none' : 'cinebookFloat 5s ease-in-out infinite',
                boxShadow: '0 20px 50px -10px rgba(199, 166, 117, 0.35)',
                transform: 'translateZ(0)'
              }}
            >
              {/* Subtle Luxury Geometric Micro-Grid */}
              <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage: 'linear-gradient(#C7A675 1px, transparent 1px), linear-gradient(90deg, #C7A675 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              />
              <div className="relative z-10 flex items-center justify-between border-b border-[#C7A675]/25 pb-2.5">
                <span className="text-[11px] sm:text-xs font-bold tracking-widest text-[#C7A675] uppercase flex items-center gap-1.5">
                  ✦ CINEBOOK VIP PREMIERE PASS
                </span>
                <span className="text-[11px] sm:text-xs font-mono font-bold text-[#DFC49D] px-2 py-0.5 rounded bg-[#C7A675]/20 border border-[#C7A675]/40">
                  ₹5.00 TICKET
                </span>
              </div>
              <div className="relative z-10 space-y-1.5 my-auto">
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F3F0E8] tracking-wide">{activeMovie.title}</h3>
                <p className="text-xs text-[#A8ADB4] font-medium">{activeMovie.genre.slice(0, 3).join(' • ')}  |  {activeMovie.duration}</p>
              </div>
              <div className="relative z-10 flex items-center justify-between pt-2.5 border-t border-[#C7A675]/25 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[#A8ADB4] text-[11px]">AUDI 1 • A1, A2 (VIP)</span>
                  <span className="text-[#C7A675] font-bold">★ {activeMovie.rating.toFixed(1)} / 10</span>
                </div>
                <span className="font-mono text-[10px] text-[#A8ADB4] tracking-widest">#CINEBOOK-VIP</span>
              </div>
            </div>
          )}

          {/* Interactive Floating Ticket Action Indicator (Clarity on hover/focus) */}
          <div className="absolute bottom-2 sm:bottom-4 px-3.5 py-1.5 rounded-full bg-[#15171B]/95 border border-[#C7A675]/40 text-[#DFC49D] text-[10px] sm:text-xs font-bold tracking-wider uppercase backdrop-blur-xl shadow-xl flex items-center gap-1.5 opacity-90 group-hover:opacity-100 group-hover:border-[#C7A675] group-hover:scale-105 transition-all pointer-events-none">
            <Ticket className="w-3.5 h-3.5 text-[#C7A675] fill-[#C7A675]" />
            <span>Click or Tap Ticket to View Showtimes (₹5)</span>
          </div>

          {/* Floating Companion Badge: Left Flank (Desktop) */}
          <div
            data-cursor="VERIFIED"
            className="hidden md:flex absolute -left-4 top-1/3 -translate-y-1/2 flex-col gap-1 p-4 rounded-2xl bg-[#15171B]/95 border border-[#C7A675]/20 backdrop-blur-xl shadow-2xl pointer-events-auto hover:border-[#C7A675]/60 hover:scale-105 transition-all duration-300 animate-float-slow cursor-default"
          >
            <div className="flex items-center gap-2 text-[#C7A675] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#C7A675]" />
              <span>Verified Hold Engine</span>
            </div>
            <span className="text-[11px] text-[#A8ADB4]">10-Min Concurrency Lock</span>
          </div>

          {/* Floating Companion Badge: Right Flank (Desktop) */}
          <div
            data-cursor="GUARANTEE"
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 flex-col gap-1 p-4 rounded-2xl bg-[#15171B]/95 border border-[#C7A675]/20 backdrop-blur-xl shadow-2xl pointer-events-auto hover:border-[#DFC49D]/60 hover:scale-105 transition-all duration-300 animate-float-delayed cursor-default"
          >
            <div className="flex items-center gap-2 text-[#DFC49D] text-xs font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4 text-[#DFC49D]" />
              <span>₹5 Flat Guarantee</span>
            </div>
            <span className="text-[11px] text-[#A8ADB4]">Zero Convenience Markup</span>
          </div>
        </div>

        {/* 5. CALL TO ACTION ACTIONS */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6 z-20">
          {/* Primary Book Tickets Action */}
          <button
            ref={bookBtnRef}
            type="button"
            data-cursor="BOOK"
            onClick={handleBookNow}
            className="champagne-btn btn-tactile cursor-pointer"
          >
            <Ticket className="w-4 h-4 fill-[#08090B]" />
            <span>{t.home.bookNow} • ₹5</span>
          </button>

          {/* Explore Movies Action */}
          <button
            type="button"
            data-cursor="EXPLORE"
            onClick={() => {
              const el = document.getElementById('explore-movies-grid');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                navigate(`/movie/${activeMovie.id}`);
              }
            }}
            className="champagne-btn-outline btn-tactile cursor-pointer"
          >
            <ArrowDown className="w-4 h-4 text-[#C7A675]" />
            <span>Explore Selections</span>
          </button>

          {/* Watch Teaser Modal Button */}
          <button
            ref={trailerBtnRef}
            type="button"
            data-cursor="TRAILER"
            onClick={() => onOpenTrailer(activeMovie.title)}
            className="flex items-center gap-2 px-4 sm:px-5 py-3 sm:py-4 rounded-full font-semibold text-xs sm:text-sm text-[#A8ADB4] hover:text-[#F3F0E8] bg-transparent hover:bg-white/5 transition-colors cursor-pointer active:scale-95 btn-tactile"
          >
            <Play className="w-4 h-4 text-[#C7A675] fill-[#C7A675]" />
            <span>Trailer</span>
          </button>
        </div>

        {/* 6. TRENDING MOVIE SELECTOR STRIP */}
        <div className="w-full max-w-3xl mt-8 pt-5 border-t border-white/10 flex flex-col items-center gap-2.5">
          <span className="text-[10px] sm:text-[11px] font-bold text-[#A8ADB4] tracking-[0.2em] uppercase">
            ✦ SELECT CINEMATIC PASS ✦
          </span>
          <div className="flex items-center justify-center gap-1.5 sm:gap-3 flex-wrap">
            {movies.slice(0, 5).map(m => {
              const isSelected = m.id === activeMovie.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  data-cursor="SELECT"
                  onClick={() => onSelectMovie(m)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold transition-all duration-300 cursor-pointer border ${
                    isSelected
                      ? 'bg-[#C7A675]/15 text-[#F3F0E8] border-[#C7A675] shadow-lg shadow-black/50 scale-105'
                      : 'bg-[#15171B] text-[#A8ADB4] border-white/10 hover:border-[#C7A675]/40 hover:text-[#F3F0E8]'
                  }`}
                >
                  <span
                    className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${
                      isSelected ? 'bg-[#C7A675] animate-pulse' : 'bg-slate-600'
                    }`}
                  />
                  <span>{m.title}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
