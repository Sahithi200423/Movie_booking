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

  // WebGL & Motion state
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

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
    canvas.width = 2048;
    canvas.height = 1152;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // 1. Luxury Dark Charcoal / Carbon Base Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGrad.addColorStop(0, '#12131C');
    bgGrad.addColorStop(0.4, '#0A0B10');
    bgGrad.addColorStop(1, '#050608');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Subtle Luxury Geometric Diagonal Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    ctx.lineWidth = 2;
    for (let x = 0; x < canvas.width; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // 3. Cinematic Red / Crimson Ambient Radial Glow
    const radial = ctx.createRadialGradient(
      canvas.width * 0.35,
      canvas.height * 0.45,
      50,
      canvas.width * 0.35,
      canvas.height * 0.45,
      800
    );
    radial.addColorStop(0, 'rgba(225, 29, 72, 0.28)');
    radial.addColorStop(0.5, 'rgba(159, 18, 57, 0.12)');
    radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 4. Gold / Ruby Outer Border Foil
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.85)';
    ctx.lineWidth = 14;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 3;
    ctx.strokeRect(58, 58, canvas.width - 116, canvas.height - 116);

    // 5. Perforation Dividing Line between Ticket Body and Stub (at x = 1450)
    const stubX = 1450;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 6;
    ctx.setLineDash([22, 16]);
    ctx.beginPath();
    ctx.moveTo(stubX, 40);
    ctx.lineTo(stubX, canvas.height - 40);
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // 6. Header: CINEBOOK VIP PREMIERE PASS
    ctx.fillStyle = '#E11D48';
    ctx.font = 'bold 36px "Outfit", "Inter", sans-serif';
    ctx.letterSpacing = '8px';
    ctx.fillText('✦ CINEBOOK LUXURY PASS • VIP EXPERIENCE ✦', 100, 130);

    // 7. Cinema & Hall Info
    ctx.fillStyle = '#94A3B8';
    ctx.font = '500 28px "Inter", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('PVR INOX • AUDITORIUM 1 • 4K LASER DOLBY ATMOS', 100, 180);

    // 8. Main Movie Title (Large & Bold with Subtitle Drop)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 88px "Outfit", "Inter", sans-serif';
    ctx.letterSpacing = '2px';
    const cleanTitle = movie.title.toUpperCase();
    ctx.fillText(cleanTitle, 100, 310);

    // 9. Movie Details: Rating, Genre, Duration
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 36px "Inter", sans-serif';
    ctx.fillText(`★ ${movie.rating.toFixed(1)} / 10`, 100, 390);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '600 32px "Inter", sans-serif';
    const genres = movie.genre.slice(0, 3).join(' • ');
    ctx.fillText(`${genres}  |  ${movie.duration}  |  ${movie.ageRating || 'UA'}`, 340, 390);

    // 10. Luxury Feature Pills (IMAX 3D, ₹5 PRICE, 10-MIN HOLD)
    const pills = [
      { text: 'IMAX 3D LASER', bg: '#1E293B', border: '#475569', color: '#38BDF8' },
      { text: '₹5 FLAT TICKET GUARANTEE', bg: '#881337', border: '#E11D48', color: '#FECDD3' },
      { text: 'VERIFIED CONCURRENCY SEAT HOLD', bg: '#14532D', border: '#22C55E', color: '#BBF7D0' }
    ];

    let pillX = 100;
    pills.forEach(pill => {
      ctx.font = 'bold 26px "Inter", sans-serif';
      const textWidth = ctx.measureText(pill.text).width;
      const pillWidth = textWidth + 48;
      const pillHeight = 60;
      const pillY = 460;

      ctx.fillStyle = pill.bg;
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 30);
      ctx.fill();

      ctx.strokeStyle = pill.border;
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = pill.color;
      ctx.fillText(pill.text, pillX + 24, pillY + 41);

      pillX += pillWidth + 24;
    });

    // 11. Seat Number and Time Grid Box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(100, 560, 1260, 320, 24);
    ctx.fill();
    ctx.stroke();

    // Section 1: SEAT NUMBER
    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 24px "Inter", sans-serif';
    ctx.fillText('ALLOCATED SEATS', 140, 620);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 64px "Outfit", monospace';
    ctx.fillText('A1, A2 • VIP RECLINER', 140, 710);
    ctx.fillStyle = '#38BDF8';
    ctx.font = '600 26px "Inter", sans-serif';
    ctx.fillText('Front Row Prime Audio Zone', 140, 770);

    // Section 2: SHOWTIME & DATE
    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 24px "Inter", sans-serif';
    ctx.fillText('DATE & TIME', 760, 620);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 52px "Outfit", sans-serif';
    ctx.fillText('TODAY • 04:30 PM', 760, 700);
    ctx.fillStyle = '#F43F5E';
    ctx.font = 'bold 26px "Inter", sans-serif';
    ctx.fillText('Doors open 15 min prior', 760, 770);

    // Section 3: PRICE TAG
    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 24px "Inter", sans-serif';
    ctx.fillText('PRICE PER TICKET', 1140, 620);
    ctx.fillStyle = '#38BDF8';
    ctx.font = '900 68px "Outfit", sans-serif';
    ctx.fillText('₹5.00', 1140, 710);
    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 22px "Inter", sans-serif';
    ctx.fillText('All Taxes Incl.', 1140, 770);

    // 12. Bottom Barcode across main ticket
    ctx.fillStyle = '#FFFFFF';
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

    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 24px monospace';
    ctx.letterSpacing = '6px';
    ctx.fillText(`CINEBOOK-SECURE-TOKEN • #${movie.id.toUpperCase()}-2026-X99`, 100, 1090);

    // 13. STUB SECTION (Right of perforation at x = 1450)
    ctx.save();
    ctx.translate(1500, 0);

    // Stub Title & Brand
    ctx.fillStyle = '#E11D48';
    ctx.font = 'bold 32px "Outfit", sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('STUB CHECK', 20, 130);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 48px "Outfit", sans-serif';
    ctx.fillText(cleanTitle.slice(0, 14), 20, 210);

    // Stub Details Box
    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 24px "Inter", sans-serif';
    ctx.fillText('AUDITORIUM 1', 20, 270);
    ctx.fillText('ROW A • SEAT 1, 2', 20, 310);
    ctx.fillText('TIME: 04:30 PM', 20, 350);

    // Stub Hologram Seal Graphic
    const sealX = 230;
    const sealY = 560;
    const sealRad = 150;
    const sealGrad = ctx.createLinearGradient(sealX - sealRad, sealY - sealRad, sealX + sealRad, sealY + sealRad);
    sealGrad.addColorStop(0, '#F43F5E');
    sealGrad.addColorStop(0.5, '#6366F1');
    sealGrad.addColorStop(1, '#38BDF8');
    ctx.fillStyle = sealGrad;
    ctx.beginPath();
    ctx.arc(sealX, sealY, sealRad, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(sealX, sealY, sealRad - 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★ VIP ★', sealX, sealY - 10);
    ctx.font = 'bold 24px "Inter", sans-serif';
    ctx.fillText('₹5 VERIFIED', sealX, sealY + 30);
    ctx.textAlign = 'start'; // reset

    // Stub Mini Barcode
    const stubBarcodeY = 820;
    let sBx = 40;
    for (let i = 0; i < 35; i++) {
      const bw = (i % 3 === 0) ? 8 : 4;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(sBx, stubBarcodeY, bw, 130);
      sBx += bw + 8;
    }

    ctx.fillStyle = '#64748B';
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

  // WebGL 3D Scene Initialization & Physics Engine
  useEffect(() => {
    if (!canvasRef.current) return;

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

      // Adaptive DPR: capped at 1.75 for mobile battery longevity
      const isSmallScreen = (containerRef.current?.clientWidth || window.innerWidth) < 640;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmallScreen ? 1.75 : 2.0));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      // 2. Scene & Camera Setup
      scene = new THREE.Scene();

      const width = canvasRef.current.clientWidth || 800;
      const height = canvasRef.current.clientHeight || 500;
      camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
      camera.position.set(0, 0, 7.6);

      // 3. Lighting Setup: Luxury Theatrical Red, Amber & Cool Specular
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
      scene.add(ambientLight);

      // Theatrical Red/Crimson Main Specular Rim Light
      pointLightRed = new THREE.PointLight(0xe11d48, 7.5, 22);
      pointLightRed.position.set(4.5, 2.5, 3.5);
      scene.add(pointLightRed);

      // Soft Cobalt/Cyan Balance Light
      pointLightBlue = new THREE.PointLight(0x38bdf8, 4.2, 18);
      pointLightBlue.position.set(-4.5, -1.5, 3.0);
      scene.add(pointLightBlue);

      // Warm Amber Under-Glow
      amberUnderLight = new THREE.PointLight(0xf59e0b, 2.5, 14);
      amberUnderLight.position.set(0, -3.2, 2.8);
      scene.add(amberUnderLight);

      // Directional Overhead Spotlight
      dirLight = new THREE.DirectionalLight(0xfff1f2, 1.8);
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

      // 5. Materials Setup (AURAL Luxury Red Metallic & Clearcoat)
      const frontTexture = createTicketTexture(activeMovie);
      frontTexture.wrapS = THREE.ClampToEdgeWrapping;
      frontTexture.wrapT = THREE.ClampToEdgeWrapping;

      // Front face material with clearcoat metallic finish & iridescence
      const frontMaterial = new THREE.MeshPhysicalMaterial({
        map: frontTexture,
        metalness: 0.88,
        roughness: 0.14,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        reflectivity: 0.95,
        iridescence: 0.4,
        iridescenceIOR: 1.35
      });

      // Side chamfered edge material: dark anodized ruby obsidian
      const sideMaterial = new THREE.MeshStandardMaterial({
        color: 0x1f0b12,
        metalness: 0.96,
        roughness: 0.18
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
        rad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
        rad.addColorStop(0.4, 'rgba(225, 29, 72, 0.22)');
        rad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        sCtx.fillStyle = rad;
        sCtx.fillRect(0, 0, 256, 256);
      }
      const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
      const shadowGeo = new THREE.PlaneGeometry(6.6, 2.9);
      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.6,
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
      if (typeof window !== 'undefined' && 'IntersectionObserver' in window && containerRef.current) {
        observer = new IntersectionObserver(
          ([entry]) => {
            isVisible = entry.isIntersecting;
          },
          { threshold: 0.05 }
        );
        observer.observe(containerRef.current);
      }

      // 9. Continuous Animation & Autonomous Physics Loop
      let clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        // Skip GPU render when off-screen to preserve mobile CPU & battery
        if (!isVisible) return;

        const elapsedTime = clock.getElapsedTime();

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
  }, [activeMovie, createTicketTexture, reducedMotion]);

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
      className={`relative w-full overflow-hidden bg-[#0A0B10] text-slate-100 select-none ${
        isRTL ? 'rtl' : 'ltr'
      }`}
    >
      {/* 1. CINEMATIC BACKGROUND ATMOSPHERE WITH LUXURY GRADIENTS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep Charcoal Radial Ambient Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#181926_0%,#0C0D14_60%,#06070A_100%)]" />

        {/* Theatrical Red Glow (Right Rim) */}
        <div className="absolute -top-32 right-0 w-[550px] sm:w-[750px] h-[550px] sm:h-[750px] rounded-full bg-rose-600/15 blur-[140px] pointer-events-none" />

        {/* Theatrical Cobalt Glow (Left Bottom Accent) */}
        <div className="absolute -bottom-32 left-0 w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />

        {/* Floating Decorative Film Elements */}
        <div className="absolute top-12 left-8 opacity-15 hidden sm:block animate-pulse">
          <Film className="w-12 h-12 text-rose-500" />
        </div>
        <div className="absolute bottom-16 right-8 opacity-15 hidden sm:block animate-pulse" style={{ animationDelay: '1.5s' }}>
          <Film className="w-10 h-10 text-blue-500" />
        </div>

        {/* Subtle Luxury Film Grid */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      {/* 2. OVERSIZED "CINEBOOK" TYPOGRAPHY BEHIND OBJECT (AURAL INSPIRED) */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0"
        aria-hidden="true"
      >
        <span
          className="text-[22vw] sm:text-[18vw] font-black tracking-[0.16em] uppercase text-transparent select-none whitespace-nowrap transition-transform duration-700 ease-out"
          style={{
            WebkitTextStroke: '2px rgba(244, 63, 94, 0.12)',
            textShadow: '0 0 70px rgba(225, 29, 72, 0.08)',
            transform: `translate3d(${-mouseRef.current.x * 25}px, ${-mouseRef.current.y * 15}px, 0)`,
            fontFamily: '"Outfit", "Inter", sans-serif'
          }}
        >
          CINEBOOK
        </span>
      </div>

      {/* 3. MAIN HERO VIEWPORT CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12 pb-12 sm:pb-20 flex flex-col items-center">
        
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold tracking-widest uppercase bg-white/5 border border-white/10 text-rose-400 backdrop-blur-xl shadow-lg shadow-rose-950/30 mb-3 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span>V3 SIGNATURE EXPERIENCE • LUXURY CINEMA</span>
        </div>

        {/* Featured Movie Title & Quick Tagline */}
        <div className="text-center max-w-3xl space-y-1.5 mb-1 sm:mb-3">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase drop-shadow-md">
            {activeMovie.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide">
            {activeMovie.genre.join(' • ')}  |  {activeMovie.duration}  |  
            <span className="text-rose-400 font-bold ml-1">★ {activeMovie.rating.toFixed(1)} / 10</span>
          </p>

          {/* Mobile Companion Badges (Under title on mobile) */}
          <div className="flex md:hidden items-center justify-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 border border-rose-500/25 text-rose-300">
              <ShieldCheck className="w-3 h-3 text-rose-400" />
              10-Min Concurrency Lock
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 border border-blue-500/25 text-blue-300">
              <Zap className="w-3 h-3 text-blue-400" />
              ₹5 Flat Guarantee
            </span>
          </div>
        </div>

        {/* 4. 3D FLOATING TICKET STAGE (320px to 1440px Centered) */}
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="relative w-full max-w-4xl h-[280px] xs:h-[310px] sm:h-[400px] md:h-[480px] lg:h-[510px] flex items-center justify-center select-none pointer-events-none"
        >
          {webglSupported ? (
            /* Three.js Hardware-Accelerated 3D Canvas */
            <canvas
              ref={canvasRef}
              className="w-full h-full block focus:outline-none pointer-events-none"
              style={{
                filter: isHovered ? 'drop-shadow(0 20px 45px rgba(225, 29, 72, 0.3))' : 'none',
                transition: 'filter 0.5s ease'
              }}
            />
          ) : (
            /* Graceful Animated CSS 3D Fallback for Non-WebGL Devices */
            <div
              className="w-[92%] max-w-[560px] aspect-[1.8/1] rounded-3xl p-5 sm:p-7 border border-rose-500/40 bg-gradient-to-br from-[#1E1118] via-[#0E0F16] to-[#06070A] shadow-2xl flex flex-col justify-between transition-transform duration-500"
              style={{
                animation: reducedMotion ? 'none' : 'cinebookFloat 5s ease-in-out infinite',
                boxShadow: '0 25px 60px -15px rgba(225, 29, 72, 0.45)',
                transformStyle: 'preserve-3d'
              }}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="text-[11px] sm:text-xs font-bold tracking-widest text-rose-400 uppercase">✦ CINEBOOK VIP PASS</span>
                <span className="text-[11px] sm:text-xs font-mono font-bold text-blue-400">₹5.00 TICKET</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl sm:text-3xl font-black text-white">{activeMovie.title}</h3>
                <p className="text-xs text-slate-400">{activeMovie.genre.join(', ')} • {activeMovie.duration}</p>
              </div>
              <div className="flex items-center justify-between pt-2.5 border-t border-white/10 text-xs">
                <span className="text-slate-400">AUDI 1 • VIP RECLINER</span>
                <span className="text-amber-400 font-bold">★ {activeMovie.rating.toFixed(1)} / 10</span>
              </div>
            </div>
          )}

          {/* Floating Companion Badge: Left Flank (Desktop) */}
          <div className="hidden md:flex absolute -left-4 top-1/3 -translate-y-1/2 flex-col gap-1 p-3.5 rounded-2xl bg-[#141622]/90 border border-white/15 backdrop-blur-xl shadow-2xl pointer-events-none animate-float-slow">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase">
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              <span>Verified Hold Engine</span>
            </div>
            <span className="text-[11px] text-slate-400">10-Min Concurrency Lock</span>
          </div>

          {/* Floating Companion Badge: Right Flank (Desktop) */}
          <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 flex-col gap-1 p-3.5 rounded-2xl bg-[#141622]/90 border border-white/15 backdrop-blur-xl shadow-2xl pointer-events-none animate-float-delayed">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase">
              <Zap className="w-4 h-4 text-blue-400" />
              <span>₹5 Flat Guarantee</span>
            </div>
            <span className="text-[11px] text-slate-400">Zero Convenience Markup</span>
          </div>
        </div>

        {/* 5. CALL TO ACTION ACTIONS */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6 z-20">
          {/* Primary Book Tickets Action */}
          <button
            type="button"
            onClick={handleBookNow}
            className="flex items-center gap-2.5 px-7 sm:px-10 py-3 sm:py-4 rounded-full font-black text-xs sm:text-sm tracking-wider uppercase bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-xl shadow-rose-600/30 active:scale-95 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
          >
            <Ticket className="w-4 h-4 fill-white" />
            <span>{t.home.bookNow} • ₹5</span>
          </button>

          {/* Explore Movies Action (Smooth scroll to movie catalogue) */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('explore-movies-grid');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                navigate(`/movie/${activeMovie.id}`);
              }
            }}
            className="flex items-center gap-2 px-5 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-xs sm:text-sm border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white backdrop-blur-xl active:scale-95 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
          >
            <ArrowDown className="w-4 h-4" />
            <span>Explore Movies</span>
          </button>

          {/* Watch Teaser Modal Button */}
          <button
            type="button"
            onClick={() => onOpenTrailer(activeMovie.title)}
            className="flex items-center gap-2 px-4 sm:px-5 py-3 sm:py-4 rounded-full font-semibold text-xs sm:text-sm text-slate-400 hover:text-white bg-transparent hover:bg-white/5 transition-colors cursor-pointer active:scale-95"
          >
            <Play className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span>Trailer</span>
          </button>
        </div>

        {/* 6. TRENDING MOVIE SELECTOR STRIP */}
        <div className="w-full max-w-3xl mt-8 pt-5 border-t border-white/10 flex flex-col items-center gap-2.5">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 tracking-widest uppercase">
            ✦ SELECT FEATURED 3D PASS ✦
          </span>
          <div className="flex items-center justify-center gap-1.5 sm:gap-3 flex-wrap">
            {movies.slice(0, 5).map(m => {
              const isSelected = m.id === activeMovie.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onSelectMovie(m)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-300 cursor-pointer border ${
                    isSelected
                      ? 'bg-rose-600/20 text-rose-300 border-rose-500 shadow-lg shadow-rose-950/40 scale-105 ring-1 ring-rose-500/50'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <span
                    className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${
                      isSelected ? 'bg-rose-500 animate-pulse' : 'bg-slate-600'
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
