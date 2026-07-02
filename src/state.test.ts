import { describe, expect, it } from "vitest";
import { DEFAULT_REMARKS, createInitialState } from "./constants";
import {
  addDish,
  addDishToActiveGroup,
  createOrderGroup,
  deleteDish,
  deleteGroup,
  getGrandTotal,
  getGroupTotal,
  setActiveGroup,
  submitGroup,
  toggleItemCompleted,
  updateDish,
  updateItemRemarks,
} from "./state";

describe("ordering state", () => {
  it("starts with default dishes and no live menu", () => {
    const state = createInitialState();

    expect(state.dishes.length).toBeGreaterThanOrEqual(6);
    expect(state.orderGroups).toEqual([]);
    expect(state.activeGroupId).toBeNull();
    expect(DEFAULT_REMARKS).toEqual([
      "少辣",
      "不辣",
      "多辣",
      "不要香菜",
      "少盐",
      "打包",
    ]);
  });

  it("creates numbered groups and keeps numbers after deletion", () => {
    let state = createInitialState();
    state = createOrderGroup(state);
    state = createOrderGroup(state);
    const firstGroupId = state.orderGroups[0].id;

    state = deleteGroup(state, firstGroupId);
    state = createOrderGroup(state);

    expect(state.orderGroups.map((group) => group.number)).toEqual([2, 3]);
    expect(state.activeGroupId).toBe(state.orderGroups[1].id);
  });

  it("automatically creates the first group and adds repeated dishes as separate rows", () => {
    let state = createInitialState();
    const dish = state.dishes.find((item) => item.name === "鱼香肉丝")!;

    state = addDishToActiveGroup(state, dish, ["少辣", "少辣"]);
    state = addDishToActiveGroup(state, dish, ["打包"]);

    expect(state.orderGroups).toHaveLength(1);
    expect(state.orderGroups[0].number).toBe(1);
    expect(state.orderGroups[0].items).toHaveLength(2);
    expect(state.orderGroups[0].items[0].remarks).toEqual(["少辣"]);
    expect(state.orderGroups[0].items[1].remarks).toEqual(["打包"]);
    expect(getGroupTotal(state.orderGroups[0])).toBe(dish.price * 2);
  });

  it("adds dishes to the selected submitted group", () => {
    let state = createInitialState();
    const hotDish = state.dishes.find((item) => item.name === "鱼香肉丝")!;
    const drink = state.dishes.find((item) => item.name === "可乐")!;

    state = addDishToActiveGroup(state, hotDish, []);
    const firstGroupId = state.orderGroups[0].id;
    state = submitGroup(state, firstGroupId);
    state = createOrderGroup(state);
    state = setActiveGroup(state, firstGroupId);
    state = addDishToActiveGroup(state, drink, []);

    const firstGroup = state.orderGroups.find((group) => group.id === firstGroupId)!;
    expect(firstGroup.submitted).toBe(true);
    expect(firstGroup.items.map((item) => item.name)).toEqual(["鱼香肉丝", "可乐"]);
  });

  it("updates remarks uniquely and toggles item completion", () => {
    let state = createInitialState();
    const dish = state.dishes[0];
    state = addDishToActiveGroup(state, dish, []);
    const groupId = state.orderGroups[0].id;
    const itemId = state.orderGroups[0].items[0].id;

    state = updateItemRemarks(state, groupId, itemId, ["少辣", "少辣", "少盐"]);
    state = toggleItemCompleted(state, groupId, itemId);
    state = toggleItemCompleted(state, groupId, itemId);

    expect(state.orderGroups[0].items[0].remarks).toEqual(["少辣", "少盐"]);
    expect(state.orderGroups[0].items[0].completed).toBe(false);
  });

  it("calculates group and grand totals", () => {
    let state = createInitialState();
    const hotDish = state.dishes.find((item) => item.name === "宫保鸡丁")!;
    const coldDish = state.dishes.find((item) => item.name === "凉拌黄瓜")!;

    state = addDishToActiveGroup(state, hotDish, []);
    state = createOrderGroup(state);
    state = addDishToActiveGroup(state, coldDish, []);

    expect(state.orderGroups.map(getGroupTotal)).toEqual([hotDish.price, coldDish.price]);
    expect(getGrandTotal(state.orderGroups)).toBe(hotDish.price + coldDish.price);
  });

  it("edits and deletes dishes without changing existing order rows", () => {
    let state = createInitialState();
    state = addDish(state, { name: "酸辣土豆丝", price: 18, category: "hot" });
    const dish = state.dishes.find((item) => item.name === "酸辣土豆丝")!;
    state = addDishToActiveGroup(state, dish, []);
    state = updateDish(state, dish.id, {
      name: "土豆丝",
      price: 20,
      category: "cold",
    });
    state = deleteDish(state, dish.id);

    expect(state.dishes.some((item) => item.id === dish.id)).toBe(false);
    expect(state.orderGroups[0].items[0]).toMatchObject({
      dishId: dish.id,
      name: "酸辣土豆丝",
      price: 18,
    });
  });
});
