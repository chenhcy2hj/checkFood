import { useEffect, useState } from "react";
import { BottomNav } from "./components/BottomNav";
import { OrderPage } from "./pages/OrderPage";
import { ManagePage } from "./pages/ManagePage";
import { loadState, saveState } from "./storage";
import type { AppState, Dish, OrderItem } from "./types";

type Page = "order" | "manage";

interface PendingDish {
  dish: Dish;
  remarks: string[];
}

interface PendingItem {
  groupId: string;
  item: OrderItem;
  remarks: string[];
}

export default function App() {
  const [page, setPage] = useState<Page>("order");
  const [state, setState] = useState<AppState>(() => loadState());
  const [pendingDish, setPendingDish] = useState<PendingDish | null>(null);
  const [pendingItem, setPendingItem] = useState<PendingItem | null>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <main className="app-shell">
      <section className="content-shell">
        {page === "order" ? (
          <OrderPage
            state={state}
            setState={setState}
            pendingDish={pendingDish}
            setPendingDish={setPendingDish}
            pendingItem={pendingItem}
            setPendingItem={setPendingItem}
          />
        ) : (
          <ManagePage state={state} setState={setState} />
        )}
      </section>
      <BottomNav page={page} onChange={setPage} />
    </main>
  );
}
