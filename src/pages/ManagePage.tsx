import { useState } from "react";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "../constants";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { addDish, addRemark, deleteDish, deleteRemark, updateDish } from "../state";
import type { AppState, Dish, DishCategory } from "../types";

interface ManagePageProps {
  state: AppState;
  setState: (updater: (state: AppState) => AppState) => void;
}

interface FormState {
  name: string;
  price: string;
  category: DishCategory;
}

const emptyForm: FormState = {
  name: "",
  price: "",
  category: "hot",
};

function formatPrice(price: number): string {
  return Number.isInteger(price) ? `￥${price}` : `￥${price.toFixed(2)}`;
}

export function ManagePage({ state, setState }: ManagePageProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [remarkInput, setRemarkInput] = useState("");
  const [remarkError, setRemarkError] = useState("");
  const [deletingDish, setDeletingDish] = useState<Dish | null>(null);

  const submit = () => {
    const price = Number(form.price);
    if (!form.name.trim()) {
      setError("菜品名称不能为空");
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setError("价格必须是大于或等于 0 的数字");
      return;
    }

    setState((current) =>
      editingId
        ? updateDish(current, editingId, {
            name: form.name,
            price,
            category: form.category,
          })
        : addDish(current, {
            name: form.name,
            price,
            category: form.category,
          }),
    );
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  };

  const submitRemark = () => {
    const normalized = remarkInput.trim();
    if (!normalized) {
      setRemarkError("备注不能为空");
      return;
    }
    if (state.remarks.includes(normalized)) {
      setRemarkError("备注已存在");
      return;
    }

    setState((current) => addRemark(current, normalized));
    setRemarkInput("");
    setRemarkError("");
  };

  return (
    <section className="page manage-page">
      <div className="manage-layout">
        <aside className="manage-side">
          <section className="form-card">
            <h2>{editingId ? "编辑菜品" : "新增菜品"}</h2>
            <label className="field">
              <span>菜品名称</span>
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </label>
            <label className="field">
              <span>价格</span>
              <input
                inputMode="decimal"
                value={form.price}
                onChange={(event) => setForm({ ...form, price: event.target.value })}
              />
            </label>
            <label className="field">
              <span>分类</span>
              <select
                value={form.category}
                onChange={(event) =>
                  setForm({ ...form, category: event.target.value as DishCategory })
                }
              >
                {CATEGORY_ORDER.map((category) => (
                  <option key={category} value={category}>
                    {CATEGORY_LABELS[category]}
                  </option>
                ))}
              </select>
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            <div className="form-actions">
              <button className="button" type="button" onClick={submit}>
                保存菜品
              </button>
              <button
                className="button secondary"
                type="button"
                onClick={() => {
                  setForm(emptyForm);
                  setEditingId(null);
                  setError("");
                }}
              >
                清空
              </button>
            </div>
          </section>

          <section className="form-card remark-manage-card">
            <h2>备注管理</h2>
            <label className="field">
              <span>新增备注</span>
              <input
                value={remarkInput}
                onChange={(event) => setRemarkInput(event.target.value)}
              />
            </label>
            {remarkError ? <p className="form-error">{remarkError}</p> : null}
            <button className="button full" type="button" onClick={submitRemark}>
              添加备注
            </button>
            <div className="manage-remark-list">
              {state.remarks.map((remark) => (
                <div className="manage-remark" key={remark}>
                  <span>{remark}</span>
                  <button
                    aria-label={`删除备注 ${remark}`}
                    className="mini-button danger"
                    type="button"
                    onClick={() => setState((current) => deleteRemark(current, remark))}
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          </section>
        </aside>

        <section className="catalog">
          <h2>菜品列表</h2>
          <div className="catalog-grid">
            {CATEGORY_ORDER.map((category) => (
              <section className="catalog-column" key={category}>
                <h3>{CATEGORY_LABELS[category]}</h3>
                {state.dishes
                  .filter((dish) => dish.category === category)
                  .map((dish) => (
                    <article className="manage-dish" key={dish.id}>
                      <div>
                        <strong>{dish.name}</strong>
                        <span>{formatPrice(dish.price)}</span>
                      </div>
                      <div className="row-actions">
                        <button
                          className="mini-button primary"
                          type="button"
                          onClick={() => {
                            setEditingId(dish.id);
                            setForm({
                              name: dish.name,
                              price: String(dish.price),
                              category: dish.category,
                            });
                          }}
                        >
                          编辑
                        </button>
                        <button
                          className="mini-button danger"
                          type="button"
                          onClick={() => setDeletingDish(dish)}
                        >
                          删除
                        </button>
                      </div>
                    </article>
                  ))}
              </section>
            ))}
          </div>
        </section>
      </div>

      {deletingDish ? (
        <ConfirmDialog
          title="删除菜品"
          message={`确认删除${deletingDish.name}吗？已加入菜单的记录不会受影响。`}
          onCancel={() => setDeletingDish(null)}
          onConfirm={() => {
            setState((current) => deleteDish(current, deletingDish.id));
            setDeletingDish(null);
          }}
        />
      ) : null}
    </section>
  );
}
