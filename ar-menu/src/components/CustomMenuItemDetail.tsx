"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { defaultMenuItems, type MenuItem } from "@/data/menu";
import {
  MENU_STORAGE_KEY,
  formatPriceTRY,
  getMenuItemById,
  mergeStoredMenuItems,
} from "@/lib/menuUtils";
import ModelViewer from "@/components/ModelViewer";

export default function CustomMenuItemDetail({ id }: { id: string }) {
  const [item, setItem] = useState<MenuItem | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(MENU_STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      const merged = mergeStoredMenuItems(defaultMenuItems, parsed);
      const found = getMenuItemById(merged, id);
      setItem(found ?? null);
    } catch {
      setItem(null);
    } finally {
      setChecked(true);
    }
  }, [id]);

  if (!checked) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <p className="text-sm font-medium text-foreground/75">Ürün yükleniyor...</p>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center gap-4">
        <h1 className="text-2xl font-bold text-foreground">Ürün Bulunamadı</h1>
        <p className="text-sm text-foreground/75 max-w-md">
          Bu özel ürün tarayıcı belleğinizde kayıtlı değil veya kaldırılmış olabilir.
        </p>
        <div className="flex gap-3">
          <Link
            href="/menu"
            className="bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-bold"
          >
            Menüye Dön
          </Link>
          <Link
            href="/admin"
            className="border border-border bg-surface text-foreground px-4 py-2.5 rounded-xl text-sm font-bold"
          >
            Yönetim Paneli
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background flex flex-col max-w-md mx-auto shadow-2xl relative">
      <nav
        aria-label="Ürün sayfası gezinme"
        className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface"
      >
        <Link
          href="/menu"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Tüm Menü
        </Link>
        <Link href="/" className="text-sm font-bold text-foreground/80 hover:text-primary hover:underline">
          Ana Sayfa
        </Link>
      </nav>

      <div className="w-full aspect-square bg-surface border-b border-border shadow-sm p-4">
        <ModelViewer src={item.modelUrl} alt={item.name} />
      </div>

      <div className="p-6 flex flex-col gap-4">
        <div className="flex justify-between items-start gap-3">
          <h1 className="text-2xl font-bold text-foreground leading-tight">{item.name}</h1>
          <span className="text-xl font-extrabold text-primary shrink-0">
            {formatPriceTRY(item.price)}
          </span>
        </div>

        <p className="text-foreground/85 leading-relaxed text-sm">{item.description}</p>

        <div className="mt-2 p-4 bg-surface rounded-xl border border-border shadow-sm">
          <p className="text-sm font-medium text-foreground/90 text-center leading-relaxed">
            Tüm cihazlarda modeli sürükleyerek döndürebilir ve yakınlaştırabilirsiniz. AR destekleyen mobil cihazlarda{" "}
            <strong className="text-primary">&quot;Masada Gör (AR)&quot;</strong> butonu görünür.
          </p>
        </div>
      </div>
    </main>
  );
}
