import test from "node:test";
import assert from "node:assert/strict";
import {
  createMaterialOneContext
} from "../packages/core/src/index.ts";
import {
  createLayoutPresentation,
  createLayoutProfile,
  resolveLayoutColumns,
  resolveLayoutContentWidth,
  resolveLayoutPaneStrategy
} from "../packages/layout/src/index.ts";

const preferences = {
  theme: "system" as const,
  density: "comfortable" as const,
  motion: "full" as const,
  experienceMode: "professional" as const
};

function context(
  width: number,
  layoutPreference:
    | "automatic"
    | "compact"
    | "expanded"
    | "workspace" = "automatic"
) {
  return createMaterialOneContext(
    { ...preferences, layoutPreference },
    {
      width,
      height: 900,
      input: width < 600 ? "touch" : "mixed",
      orientation:
        width < 600 ? "portrait" : "landscape"
    }
  );
}

test("layout profiles resolve semantic geometry from core layout mode", () => {
  const compact = createLayoutProfile(context(390));
  const expanded = createLayoutProfile(context(900));
  const workspace = createLayoutProfile(context(1440));

  assert.deepEqual(
    {
      mode: compact.mode,
      padding: compact.contentPadding,
      width: compact.contentMaxWidth,
      columns: compact.gridColumns,
      capacity: compact.columnCapacity,
      panes: compact.paneStrategy
    },
    {
      mode: "compact",
      padding: 16,
      width: 720,
      columns: 1,
      capacity: 1,
      panes: "stacked"
    }
  );

  assert.equal(expanded.mode, "expanded");
  assert.equal(expanded.contentPadding, 24);
  assert.equal(expanded.contentMaxWidth, 1120);
  assert.equal(expanded.gridColumns, 2);
  assert.equal(expanded.paneStrategy, "split");

  assert.equal(workspace.mode, "workspace");
  assert.equal(workspace.contentPadding, 32);
  assert.equal(workspace.contentMaxWidth, "fluid");
  assert.equal(workspace.gridColumns, 3);
  assert.equal(workspace.columnCapacity, 4);
  assert.equal(workspace.paneStrategy, "multi-pane");
});

test("layout engine honors core layout overrides instead of reclassifying viewport width", () => {
  const overridden = createLayoutProfile(
    context(1440, "compact")
  );

  assert.equal(overridden.mode, "compact");
  assert.equal(overridden.gridColumns, 1);
  assert.equal(overridden.paneStrategy, "stacked");
  assert.equal(overridden.supportsContextPane, false);
});

test("requested columns are clamped to the current layout capacity", () => {
  assert.equal(resolveLayoutColumns("compact", 4), 1);
  assert.equal(resolveLayoutColumns("expanded", 4), 2);
  assert.equal(resolveLayoutColumns("workspace", 4), 4);
  assert.equal(
    resolveLayoutColumns("workspace", "automatic"),
    3
  );
});

test("pane strategy and content width remain explicit layout concerns", () => {
  assert.equal(
    resolveLayoutPaneStrategy("compact"),
    "stacked"
  );
  assert.equal(
    resolveLayoutPaneStrategy("expanded"),
    "split"
  );
  assert.equal(
    resolveLayoutPaneStrategy("workspace"),
    "multi-pane"
  );
  assert.equal(
    resolveLayoutContentWidth("expanded", true),
    "fluid"
  );
});

test("layout presentation emits portable attributes and CSS variables", () => {
  const presentation = createLayoutPresentation(
    context(900),
    { columns: 4 }
  );

  assert.equal(
    presentation.attributes["data-mo-layout"],
    "expanded"
  );
  assert.equal(
    presentation.attributes[
      "data-mo-layout-pane-strategy"
    ],
    "split"
  );
  assert.equal(
    presentation.attributes[
      "data-mo-layout-grid-columns"
    ],
    "2"
  );
  assert.equal(
    presentation.attributes[
      "data-mo-layout-context-pane"
    ],
    "unavailable"
  );
  assert.equal(
    presentation.style["--mo-layout-content-padding"],
    "24px"
  );
  assert.equal(
    presentation.style["--mo-layout-content-max"],
    "1120px"
  );
  assert.equal(
    presentation.style["--mo-layout-min-column"],
    "280px"
  );
});
