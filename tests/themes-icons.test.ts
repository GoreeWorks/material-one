import test from "node:test";
import assert from "node:assert/strict";
import {
  serializeTheme,
  themeToCssVariables
} from "../packages/themes/src/index.ts";
import {
  defineMaterialOneIcon,
  getIconState,
  materialOneIconGrid
} from "../packages/icons/src/index.ts";

test("themes serialize semantic variables", () => {
  const theme = {
    name: "sample",
    scheme: "light" as const,
    colors: {
      primary: "#000001",
      onPrimary: "#ffffff",
      primaryContainer: "#eeeeff",
      onPrimaryContainer: "#111122",
      secondary: "#333333",
      onSecondary: "#ffffff",
      secondaryContainer: "#eeeeee",
      onSecondaryContainer: "#111111",
      tertiary: "#444444",
      onTertiary: "#ffffff",
      tertiaryContainer: "#dddddd",
      onTertiaryContainer: "#111111",
      background: "#ffffff",
      surface: "#ffffff",
      surfaceContainer: "#f5f5f5",
      surfaceContainerHigh: "#eeeeee",
      floating: "#ffffff",
      text: "#111111",
      textMuted: "#666666",
      border: "#cccccc",
      success: "#006600",
      warning: "#775500",
      error: "#990000",
      information: "#004488"
    }
  };

  const variables = themeToCssVariables(theme);
  assert.equal(variables["--mo-color-primary"], "#000001");
  assert.match(serializeTheme(theme), /data-mo-theme="sample"/);
});

test("icon definitions enforce Material One geometry", () => {
  const icon = defineMaterialOneIcon({
    name: "sample",
    style: "outline",
    weight: "regular",
    paths: ["M2 12h20"],
    states: [{ name: "active", paths: ["M2 12h20M12 2v20"] }]
  });

  assert.equal(icon.viewBox, "0 0 24 24");
  assert.deepEqual(getIconState(icon, "active"), ["M2 12h20M12 2v20"]);
  assert.equal(materialOneIconGrid.canvas, 24);
});
