import test from "node:test";
import assert from "node:assert/strict";
import {
  createMaterialOneContext
} from "../packages/core/src/index.ts";
import {
  createAccessibilityPolicy
} from "../packages/accessibility/src/index.ts";
import {
  createPersonalizationControlStates,
  createPersonalizationPresentation,
  createPersonalizationProfile,
  isPersonalizationConstrained
} from "../packages/personalization/src/index.ts";

const context = createMaterialOneContext(
  {
    theme: "system",
    density: "spacious",
    motion: "full",
    experienceMode: "expressive",
    accessibility: {
      contrast: "standard",
      textScale: 1.25,
      reducedTransparency: false
    }
  },
  {
    width: 1440,
    height: 900,
    input: "mouse",
    orientation: "landscape"
  }
);

const accessibility = createAccessibilityPolicy(context, {
  prefersReducedMotion: true,
  prefersHighContrast: true,
  prefersReducedTransparency: true
});

test("personalization profile preserves requested choices and accessibility-resolved behavior", () => {
  const profile = createPersonalizationProfile(
    context,
    accessibility
  );

  assert.equal(profile.themePreference, "system");
  assert.equal(profile.density, "spacious");
  assert.equal(profile.experienceMode, "expressive");
  assert.equal(profile.layout, "workspace");
  assert.equal(profile.layoutPreference, "automatic");
  assert.equal(profile.requestedMotion, "full");
  assert.equal(profile.motion, "reduced");
  assert.equal(profile.requestedTextScale, 1.25);
  assert.equal(profile.textScale, 1.25);
  assert.equal(profile.requestedContrast, "standard");
  assert.equal(profile.contrast, "high");
  assert.equal(profile.requestedReducedTransparency, false);
  assert.equal(profile.reducedTransparency, true);
  assert.equal(profile.interactionTarget, 48);
  assert.equal(profile.accessibilityMode, "enhanced");
});

test("personalization presentation emits portable requested and effective attributes", () => {
  const presentation = createPersonalizationPresentation(
    context,
    accessibility
  );

  assert.equal(
    presentation.attributes["data-mo-experience"],
    "expressive"
  );
  assert.equal(
    presentation.attributes["data-mo-theme-preference"],
    "system"
  );
  assert.equal(
    presentation.attributes["data-mo-motion-preference"],
    "full"
  );
  assert.equal(
    presentation.attributes["data-mo-motion"],
    "reduced"
  );
  assert.equal(
    presentation.attributes["data-mo-contrast"],
    "high"
  );
  assert.equal(
    presentation.attributes["data-mo-transparency"],
    "reduced"
  );
  assert.equal(
    presentation.style["--mo-personalization-text-scale"],
    "1.25"
  );
  assert.equal(
    presentation.style["--mo-personalization-min-target"],
    "48px"
  );
});

test("control states expose product capabilities and accessibility constraints", () => {
  const states = createPersonalizationControlStates(
    context,
    accessibility,
    { motion: false, layout: false }
  );
  const byControl = Object.fromEntries(
    states.map((state) => [state.control, state])
  );

  assert.equal(byControl.theme.enabled, true);
  assert.equal(byControl.motion.enabled, false);
  assert.equal(byControl.layout.enabled, false);
  assert.equal(
    byControl.motion.constrainedByAccessibility,
    true
  );
  assert.equal(
    byControl.contrast.constrainedByAccessibility,
    true
  );
  assert.equal(
    byControl.transparency.constrainedByAccessibility,
    true
  );
  assert.equal(
    byControl.textScale.constrainedByAccessibility,
    false
  );
});

test("personalization reports whether accessibility strengthens requested presentation", () => {
  assert.equal(
    isPersonalizationConstrained(context, accessibility),
    true
  );

  const unconstrained = createAccessibilityPolicy(context);
  assert.equal(
    isPersonalizationConstrained(context, unconstrained),
    false
  );
});
