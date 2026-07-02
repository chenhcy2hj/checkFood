# Tablet Ordering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the tablet ordering app described in the requirements and design documents as a Vite + React + TypeScript single-page application.

**Architecture:** Keep business rules in pure state functions, persistence in a small localStorage module, and UI in focused React components. The app stores dishes, live order groups, active group, submitted state, remarks, and item completion state locally in the browser.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, localStorage, CSS.

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`
- Create: `src/vite-env.d.ts`

- [ ] Create a Vite React TypeScript project structure in the existing repository.
- [ ] Add scripts: `dev`, `build`, `test`.
- [ ] Install runtime dependencies: `@vitejs/plugin-react`, `vite`, `typescript`, `react`, `react-dom`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`.
- [ ] Verify `npm test -- --run` starts successfully once at least one test exists.

### Task 2: Core Types and Constants

**Files:**
- Create: `src/types.ts`
- Create: `src/constants.ts`
- Test: `src/state.test.ts`

- [ ] Write failing tests for default categories, default remarks, and initial state shape.
- [ ] Define `DishCategory`, `Dish`, `OrderItem`, `OrderGroup`, `AppState`, and form input types.
- [ ] Define category labels, fixed remarks, default dishes, and `createInitialState`.
- [ ] Run `npm test -- --run src/state.test.ts` and verify tests pass.

### Task 3: Pure State Operations

**Files:**
- Create: `src/state.ts`
- Modify: `src/state.test.ts`

- [ ] Write failing tests for automatic first group creation, group numbering, active group selection, adding repeated dishes as separate items, submitting groups, adding to submitted groups, toggling completion, updating remarks uniquely, deleting groups, adding/editing/deleting dishes, and totals.
- [ ] Implement pure functions: `createOrderGroup`, `setActiveGroup`, `addDishToActiveGroup`, `updateItemRemarks`, `toggleItemCompleted`, `submitGroup`, `deleteGroup`, `addDish`, `updateDish`, `deleteDish`, `getGroupTotal`, `getGrandTotal`.
- [ ] Run `npm test -- --run src/state.test.ts` and verify tests pass.

### Task 4: Persistence

**Files:**
- Create: `src/storage.ts`
- Create: `src/storage.test.ts`

- [ ] Write failing tests for loading default state, saving state, restoring saved state, and recovering from invalid localStorage data.
- [ ] Implement `loadState` and `saveState` with key `check-food-state-v1`.
- [ ] Run `npm test -- --run src/storage.test.ts` and verify tests pass.

### Task 5: React App Shell

**Files:**
- Modify: `src/App.tsx`
- Create: `src/components/BottomNav.tsx`
- Create: `src/components/EmptyState.tsx`
- Modify: `src/styles.css`

- [ ] Build the two-tab shell: 点餐 and 管理.
- [ ] Load state from localStorage on startup and save on changes.
- [ ] Keep bottom navigation fixed.
- [ ] Verify `npm run build` compiles.

### Task 6: Ordering Page

**Files:**
- Create: `src/pages/OrderPage.tsx`
- Create: `src/components/RemarkPicker.tsx`
- Create: `src/components/ConfirmDialog.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] Implement dish categories, fixed remark picker, automatic first group, new group, active add target, group cards, submit, add dish, update item remarks, toggle completion, delete group confirmation, per-group subtotal, and grand total.
- [ ] Ensure repeated clicks create repeated independent menu rows.
- [ ] Verify `npm test -- --run` and `npm run build`.

### Task 7: Management Page

**Files:**
- Create: `src/pages/ManagePage.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] Implement add/edit/delete dish form with validation.
- [ ] Keep categories fixed as 热菜、凉菜、饮料.
- [ ] Confirm before deleting dishes.
- [ ] Ensure edited/deleted dishes do not alter existing order items.
- [ ] Verify `npm test -- --run` and `npm run build`.

### Task 8: Browser Verification

**Files:**
- No source files expected unless visual issues are found.

- [ ] Start the app with `npm run dev -- --host 127.0.0.1`.
- [ ] Open the app in the browser.
- [ ] Verify tablet-width layout: point ordering page, management page, bottom nav, remark picker, group cards, completion green state, delete confirmations, and totals.
- [ ] Run final `npm test -- --run` and `npm run build`.
