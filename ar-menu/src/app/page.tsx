import Link from "next/link";
import { BookOpen, QrCode, Smartphone, UtensilsCrossed } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-3xl space-y-8">
        <div className="bg-primary/10 p-6 rounded-full inline-block mb-2">
          <UtensilsCrossed className="text-primary w-16 h-16" aria-hidden="true" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          AR Menü Sistemine <br />
          <span className="text-primary">Hoş Geldiniz</span>
        </h1>

        <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed max-w-2xl mx-auto">
          Müşterilerinize yemeklerin porsiyon boyutlarını 3 boyutlu görünüm ve desteklenen mobil cihazlarda Artırılmış Gerçeklik (AR) ile gösterin. Yönetim panelinden yeni ürünler ekleyip QR kodları SVG olarak indirebilirsiniz.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-center mt-10">
          <Link
            href="/menu"
            className="group bg-surface border-2 border-border p-6 rounded-2xl hover:border-primary transition-all shadow-sm hover:shadow-md flex flex-col items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <BookOpen
              className="text-foreground group-hover:text-primary transition-colors"
              size={32}
              aria-hidden="true"
            />
            <div>
              <h2 className="font-bold text-lg text-foreground">Menüyü İncele</h2>
              <p className="text-sm text-foreground/75 mt-1">
                Tüm ürünleri listeleyin ve 3D önizleme seçin.
              </p>
            </div>
          </Link>

          <Link
            href="/menu/1"
            className="group bg-primary text-primary-foreground p-6 rounded-2xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl flex flex-col items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Smartphone size={32} aria-hidden="true" />
            <div>
              <h2 className="font-bold text-lg">Müşteri Deneyimi</h2>
              <p className="text-primary-foreground/90 text-sm mt-1">
                Örnek ürün sayfasını ve 3D/AR görünümünü test edin.
              </p>
            </div>
          </Link>

          <Link
            href="/admin"
            className="group bg-surface border-2 border-border p-6 rounded-2xl hover:border-primary transition-all shadow-sm hover:shadow-md flex flex-col items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <QrCode
              className="text-foreground group-hover:text-primary transition-colors"
              size={32}
              aria-hidden="true"
            />
            <div>
              <h2 className="font-bold text-lg text-foreground">Yönetim Paneli</h2>
              <p className="text-sm text-foreground/75 mt-1">
                Ürün ekleyin, URL tanımlayın ve QR kod indirin.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
