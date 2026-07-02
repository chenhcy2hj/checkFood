import { useState } from "react";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "../constants";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { EmptyState } from "../components/EmptyState";
import { RemarkPicker } from "../components/RemarkPicker";
import {
  addDishToActiveGroup,
  createOrderGroup,
  deleteGroup,
  getGrandTotal,
  getGroupTotal,
  setActiveGroup,
  submitGroup,
  toggleItemCompleted,
  updateItemRemarks,
} from "../state";
import type { AppState, Dish, OrderItem } from "../types";

interface PendingDish {
  dish: Dish;
  remarks: string[];
}

interface PendingItem {
  groupId: string;
  item: OrderItem;
  remarks: string[];
}

interface OrderPageProps {
  state: AppState;
  setState: (updater: (state: AppState) => AppState) => void;
  pendingDish: PendingDish | null;
  setPendingDish: (pending: PendingDish | null) => void;
  pendingItem: PendingItem | null;
  setPendingItem: (pending: PendingItem | null) => void;
}

function formatPrice(price: number): string {
  return Number.isInteger(price) ? `￥${price}` : `￥${price.toFixed(2)}`;
}

function itemTitle(item: OrderItem): string {
  return item.remarks.length > 0 ? `${item.name}（${item.remarks.join("、")}）` : item.name;
}

export function OrderPage({
  state,
  setState,
  pendingDish,
  setPendingDish,
  pendingItem,
  setPendingItem,
}: OrderPageProps) {
  const activeGroup = state.orderGroups.find((group) => group.id === state.activeGroupId);
  const confirmDish = () => {
    if (!pendingDish) {
      return;
    }
    setState((current) => addDishToActiveGroup(current, pendingDish.dish, pendingDish.remarks));
    setPendingDish(null);
  };
  const confirmItemRemarks = () => {
    if (!pendingItem) {
      return;
    }
    setState((current) =>
      updateItemRemarks(current, pendingItem.groupId, pendingItem.item.id, pendingItem.remarks),
    );
    setPendingItem(null);
  };

  return (
    <section className="page order-page">
      <header className="topbar">
        <div>
          <h1>平板点餐</h1>
          <p>{activeGroup ? `当前加菜目标：第 ${activeGroup.number} 组` : "点击菜品自动创建第 1 组"}</p>
        </div>
        <div className="summary">
          <strong>{state.orderGroups.length} 组</strong>
          <span>全部合计 {formatPrice(getGrandTotal(state.orderGroups))}</span>
        </div>
      </header>

      <div className="order-layout">
        <aside className="dish-pane">
          <div className="pane-head">
            <h2>菜品</h2>
            <button className="button secondary" type="button" onClick={() => setState(createOrderGroup)}>
              新建一组
            </button>
          </div>
          {state.dishes.length === 0 ? (
            <EmptyState title="暂无菜品" description="请到管理页新增菜品。" />
          ) : (
            CATEGORY_ORDER.map((category) => {
              const dishes = state.dishes.filter((dish) => dish.category === category);
              return (
                <section className="category-section" key={category}>
                  <h3>
                    <span>{CATEGORY_LABELS[category]}</span>
                    <span>{dishes.length} 道</span>
                  </h3>
                  <div className="dish-grid">
                    {dishes.map((dish) => (
                      <button
                        aria-label={`${dish.name} ${formatPrice(dish.price)}`}
                        className="dish-button"
                        key={dish.id}
                        type="button"
                        onClick={() => setPendingDish({ dish, remarks: [] })}
                      >
                        <strong>{dish.name}</strong>
                        <span>{formatPrice(dish.price)}</span>
                      </button>
                    ))}
                  </div>
                </section>
              );
            })
          )}
          {pendingDish ? (
            <RemarkPicker
              title={`${pendingDish.dish.name}备注`}
              selectedRemarks={pendingDish.remarks}
              confirmText="确认添加"
              onToggleRemark={(remark) =>
                setPendingDish({
                  ...pendingDish,
                  remarks: pendingDish.remarks.includes(remark)
                    ? pendingDish.remarks.filter((item) => item !== remark)
                    : [...pendingDish.remarks, remark],
                })
              }
              onConfirm={confirmDish}
              onCancel={() => setPendingDish(null)}
            />
          ) : null}
        </aside>

        <section className="groups-pane">
          {state.orderGroups.length === 0 ? (
            <EmptyState title="暂无菜单" description="点击左侧菜品即可自动创建第 1 组。" />
          ) : (
            <div className="group-grid">
              {state.orderGroups.map((group) => (
                <article
                  className={group.id === state.activeGroupId ? "order-group active" : "order-group"}
                  key={group.id}
                >
                  <div className="group-head">
                    <div>
                      <h2>第 {group.number} 组</h2>
                      <span className={group.submitted ? "status submitted" : "status"}>
                        {group.submitted ? "已提交" : "点菜中"}
                      </span>
                    </div>
                    <div className="group-actions">
                      <button
                        className="mini-button primary"
                        type="button"
                        onClick={() => setState((current) => setActiveGroup(current, group.id))}
                      >
                        加菜
                      </button>
                      {!group.submitted ? (
                        <button
                          className="mini-button primary"
                          disabled={group.items.length === 0}
                          type="button"
                          onClick={() => setState((current) => submitGroup(current, group.id))}
                        >
                          提交
                        </button>
                      ) : null}
                      <DeleteGroupButton
                        groupNumber={group.number}
                        onConfirm={() => setState((current) => deleteGroup(current, group.id))}
                      />
                    </div>
                  </div>
                  <div className="order-items">
                    {group.items.map((item) => (
                      <div className={item.completed ? "order-item done" : "order-item"} key={item.id}>
                        <button
                          className="item-name-button"
                          type="button"
                          onClick={() =>
                            setPendingItem({
                              groupId: group.id,
                              item,
                              remarks: [...item.remarks],
                            })
                          }
                        >
                          {itemTitle(item)}
                        </button>
                        <span className="item-price">{formatPrice(item.price)}</span>
                        <button
                          className="mini-button primary"
                          type="button"
                          onClick={() =>
                            setState((current) => toggleItemCompleted(current, group.id, item.id))
                          }
                        >
                          {item.completed ? "取消" : "完成"}
                        </button>
                      </div>
                    ))}
                  </div>
                  <footer className="group-foot">
                    <span>第 {group.number} 组小计</span>
                    <strong>{formatPrice(getGroupTotal(group))}</strong>
                  </footer>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {pendingItem ? (
        <RemarkPicker
          title={`${pendingItem.item.name}备注`}
          selectedRemarks={pendingItem.remarks}
          confirmText="保存备注"
          onToggleRemark={(remark) =>
            setPendingItem({
              ...pendingItem,
              remarks: pendingItem.remarks.includes(remark)
                ? pendingItem.remarks.filter((item) => item !== remark)
                : [...pendingItem.remarks, remark],
            })
          }
          onConfirm={confirmItemRemarks}
          onCancel={() => setPendingItem(null)}
        />
      ) : null}
    </section>
  );
}

function DeleteGroupButton({
  groupNumber,
  onConfirm,
}: {
  groupNumber: number;
  onConfirm: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  return (
    <>
      <button className="mini-button danger" type="button" onClick={() => setConfirming(true)}>
        删除
      </button>
      {confirming ? (
        <ConfirmDialog
          title="删除菜单"
          message={`确认删除第 ${groupNumber} 组菜单吗？此操作不会保留记录。`}
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            setConfirming(false);
            onConfirm();
          }}
        />
      ) : null}
    </>
  );
}
