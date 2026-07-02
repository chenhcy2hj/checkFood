import type { AppState, Dish, DishCategory } from "./types";

export const CATEGORY_LABELS: Record<DishCategory, string> = {
  hot: "热菜",
  cold: "凉菜",
  drink: "饮料",
};

export const CATEGORY_ORDER: DishCategory[] = ["hot", "cold", "drink"];

export const DEFAULT_REMARKS = [
  "少辣",
  "不辣",
  "多辣",
  "不要香菜",
  "少盐",
  "打包",
] as const;

export const DEFAULT_DISHES: Dish[] = [
  { id: "dish-hot-yuxiang", name: "鱼香肉丝", price: 28, category: "hot" },
  { id: "dish-hot-kungpao", name: "宫保鸡丁", price: 32, category: "hot" },
  { id: "dish-hot-huiguorou", name: "回锅肉", price: 36, category: "hot" },
  { id: "dish-hot-tomato-egg", name: "番茄炒蛋", price: 22, category: "hot" },
  { id: "dish-cold-cucumber", name: "凉拌黄瓜", price: 12, category: "cold" },
  { id: "dish-cold-chicken", name: "口水鸡", price: 26, category: "cold" },
  { id: "dish-drink-cola", name: "可乐", price: 5, category: "drink" },
  { id: "dish-drink-sprite", name: "雪碧", price: 5, category: "drink" },
];

export function createInitialState(): AppState {
  return {
    dishes: DEFAULT_DISHES.map((dish) => ({ ...dish })),
    remarks: [...DEFAULT_REMARKS],
    orderGroups: [],
    activeGroupId: null,
  };
}
