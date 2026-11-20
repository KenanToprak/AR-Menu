"use client";

import { useEffect, useRef, useState } from "react";
import { defaultMenuItems, type MenuItem } from "@/data/menu";
import {
  DEMO_MODEL_URL,
  MENU_STORAGE_KEY,
  buildMenuItemPath,
  buildMenuQrUrl,
  formatPriceTRY,
  mergeStoredMenuItems,
  validateMenuItemInput,
  type MenuItemValidationErrors,
} from "@/lib/menuUtils";
import { QRCodeSVG } from "qrcode.react";
import { Download, Plus, QrCode, RotateCcw, ScanLine, Trash2, X } from "lucide-react";
import Link from "next/link";

const CUSTOM_ID_PREFIX = "custom-";

function saveCustomItemsToStorage(items: MenuItem[]) {
  const customOnly = items.filter((item) => item.id.startsWith(CUSTOM_ID_PREFIX));
  try {
    if (customOnly.length === 0) {
      window.localStorage.removeItem(MENU_STORAGE_KEY);
    } else {
      window.localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(customOnly));
    }
  } catch {
    // Ignore storage quota or private-mode restrictions
  }
}

export default function AdminPage() {
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [items, setItems] = useState<MenuItem[]>(defaultMenuItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [nameInput, setNameInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [modelUrlInput, setModelUrlInput] = useState("");
  const [formErrors, setFormErrors] = useState<MenuItemValidationErrors>({});

  const qrContainerRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  useEffect(() => {
    setBaseUrl(window.location.origin);

    try {
      const raw = window.localStorage.getItem(MENU_STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        setItems(mergeStoredMenuItems(defaultMenuItems, parsed));
      }
    } catch {
      setItems(defaultMenuItems);
    }
  }, []);

  const hasCustomItems = items.some((item) => item.id.startsWith(CUSTOM_ID_PREFIX));

  function handleDownloadQr(item: MenuItem) {
    const container = qrContainerRefs.current.get(item.id);
    const svg = container?.querySelector("svg");
    if (!svg) {
      setStatusMessage("QR kodu henüz hazır değil.");
      return;
    }

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);

    const safeFileName = item.name
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/gi, "-")
      .replace(/^-+|-+$/g, "") || item.id;

    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = `qr-${safeFileName}.svg`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);

    setStatusMessage(`"${item.name}" için QR kod SVG olarak indirildi.`);
  }

  function handleOpenModal() {
    setFormErrors({});
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setFormErrors({});
  }

  function handleAddItemSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateMenuItemInput({
      name: nameInput,
      description: descriptionInput,
      price: priceInput,
      modelUrl: modelUrlInput,
    });

    if (!validation.valid) {
      setFormErrors(validation.errors);
      return;
    }

    const newItem: MenuItem = {
      id: `${CUSTOM_ID_PREFIX}${Date.now()}`,
      name: validation.item.name,
      description: validation.item.description,
      price: validation.item.price,
      modelUrl: validation.item.modelUrl,
    };

    const nextItems = [...items, newItem];
    setItems(nextItems);
    saveCustomItemsToStorage(nextItems);

    setNameInput("");
    setDescriptionInput("");
    setPriceInput("");
    setModelUrlInput("");
    setFormErrors({});
    setIsModalOpen(false);
    setStatusMessage(`"${newItem.name}" tarayıcı belleğine eklendi.`);
  }

  function handleDeleteCustomItem(item: MenuItem) {
    const nextItems = items.filter((entry) => entry.id !== item.id);
    setItems(nextItems);
    saveCustomItemsToStorage(nextItems);
    setStatusMessage(`"${item.name}" listeden kaldırıldı.`);
  }

  function handleResetDefaults() {
    setItems(defaultMenuItems);
    saveCustomItemsToStorage(defaultMenuItems);
    setStatusMessage("Menü varsayılan ürünlere sıfırlandı.");
  }

  return (
    <main className="min-h-screen bg-background p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Restoran Yönetim Paneli</h1>
            <p className="text-foreground/75 mt-2">
              Menünüzü görüntüleyin, tarayıcı belleğine URL tabanlı 3D modeller ekleyin ve QR kodları SVG olarak indirin.
            </p>
          </div>
          <nav aria-label="Üst gezinme" className="flex items-center gap-4 shrink-0">
            <Link href="/menu" className="text-sm font-bold text-foreground/80 hover:text-primary hover:underline">
              Menü Listesi
            </Link>
            <Link href="/" className="text-sm font-bold text-primary hover:underline">
              Ana Sayfaya Dön
            </Link>
          </nav>
        </header>

        {/* Bilgilendirme Kartı */}
        <section
          aria-labelledby="scanning-guide-heading"
          className="bg-primary/10 border border-primary/25 rounded-2xl p-6 flex gap-4 items-start shadow-sm"
        >
          <div className="bg-primary/15 p-3 rounded-full text-primary shrink-0" aria-hidden="true">
            <ScanLine size={24} />
          </div>
          <div>
            <h2
              id="scanning-guide-heading"
              className="text-lg font-bold text-foreground flex items-center gap-2"
            >
              Ürünlerinizi Nasıl 3 Boyutlu Hazırlayabilirsiniz? (ÜCRETSİZ)
            </h2>
            <p className="text-foreground/85 mt-2 text-sm leading-relaxed">
              Yemeklerinizi 3D modele dönüştürmek için akıllı telefonunuzda App Store veya Google Play&apos;den{" "}
              <strong>Luma AI</strong> veya <strong>RealityScan</strong> (Epic Games) uygulamalarını kullanabilirsiniz.
              <br />
              <br />
              Taramayı <strong>.glb</strong> veya <strong>.gltf</strong> formatında dışa aktarıp bir HTTPS sunucusuna
              (veya proje içindeki <code className="font-mono text-xs">/models/...</code> yoluna) yerleştirdikten sonra
              aşağıdaki <strong>+ Yeni Ürün Ekle</strong> butonuyla model bağlantısını tarayıcı belleğinize ekleyebilirsiniz.
              (Bu MVP sürümünde sunucu dosya yüklemesi yerine tarayıcı <code className="font-mono text-xs">localStorage</code> kaydı kullanılır.)
            </p>
          </div>
        </section>

        {statusMessage && (
          <div
            role="status"
            aria-live="polite"
            className="bg-surface border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground flex items-center justify-between gap-4"
          >
            <span>{statusMessage}</span>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              aria-label="Bildirimi kapat"
              className="text-foreground/75 hover:text-foreground p-1 rounded-md"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Ürün Listesi */}
        <section aria-labelledby="menu-items-heading">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
            <h2
              id="menu-items-heading"
              className="text-2xl font-bold text-foreground flex items-center gap-2"
            >
              <QrCode className="text-primary" aria-hidden="true" /> Menü Öğeleri ve QR Kodlar
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {hasCustomItems && (
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="border border-border bg-surface text-foreground px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-border/40 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw size={16} aria-hidden="true" /> Varsayılanlara Sıfırla
                </button>
              )}
              <button
                type="button"
                onClick={handleOpenModal}
                className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Plus size={16} aria-hidden="true" /> Yeni Ürün Ekle
              </button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {items.map((item) => {
              const qrUrl = buildMenuQrUrl(baseUrl, item.id);
              const itemPath = buildMenuItemPath(item.id);
              const isCustom = item.id.startsWith(CUSTOM_ID_PREFIX);

              return (
                <article
                  key={item.id}
                  className="bg-surface border border-border p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-stretch transition-all hover:shadow-md"
                >
                  {/* QR Kod Alanı */}
                  <div
                    ref={(el) => {
                      qrContainerRefs.current.set(item.id, el);
                    }}
                    className="shrink-0 bg-white p-3 rounded-xl shadow-sm border border-stone-200 flex flex-col items-center justify-center gap-2 self-center sm:self-start"
                  >
                    {qrUrl ? (
                      <QRCodeSVG
                        value={qrUrl}
                        size={110}
                        bgColor="#ffffff"
                        fgColor="#3d342b"
                        level="H"
                        role="img"
                        aria-label={`${item.name} ürünü için QR kod`}
                      />
                    ) : (
                      <div
                        aria-label="QR kodu hazırlanıyor"
                        className="w-[110px] h-[110px] rounded-lg bg-stone-100 animate-pulse flex items-center justify-center text-xs font-medium text-stone-700 text-center px-2"
                      >
                        Hazırlanıyor...
                      </div>
                    )}
                    <span className="text-xs font-bold text-stone-700">
                      Masaya Okutun
                    </span>
                  </div>

                  {/* Ürün Bilgileri */}
                  <div className="flex-1 text-center sm:text-left flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-center sm:justify-between gap-2">
                        <h3 className="font-bold text-xl text-foreground break-words">
                          {item.name}
                        </h3>
                        {isCustom && (
                          <button
                            type="button"
                            onClick={() => handleDeleteCustomItem(item)}
                            aria-label={`${item.name} ürününü sil`}
                            className="text-foreground/75 hover:text-primary p-1 rounded-lg shrink-0"
                          >
                            <Trash2 size={16} aria-hidden="true" />
                          </button>
                        )}
                      </div>
                      <p className="text-primary font-extrabold mt-1">
                        {formatPriceTRY(item.price)}
                      </p>
                      <p className="text-sm text-foreground/75 mt-2 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2 justify-center sm:justify-start">
                      <button
                        type="button"
                        disabled={!qrUrl}
                        onClick={() => handleDownloadQr(item)}
                        aria-label={`${item.name} için QR kodu indir`}
                        className="text-sm border border-border bg-background px-4 py-2 rounded-lg text-foreground hover:bg-border/50 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-colors inline-flex items-center gap-1.5"
                      >
                        <Download size={14} aria-hidden="true" /> QR İndir
                      </button>
                      <Link
                        href={itemPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${item.name} ürününü yeni sekmede AR ile test et`}
                        className="text-sm border border-primary/25 bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold hover:bg-primary/20 transition-colors"
                      >
                        AR Test Et
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      {/* Yeni Ürün Ekle Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-item-modal-title"
        >
          <div className="bg-surface border border-border rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 id="add-item-modal-title" className="text-xl font-bold text-foreground">
                Yeni Menü Öğesi Ekle
              </h2>
              <button
                type="button"
                onClick={handleCloseModal}
                aria-label="Formu kapat"
                className="p-1.5 rounded-lg text-foreground/75 hover:text-foreground hover:bg-border/40"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleAddItemSubmit} noValidate className="space-y-4">
              <div>
                <label htmlFor="item-name" className="block text-sm font-bold text-foreground mb-1">
                  Ürün Adı
                </label>
                <input
                  id="item-name"
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Örn: Fırın Sütlaç"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground"
                />
                {formErrors.name && (
                  <p className="text-xs font-semibold text-primary mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="item-description" className="block text-sm font-bold text-foreground mb-1">
                  Açıklama
                </label>
                <textarea
                  id="item-description"
                  rows={3}
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                  placeholder="Ürün içeriği ve sunum detayları..."
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground"
                />
                {formErrors.description && (
                  <p className="text-xs font-semibold text-primary mt-1">
                    {formErrors.description}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="item-price" className="block text-sm font-bold text-foreground mb-1">
                  Fiyat (₺)
                </label>
                <input
                  id="item-price"
                  type="text"
                  inputMode="decimal"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  placeholder="Örn: 145"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground"
                />
                {formErrors.price && (
                  <p className="text-xs font-semibold text-primary mt-1">{formErrors.price}</p>
                )}
              </div>

              <div>
                <label htmlFor="item-model-url" className="block text-sm font-bold text-foreground mb-1">
                  3D Model URL (.glb / .gltf — İsteğe bağlı)
                </label>
                <input
                  id="item-model-url"
                  type="url"
                  value={modelUrlInput}
                  onChange={(e) => setModelUrlInput(e.target.value)}
                  placeholder={DEMO_MODEL_URL}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground font-mono"
                />
                <p className="text-xs text-foreground/75 mt-1">
                  Boş bırakılırsa demo 3D model kullanılır. Yalnızca <code className="font-mono">https://</code> veya{" "}
                  <code className="font-mono">/</code> ile başlayan güvenli yollar kabul edilir.
                </p>
                {formErrors.modelUrl && (
                  <p className="text-xs font-semibold text-primary mt-1">{formErrors.modelUrl}</p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-xl border border-border bg-background text-sm font-bold text-foreground hover:bg-border/40"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90"
                >
                  Ürünü Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
