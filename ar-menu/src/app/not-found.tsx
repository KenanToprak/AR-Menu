import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-5 bg-surface border border-border rounded-2xl p-8 shadow-sm">
        <div className="bg-primary/10 p-4 rounded-full inline-block">
          <SearchX className="text-primary w-10 h-10" aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-extrabold text-foreground">Sayfa Bulunamadı (404)</h1>
        <p className="text-sm text-foreground/80 leading-relaxed">
          Aradığınız menü ürünü veya sayfa mevcut değil ya da kaldırılmış olabilir.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/menu"
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors"
          >
            Menüye Git
          </Link>
          <Link
            href="/"
            className="border border-border bg-background text-foreground px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-border/40 transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </main>
  );
}
