import test from "node:test";
import assert from "node:assert/strict";
import {
  resolveApplicationShell,
  resolveOverlay,
  resolveShellNavigation
} from "../packages/shell/src/index.ts";
import type { MaterialOneContext } from "../packages/core/src/index.ts";

function context(layout: MaterialOneContext["layout"]): MaterialOneContext {
  return {
    layout,
    interactionTarget: layout === "compact" ? 48 : 44,
    device: {
      width: layout === "compact" ? 390 : layout === "expanded" ? 900 : 1440,
      height: 900,
      input: layout === "compact" ? "touch" : "mixed",
      orientation: layout === "compact" ? "portrait" : "landscape"
    },
    preferences: {
      theme: "system",
      density: "comfortable",
      motion: "full",
      experienceMode: "professional",
      layoutPreference: "automatic",
      accessibility: {
        contrast: "standard",
        textScale: 1,
        reducedTransparency: false
      }
    }
  };
}

test("navigation transforms by layout", () => {
  assert.equal(resolveShellNavigation(context("compact")), "bottom");
  assert.equal(resolveShellNavigation(context("expanded")), "rail");
  assert.equal(resolveShellNavigation(context("workspace")), "sidebar");
});

test("workspace exposes contextual panes", () => {
  const recipe = resolveApplicationShell(context("workspace"));
  assert.equal(recipe.contextPane, "contextual");
  assert.equal(recipe.navigationSize, 280);
  assert.equal(recipe.contentMaxWidth, "fluid");
  assert.equal(recipe.contentPadding, 32);
});

test("compact command surface becomes overlay", () => {
  const recipe = resolveApplicationShell(context("compact"));
  assert.equal(recipe.commandSurface, "overlay");
  assert.equal(recipe.contextPane, "none");
  assert.equal(recipe.contentPadding, 16);
  assert.equal(recipe.contentMaxWidth, 720);
});

test("shell can request fluid content without redefining layout geometry", () => {
  const recipe = resolveApplicationShell(
    context("expanded"),
    { preferFluidContent: true }
  );

  assert.equal(recipe.contentMaxWidth, "fluid");
  assert.equal(recipe.contentPadding, 24);
});

test("overlays adapt presentation", () => {
  assert.equal(resolveOverlay(context("compact"), "dialog").presentation, "sheet");
  assert.equal(resolveOverlay(context("workspace"), "menu").presentation, "popover");
  assert.equal(resolveOverlay(context("compact"), "command").presentation, "fullscreen");
});
