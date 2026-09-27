import test from "node:test";
import assert from "node:assert/strict";
import {
  createDataTableRecipe,
  createPaginationRecipe,
  createSegmentedRecipe,
  createTabsRecipe,
  createToggleRecipe,
  createControlPresentation,
  disclosurePresentation
} from "../packages/controls/src/index.ts";
import type { MaterialOneContext } from "../packages/core/src/index.ts";

function context(
  layout: MaterialOneContext["layout"],
  input: MaterialOneContext["device"]["input"] = "mouse"
): MaterialOneContext {
  return {
    layout,
    interactionTarget: input === "touch" ? 48 : 44,
    device: {
      width: layout === "compact" ? 390 : layout === "expanded" ? 900 : 1440,
      height: 900,
      input,
      orientation: layout === "compact" ? "portrait" : "landscape"
    },
    preferences: {
      theme: "light",
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

test("toggle recipes inherit accessible target size", () => {
  const toggle = createToggleRecipe(context("compact", "touch"), "switch", true);
  assert.equal(toggle.minTargetSize, 48);
  assert.equal(toggle.checked, true);
});

test("segmented controls and tabs become scrollable when space is constrained", () => {
  assert.equal(createSegmentedRecipe(context("compact"), 5).presentation, "scrollable");
  assert.equal(createTabsRecipe(context("compact"), 3).presentation, "scrollable");
});

test("data tables transform into cards on compact layouts", () => {
  const compact = createDataTableRecipe(context("compact"), { columns: 6 });
  const workspace = createDataTableRecipe(context("workspace"), { columns: 6 });
  assert.equal(compact.presentation, "cards");
  assert.equal(compact.columnPriority, "essential-first");
  assert.equal(workspace.presentation, "table");
  assert.equal(workspace.stickyHeader, true);
});

test("pagination reduces visible pages on compact layouts", () => {
  assert.equal(createPaginationRecipe(context("compact"), 20).visiblePages, 3);
  assert.equal(createPaginationRecipe(context("workspace"), 20).visiblePages, 7);
});

test("tooltips adapt from hover to press for touch", () => {
  assert.equal(disclosurePresentation(context("workspace"), "tooltip"), "hover");
  assert.equal(disclosurePresentation(context("compact", "touch"), "tooltip"), "press");
});


test("controls share canonical hovered state and portable component presentation", () => {
  const ctx = context("workspace");
  const recipe = createToggleRecipe(
    ctx,
    "switch",
    false,
    "hovered"
  );
  const presentation = createControlPresentation(
    ctx,
    recipe
  );

  assert.equal(recipe.state, "hovered");
  assert.equal(
    presentation.attributes["data-mo-state"],
    "hovered"
  );
  assert.equal(
    presentation.attributes["data-mo-control"],
    "toggle"
  );
  assert.equal(
    presentation.attributes["data-mo-control-kind"],
    "switch"
  );
  assert.equal(
    presentation.style["--mo-control-target-size"],
    "44px"
  );
});

test("data table presentation exposes adaptive row height and structure", () => {
  const ctx = context("workspace");
  const recipe = createDataTableRecipe(ctx, {
    columns: 6
  });
  const presentation = createControlPresentation(
    ctx,
    recipe
  );

  assert.equal(
    presentation.attributes["data-mo-presentation"],
    "table"
  );
  assert.equal(
    presentation.attributes["data-mo-sticky-header"],
    "true"
  );
  assert.equal(
    presentation.style["--mo-control-row-height"],
    "48px"
  );
});
