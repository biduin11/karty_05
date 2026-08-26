"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    pannellum?: {
      viewer: (id: string, config: Record<string, unknown>) => { destroy: () => void };
    };
  }
}

export default function PanoramaViewer({ src }: { src: string }) {
  const containerId = "pano-viewer";
  const [ready, setReady] = useState(false);
  const viewerRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    if (!ready || !window.pannellum) return;
    viewerRef.current = window.pannellum.viewer(containerId, {
      type: "equirectangular",
      panorama: src,
      autoLoad: true,
      compass: false,
      showZoomCtrl: true,
      showFullscreenCtrl: true,
      hfov: 110,
    });
    return () => {
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
  }, [ready, src]);

  return (
    <>
      <link rel="stylesheet" href="/vendor/pannellum/pannellum.css" />
      <Script
        src="/vendor/pannellum/pannellum.js"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
        onLoad={() => setReady(true)}
      />
      <div id={containerId} className="pano-viewer" />
    </>
  );
}
