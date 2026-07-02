# 平板点餐功能设计文档

## 1. 设计目标

本设计基于《平板点餐功能需求文档》，面向第一版可用产品。系统用于店内平板横屏点餐和后厨实时查看，强调快速上手、信息清楚、误操作可控。

第一版采用纯前端本地应用设计：

- 不接后端。
- 不做登录和权限。
- 不保存历史订单。
- 使用浏览器本地存储保存菜品和当前实时菜单。

## 2. 推荐技术方案

建议使用：

- Vite
- React
- TypeScript
- CSS Modules 或普通 CSS
- localStorage

选择理由：

- 功能主要是前端交互和本地状态管理，不需要后端即可完成第一版。
- React 适合拆分点餐页、菜单卡片、管理表单等交互组件。
- TypeScript 可以约束菜品、菜单组、菜品记录等核心数据结构，减少状态更新错误。
- Vite 启动快，适合空仓库快速搭建。
- localStorage 可以满足刷新不丢失的实时使用要求。

## 3. 页面和路由设计

第一版不需要复杂路由，使用单页应用内状态切换两个页面：

- 点餐页：`order`
- 管理页：`manage`

底部导航固定显示：

- 点餐
- 管理

页面整体结构：

```text
App
├── 主内容区
│   ├── 点餐页
│   └── 管理页
└── 底部导航
```

底部导航只负责切换当前页面，不清空任何数据。

## 4. 核心数据模型

### 4.1 菜品分类

分类固定为：

```ts
type DishCategory = "hot" | "cold" | "drink";
```

展示文案映射：

```ts
const categoryLabels = {
  hot: "热菜",
  cold: "凉菜",
  drink: "饮料",
};
```

### 4.2 菜品

```ts
interface Dish {
  id: string;
  name: string;
  price: number;
  category: DishCategory;
}
```

说明：

- `id` 用于稳定识别菜品。
- `name` 是展示名称。
- `price` 是单价，金额按数字存储。
- `category` 用于左侧分组展示。

### 4.3 菜品记录

菜单中的每一次点菜都是独立记录。

```ts
interface OrderItem {
  id: string;
  dishId: string;
  name: string;
  price: number;
  remarks: string[];
  completed: boolean;
  createdAt: number;
}
```

说明：

- 同一道菜点多次会生成多个 `OrderItem`。
- `name` 和 `price` 在加入菜单时复制一份，后续管理页编辑菜品不影响已点记录。
- `remarks` 只保存固定备注。
- `completed` 控制后厨完成状态和绿色展示。

### 4.4 菜单组

每组客人对应一个菜单组。

```ts
interface OrderGroup {
  id: string;
  number: number;
  submitted: boolean;
  items: OrderItem[];
  createdAt: number;
}
```

说明：

- `number` 展示为第 1 组、第 2 组。
- 新建组号为当前最大组号加 1。
- 删除已有组后不重排编号。
- `submitted` 表示这组菜单已提交制作，但仍可继续加菜。

### 4.5 应用状态

```ts
interface AppState {
  dishes: Dish[];
  orderGroups: OrderGroup[];
  activeGroupId: string | null;
}
```

说明：

- `dishes` 是管理页维护的菜品列表。
- `orderGroups` 是右侧实时菜单。
- `activeGroupId` 是当前加菜目标。

## 5. 本地存储设计

使用一个 localStorage key 保存完整状态：

```ts
const STORAGE_KEY = "check-food-state-v1";
```

保存内容：

```ts
interface PersistedState {
  dishes: Dish[];
  orderGroups: OrderGroup[];
  activeGroupId: string | null;
}
```

加载规则：

- 启动时读取 localStorage。
- 如果读取失败或数据为空，使用默认菜品和空菜单。
- 如果数据结构无效，回退到默认数据，避免页面崩溃。

写入规则：

- 菜品变化后写入。
- 菜单组变化后写入。
- 当前加菜目标变化后写入。

第一版不做复杂迁移，只通过 `check-food-state-v1` 表示当前数据结构版本。

## 6. 点餐页设计

### 6.1 布局

点餐页使用左右分栏：

- 左侧约 45% 宽度：菜品选择。
- 右侧约 55% 宽度：菜单组列表和总金额。

适配平板横屏：

- 主内容区高度扣除底部导航。
- 左右两侧各自内部滚动。
- 总金额区域固定在右侧底部或顶部醒目位置。

