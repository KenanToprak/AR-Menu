"use client";

import { useEffect, useState } from "react";

export default function ModelViewer({ src, alt }: { src: string; alt: string }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Dynamically import model-viewer only on client side to avoid SSR errors
    import("@google/model-viewer");
    setIsClient(true);
  }, []);

  if (!isClient) return <div className="w-full h-full bg-surface animate-pulse rounded-2xl flex items-center justify-center text-foreground/50 text-sm">Yükleniyor...</div>;

  return (
    <div className="w-full h-full relative bg-surface rounded-2xl overflow-hidden shadow-sm border border-border">
      {/* @ts-expect-error - Custom web component */}
      <model-viewer
        src={src}
        alt={alt}
        auto-rotate
        camera-controls
        ar
        ar-modes="webxr scene-viewer quick-look"
        shadow-intensity="1"
        style={{ width: "100%", height: "100%" }}
      >
        <button
          slot="ar-button"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold shadow-xl hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2 tracking-wide"
        >
          Masada Gör (AR)
        </button>
      {/* @ts-expect-error - Custom web component */}
      </model-viewer>
    </div>
  );
}
