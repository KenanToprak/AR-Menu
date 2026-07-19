"use client";

import { defaultMenuItems } from "@/data/menu";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, ScanLine } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  // Using a placeholder domain if running on server, else current origin
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://armenu.app';

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Restoran Yönetim Paneli</h1>
            <p className="text-foreground/70 mt-2">Menünüzü yönetin, 3D modeller yükleyin ve masalar için QR kodları indirin.</p>
          </div>
          <Link href="/" className="text-sm font-bold text-primary hover:underline">
            Ana Sayfaya Dön
          </Link>
        </header>

        {/* Bilgilendirme Kartı */}
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 flex gap-4 items-start shadow-sm">
          <div className="bg-primary/20 p-3 rounded-full text-primary shrink-0">
            <ScanLine size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              Ürünlerinizi Nasıl 3 Boyutlu Tarayabilirsiniz? (ÜCRETSİZ)
            </h3>
            <p className="text-foreground/80 mt-2 text-sm leading-relaxed">
              Yemeklerinizi 3D modele dönüştürmek artık çok kolay ve tamamen ücretsiz! Telefonunuzun kamerasıyla profesyonel kalitede tarama yapmak için App Store veya Google Play&apos;den <strong>Luma AI</strong> veya <strong>RealityScan</strong> (Epic Games) uygulamalarını indirin. 
              <br/><br/>
              Uygulamadaki yönergeleri izleyerek tabağın etrafında dönüp taramayı tamamlayın. Ardından taramayı <strong>.glb</strong> formatında telefonunuza kaydedin ve bu panele yükleyin. Hepsi bu kadar!
            </p>
          </div>
        </div>

        {/* Ürün Listesi */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <QrCode className="text-primary" /> Menü Öğeleri ve QR Kodlar
            </h2>
            <button className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-primary/90 transition-all active:scale-95">
              + Yeni Ürün Ekle
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {defaultMenuItems.map((item) => (
              <div key={item.id} className="bg-surface border border-border p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start transition-all hover:shadow-md">
                
                {/* QR Kod Alanı */}
                <div className="shrink-0 bg-white p-3 rounded-xl shadow-sm border border-border flex flex-col items-center gap-2">
                  <QRCodeSVG 
                    value={`${baseUrl}/menu/${item.id}`} 
                    size={110} 
                    bgColor={"#ffffff"}
                    fgColor={"#4a4036"}
                    level={"H"}
                  />
                  <span className="text-xs font-bold text-foreground/50">Masaya Okutun</span>
                </div>

                {/* Ürün Bilgileri */}
                <div className="flex-1 text-center sm:text-left flex flex-col h-full justify-between">
                  <div>
                    <h3 className="font-bold text-xl text-foreground">{item.name}</h3>
                    <p className="text-primary font-extrabold mt-1">{item.price} ₺</p>
                    <p className="text-sm text-foreground/70 mt-2 line-clamp-2">{item.description}</p>
                  </div>
                  
                  <div className="mt-5 flex gap-2 justify-center sm:justify-start">
                    <button className="text-sm border border-border bg-background px-4 py-2 rounded-lg text-foreground hover:bg-border/50 font-bold transition-colors">
                      QR İndir
                    </button>
                    <Link href={`/menu/${item.id}`} target="_blank" className="text-sm border border-primary/20 bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold hover:bg-primary/20 transition-colors">
                      AR Test Et
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
