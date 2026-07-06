import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

const manifest = readFileSync(
  resolve(process.cwd(), "android/app/src/main/AndroidManifest.xml"),
  "utf8",
);
const styles = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");
const androidVariables = readFileSync(
  resolve(process.cwd(), "android/variables.gradle"),
  "utf8",
);

describe("Android landscape ordering mode", () => {
  test("locks the Android activity to landscape orientation", () => {
    expect(manifest).toContain('android:screenOrientation="landscape"');
  });

  test("keeps ordering screen split left and right in landscape", () => {
    expect(styles).toContain("@media (orientation: landscape) and (max-width: 959px)");
    expect(styles).toContain("grid-template-columns: minmax(280px, 42%) minmax(0, 58%)");
    expect(styles).toContain("grid-template-rows: minmax(0, 1fr)");
  });

  test("supports Android 9 tablets and old WebView viewport fallbacks", () => {
    const minSdkMatch = androidVariables.match(/minSdkVersion\s*=\s*(\d+)/);

    expect(minSdkMatch).not.toBeNull();
    expect(Number(minSdkMatch?.[1])).toBeLessThanOrEqual(28);
    expect(styles).toContain("height: 100vh");
    expect(styles).toContain("height: 100dvh");
  });

  test("compacts remarks and navigation when landscape height is tight", () => {
    expect(styles).toContain("@media (orientation: landscape) and (max-height: 520px)");
    expect(styles).toContain("max-height: 64px");
    expect(styles).toContain("padding-block: 4px calc(4px + env(safe-area-inset-bottom))");
    expect(styles).toContain("min-height: 38px");
  });
});
