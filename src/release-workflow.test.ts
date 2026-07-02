import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

const workflowPath = resolve(process.cwd(), ".github/workflows/android-release.yml");

describe("Android release workflow", () => {
  test("publishes a debug APK when a tablet version tag is pushed", () => {
    const workflow = readFileSync(workflowPath, "utf8");

    expect(workflow).toContain("on:");
    expect(workflow).toContain("tablet-v*");
    expect(workflow).toContain("contents: write");
    expect(workflow).toContain("npm ci --include=optional");
    expect(workflow).toContain("npm test -- --run");
    expect(workflow).toContain("chmod +x android/gradlew");
    expect(workflow).toContain("npm run android:build:debug");
    expect(workflow).toContain("android/app/build/outputs/apk/debug/app-debug.apk");
    expect(workflow).toContain("if: startsWith(github.ref, 'refs/tags/tablet-v')");
    expect(workflow).toContain("softprops/action-gh-release");
  });
});
