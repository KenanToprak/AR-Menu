import { defaultMenuItems } from "@/data/menu";
import ModelViewer from "@/components/ModelViewer";
import { notFound } from "next/navigation";

export default function MenuDetailPage({ params }: { params: { id: string } }) {
  const item = defaultMenuItems.find((i) => i.id === params.id);

  if (!item) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background flex flex-col max-w-md mx-auto shadow-2xl relative">
      <div className="w-full aspect-square bg-surface border-b border-border shadow-sm p-4">
        <ModelViewer src={item.modelUrl} alt={item.name} />
      </div>

      <div className="p-6 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold text-foreground leading-tight">{item.name}</h1>
          <span className="text-xl font-extrabold text-primary shrink-0">{item.price} ₺</span>
        </div>
        
        <p className="text-foreground/80 leading-relaxed text-sm">
          {item.description}
        </p>

        <div className="mt-4 p-4 bg-surface rounded-xl border border-border shadow-sm">
          <p className="text-sm font-medium text-foreground/90 text-center leading-relaxed">
            Masanızda görmek için yukarıdaki <strong className="text-primary">&quot;Masada Gör&quot;</strong> butonuna tıklayın. Kameranız açılacaktır. <br/>Siparişinizi garsona iletebilirsiniz.
          </p>
        </div>
      </div>
    </main>
  );
}
