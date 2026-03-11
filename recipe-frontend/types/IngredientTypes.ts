export type InventoryIngredient = {
  id: number;
  quantity?: number;
  quantityUnit?: QuantityUnit;
  ingredient: Ingredient;
};

export type QuantityUnit = {
  id: number;
  name: string;
  shortName: string;
};

export type Ingredient = {
  id: number;
  ingredientId: number;
  name: string;
  quantity: number;
  unit: string;
  quantityUnit?: QuantityUnit;
  alwaysInStock: boolean;
  ingredientName: string;
  isInInventory?: boolean;
  isInShoppingList?: boolean;
  ingredientTypeId: number;
};

export type IngredientType = {
  id: number;
  name: string;
}

export type ListIngredient = {
  id: number;
  checked: boolean;
  quantity?: number;
  quantityUnit?: QuantityUnit;
  ingredient: Ingredient;
};