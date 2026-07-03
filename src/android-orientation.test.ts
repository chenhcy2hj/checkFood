import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

const manifest = readFileSync(
  resolve(process.cwd(), "android/app/src/main/AndroidManifest.xml"),
  "utf8",
);
const styles = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");

describe("Android landscape ordering mode", () => {
  test("locks the Android activity to landscape orientation", () => {
    expect(manifest).toContain('android:screenOrientation="landscape"');
  });

  test("keeps ordering screen split left and right in landscape", () => {
    expect(styles).toContain("@media (orientation: landscape) and (max-width: 959px)");
    expect(styles).toContain("grid-template-columns: minmax(280px, 42%) minmax(0, 58%)");
    expect(styles).toContain("grid-template-rows: minmax(0, 1fr)");
  });
});
