import type { MenuItem } from "@/data/menu";

export declare const DEMO_MODEL_URL: string;
export declare const MENU_STORAGE_KEY: string;

export declare function isSafeModelUrl(url: unknown): boolean;
export declare function isModelAssetExtension(url: unknown): boolean;
export declare function getMenuItemById<T extends { id: string }>(
  items: readonly T[],
  id: unknown
): T | undefined;
export declare function buildMenuItemPath(id: string): string;
export declare function buildMenuQrUrl(origin: unknown, id: string): string;
export declare function formatPriceTRY(price: unknown): string;

export type MenuItemInput = {
  name?: unknown;
  description?: unknown;
  price?: unknown;
  modelUrl?: unknown;
};

export type MenuItemValidationErrors = {
  name?: string;
  description?: string;
  price?: string;
  modelUrl?: string;
};

export type MenuItemValidationResult =
  | {
      valid: true;
      errors: Record<string, never>;
      item: {
        name: string;
        description: string;
        price: number;
        modelUrl: string;
      };
    }
  | {
      valid: false;
      errors: MenuItemValidationErrors;
    };

export declare function validateMenuItemInput(
  input: MenuItemInput
): MenuItemValidationResult;

export declare function mergeStoredMenuItems(
  defaults: readonly MenuItem[],
  stored: unknown
): MenuItem[];
