import test from "node:test";
import assert from "node:assert/strict";
import {
  createMaterialOneContext
} from "../packages/core/src/index.ts";
import {
  createCatalogPattern,
  createGridPattern,
  createMasterDetailPattern,
  createPagePattern,
  createProductPatternPresentation,
  createSettingsPattern
} from "../packages/patterns/src/index.ts";

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
    {
      ...preferences,
      layoutPreference
    },
    {
      width,
      height: 900,
      input:
        width < 600
          ? "touch"
          : "mixed",
      orientation:
        width < 600
          ? "portrait"
          : "landscape"
    }
  );
}

test("page patterns derive header presentation from authoritative layout mode", () => {
  const compact = createPagePattern(
    context(390)
  );
  const workspace = createPagePattern(
    context(1440)
  );

  assert.equal(compact.presentation, "stacked");
  assert.equal(compact.maxWidth, 720);
  assert.equal(workspace.presentation, "split");
  assert.equal(workspace.maxWidth, "fluid");
});

test("page patterns support explicit content-width intents", () => {
  const page = createPagePattern(
    context(1440),
    { width: "standard" }
  );

  assert.equal(page.width, "standard");
  assert.equal(page.maxWidth, 1040);
});

test("grid patterns clamp product column requests to layout capacity", () => {
  const compact = createGridPattern(
    context(390),
    { columns: 4 }
  );
  const expanded = createGridPattern(
    context(900),
    { columns: 4 }
  );
  const workspace = createGridPattern(
    context(1440),
    { columns: 4 }
  );

  assert.equal(compact.columns, 1);
  assert.equal(expanded.columns, 2);
  assert.equal(workspace.columns, 4);
});

test("master-detail and settings patterns become sequential in compact layout", () => {
  const forcedCompact = context(
    1440,
    "compact"
  );
  const masterDetail =
    createMasterDetailPattern(
      forcedCompact
    );
  const settings =
    createSettingsPattern(
      forcedCompact
    );

  assert.equal(
    masterDetail.presentation,
    "stacked"
  );
  assert.equal(
    masterDetail.detailPriority,
    "sequential"
  );
  assert.equal(
    settings.stickyNavigation,
    false
  );
});

test("catalog filter strategy follows layout policy instead of raw viewport width", () => {
  const forcedWorkspace = createCatalogPattern(
    context(900, "workspace")
  );
  const expanded = createCatalogPattern(
    context(900)
  );

  assert.equal(
    forcedWorkspace.filterPresentation,
    "sidebar"
  );
  assert.equal(
    forcedWorkspace.stickyFilters,
    true
  );
  assert.equal(
    expanded.filterPresentation,
    "drawer"
  );
});

test("pattern presentation emits portable attributes and CSS variables", () => {
  const presentation =
    createProductPatternPresentation(
      createCatalogPattern(
        context(1440)
      )
    );

  assert.equal(
    presentation.attributes[
      "data-mo-pattern"
    ],
    "catalog"
  );
  assert.equal(
    presentation.attributes[
      "data-mo-pattern-presentation"
    ],
    "split"
  );
  assert.equal(
    presentation.attributes[
      "data-mo-filter-presentation"
    ],
    "sidebar"
  );
  assert.equal(
    presentation.style[
      "--mo-pattern-card-min"
    ],
    "230px"
  );
});
