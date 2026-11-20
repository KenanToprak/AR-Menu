# AR-Menu

Restoran menüsündeki ürünlerin QR kod okutularak 3 boyutlu (3D) ve desteklenen mobil cihazlarda Artırılmış Gerçeklik (AR) ile görüntülenmesini sağlayan Next.js uygulaması.

## Dizin Yapısı

Asıl Next.js / TypeScript projesi `ar-menu/` alt dizininde yer almaktadır:

- `ar-menu/` — Next.js 14 App Router kaynak kodları, yapılandırma dosyaları ve birim testleri

## Gereksinimler

- **Node.js:** `>=18.17.0` (önerilen: LTS `v18.18+` veya `v20+`)
- **npm:** `>=9`

## Hızlı Başlangıç

```bash
cd ar-menu
npm ci
npm run dev
```

Tarayıcıda `http://localhost:3000` adresini açabilirsiniz.

## Komutlar (`ar-menu/` içinde)

- `npm run dev` — Geliştirme sunucusunu başlatır
- `npm run build` — Üretim derlemesi alır
- `npm run start` — Üretim sunucusunu başlatır
- `npm run lint` — ESLint kontrollerini çalıştırır
- `npm run typecheck` — TypeScript tip denetimi (`tsc --noEmit`) çalıştırır
- `npm test` — `node --test` ile birim testlerini çalıştırır

## Uygulama Rotaları

- `/` — Karşılama sayfası
- `/menu` — Menü ürün listesi
- `/menu/[id]` — Ürün 3D/AR detay sayfası (`/menu/1`, `/menu/2`)
- `/admin` — Yönetim paneli (SVG QR kod indirme, `localStorage` tabanlı ürün ekleme)

Daha ayrıntılı kurulum ve kullanım bilgileri için [`ar-menu/README.md`](./ar-menu/README.md) dosyasına bakın.
