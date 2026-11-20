import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, UtensilsCrossed } from "lucide-react";
import { defaultMenuItems } from "@/data/menu";
import { buildMenuItemPath, formatPriceTRY } from "@/lib/menuUtils";

export const metadata: Metadata = {
  title: "Menü | AR Menü Sistemi",
  description: "Restoran menüsündeki tüm ürünleri görüntüleyin ve 3D/AR önizlemeyi başlatın.",
};

export default function MenuIndexPage() {
  return (
    <main className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 border-b border-border pb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <UtensilsCrossed size={14} aria-hidden="true" /> Dijital Restoran Menüsü
            </p>
            <h1 className="text-3xl font-extrabold text-foreground mt-1">Menümüz</h1>
            <p className="text-sm text-foreground/75 mt-2">
              Her ürünün detay sayfasında 3D modeli döndürebilir ve desteklenen mobil cihazlarda masanızda AR ile görebilirsiniz.
            </p>
          </div>
          <nav aria-label="Menü gezinme" className="flex items-center gap-4 shrink-0">
            <Link href="/admin" className="text-sm font-bold text-foreground/80 hover:text-primary hover:underline">
              Yönetim Paneli
            </Link>
            <Link href="/" className="text-sm font-bold text-primary hover:underline">
              Ana Sayfa
            </Link>
          </nav>
        </header>

        <section aria-label="Menü ürünleri" className="grid gap-6 sm:grid-cols-2">
          {defaultMenuItems.map((item) => (
            <article
              key={item.id}
              className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-4 hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-bold text-foreground">{item.name}</h2>
                  <span className="text-lg font-extrabold text-primary shrink-0">
                    {formatPriceTRY(item.price)}
                  </span>
                </div>
                <p className="text-sm text-foreground/75 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href={buildMenuItemPath(item.id)}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors"
                >
                  3D / AR İncele <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
