import test from "node:test";
import assert from "node:assert/strict";
import { createMaterialOneContext } from "../packages/core/src/index.ts";
import {
  createAccessibilityPolicy
} from "../packages/accessibility/src/index.ts";
import {
  componentStates,
  createAdaptiveComponentContext,
  createAdaptiveComponentPresentation,
  createComponentContract,
  createComponentPresentation,
  resolveComponentDensity
} from "../packages/components/src/index.ts";

const context = createMaterialOneContext(
  {
    theme: "system",
    density: "spacious",
    motion: "reduced",
    experienceMode: "professional",
    accessibility: {
      contrast: "high",
      textScale: 1.25,
      reducedTransparency: false
    }
  },
  {
    width: 390,
    height: 844,
    input: "touch",
    orientation: "portrait"
  }
);

test("components expose the canonical Material One state contract", () => {
  assert.deepEqual(componentStates, [
    "default",
    "hovered",
    "focused",
    "pressed",
    "selected",
    "disabled",
    "loading",
    "success",
    "warning",
    "error"
  ]);
});

test("adaptive component contracts inherit live Material One context", () => {
  const contract = createComponentContract("button", context);

  assert.equal(contract.state, "default");
  assert.equal(contract.context.layout, "compact");
  assert.equal(contract.context.density, "comfortable");
  assert.equal(contract.context.input, "touch");
  assert.equal(contract.context.motion, "reduced");
  assert.equal(contract.context.highContrast, true);
  assert.equal(contract.context.textScale, 1.25);
  assert.equal(contract.context.interactionTarget, 48);
  assert.equal(contract.semanticColorRole, "surfaceContainer");
  assert.equal(contract.typographyRole, "body");
  assert.equal(contract.motionIntent, "feedback");
  assert.equal(contract.shapeRole, "control");
  assert.equal(contract.shapeToken, "medium");
});

test("component contracts use typed semantic subsystem roles", () => {
  const contract = createComponentContract("field", context, {
    state: "error",
    semanticColorRole: "errorContainer",
    typographyRole: "label",
    motionIntent: "instant"
  });

  assert.equal(contract.state, "error");
  assert.equal(contract.semanticColorRole, "errorContainer");
  assert.equal(contract.typographyRole, "label");
  assert.equal(contract.motionIntent, "instant");
  assert.equal(contract.shapeRole, "field");
  assert.equal(contract.shapeToken, "medium");
  assert.equal(contract.context.layout, "compact");
});

test("component presentation emits portable attributes and CSS variables", () => {
  const presentation = createComponentPresentation(
    "field",
    context,
    {
      state: "error",
      semanticColorRole: "errorContainer",
      typographyRole: "label",
      motionIntent: "feedback"
    }
  );

  assert.equal(
    presentation.attributes["data-mo-component"],
    "field"
  );
  assert.equal(
    presentation.attributes["data-mo-state"],
    "error"
  );
  assert.equal(
    presentation.attributes["data-mo-density"],
    "comfortable"
  );
  assert.equal(
    presentation.attributes["data-mo-layout"],
    "compact"
  );
  assert.equal(
    presentation.attributes["data-mo-contrast"],
    "high"
  );
  assert.equal(
    presentation.attributes["data-mo-semantic-role"],
    "errorContainer"
  );
  assert.equal(
    presentation.style["--mo-component-semantic-color"],
    "var(--mo-sem-error-container)"
  );
  assert.equal(
    presentation.style["--mo-component-type-size"],
    "var(--mo-type-label)"
  );
  assert.equal(
    presentation.style["--mo-motion-duration"],
    "100ms"
  );
  assert.equal(
    presentation.style["--mo-motion-translate"],
    "0px"
  );
  assert.equal(
    presentation.attributes["data-mo-shape-role"],
    "field"
  );
  assert.equal(
    presentation.attributes["data-mo-shape-token"],
    "medium"
  );
  assert.equal(
    presentation.style["--mo-component-radius"],
    "var(--mo-shape-medium)"
  );
});

test("spacious density collapses only when compact layout requires it", () => {
  assert.equal(
    resolveComponentDensity("spacious", "compact"),
    "comfortable"
  );
  assert.equal(
    resolveComponentDensity("spacious", "workspace"),
    "spacious"
  );
});


test("effective component context applies Accessibility safeguards over requested preferences", () => {
  const requested = createMaterialOneContext(
    {
      theme: "system",
      density: "compact",
      motion: "full",
      experienceMode: "professional",
      accessibility: {
        contrast: "standard",
        textScale: 0.4,
        reducedTransparency: false
      }
    },
    {
      width: 900,
      height: 900,
      input: "mouse",
      orientation: "landscape"
    }
  );
  const accessibility =
    createAccessibilityPolicy(
      requested,
      {
        prefersReducedMotion: true,
        prefersHighContrast: true,
        prefersReducedTransparency: true,
        forcedColors: true
      }
    );
  const effective =
    createAdaptiveComponentContext(
      requested,
      accessibility
    );

  assert.equal(
    effective.requestedMotion,
    "full"
  );
  assert.equal(
    effective.motion,
    "reduced"
  );
  assert.equal(
    effective.requestedContrast,
    "standard"
  );
  assert.equal(
    effective.contrast,
    "high"
  );
  assert.equal(
    effective.requestedTextScale,
    0.4
  );
  assert.equal(
    effective.textScale,
    0.8
  );
  assert.equal(
    effective.reducedTransparency,
    true
  );
  assert.equal(
    effective.forcedColors,
    true
  );
  assert.equal(
    effective.constrainedByAccessibility,
    true
  );
});

test("adaptive component presentation uses effective typography, motion, contrast, and target policy", () => {
  const requested = createMaterialOneContext(
    {
      theme: "system",
      density: "compact",
      motion: "full",
      experienceMode: "professional",
      accessibility: {
        contrast: "standard",
        textScale: 0.4,
        reducedTransparency: false
      }
    },
    {
      width: 900,
      height: 900,
      input: "mouse",
      orientation: "landscape"
    }
  );
  const accessibility =
    createAccessibilityPolicy(
      requested,
      {
        prefersReducedMotion: true,
        prefersHighContrast: true,
        forcedColors: true
      }
    );
  const presentation =
    createAdaptiveComponentPresentation(
      "button",
      requested,
      accessibility,
      {
        typographyRole: "label",
        motionIntent: "navigation"
      }
    );

  assert.equal(
    presentation.attributes[
      "data-mo-motion"
    ],
    "reduced"
  );
  assert.equal(
    presentation.attributes[
      "data-mo-motion-requested"
    ],
    "full"
  );
  assert.equal(
    presentation.attributes[
      "data-mo-contrast"
    ],
    "high"
  );
  assert.equal(
    presentation.attributes[
      "data-mo-text-scale"
    ],
    "0.8"
  );
  assert.equal(
    presentation.attributes[
      "data-mo-forced-colors"
    ],
    "active"
  );
  assert.equal(
    presentation.attributes[
      "data-mo-accessibility-constrained"
    ],
    "true"
  );
  assert.equal(
    presentation.style[
      "--mo-motion-duration"
    ],
    "0ms"
  );
  assert.equal(
    presentation.style[
      "--mo-component-type-size"
    ],
    "var(--mo-type-effective-size)"
  );
  assert.equal(
    presentation.style[
      "--mo-type-effective-size"
    ],
    "0.7rem"
  );
  assert.equal(
    presentation.style[
      "--mo-component-min-target"
    ],
    "36px"
  );
});
