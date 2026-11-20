# AR Restoran Menü Sistemi (`ar-menu`)

Bu proje, restoran müşterilerinin menüdeki ürünlerin QR kodlarını okutarak veya menü listesinden seçerek yemekleri 3 boyutlu (3D) incelemelerini ve desteklenen mobil cihazlarda kendi masalarında Artırılmış Gerçeklik (AR) teknolojisiyle gerçek boyutlarında görmelerini sağlayan bir Next.js 14 MVP web uygulamasıdır.

## 🚀 Özellikler ve Rotalar

- **`/` (Ana Sayfa):** Menü listesi, örnek ürün deneyimi ve yönetim paneline hızlı erişim sunar.
- **`/menu` (Menü Listesi):** Varsayılan menü ürünlerini fiyat ve açıklamalarıyla listeler, 3D/AR detay sayfalarına yönlendirir.
- **`/menu/[id]` (3D / AR Ürün Detayı):** `@google/model-viewer` ile tüm cihazlarda etkileşimli 3D döndürme/yakınlaştırma ve desteklenen mobil cihazlarda (iOS Quick Look, Android Scene Viewer / WebXR) **"Masada Gör (AR)"** deneyimi sunar. Varsayılan ürünlerde demo `.glb` modelleri (`modelviewer.dev`) kullanılır.
- **`/admin` (Yönetim Paneli):**
  - Menü öğeleri için dinamik olarak sayfa kaynağına göre oluşturulan QR kodları görüntüler.
  - **QR İndir:** Her ürünün QR kodunu gerçek **SVG** dosyası olarak indirir.
  - **+ Yeni Ürün Ekle:** Ad, açıklama, TRY fiyat ve doğrulanmış `https://` veya `/` tabanlı `.glb`/`.gltf` URL ile yeni ürün eklemeyi sağlar. (Bu MVP sürümünde sunucu dosya yüklemesi/veritabanı yerine tarayıcı **`localStorage`** kalıcılığı kullanılır.)

## 🛠️ Kullanılan Teknolojiler

- **Framework:** Next.js 14 (App Router), React 18, TypeScript
- **Stil:** Tailwind CSS, Geist Sans & Geist Mono yerel fontları
- **3D / AR:** `@google/model-viewer`, `three`
- **Diğer Araçlar:** `qrcode.react` (QR Kod SVG üretimi), `lucide-react` (ikonlar)
- **Testler:** Node.js yerleşik `node:test` ve `node:assert/strict`

## 📸 3 Boyutlu Ürün Tarama (Tavsiye)

Kendi yemeklerinizi `.glb` / `.gltf` formatında 3D modele dönüştürmek için akıllı telefonunuzda **Luma AI** veya **RealityScan (Epic Games)** gibi araçları kullanabilirsiniz. Dışa aktardığınız `.glb` dosyasını bir HTTPS sunucusuna veya `public/models/` altına yerleştirip `/admin` panelinden URL olarak tanımlayabilirsiniz.

## 💻 Kurulum ve Çalıştırma

- **Gereksinim:** Node.js `>=18.17.0`

Bu dizin (`ar-menu/`) içindeyseniz doğrudan aşağıdaki komutları çalıştırın (kök dizindeyseniz önce `cd ar-menu` yapın):

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
   *(veya kilitli kurulum için `npm ci`)*

2. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```
   Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

3. Doğrulama ve üretim komutları:
   ```bash
   npm run typecheck   # TypeScript tip kontrolü (tsc --noEmit)
   npm run lint        # ESLint kontrolü
   npm test            # Birim testleri (node --test)
   npm run build       # Üretim derlemesi
   npm run start       # Üretim sunucusunu başlatma
   ```

## 📁 Proje Yapısı

```text
ar-menu/
├── src/
│   ├── app/
│   │   ├── admin/page.tsx         # Yönetim paneli, SVG QR indirme, localStorage ürün formu
│   │   ├── menu/
│   │   │   ├── page.tsx           # Menü listesi (/menu)
│   │   │   └── [id]/page.tsx      # 3D/AR ürün detay sayfası (/menu/[id])
│   │   ├── error.tsx              # Hata sınırı sayfası
│   │   ├── not-found.tsx          # 404 sayfası
│   │   ├── globals.css            # Tema değişkenleri ve odak stilleri
│   │   ├── layout.tsx             # Kök düzen (lang="tr", Geist fontları, Türkçe metadata)
│   │   └── page.tsx               # Ana sayfa (/)
│   ├── components/
│   │   ├── CustomMenuItemDetail.tsx
│   │   └── ModelViewer.tsx        # Güvenli URL doğrulamalı @google/model-viewer sarmalayıcısı
│   ├── data/
│   │   └── menu.ts                # Varsayılan menü verisi
│   ├── lib/
│   │   ├── menuUtils.mjs          # Paylaşılan saf yardımcı fonksiyonlar
│   │   └── menuUtils.d.ts         # TypeScript tip tanımları
│   └── types/
│       └── global.d.ts            # <model-viewer> JSX tip tanımları
└── tests/
    └── menuUtils.test.mjs         # Birim testleri
```

---
*Bu proje, restoranlarda müşteri deneyimini geliştirmek amacıyla hazırlanmış bir MVP (Minimum Viable Product) uygulamasıdır.*
