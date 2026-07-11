import { useEffect, useRef } from 'react';
import '../styles/animated-background.css';

/**
 * AnimatedBackground
 *
 * A full-screen, fixed background stack with:
 *   1. Animated blue gradient
 *   2. Floating mesh/radial gradients
 *   3. Three blurred glowing blobs
 *   4. Animated grid overlay
 *   5. Floating particles (generated once on mount)
 *
 * Usage:
 *   Import and render once, high in the tree (e.g. MainLayout).
 *   It is fully transparent to pointer events so it never
 *   blocks any page interaction.
 *
 * Props:
 *   particleCount {number}  — number of floating particles (default: 30)
 */
export default function AnimatedBackground({ particleCount = 30 }) {
  const particlesRef = useRef(null);

  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;

    // Build a document fragment so we only touch the DOM once
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('span');
      p.className = 'bg-particle';

      const size = Math.random() * 3 + 1;           // 1 – 4 px
      const duration = Math.random() * 10 + 10;     // 10 – 20 s
      const delay = Math.random() * 10;              // 0 – 10 s
      const left = Math.random() * 100;              // 0 – 100 %

      p.style.cssText = [
        `width: ${size}px`,
        `height: ${size}px`,
        `left: ${left}%`,
        `animation-duration: ${duration}s`,
        `animation-delay: -${delay}s`,   // negative delay → instant start spread
      ].join('; ');

      fragment.appendChild(p);
    }

    container.appendChild(fragment);

    // Cleanup on unmount (React StrictMode safe)
    return () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [particleCount]);

  return (
    <div className="bg-container" aria-hidden="true">
      {/* Layer 1 – base gradient */}
      <div className="bg-gradient" />

      {/* Layer 2 – floating mesh */}
      <div className="bg-mesh" />

      {/* Layer 3 – glowing blobs */}
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />

      {/* Layer 4 – grid overlay */}
      <div className="bg-grid" />

      {/* Layer 5 – particles (populated by useEffect) */}
      <div className="bg-particles" ref={particlesRef} />
    </div>
  );
}
