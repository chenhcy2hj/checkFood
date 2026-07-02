import { DEFAULT_REMARKS, createInitialState } from "./constants";
import type { AppState, Dish, OrderGroup } from "./types";

export const STORAGE_KEY = "check-food-state-v1";

function isDish(value: unknown): value is Dish {
  if (!value || typeof value !== "object") {
    return false;
  }

  const dish = value as Dish;
  return (
    typeof dish.id === "string" &&
    typeof dish.name === "string" &&
    typeof dish.price === "number" &&
    ["hot", "cold", "drink"].includes(dish.category)
  );
}

function isOrderGroup(value: unknown): value is OrderGroup {
  if (!value || typeof value !== "object") {
    return false;
  }

  const group = value as OrderGroup;
  return (
    typeof group.id === "string" &&
    typeof group.number === "number" &&
    typeof group.submitted === "boolean" &&
    Array.isArray(group.items) &&
    group.items.every(
      (item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.dishId === "string" &&
        typeof item.name === "string" &&
        typeof item.price === "number" &&
        Array.isArray(item.remarks) &&
        item.remarks.every((remark) => typeof remark === "string") &&
        typeof item.completed === "boolean" &&
        typeof item.createdAt === "number",
    ) &&
    typeof group.createdAt === "number"
  );
}

function isAppState(value: unknown): value is AppState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const state = value as AppState;
  return (
    Array.isArray(state.dishes) &&
    state.dishes.every(isDish) &&
    Array.isArray(state.remarks) &&
    state.remarks.every((remark) => typeof remark === "string") &&
    Array.isArray(state.orderGroups) &&
    state.orderGroups.every(isOrderGroup) &&
    (typeof state.activeGroupId === "string" || state.activeGroupId === null)
  );
}

function isLegacyAppState(value: unknown): value is Omit<AppState, "remarks"> {
  if (!value || typeof value !== "object") {
    return false;
  }

  const state = value as Omit<AppState, "remarks">;
  return (
    Array.isArray(state.dishes) &&
    state.dishes.every(isDish) &&
    Array.isArray(state.orderGroups) &&
    state.orderGroups.every(isOrderGroup) &&
    (typeof state.activeGroupId === "string" || state.activeGroupId === null)
  );
}

export function loadState(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return createInitialState();
    }

    const parsed: unknown = JSON.parse(stored);
    if (isAppState(parsed)) {
      return parsed;
    }
    if (isLegacyAppState(parsed)) {
      return {
        ...parsed,
        remarks: [...DEFAULT_REMARKS],
      };
    }
    return createInitialState();
  } catch {
    return createInitialState();
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
