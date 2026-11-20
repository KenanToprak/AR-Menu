"use client";

import { useEffect, useRef, useState } from "react";
import { isSafeModelUrl } from "@/lib/menuUtils";

export default function ModelViewer({ src, alt }: { src: string; alt: string }) {
  const [viewerReady, setViewerReady] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const [modelError, setModelError] = useState<string | null>(null);
  const viewerRef = useRef<HTMLElement | null>(null);

  const safeUrl = isSafeModelUrl(src);

  useEffect(() => {
    if (!safeUrl) {
      return;
    }

    let cancelled = false;
    setViewerReady(false);
    setScriptError(null);

    async function loadViewer() {
      try {
        await import("@google/model-viewer");
        if (!cancelled) {
          setViewerReady(true);
        }
      } catch {
        if (!cancelled) {
          setScriptError("3D görüntüleyici bileşeni yüklenemedi.");
        }
      }
    }

    loadViewer();

    return () => {
      cancelled = true;
    };
  }, [safeUrl]);

  useEffect(() => {
    setModelError(null);
    const el = viewerRef.current;
    if (!viewerReady || !el) {
      return;
    }

    const handleError = () => {
      setModelError("3D model dosyası yüklenemedi. Lütfen bağlantıyı kontrol edin.");
    };

    const handleLoad = () => {
      setModelError(null);
    };

    el.addEventListener("error", handleError);
    el.addEventListener("load", handleLoad);

    return () => {
      el.removeEventListener("error", handleError);
      el.removeEventListener("load", handleLoad);
    };
  }, [viewerReady, src]);

  if (!safeUrl) {
    return (
      <div
        role="alert"
        className="w-full h-full bg-surface rounded-2xl border border-border flex flex-col items-center justify-center p-6 text-center gap-2"
      >
        <p className="text-sm font-bold text-foreground">
          Geçersiz 3D model bağlantısı
        </p>
        <p className="text-xs text-foreground/75 max-w-xs">
          Güvenlik nedeniyle yalnızca HTTPS veya uygulama içi (/) 3D model yolları desteklenir.
        </p>
      </div>
    );
  }

  if (scriptError || modelError) {
    return (
      <div
        role="alert"
        className="w-full h-full bg-surface rounded-2xl border border-border flex flex-col items-center justify-center p-6 text-center gap-2"
      >
        <p className="text-sm font-bold text-foreground">
          {scriptError ?? modelError}
        </p>
        <p className="text-xs text-foreground/75 max-w-xs">
          İnternet bağlantınızı veya 3D model (.glb / .gltf) kaynağını kontrol edin.
        </p>
      </div>
    );
  }

  if (!viewerReady) {
    return (
      <div
        aria-live="polite"
        className="w-full h-full bg-surface animate-pulse rounded-2xl border border-border flex items-center justify-center text-foreground/75 text-sm font-medium"
      >
        3D model hazırlanıyor...
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-surface rounded-2xl overflow-hidden shadow-sm border border-border">
      <model-viewer
        ref={viewerRef}
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
          type="button"
          slot="ar-button"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold shadow-xl hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2 tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Masada Gör (AR)
        </button>
      </model-viewer>
    </div>
  );
}
