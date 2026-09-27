import test from "node:test";
import assert from "node:assert/strict";
import {
  createMaterialOneContext
} from "../packages/core/src/index.ts";
import {
  createAccessibilityPolicy
} from "../packages/accessibility/src/index.ts";
import {
  createSeriesEncodings,
  createSeriesPresentation,
  createStatusVisualizationPresentation,
  createVisualizationPolicy,
  createVisualizationPresentation
} from "../packages/data-visualization/src/index.ts";

function context() {
  return createMaterialOneContext(
    {
      theme: "system",
      density: "comfortable",
      motion: "full",
      experienceMode: "professional"
    },
    {
      width: 900,
      height: 900,
      input: "mixed",
      orientation: "landscape"
    }
  );
}

test("visualization policy uses effective Accessibility motion and contrast", () => {
  const ctx = context();
  const accessibility =
    createAccessibilityPolicy(
      ctx,
      {
        prefersReducedMotion: true,
        prefersHighContrast: true,
        forcedColors: true
      }
    );

  const policy =
    createVisualizationPolicy(
      ctx,
      accessibility
    );

  assert.equal(
    policy.motion,
    "reduced"
  );
  assert.equal(
    policy.contrast,
    "high"
  );
  assert.equal(
    policy.forcedColors,
    true
  );
  assert.equal(
    policy.requireRedundantCues,
    true
  );
  assert.equal(
    policy.transitionMs,
    0
  );
});

test("visualization presentation exposes portable effective policy", () => {
  const ctx = context();
  const accessibility =
    createAccessibilityPolicy(ctx);
  const presentation =
    createVisualizationPresentation(
      ctx,
      accessibility,
      {
        label: "Revenue by product"
      }
    );

  assert.equal(
    presentation.attributes[
      "data-mo-visualization"
    ],
    "adaptive"
  );
  assert.equal(
    presentation.attributes[
      "data-mo-viz-motion"
    ],
    "full"
  );
  assert.equal(
    presentation.attributes[
      "data-mo-viz-redundancy"
    ],
    "required"
  );
  assert.equal(
    presentation.attributes.role,
    "group"
  );
  assert.equal(
    presentation.attributes[
      "aria-label"
    ],
    "Revenue by product"
  );
  assert.equal(
    presentation.style[
      "--mo-viz-transition-duration"
    ],
    "460ms"
  );
});

test("series presentation preserves categorical color and redundant pattern", () => {
  const [encoding] =
    createSeriesEncodings([
      {
        key: "design",
        label: "Design",
        value: 42,
        unit: "%"
      }
    ]);
  const presentation =
    createSeriesPresentation(
      encoding,
      0.42
    );

  assert.equal(
    presentation.attributes[
      "data-mo-color-code"
    ],
    encoding.colorCode
  );
  assert.equal(
    presentation.attributes[
      "data-mo-viz-pattern"
    ],
    "solid"
  );
  assert.equal(
    presentation.attributes[
      "aria-label"
    ],
    "Design: 42 %"
  );
  assert.equal(
    presentation.style[
      "--mo-viz-value"
    ],
    "42%"
  );
});

test("status visualization presentation stays semantic instead of categorical", () => {
  const presentation =
    createStatusVisualizationPresentation(
      "error",
      "dark"
    );

  assert.equal(
    presentation.attributes[
      "data-mo-status"
    ],
    "error"
  );
  assert.equal(
    presentation.style[
      "--mo-viz-status"
    ],
    "var(--mo-sem-error)"
  );
  assert.equal(
    presentation.style[
      "--mo-viz-status-container"
    ],
    "var(--mo-sem-error-container)"
  );
});