### 6.2 左侧菜品选择区

左侧按分类显示：

```text
热菜
  鱼香肉丝 ￥28
  宫保鸡丁 ￥32

凉菜
  凉拌黄瓜 ￥12

饮料
  可乐 ￥5
```

菜品按钮点击流程：

1. 如果没有菜单组，自动创建第 1 组，并设为当前加菜目标。
2. 如果已有菜单组但没有当前加菜目标，选择最近创建的一组作为当前加菜目标。
3. 打开固定备注选择面板。
4. 用户选择备注或直接确认。
5. 向当前菜单组新增一条 `OrderItem`。

### 6.3 备注选择

固定备注为：

- 少辣
- 不辣
- 多辣
- 不要香菜
- 少盐
- 打包

交互方式：

- 使用弹层或底部抽屉展示备注按钮。
- 备注按钮可多选。
- 提供“确认添加”和“直接添加”操作。
- 如果用户不选备注，菜品照常加入。

右侧已点菜品点击流程：

1. 点击某条菜品记录。
2. 打开同一套备注选择面板。
3. 已有备注保持选中。
4. 用户确认后，更新该条记录的备注。
5. 重复备注不重复添加。

### 6.4 右侧菜单组列表

右侧展示多个菜单组卡片。

每张菜单组卡片包含：

- 标题：第 X 组。
- 状态：点菜中或已提交。
- 操作：加菜、提交菜单、删除。
- 菜品记录列表。
- 小计金额。

当前加菜目标需要突出显示，例如边框加深或标题区域高亮。

### 6.5 菜品记录展示

每条菜品记录展示：

- 菜名和备注，例如：鱼香肉丝（少辣、不要香菜）。
- 单价。
- 完成按钮。

状态规则：

- 未完成：普通背景。
- 已完成：绿色背景。
- 已完成后再次点击完成按钮，切回未完成，防止误点。

### 6.6 提交菜单

每组菜单提供“提交菜单”按钮。

规则：

- 菜单没有菜品时，提交按钮禁用或提示不能提交空菜单。
- 提交后状态变为已提交。
- 已提交菜单仍可以继续加菜。
- 点击“加菜”后，该组成为当前加菜目标。
- 提交不影响菜品完成状态，也不影响金额。

### 6.7 新建和删除菜单组

新建菜单：

- 点餐页提供“新建一组”按钮。
- 新组编号为当前最大编号加 1。
- 新组创建后自动成为当前加菜目标。

删除菜单：

- 删除整组菜单前展示确认。
- 确认文案：确认删除第 X 组菜单吗？此操作不会保留记录。
- 删除后移除该组所有菜品。
- 如果删除的是当前加菜目标，系统自动选择剩余最新菜单组；如果没有剩余菜单组，则 `activeGroupId` 变为 `null`。

### 6.8 金额汇总

每组小计：

```ts
groupTotal = group.items.reduce((sum, item) => sum + item.price, 0);
```

全部合计：

```ts
grandTotal = orderGroups.reduce((sum, group) => sum + groupTotal(group), 0);
```

展示内容：

- 当前组数。
- 全部合计金额。
- 每组菜单的小计金额。

金额展示统一使用两位小数或去掉无意义小数。第一版建议展示为 `￥28` 或 `￥28.50`，按输入价格决定。

## 7. 管理页设计

### 7.1 布局

管理页分为两块：

- 顶部或左侧：新增/编辑表单。
- 主区域：按分类展示菜品列表。

### 7.2 新增菜品

表单字段：

- 菜品名称。
- 价格。
- 分类。

校验：

- 名称去掉前后空格后不能为空。
- 价格必须是数字。
- 价格必须大于或等于 0。
- 分类必须是热菜、凉菜、饮料之一。

提交成功后：

- 新菜品加入菜品列表。
- 表单清空。
- 数据写入 localStorage。

### 7.3 编辑菜品

点击菜品的“编辑”按钮后：

- 表单进入编辑模式。
- 表单填入当前菜品信息。
- 保存后更新菜品列表。
- 已加入菜单的菜品记录不变。

取消编辑：

- 清空编辑状态。
- 表单恢复新增模式。

### 7.4 删除菜品

点击删除后展示确认。

确认后：

- 从菜品列表移除该菜品。
- 已经加入菜单的菜品记录不受影响。
- 数据写入 localStorage。

## 8. 状态更新设计

建议将核心状态操作集中成一组纯函数，便于测试：

