import { DEMO_MODEL_URL, getMenuItemById } from "@/lib/menuUtils";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  modelUrl: string;
  image?: string;
};

export const defaultMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Classic Cheeseburger",
    description:
      "Özel harman dana köfte, taze çedar peyniri, karamelize soğan ve ev yapımı sos. Masanızda gerçek boyutunda incelemek için 3D görünümü döndürebilir veya desteklenen mobil cihazlarda 'Masada Gör' butonuna tıklayabilirsiniz.",
    price: 180,
    modelUrl: DEMO_MODEL_URL,
  },
  {
    id: "2",
    name: "Özel Karışım Espresso",
    description:
      "Taze kavrulmuş çekirdeklerden, yumuşak içimli sıcak espresso (demo 3D model ile).",
    price: 75,
    modelUrl:
      "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb",
  },
];

export function findDefaultMenuItem(id: string): MenuItem | undefined {
  return getMenuItemById(defaultMenuItems, id);
}
