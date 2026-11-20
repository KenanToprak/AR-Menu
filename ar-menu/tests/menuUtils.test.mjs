import test from "node:test";
import assert from "node:assert/strict";
import {
  DEMO_MODEL_URL,
  buildMenuItemPath,
  buildMenuQrUrl,
  formatPriceTRY,
  getMenuItemById,
  isModelAssetExtension,
  isSafeModelUrl,
  mergeStoredMenuItems,
  validateMenuItemInput,
} from "../src/lib/menuUtils.mjs";

const sampleItems = [
  {
    id: "1",
    name: "Classic Cheeseburger",
    description: "Özel harman dana köfte ve çedar peyniri.",
    price: 180,
    modelUrl: DEMO_MODEL_URL,
  },
  {
    id: "2",
    name: "Özel Karışım Espresso",
    description: "Taze kavrulmuş çekirdeklerden sıcak espresso.",
    price: 75,
    modelUrl: "/models/espresso.glb",
  },
];

test("getMenuItemById returns matching item and handles whitespace or missing IDs", () => {
  assert.equal(getMenuItemById(sampleItems, "1")?.name, "Classic Cheeseburger");
  assert.equal(getMenuItemById(sampleItems, " 2 ")?.name, "Özel Karışım Espresso");
  assert.equal(getMenuItemById(sampleItems, "999"), undefined);
  assert.equal(getMenuItemById(sampleItems, ""), undefined);
  assert.equal(getMenuItemById(sampleItems, null), undefined);
  assert.equal(getMenuItemById(null, "1"), undefined);
});

test("buildMenuItemPath encodes special characters and rejects empty IDs", () => {
  assert.equal(buildMenuItemPath("1"), "/menu/1");
  assert.equal(buildMenuItemPath("  a/b?c "), "/menu/a%2Fb%3Fc");
  assert.throws(() => buildMenuItemPath(""));
  assert.throws(() => buildMenuItemPath("   "));
});

test("buildMenuQrUrl validates origin and encodes item ID", () => {
  assert.equal(
    buildMenuQrUrl("http://localhost:3000/", "1"),
    "http://localhost:3000/menu/1"
  );
  assert.equal(
    buildMenuQrUrl("https://menu.restoran.example", "özel ürün"),
    "https://menu.restoran.example/menu/%C3%B6zel%20%C3%BCr%C3%BCn"
  );
  assert.equal(buildMenuQrUrl("", "1"), "");
  assert.equal(buildMenuQrUrl("javascript:alert(1)", "1"), "");
  assert.equal(buildMenuQrUrl("not-a-url", "1"), "");
});

test("isSafeModelUrl allows only https: or safe root-relative / paths", () => {
  assert.equal(isSafeModelUrl(DEMO_MODEL_URL), true);
  assert.equal(isSafeModelUrl("/models/burger.glb"), true);
  assert.equal(isSafeModelUrl("  /models/espresso.gltf?v=1  "), true);

  assert.equal(isSafeModelUrl("http://example.com/model.glb"), false);
  assert.equal(isSafeModelUrl("javascript:alert(1)"), false);
  assert.equal(isSafeModelUrl("data:model/gltf-binary;base64,AAAA"), false);
  assert.equal(isSafeModelUrl("//evil.example.com/model.glb"), false);
  assert.equal(isSafeModelUrl("/\\evil.example.com/model.glb"), false);
  assert.equal(isSafeModelUrl("/"), false);
  assert.equal(isSafeModelUrl(""), false);
  assert.equal(isSafeModelUrl("https://user:pass@example.com/a.glb"), false);
  assert.equal(isSafeModelUrl(null), false);
});

test("isModelAssetExtension requires .glb or .gltf extension on safe URLs", () => {
  assert.equal(isModelAssetExtension("https://cdn.example.com/dish.glb"), true);
  assert.equal(isModelAssetExtension("/models/cake.GLTF?v=2"), true);
  assert.equal(isModelAssetExtension("https://cdn.example.com/page.html"), false);
  assert.equal(isModelAssetExtension("http://cdn.example.com/dish.glb"), false);
});

test("formatPriceTRY formats valid Turkish Lira amounts and rejects invalid prices", () => {
  assert.equal(formatPriceTRY(180), "180 ₺");
  assert.equal(formatPriceTRY(0), "0 ₺");
  assert.equal(formatPriceTRY(1250.5), "1.250,50 ₺");
  assert.throws(() => formatPriceTRY(-10), RangeError);
  assert.throws(() => formatPriceTRY(Number.NaN), RangeError);
  assert.throws(() => formatPriceTRY("180"), RangeError);
});

test("validateMenuItemInput validates fields, defaults empty modelUrl, and rejects unsafe inputs", () => {
  const validWithDefault = validateMenuItemInput({
    name: "  Izgara Somon ",
    description: "Taze kuşkonmaz ve limon sos ile servis edilir.",
    price: "245,5",
    modelUrl: "",
  });
  assert.equal(validWithDefault.valid, true);
  if (validWithDefault.valid) {
    assert.equal(validWithDefault.item.name, "Izgara Somon");
    assert.equal(validWithDefault.item.price, 245.5);
    assert.equal(validWithDefault.item.modelUrl, DEMO_MODEL_URL);
  }

  const invalid = validateMenuItemInput({
    name: "A",
    description: "Kısa",
    price: "-5",
    modelUrl: "http://insecure.example.com/model.exe",
  });
  assert.equal(invalid.valid, false);
  if (!invalid.valid) {
    assert.ok(invalid.errors.name);
    assert.ok(invalid.errors.description);
    assert.ok(invalid.errors.price);
    assert.ok(invalid.errors.modelUrl);
  }
});

test("mergeStoredMenuItems merges valid custom items and filters invalid/duplicate entries", () => {
  const merged = mergeStoredMenuItems(sampleItems, [
    {
      id: "1",
      name: "Duplicate Override Attempt",
      description: "Should not overwrite default item",
      price: 999,
      modelUrl: DEMO_MODEL_URL,
    },
    {
      id: "custom-3",
      name: "Tiramisu",
      description: "Mascarpone kremalı klasik İtalyan tatlısı.",
      price: 120,
      modelUrl: "/models/tiramisu.glb",
    },
    {
      id: "custom-bad-url",
      name: "Kötü URL",
      description: "Geçersiz protokol testi.",
      price: 50,
      modelUrl: "javascript:alert(1)",
    },
    null,
    { id: "custom-bad-price", name: "Test", description: "Geçersiz fiyat", price: -1, modelUrl: DEMO_MODEL_URL },
  ]);

  assert.equal(merged.length, 3);
  assert.equal(merged[0].name, "Classic Cheeseburger");
  assert.equal(merged[2].id, "custom-3");
  assert.equal(merged[2].name, "Tiramisu");
});
