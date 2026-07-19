import Link from "next/link";
import { QrCode, Smartphone, UtensilsCrossed } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl space-y-8">
        
        <div className="bg-primary/10 p-6 rounded-full inline-block mb-4">
          <UtensilsCrossed className="text-primary w-16 h-16" />
        </div>

        <h1 className="text-5xl font-extrabold text-foreground tracking-tight">
          AR Menü Sistemine <br/><span className="text-primary">Hoş Geldiniz</span>
        </h1>
        
        <p className="text-xl text-foreground/80 leading-relaxed max-w-xl mx-auto">
          Müşterilerinize porsiyon boyutlarını masalarında Artırılmış Gerçeklik (AR) ile gösterin, güvenle sipariş vermelerini sağlayın.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          
          <Link href="/admin" className="group bg-surface border-2 border-border p-6 rounded-2xl hover:border-primary transition-all shadow-sm hover:shadow-md flex flex-col items-center gap-3">
            <QrCode className="text-foreground group-hover:text-primary transition-colors" size={32} />
            <div>
              <h3 className="font-bold text-lg text-foreground">Yönetim Paneli</h3>
              <p className="text-sm text-foreground/70 mt-1">Ürün ekleyin ve QR kodları alın.</p>
            </div>
          </Link>

          <Link href="/menu/1" className="group bg-primary text-primary-foreground p-6 rounded-2xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl flex flex-col items-center gap-3">
            <Smartphone size={32} />
            <div>
              <h3 className="font-bold text-lg">Müşteri Deneyimi</h3>
              <p className="text-primary-foreground/80 text-sm mt-1">Örnek bir ürün sayfasını test edin.</p>
            </div>
          </Link>

        </div>

      </div>
    </main>
  );
}
