import test from "node:test";
import assert from "node:assert/strict";
import {
  createMaterialOneContext
} from "../packages/core/src/index.ts";
import {
  createAccessibilityPolicy
} from "../packages/accessibility/src/index.ts";
import {
  createAdaptiveSkeletonRecipe,
  createLoadingPolicy,
  createLoadingPresentation,
  createLoadingProfile,
  createSkeletonPresentation
} from "../packages/loading/src/index.ts";

function context(
  density:
    | "compact"
    | "comfortable"
    | "spacious" = "comfortable"
) {
  return createMaterialOneContext(
    {
      theme: "system",
      density,
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

test("loading policy uses effective accessibility motion", () => {
  const ctx = context();
  const accessibility =
    createAccessibilityPolicy(
      ctx,
      {
        prefersReducedMotion: true
      }
    );

  const policy =
    createLoadingPolicy(
      ctx,
      accessibility
    );

  assert.equal(
    policy.motion,
    "reduced"
  );
  assert.equal(
    policy.skeletonMotion,
    "static"
  );
});

test("adaptive skeleton recipes cannot re-enable shimmer under reduced motion", () => {
  const ctx = context();
  const accessibility =
    createAccessibilityPolicy(
      ctx,
      {
        prefersReducedMotion: true
      }
    );

  const recipe =
    createAdaptiveSkeletonRecipe(
      ctx,
      accessibility,
      "card"
    );

  assert.equal(
    recipe.motion,
    "static"
  );
  assert.equal(
    recipe.delayMs,
    180
  );
  assert.equal(
    recipe.minimumVisibleMs,
    300
  );
});

test("loading profile uses core density for skeleton blueprints", () => {
  const ctx = context("compact");
  const accessibility =
    createAccessibilityPolicy(ctx);

  const profile =
    createLoadingProfile(
      ctx,
      accessibility,
      {
        intent: "content",
        expectedLatencyMs: 600,
        geometryKnown: true,
        skeletonKind: "table-row",
        blueprintKind: "table"
      }
    );

  assert.equal(
    profile.presentation,
    "skeleton"
  );
  assert.equal(
    profile.policy.density,
    "compact"
  );
  assert.equal(
    profile.blueprint?.rows,
    6
  );
  assert.equal(
    profile.skeleton?.kind,
    "table-row"
  );
});

test("fast loading may have no placeholder while region remains busy", () => {
  const ctx = context();
  const accessibility =
    createAccessibilityPolicy(ctx);

  const profile =
    createLoadingProfile(
      ctx,
      accessibility,
      {
        intent: "content",
        expectedLatencyMs: 90,
        geometryKnown: true
      }
    );
  const presentation =
    createLoadingPresentation(
      profile
    );

  assert.equal(
    profile.presentation,
    "none"
  );
  assert.equal(
    presentation.attributes[
      "aria-busy"
    ],
    "true"
  );
});

test("stale refresh preserves content and emits portable metadata", () => {
  const ctx = context("spacious");
  const accessibility =
    createAccessibilityPolicy(ctx);

  const profile =
    createLoadingProfile(
      ctx,
      accessibility,
      {
        intent: "refresh",
        expectedLatencyMs: 800,
        geometryKnown: true,
        staleContentAvailable: true
      }
    );
  const presentation =
    createLoadingPresentation(
      profile
    );

  assert.equal(
    profile.presentation,
    "stale"
  );
  assert.equal(
    presentation.attributes[
      "data-mo-loading-presentation"
    ],
    "stale"
  );
  assert.equal(
    presentation.attributes[
      "data-mo-loading-density"
    ],
    "spacious"
  );
  assert.equal(
    presentation.attributes[
      "data-mo-stale-content"
    ],
    "true"
  );
});

test("completed loading profiles clear busy state", () => {
  const ctx = context();
  const accessibility =
    createAccessibilityPolicy(ctx);

  const profile =
    createLoadingProfile(
      ctx,
      accessibility,
      {
        intent: "navigation",
        expectedLatencyMs: 500,
        geometryKnown: false,
        busy: false
      }
    );
  const presentation =
    createLoadingPresentation(
      profile
    );

  assert.equal(
    profile.presentation,
    "none"
  );
  assert.equal(
    presentation.attributes[
      "aria-busy"
    ],
    "false"
  );
});

test("skeleton presentation keeps placeholder geometry out of the accessibility tree", () => {
  const ctx = context();
  const accessibility =
    createAccessibilityPolicy(ctx);
  const recipe =
    createAdaptiveSkeletonRecipe(
      ctx,
      accessibility,
      "title"
    );
  const presentation =
    createSkeletonPresentation(
      recipe
    );

  assert.equal(
    presentation.attributes[
      "aria-hidden"
    ],
    "true"
  );
  assert.equal(
    presentation.attributes[
      "data-mo-kind"
    ],
    "title"
  );
  assert.equal(
    presentation.style[
      "--mo-loading-delay"
    ],
    "180ms"
  );
});
