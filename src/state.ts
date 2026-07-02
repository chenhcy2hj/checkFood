import type { AppState, Dish, DishInput, OrderGroup, OrderItem } from "./types";

let idCounter = 0;

function makeId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}

function uniqueRemarks(remarks: string[]): string[] {
  return Array.from(new Set(remarks.map((remark) => remark.trim()).filter(Boolean)));
}

function validateDishInput(input: DishInput): DishInput {
  const name = input.name.trim();
  if (!name) {
    throw new Error("菜品名称不能为空");
  }

  if (!Number.isFinite(input.price) || input.price < 0) {
    throw new Error("价格必须是大于或等于 0 的数字");
  }

  return {
    name,
    price: input.price,
    category: input.category,
  };
}

function latestGroup(groups: OrderGroup[]): OrderGroup | undefined {
  return groups[groups.length - 1];
}

export function createOrderGroup(state: AppState): AppState {
  const nextNumber =
    state.orderGroups.reduce((max, group) => Math.max(max, group.number), 0) + 1;
  const group: OrderGroup = {
    id: makeId("group"),
    number: nextNumber,
    submitted: false,
    items: [],
    createdAt: Date.now(),
  };

  return {
    ...state,
    orderGroups: [...state.orderGroups, group],
    activeGroupId: group.id,
  };
}

export function setActiveGroup(state: AppState, groupId: string): AppState {
  if (!state.orderGroups.some((group) => group.id === groupId)) {
    return state;
  }

  return {
    ...state,
    activeGroupId: groupId,
  };
}

function ensureActiveGroup(state: AppState): AppState {
  if (state.orderGroups.length === 0) {
    return createOrderGroup(state);
  }

  if (state.activeGroupId && state.orderGroups.some((group) => group.id === state.activeGroupId)) {
    return state;
  }

  return {
    ...state,
    activeGroupId: latestGroup(state.orderGroups)?.id ?? null,
  };
}

export function addDishToActiveGroup(
  state: AppState,
  dish: Dish,
  remarks: string[],
): AppState {
  const activeState = ensureActiveGroup(state);
  const activeGroupId = activeState.activeGroupId;
  if (!activeGroupId) {
    return activeState;
  }

  const orderItem: OrderItem = {
    id: makeId("item"),
    dishId: dish.id,
    name: dish.name,
    price: dish.price,
    remarks: uniqueRemarks(remarks),
    completed: false,
    createdAt: Date.now(),
  };

  return {
    ...activeState,
    orderGroups: activeState.orderGroups.map((group) =>
      group.id === activeGroupId
        ? { ...group, items: [...group.items, orderItem] }
        : group,
    ),
  };
}

export function updateItemRemarks(
  state: AppState,
  groupId: string,
  itemId: string,
  remarks: string[],
): AppState {
  return {
    ...state,
    orderGroups: state.orderGroups.map((group) =>
      group.id === groupId
        ? {
            ...group,
            items: group.items.map((item) =>
              item.id === itemId ? { ...item, remarks: uniqueRemarks(remarks) } : item,
            ),
          }
        : group,
    ),
  };
}

export function toggleItemCompleted(
  state: AppState,
  groupId: string,
  itemId: string,
): AppState {
  return {
    ...state,
    orderGroups: state.orderGroups.map((group) =>
      group.id === groupId
        ? {
            ...group,
            items: group.items.map((item) =>
              item.id === itemId ? { ...item, completed: !item.completed } : item,
            ),
          }
        : group,
    ),
  };
}

export function submitGroup(state: AppState, groupId: string): AppState {
  return {
    ...state,
    orderGroups: state.orderGroups.map((group) =>
      group.id === groupId && group.items.length > 0
        ? { ...group, submitted: true }
        : group,
    ),
  };
}

export function deleteGroup(state: AppState, groupId: string): AppState {
  const orderGroups = state.orderGroups.filter((group) => group.id !== groupId);
  const activeGroupId =
    state.activeGroupId === groupId
      ? latestGroup(orderGroups)?.id ?? null
      : state.activeGroupId;

  return {
    ...state,
    orderGroups,
    activeGroupId,
  };
}

export function addDish(state: AppState, input: DishInput): AppState {
  const dishInput = validateDishInput(input);
  const dish: Dish = {
    id: makeId("dish"),
    ...dishInput,
  };

  return {
    ...state,
    dishes: [...state.dishes, dish],
  };
}

export function updateDish(
  state: AppState,
  dishId: string,
  input: DishInput,
): AppState {
  const dishInput = validateDishInput(input);

  return {
    ...state,
    dishes: state.dishes.map((dish) =>
      dish.id === dishId ? { ...dish, ...dishInput } : dish,
    ),
  };
}

export function deleteDish(state: AppState, dishId: string): AppState {
  return {
    ...state,
    dishes: state.dishes.filter((dish) => dish.id !== dishId),
  };
}

export function addRemark(state: AppState, remark: string): AppState {
  const normalized = remark.trim();
  if (!normalized || state.remarks.includes(normalized)) {
    return state;
  }

  return {
    ...state,
    remarks: [...state.remarks, normalized],
  };
}

export function deleteRemark(state: AppState, remark: string): AppState {
  return {
    ...state,
    remarks: state.remarks.filter((item) => item !== remark),
  };
}

export function getGroupTotal(group: OrderGroup): number {
  return group.items.reduce((sum, item) => sum + item.price, 0);
}

export function getGrandTotal(groups: OrderGroup[]): number {
  return groups.reduce((sum, group) => sum + getGroupTotal(group), 0);
}
