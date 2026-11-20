import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { defaultMenuItems } from "@/data/menu";
import { formatPriceTRY, getMenuItemById } from "@/lib/menuUtils";
import ModelViewer from "@/components/ModelViewer";
import CustomMenuItemDetail from "@/components/CustomMenuItemDetail";

export function generateStaticParams() {
  return defaultMenuItems.map((item) => ({
    id: item.id,
  }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const item = getMenuItemById(defaultMenuItems, params.id);
  if (!item) {
    return {
      title: "Ürün Detayı | AR Menü",
      description: "AR Menü 3D ürün önizleme sayfası.",
    };
  }
  return {
    title: `${item.name} (${formatPriceTRY(item.price)}) | AR Menü`,
    description: item.description,
  };
}

export default function MenuDetailPage({ params }: { params: { id: string } }) {
  const item = getMenuItemById(defaultMenuItems, params.id);

  if (!item) {
    if (params.id.startsWith("custom-")) {
      return <CustomMenuItemDetail id={params.id} />;
    }
    notFound();
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
        <Link
          href="/"
          className="text-sm font-bold text-foreground/80 hover:text-primary hover:underline"
        >
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
            Tüm cihazlarda modeli parmağınızla veya farenizle döndürüp yakınlaştırabilirsiniz.{" "}
            Desteklenen mobil cihazlarda yukarıdaki{" "}
            <strong className="text-primary">&quot;Masada Gör (AR)&quot;</strong> butonu görünür. Siparişinizi garsona iletebilirsiniz.
          </p>
        </div>
      </div>
    </main>
  );
}
