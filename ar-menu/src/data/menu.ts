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
    description: "Özel harman dana köfte, taze çedar peyniri, karamelize soğan ve ev yapımı sos. Lütfen masanızda gerçek boyutunda görmek için 'Masada Gör' butonuna tıklayın.",
    price: 180,
    modelUrl: "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/Avocado/glTF-Binary/Avocado.glb", // Using avocado model as food placeholder
  },
  {
    id: "2",
    name: "Özel Karışım Espresso",
    description: "Taze kavrulmuş çekirdeklerden, yumuşak içimli sıcak espresso.",
    price: 75,
    modelUrl: "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb", // Placeholder
  }
];
