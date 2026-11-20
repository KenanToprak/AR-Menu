"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-5 bg-surface border border-border rounded-2xl p-8 shadow-sm">
        <div className="bg-primary/10 p-4 rounded-full inline-block">
          <AlertTriangle className="text-primary w-10 h-10" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground">Bir Hata Oluştu</h1>
        <p className="text-sm text-foreground/80 leading-relaxed">
          Sayfa yüklenirken beklenmeyen bir sorunla karşılaşıldı. Lütfen tekrar deneyin veya ana sayfaya dönün.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors inline-flex items-center gap-1.5"
          >
            <RotateCcw size={16} aria-hidden="true" /> Tekrar Dene
          </button>
          <Link
            href="/"
            className="border border-border bg-background text-foreground px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-border/40 transition-colors"
          >
            Ana Sayfa
          </Link>
        </div>
      </div>
    </main>
  );
}
