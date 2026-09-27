import test from "node:test";
import assert from "node:assert/strict";
import { createMaterialOneContext } from "../packages/core/src/index.ts";
import {
  auditInteractionTarget,
  clampAccessibilityTextScale,
  createAccessibilityPolicy,
  createAccessibilityPresentation,
  createLiveRegionAttributes,
  resolveAccessibilityMotion
} from "../packages/accessibility/src/index.ts";

const device = {
  width: 1440,
  height: 900,
  input: "mouse" as const,
  orientation: "landscape" as const
};

function createContext(
  overrides: Parameters<typeof createMaterialOneContext>[0] = {
    theme: "system",
    density: "comfortable",
    motion: "full",
    experienceMode: "professional"
  }
) {
  return createMaterialOneContext(overrides, device);
}

test("accessibility text scale is clamped to the supported adaptive range", () => {
  assert.equal(clampAccessibilityTextScale(0.4), 0.8);
  assert.equal(clampAccessibilityTextScale(1.257), 1.26);
  assert.equal(clampAccessibilityTextScale(3), 2);
  assert.equal(clampAccessibilityTextScale(Number.NaN), 1);
});

test("platform reduced-motion signals never increase requested motion", () => {
  assert.equal(resolveAccessibilityMotion(createContext(), {}), "full");
  assert.equal(
    resolveAccessibilityMotion(createContext(), {
      prefersReducedMotion: true
    }),
    "reduced"
  );
  assert.equal(
    resolveAccessibilityMotion(
      createContext({
        theme: "system",
        density: "comfortable",
        motion: "none",
        experienceMode: "professional"
      }),
      { prefersReducedMotion: false }
    ),
    "none"
  );
});

test("accessibility policy combines user, device, and platform needs", () => {
  const context = createContext({
    theme: "dark",
    density: "compact",
    motion: "full",
    experienceMode: "accessibility",
    accessibility: {
      contrast: "standard",
      textScale: 1.4,
      reducedTransparency: false
    }
  });
  const policy = createAccessibilityPolicy(context, {
    prefersHighContrast: true,
    prefersReducedMotion: true,
    prefersReducedTransparency: true,
    forcedColors: true
  });

  assert.equal(policy.mode, "enhanced");
  assert.equal(policy.contrast, "high");
  assert.equal(policy.textScale, 1.4);
  assert.equal(policy.motion, "reduced");
  assert.equal(policy.reducedTransparency, true);
  assert.equal(policy.forcedColors, true);
  assert.equal(policy.minTargetSize, 48);
  assert.equal(policy.focusRingWidth, 3);
  assert.equal(policy.requireRedundantCues, true);
});

test("accessibility presentation emits portable attributes and CSS variables", () => {
  const presentation = createAccessibilityPresentation(
    createContext({
      theme: "system",
      density: "comfortable",
      motion: "reduced",
      experienceMode: "professional",
      accessibility: {
        contrast: "high",
        textScale: 1.25,
        reducedTransparency: true
      }
    })
  );

  assert.equal(
    presentation.attributes["data-mo-accessibility"],
    "enhanced"
  );
  assert.equal(presentation.attributes["data-mo-contrast"], "high");
  assert.equal(presentation.attributes["data-mo-motion"], "reduced");
  assert.equal(
    presentation.attributes["data-mo-transparency"],
    "reduced"
  );
  assert.equal(presentation.style["--mo-a11y-text-scale"], "1.25");
  assert.equal(presentation.style["--mo-a11y-min-target"], "44px");
  assert.equal(
    presentation.style["--mo-a11y-focus-ring-width"],
    "3px"
  );
});

test("interaction target audits use the resolved Material One target", () => {
  const policy = createAccessibilityPolicy(
    createMaterialOneContext(
      {
        theme: "system",
        density: "comfortable",
        motion: "full",
        experienceMode: "professional"
      },
      { ...device, input: "touch" }
    )
  );

  assert.deepEqual(auditInteractionTarget(48, policy), {
    actual: 48,
    required: 48,
    passes: true,
    shortfall: 0
  });
  assert.deepEqual(auditInteractionTarget(40, policy), {
    actual: 40,
    required: 48,
    passes: false,
    shortfall: 8
  });
});

test("live region helper provides explicit polite and urgent semantics", () => {
  assert.deepEqual(createLiveRegionAttributes("polite"), {
    role: "status",
    "aria-live": "polite",
    "aria-atomic": "true"
  });
  assert.deepEqual(createLiveRegionAttributes("urgent"), {
    role: "alert",
    "aria-live": "assertive",
    "aria-atomic": "true"
  });
});
