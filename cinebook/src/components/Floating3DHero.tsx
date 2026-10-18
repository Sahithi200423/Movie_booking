import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import {
  Ticket,
  Play,
  Sparkles,
  ArrowDown,
  ShieldCheck,
  Zap
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
 * - Large realistic 3D CineBook ticket floating in the center
 * - Continuous smooth floating and gentle rotation
 * - Mouse-controlled tilt and parallax physics
 * - Oversized CINEBOOK typography behind the ticket
 * - Dark charcoal background with cinematic red & cobalt lighting
 * - Realistic shadows, reflections, and chamfered physical materials
 * - Smooth transitions between featured movies
 * - WebGL rendering with automatic graceful CSS 3D fallback
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

  // WebGL support detection
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

  // Parallax mouse offsets (-1 to 1)
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
    bgGrad.addColorStop(0, '#10121A');
    bgGrad.addColorStop(0.5, '#0A0B10');
    bgGrad.addColorStop(1, '#06070A');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Subtle luxury geometric grid pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
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

    // 3. Cinematic Red & Gold Radial Ambient Sheen
    const radial = ctx.createRadialGradient(
      canvas.width * 0.35,
      canvas.height * 0.4,
      50,
      canvas.width * 0.35,
      canvas.height * 0.4,
      700
    );
    radial.addColorStop(0, 'rgba(225, 29, 72, 0.22)');
    radial.addColorStop(0.6, 'rgba(225, 29, 72, 0.05)');
    radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 4. Gold / Ruby Outer Border Foil
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.7)';
    ctx.lineWidth = 14;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 3;
    ctx.strokeRect(58, 58, canvas.width - 116, canvas.height - 116);

    // 5. Perforation dividing line between Main Ticket and Stub (at x = 1450)
    const stubX = 1450;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 6;
    ctx.setLineDash([20, 16]);
    ctx.beginPath();
    ctx.moveTo(stubX, 40);
    ctx.lineTo(stubX, canvas.height - 40);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash

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

    // 8. Main Movie Title (Large & Bold)
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

    // 10. Luxury Feature Pills (IMAX 3D, ₹5 PRICE, 7-MIN HOLD)
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
    texture.needsUpdate = true;
    return texture;
  }, []);

  // WebGL 3D Scene Initialization
  useEffect(() => {
    if (!canvasRef.current) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let ticketMesh: THREE.Mesh | null = null;
    let shadowMesh: THREE.Mesh | null = null;
    let pointLightRed: THREE.PointLight | null = null;
    let pointLightBlue: THREE.PointLight | null = null;
    let animationFrameId: number;

    try {
      // 1. Renderer Setup
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      // 2. Scene & Camera Setup
      scene = new THREE.Scene();

      const width = canvasRef.current.clientWidth || 800;
      const height = canvasRef.current.clientHeight || 550;
      camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
      camera.position.set(0, 0, 7.8);

      // 3. Lighting Setup: Theatrical Red & Cool Accent
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
      scene.add(ambientLight);

      // Dramatic Red/Crimson Theatrical Rim Light (AURAL hardware aesthetic)
      pointLightRed = new THREE.PointLight(0xe11d48, 6.5, 20);
      pointLightRed.position.set(4.5, 2.5, 3.5);
      scene.add(pointLightRed);

      // Soft Cobalt/Cyan Balance Light
      pointLightBlue = new THREE.PointLight(0x38bdf8, 4.0, 18);
      pointLightBlue.position.set(-4.5, -1.5, 3.0);
      scene.add(pointLightBlue);

      // Directional Overhead Spotlight
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.6);
      dirLight.position.set(0, 6, 4);
      scene.add(dirLight);

      // 4. Ticket Geometry with Chamfered Edges
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

      // Normalize UV mapping for ticket front face
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

      // 5. Materials Setup
      const frontTexture = createTicketTexture(activeMovie);
      frontTexture.wrapS = THREE.ClampToEdgeWrapping;
      frontTexture.wrapT = THREE.ClampToEdgeWrapping;

      // Front face material with clearcoat metallic finish
      const frontMaterial = new THREE.MeshPhysicalMaterial({
        map: frontTexture,
        metalness: 0.82,
        roughness: 0.18,
        clearcoat: 0.9,
        clearcoatRoughness: 0.12,
        reflectivity: 0.85
      });

      // Side chamfered edge material: dark anodized gunmetal/ruby
      const sideMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1c24,
        metalness: 0.95,
        roughness: 0.25
      });

      ticketMesh = new THREE.Mesh(geometry, [frontMaterial, sideMaterial]);
      scene.add(ticketMesh);

      // 6. Floating Contact Shadow on Floor Plane
      const shadowCanvas = document.createElement('canvas');
      shadowCanvas.width = 256;
      shadowCanvas.height = 256;
      const sCtx = shadowCanvas.getContext('2d');
      if (sCtx) {
        const rad = sCtx.createRadialGradient(128, 128, 20, 128, 128, 120);
        rad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
        rad.addColorStop(0.4, 'rgba(225, 29, 72, 0.18)');
        rad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        sCtx.fillStyle = rad;
        sCtx.fillRect(0, 0, 256, 256);
      }
      const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
      const shadowGeo = new THREE.PlaneGeometry(6.5, 2.8);
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

      // 7. Handle Resize
      const handleResize = () => {
        if (!containerRef.current || !renderer || !camera) return;
        const newWidth = containerRef.current.clientWidth;
        const newHeight = containerRef.current.clientHeight;

        camera.aspect = newWidth / newHeight;
        if (newWidth < 640) {
          // Mobile responsive zoom adjustment
          camera.position.z = 9.2;
        } else if (newWidth < 1024) {
          camera.position.z = 8.4;
        } else {
          camera.position.z = 7.8;
        }
        camera.updateProjectionMatrix();

        renderer.setSize(newWidth, newHeight);
      };

      handleResize();
      window.addEventListener('resize', handleResize);

      // 8. Animation & Physics Loop
      let clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Mouse Parallax Physics (Smooth Exponential Lerp)
        const mouse = mouseRef.current;
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        if (ticketMesh) {
          if (!reducedMotion) {
            // Gentle continuous floating levitation
            const floatY = Math.sin(elapsedTime * 1.6) * 0.16;
            const floatRotZ = Math.cos(elapsedTime * 1.2) * 0.02;

            ticketMesh.position.y = floatY;

            // Combined mouse tilt + idle floating oscillation
            const targetRotX = mouse.y * 0.45 - Math.sin(elapsedTime * 0.8) * 0.04;
            const targetRotY = mouse.x * 0.65 + Math.sin(elapsedTime * 0.9) * 0.08;

            ticketMesh.rotation.x = targetRotX;
            ticketMesh.rotation.y = targetRotY;
            ticketMesh.rotation.z = floatRotZ - mouse.x * 0.12;

            // Dynamic shadow response to ticket height
            if (shadowMesh) {
              const shadowScale = 1 - floatY * 0.6;
              shadowMesh.scale.set(shadowScale, shadowScale, shadowScale);
              shadowMat.opacity = 0.55 - floatY * 0.25;
            }
          } else {
            // Static accessible micro-tilt without continuous spin
            ticketMesh.rotation.x = mouse.y * 0.2;
            ticketMesh.rotation.y = mouse.x * 0.3;
          }
        }

        // Mouse specular lighting interaction
        if (pointLightRed) {
          pointLightRed.position.x = 4.5 + mouse.x * 2.5;
          pointLightRed.position.y = 2.5 - mouse.y * 2.0;
        }

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      };

      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
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
      console.warn('WebGL Initialization notice, falling back to CSS 3D:', err);
      setWebglSupported(false);
    }
  }, [activeMovie, createTicketTexture, reducedMotion]);

  // Pointer move handler for 3D tilt
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

  const handlePointerEnter = () => {
    setIsHovered(true);
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#181926_0%,#0C0D14_60%,#06070A_100%)]" />

        {/* Theatrical Red Glow (Right Rim) */}
        <div className="absolute -top-32 right-0 w-[550px] sm:w-[750px] h-[550px] sm:h-[750px] rounded-full bg-rose-600/15 blur-[140px] pointer-events-none" />

        {/* Theatrical Cobalt Glow (Left Bottom Accent) */}
        <div className="absolute -bottom-32 left-0 w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />

        {/* Subtle grid pattern */}
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
          className="text-[18vw] font-black tracking-[0.18em] uppercase text-transparent select-none whitespace-nowrap transition-transform duration-700 ease-out"
          style={{
            WebkitTextStroke: '2px rgba(244, 63, 94, 0.12)',
            textShadow: '0 0 60px rgba(225, 29, 72, 0.08)',
            transform: `translate3d(${-mouseRef.current.x * 25}px, ${-mouseRef.current.y * 15}px, 0)`,
            fontFamily: '"Outfit", "Inter", sans-serif'
          }}
        >
          CINEBOOK
        </span>
      </div>

      {/* 3. MAIN HERO VIEWPORT CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-16 sm:pb-24 flex flex-col items-center">
        
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-white/5 border border-white/10 text-rose-400 backdrop-blur-xl shadow-lg shadow-rose-950/30 mb-4 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span>V3 SIGNATURE EXPERIENCE • LUXURY CINEMA</span>
        </div>

        {/* Featured Movie Title & Quick Tagline */}
        <div className="text-center max-w-3xl space-y-2 mb-2 sm:mb-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase drop-shadow-md">
            {activeMovie.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide">
            {activeMovie.genre.join(' • ')}  |  {activeMovie.duration}  |  
            <span className="text-rose-400 font-bold ml-1">★ {activeMovie.rating.toFixed(1)} / 10</span>
          </p>
        </div>

        {/* 4. 3D FLOATING TICKET STAGE */}
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          className="relative w-full max-w-4xl h-[360px] sm:h-[460px] md:h-[520px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
        >
          {webglSupported ? (
            /* Three.js Hardware-Accelerated 3D Canvas */
            <canvas
              ref={canvasRef}
              className="w-full h-full block focus:outline-none"
              style={{ filter: isHovered ? 'drop-shadow(0 20px 40px rgba(225, 29, 72, 0.25))' : 'none', transition: 'filter 0.5s ease' }}
            />
          ) : (
            /* Graceful CSS 3D Fallback for non-WebGL devices */
            <div
              className="w-[90%] max-w-[620px] aspect-[1.8/1] rounded-3xl p-6 border border-rose-500/40 bg-gradient-to-br from-[#1E202E] via-[#0E1017] to-[#0A0A0F] shadow-2xl flex flex-col justify-between transition-transform duration-300"
              style={{
                transform: `perspective(1000px) rotateX(${mouseRef.current.y * 15}deg) rotateY(${mouseRef.current.x * 20}deg)`,
                boxShadow: '0 25px 60px -15px rgba(225, 29, 72, 0.35)'
              }}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold tracking-widest text-rose-400 uppercase">✦ CINEBOOK VIP PASS</span>
                <span className="text-xs font-mono font-bold text-blue-400">₹5.00 TICKET</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl sm:text-3xl font-black text-white">{activeMovie.title}</h3>
                <p className="text-xs text-slate-400">{activeMovie.genre.join(', ')} • {activeMovie.duration}</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                <span className="text-slate-400">AUDI 1 • VIP RECLINER</span>
                <span className="text-amber-400 font-bold">★ {activeMovie.rating.toFixed(1)} / 10</span>
              </div>
            </div>
          )}

          {/* Floating Companion Badge: Left Pill */}
          <div className="hidden md:flex absolute -left-4 top-1/3 -translate-y-1/2 flex-col gap-1 p-3.5 rounded-2xl bg-[#141622]/90 border border-white/15 backdrop-blur-xl shadow-2xl pointer-events-none animate-float-slow">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase">
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              <span>Verified Hold Engine</span>
            </div>
            <span className="text-[11px] text-slate-400">7-Min Concurrency Lock</span>
          </div>

          {/* Floating Companion Badge: Right Pill */}
          <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 flex-col gap-1 p-3.5 rounded-2xl bg-[#141622]/90 border border-white/15 backdrop-blur-xl shadow-2xl pointer-events-none animate-float-delayed">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase">
              <Zap className="w-4 h-4 text-blue-400" />
              <span>₹5 Flat Guarantee</span>
            </div>
            <span className="text-[11px] text-slate-400">Zero Convenience Markup</span>
          </div>
        </div>

        {/* 5. CALL TO ACTION ACTIONS */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6 z-20">
          {/* Primary Book Tickets Action */}
          <button
            type="button"
            onClick={handleBookNow}
            className="flex items-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-black text-xs sm:text-sm tracking-wider uppercase bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-xl shadow-rose-600/30 active:scale-95 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
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
            className="flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold text-xs sm:text-sm border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white backdrop-blur-xl active:scale-95 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
          >
            <ArrowDown className="w-4 h-4" />
            <span>Explore Movies</span>
          </button>

          {/* Watch Teaser Modal Button */}
          <button
            type="button"
            onClick={() => onOpenTrailer(activeMovie.title)}
            className="flex items-center gap-2 px-5 py-3.5 sm:py-4 rounded-full font-semibold text-xs sm:text-sm text-slate-400 hover:text-white bg-transparent hover:bg-white/5 transition-colors cursor-pointer active:scale-95"
          >
            <Play className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span>Trailer</span>
          </button>
        </div>

        {/* 6. TRENDING MOVIE SELECTOR STRIP */}
        <div className="w-full max-w-3xl mt-10 pt-6 border-t border-white/10 flex flex-col items-center gap-3">
          <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">
            ✦ SELECT FEATURED 3D PASS ✦
          </span>
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            {movies.slice(0, 5).map(m => {
              const isSelected = m.id === activeMovie.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onSelectMovie(m)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer border ${
                    isSelected
                      ? 'bg-rose-600/20 text-rose-300 border-rose-500 shadow-lg shadow-rose-950/40 scale-105 ring-1 ring-rose-500/50'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
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
