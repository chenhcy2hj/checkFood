export type DishCategory = "hot" | "cold" | "drink";

export interface Dish {
  id: string;
  name: string;
  price: number;
  category: DishCategory;
}

export interface OrderItem {
  id: string;
  dishId: string;
  name: string;
  price: number;
  remarks: string[];
  completed: boolean;
  createdAt: number;
}

export interface OrderGroup {
  id: string;
  number: number;
  submitted: boolean;
  items: OrderItem[];
  createdAt: number;
}

export interface AppState {
  dishes: Dish[];
  orderGroups: OrderGroup[];
  activeGroupId: string | null;
}

export interface DishInput {
  name: string;
  price: number;
  category: DishCategory;
}
