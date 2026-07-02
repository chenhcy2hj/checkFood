import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";
import { STORAGE_KEY } from "./storage";

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("adds a dish with fixed remarks and shows totals", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "鱼香肉丝 ￥28" }));
    fireEvent.click(screen.getByRole("button", { name: "少辣" }));
    fireEvent.click(screen.getByRole("button", { name: "确认添加" }));

    expect(screen.getByText("第 1 组")).toBeInTheDocument();
    expect(screen.getByText("鱼香肉丝（少辣）")).toBeInTheDocument();
    expect(screen.getByText("全部合计 ￥28")).toBeInTheDocument();
  });

  it("switches to management and adds a new dish", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "管理" }));
    fireEvent.change(screen.getByLabelText("菜品名称"), {
      target: { value: "酸辣土豆丝" },
    });
    fireEvent.change(screen.getByLabelText("价格"), {
      target: { value: "18" },
    });
    fireEvent.click(screen.getByRole("button", { name: "保存菜品" }));

    expect(screen.getByText("酸辣土豆丝")).toBeInTheDocument();
    expect(screen.getByText("￥18")).toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEY)).toContain("酸辣土豆丝");
  });
});
