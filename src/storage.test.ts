import { beforeEach, describe, expect, it } from "vitest";
import { createInitialState } from "./constants";
import { loadState, saveState, STORAGE_KEY } from "./storage";
import { addDishToActiveGroup } from "./state";

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("loads the default state when storage is empty", () => {
    const state = loadState();

    expect(state.dishes.length).toBeGreaterThanOrEqual(6);
    expect(state.orderGroups).toEqual([]);
    expect(state.activeGroupId).toBeNull();
  });

  it("saves and restores the current state", () => {
    let state = createInitialState();
    state = addDishToActiveGroup(state, state.dishes[0], ["少辣"]);

    saveState(state);
    const restored = loadState();

    expect(restored.orderGroups).toHaveLength(1);
    expect(restored.orderGroups[0].items[0]).toMatchObject({
      name: state.dishes[0].name,
      remarks: ["少辣"],
    });
  });

  it("recovers from invalid stored data", () => {
    localStorage.setItem(STORAGE_KEY, "{bad json");

    const state = loadState();

    expect(state.dishes.length).toBeGreaterThanOrEqual(6);
    expect(state.orderGroups).toEqual([]);
  });

  it("recovers from structurally invalid stored data", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ dishes: "wrong" }));

    const state = loadState();

    expect(state.dishes.length).toBeGreaterThanOrEqual(6);
    expect(state.activeGroupId).toBeNull();
  });

  it("migrates old stored data without remarks", () => {
    const state = createInitialState();
    const oldState = {
      dishes: state.dishes,
      orderGroups: state.orderGroups,
      activeGroupId: state.activeGroupId,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(oldState));

    const loaded = loadState();

    expect(loaded.remarks).toContain("少辣");
    expect(loaded.dishes).toHaveLength(state.dishes.length);
  });
});
