'use client';

import { useEffect, useRef } from 'react';

/**
 * Three.js audio waveform sphere for the hero:
 * - Icosahedron with vertex displacement driven by a sine wave; vertices pulse
 *   outward rhythmically, suggesting audio.
 * - Color from the design source (#f23a2e), opacity 0.25, wireframe.
 * - Right side on desktop, hidden on mobile (<768px).
 * - Pauses when hero is out of viewport (IntersectionObserver).
 * - DPR limited to 1.5.
 */
export default function ThreeSphere() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = ref.current;
    if (!mount) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let running = true;
    let disposed = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let cleanup: (() => void) | null = null;

    void (async () => {
      const THREE = await import('three');
      if (disposed || !ref.current) return;

      const width = mount.clientWidth || 480;
      const height = mount.clientHeight || 560;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 0, 5.2);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // DPR cap
      renderer.setSize(width, height);
      mount.appendChild(renderer.domElement);

      const geometry = new THREE.IcosahedronGeometry(1.6, 5);
      const material = new THREE.MeshBasicMaterial({
        color: 0xf23a2e, // design-source primary
        wireframe: true,
        transparent: true,
        opacity: 0.25, // low opacity per spec
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Store original positions for displacement
      const pos = geometry.attributes.position as { array: Float32Array; count: number; needsUpdate: boolean };
      const original = Float32Array.from(pos.array);

      const clock = new THREE.Clock();

      const animate = () => {
        if (!running) return;
        raf = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        // Vertex displacement: sine wave along the surface, pulsing outward
        const arr = pos.array;
        for (let i = 0; i < pos.count; i++) {
          const ix = i * 3;
          const ox = original[ix];
          const oy = original[ix + 1];
          const oz = original[ix + 2];
          const wave = Math.sin(t * 2.2 + oy * 3.0 + ox * 1.6) * 0.5 + Math.sin(t * 1.1 + oz * 4.0) * 0.22;
          const k = 1 + wave * 0.09;
          arr[ix] = ox * k;
          arr[ix + 1] = oy * k;
          arr[ix + 2] = oz * k;
        }
        pos.needsUpdate = true;

        mesh.rotation.y = t * 0.12;
        mesh.rotation.x = Math.sin(t * 0.2) * 0.15;

        renderer.render(scene, camera);
      };
      animate();

      const onResize = () => {
        const w = mount.clientWidth || 480;
        const h = mount.clientHeight || 560;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize);

      // Pause when out of viewport
      const io = new IntersectionObserver(
        (entries) => {
          const visible = entries[0]?.isIntersecting ?? false;
          if (visible && !running) {
            running = true;
            clock.start();
            animate();
          } else if (!visible && running) {
            running = false;
            cancelAnimationFrame(raf);
          }
        },
        { threshold: 0.05 }
      );
      io.observe(mount);

      cleanup = () => {
        running = false;
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener('resize', onResize);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return <div ref={ref} className="absolute right-0 top-0 h-full w-[46%] hidden md:block" aria-hidden />;
}
