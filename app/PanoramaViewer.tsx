"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    pannellum?: {
      viewer: (container: HTMLElement, config: Record<string, unknown>) => { destroy: () => void };
    };
  }
}

// The viewer script, stylesheet and panorama image are only fetched once the block
// is about to scroll into view, so they don't compete with the first screen.
export default function PanoramaViewer({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setNearViewport(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!ready || !el || !window.pannellum) return;
    const viewer = window.pannellum.viewer(el, {
      type: "equirectangular",
      panorama: src,
      autoLoad: true,
      compass: false,
      showZoomCtrl: true,
      showFullscreenCtrl: true,
      hfov: 110,
    });
    return () => viewer.destroy();
  }, [ready, src]);

  return (
    <>
      {nearViewport && (
        <>
          <link rel="stylesheet" href="/vendor/pannellum/pannellum.css" />
          <Script
            src="/vendor/pannellum/pannellum.js"
            strategy="afterInteractive"
            onReady={() => setReady(true)}
          />
        </>
      )}
      <div ref={containerRef} className="pano-viewer" aria-label="Панорама 360° — пример съёмки" />
    </>
  );
}
