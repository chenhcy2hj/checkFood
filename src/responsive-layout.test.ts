import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

const styles = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");
const indexHtml = readFileSync(resolve(process.cwd(), "index.html"), "utf8");

describe("responsive layout CSS", () => {
  test("does not force tablet width on narrow screens", () => {
    expect(styles).not.toContain("min-width: 960px");
    expect(styles).toContain("min-width: 0");
  });

  test("uses dynamic viewport height and safe-area insets for Android WebView", () => {
    expect(styles).toContain("100dvh");
    expect(styles).toContain("env(safe-area-inset-bottom)");
    expect(indexHtml).toContain("viewport-fit=cover");
  });

  test("defines medium and narrow screen layout breakpoints", () => {
    expect(styles).toContain("@media (max-width: 959px)");
    expect(styles).toContain("@media (max-width: 599px)");
    expect(styles).toContain("grid-template-columns: 1fr");
  });
});
