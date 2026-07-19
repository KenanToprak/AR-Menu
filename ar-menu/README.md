# AR Restoran Menü Sistemi

Bu proje, restoran müşterilerinin menüdeki ürünlerin karekodlarını (QR kod) okutarak, ürünleri kendi masalarında artırılmış gerçeklik (AR) teknolojisiyle, gerçek boyutlarında görmelerini sağlayan yenilikçi bir web uygulamasıdır.

## 🚀 Özellikler

- **Uygulamasız AR Deneyimi:** Google `<model-viewer>` altyapısı sayesinde müşteriler herhangi bir uygulama indirmeden doğrudan telefonlarının kamerasından AR deneyimini (iOS'ta Quick Look, Android'de Scene Viewer) yaşarlar.
- **Yönetim Paneli (`/admin`):** Restoran yetkilileri bu panel üzerinden menü öğelerini görüntüleyebilir ve masalar için otomatik oluşturulmuş QR kodların çıktılarını alabilir.
- **Göz Yormayan Tasarım:** Restoran ambiyansına uygun, iştah açıcı ancak kullanıcıyı yormayan sıcak (krem, yumuşak kahve) tonlar tercih edilmiştir.

## 🛠️ Kullanılan Teknolojiler

- **Frontend:** Next.js (React), Tailwind CSS
- **AR Teknolojisi:** `@google/model-viewer`
- **Diğer Araçlar:** `qrcode.react` (QR Kod Üretimi), `lucide-react` (İkonlar)

## 📸 3 Boyutlu Ürün Tarama (Tavsiye)

Yemeklerinizi 3 boyutlu (.glb formatında) modele dönüştürmek için profesyonel ekipmanlara ihtiyacınız yoktur. Tamamen ücretsiz olan aşağıdaki uygulamaları telefonunuza indirerek profesyonel taramalar yapabilirsiniz:
- **Luma AI:** Akıllı telefon kamerası ile NeRF ve Photogrammetry destekli tarama yapar.
- **RealityScan (Epic Games):** Kaliteli 3D modeller elde edip `.glb` formatında ücretsiz dışa aktarabilirsiniz.

## 💻 Kurulum ve Çalıştırma

Projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin:

1. Bağımlılıkları yükleyin:
   ```bash
   cd ar-menu
   npm install
   ```

2. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

3. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine giderek sistemi test edebilirsiniz.

---
*Bu proje, restoranlarda müşteri deneyimini bir üst seviyeye taşımak üzere bir MVP (Minimum Viable Product - İlk Çalışan Ürün) olarak tasarlanmıştır.*