- `createOrderGroup(state)`
- `setActiveGroup(state, groupId)`
- `addDishToActiveGroup(state, dish, remarks)`
- `updateItemRemarks(state, groupId, itemId, remarks)`
- `toggleItemCompleted(state, groupId, itemId)`
- `submitGroup(state, groupId)`
- `deleteGroup(state, groupId)`
- `addDish(state, input)`
- `updateDish(state, dishId, input)`
- `deleteDish(state, dishId)`

组件只负责收集用户操作和展示状态，业务规则放在状态函数中。

## 9. 组件拆分设计

建议组件结构：

```text
src/
├── App.tsx
├── main.tsx
├── styles.css
├── types.ts
├── constants.ts
├── storage.ts
├── state.ts
├── components/
│   ├── BottomNav.tsx
│   ├── RemarkPicker.tsx
│   ├── ConfirmDialog.tsx
│   └── EmptyState.tsx
├── pages/
│   ├── OrderPage.tsx
│   └── ManagePage.tsx
└── test/
    └── state.test.ts
```

职责说明：

- `App.tsx`：维护当前页面和应用总状态。
- `types.ts`：定义核心数据类型。
- `constants.ts`：分类、默认备注、默认菜品。
- `storage.ts`：负责 localStorage 读写和兜底。
- `state.ts`：负责所有业务状态更新。
- `OrderPage.tsx`：点餐页布局和交互编排。
- `ManagePage.tsx`：管理页表单和菜品列表。
- `RemarkPicker.tsx`：固定备注选择。
- `ConfirmDialog.tsx`：删除确认。
- `BottomNav.tsx`：底部导航。
- `state.test.ts`：核心业务规则测试。

## 10. 错误处理和边界情况

需要明确处理：

- localStorage 数据损坏：回退默认数据。
- 菜品为空：点餐页提示去管理页新增菜品。
- 菜单为空：右侧提示新建一组或直接点菜开始。
- 提交空菜单：阻止提交并提示。
- 删除当前加菜目标：自动切换到剩余最新菜单。
- 编辑菜品时输入非法价格：阻止保存并提示。
- 删除菜品：不影响已经点入菜单的记录。
- 重复添加备注：保持唯一。

## 11. 测试设计

第一版重点测试业务状态，不需要对所有视觉细节做自动化测试。

核心测试场景：

- 首次点菜自动创建第 1 组。
- 新建多组菜单时编号递增。
- 删除菜单后编号不重排。
- 点击同一道菜多次生成多条记录。
- 每组小计和全部合计计算正确。
- 提交菜单后仍可继续加菜。
- 单个菜品完成状态可以切换。
- 同一备注不会重复添加。
- 编辑菜品不影响已加入菜单的菜品记录。
- 删除菜品不影响已加入菜单的菜品记录。
- localStorage 数据损坏时能回退默认状态。

手动验收重点：

- 平板横屏下左右分栏可用。
- 底部导航切换不丢数据。
- 备注选择对左侧新增和右侧修改都可用。
- 删除菜单和删除菜品都有确认。
- 绿色完成状态清楚可见。

## 12. 实施顺序建议

推荐按以下顺序实现：

1. 搭建 Vite + React + TypeScript 项目。
2. 定义类型、常量、默认数据。
3. 实现状态更新函数和测试。
4. 实现 localStorage 读写。
5. 实现点餐页基础布局。
6. 实现多组菜单、加菜、提交、完成、删除。
7. 实现固定备注选择。
8. 实现管理页新增、编辑、删除。
9. 完成平板横屏样式和空状态。
10. 运行测试、构建，并用浏览器检查主要流程。

## 13. 与需求文档的对应关系

- 多组客人菜单：由 `OrderGroup` 和右侧菜单组列表实现。
- 简单编号 1、2、3：由 `number` 字段和最大编号加 1 规则实现。
- 不合并数量：每次点菜生成新的 `OrderItem`。
- 固定备注：由 `RemarkPicker` 和 `remarks` 数组实现。
- 单菜完成：由 `completed` 字段和绿色状态实现。
- 提交后可加菜：由 `submitted` 状态和 `activeGroupId` 实现。
- 整组删除确认：由 `ConfirmDialog` 和 `deleteGroup` 实现。
- 菜品管理：由 `ManagePage` 和菜品状态函数实现。
- 本地保存：由 `storage.ts` 和 localStorage 实现。
