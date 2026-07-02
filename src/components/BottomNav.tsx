type Page = "order" | "manage";

interface BottomNavProps {
  page: Page;
  onChange: (page: Page) => void;
}

export function BottomNav({ page, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="底部导航">
      <button
        className={page === "order" ? "nav-button active" : "nav-button"}
        type="button"
        onClick={() => onChange("order")}
      >
        点餐
      </button>
      <button
        className={page === "manage" ? "nav-button active" : "nav-button"}
        type="button"
        onClick={() => onChange("manage")}
      >
        管理
      </button>
    </nav>
  );
}
