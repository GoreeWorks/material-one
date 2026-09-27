import test from "node:test";
import assert from "node:assert/strict";
import {
  createMaterialOneContext
} from "../packages/core/src/index.ts";
import {
  createDeviceAdaptationPresentation,
  createDeviceAdaptationProfile,
  createDeviceAdaptationSignature,
  hasDeviceAdaptationChanged,
  normalizeSafeArea,
  resolveDeviceClass,
  resolveHoverCapability,
  resolvePointerCapability
} from "../packages/device-adaptation/src/index.ts";

const preferences = {
  theme: "system" as const,
  density: "comfortable" as const,
  motion: "full" as const,
  experienceMode: "professional" as const
};

test("device class preserves physical viewport semantics independently of layout preference", () => {
  assert.equal(resolveDeviceClass({ width: 390 }), "handheld");
  assert.equal(resolveDeviceClass({ width: 900 }), "tablet");
  assert.equal(resolveDeviceClass({ width: 1440 }), "desktop");
  assert.equal(resolveDeviceClass({ width: 2200 }), "large-screen");

  const context = createMaterialOneContext(
    { ...preferences, layoutPreference: "compact" },
    {
      width: 1440,
      height: 900,
      input: "mouse",
      orientation: "landscape"
    }
  );
  const profile = createDeviceAdaptationProfile(context);

  assert.equal(profile.deviceClass, "desktop");
  assert.equal(profile.layout, "compact");
});

test("pointer and hover capability inference preserves mixed input", () => {
  assert.equal(resolvePointerCapability("touch"), "coarse");
  assert.equal(resolvePointerCapability("mouse"), "fine");
  assert.equal(resolvePointerCapability("mixed"), "mixed");
  assert.equal(resolvePointerCapability("keyboard"), "none");

  assert.equal(resolveHoverCapability("mouse"), "available");
  assert.equal(resolveHoverCapability("touch"), "unavailable");
  assert.equal(resolveHoverCapability("keyboard"), "unknown");
});

test("device profile accepts explicit capabilities and segmented viewports", () => {
  const context = createMaterialOneContext(preferences, {
    width: 1366,
    height: 768,
    input: "mixed",
    orientation: "landscape",
    pixelRatio: 1.5
  });

  const profile = createDeviceAdaptationProfile(context, {
    pointer: "fine",
    hover: "available",
    keyboard: "available",
    touch: "available",
    displayMode: "standalone",
    safeArea: {
      top: 24,
      right: 8,
      bottom: 16,
      left: 8
    },
    viewportSegments: [
      { x: 0, y: 0, width: 675, height: 768 },
      { x: 691, y: 0, width: 675, height: 768 }
    ]
  });

  assert.equal(profile.deviceClass, "desktop");
  assert.equal(profile.pointer, "fine");
  assert.equal(profile.keyboard, "available");
  assert.equal(profile.touch, "available");
  assert.equal(profile.displayMode, "standalone");
  assert.equal(profile.viewport.pixelRatio, 1.5);
  assert.equal(profile.viewportSegments.length, 2);
  assert.equal(profile.segmentedViewport, true);
  assert.deepEqual(profile.safeArea, {
    top: 24,
    right: 8,
    bottom: 16,
    left: 8
  });
});

test("safe-area normalization rejects invalid and impossible insets", () => {
  assert.deepEqual(
    normalizeSafeArea(
      {
        top: Number.NaN,
        right: 9999,
        bottom: -10,
        left: 20
      },
      { width: 400, height: 800 }
    ),
    {
      top: 0,
      right: 200,
      bottom: 0,
      left: 20
    }
  );
});

test("device presentation emits portable adaptation attributes and variables", () => {
  const context = createMaterialOneContext(preferences, {
    width: 430,
    height: 932,
    input: "touch",
    orientation: "portrait",
    pixelRatio: 3
  });

  const presentation = createDeviceAdaptationPresentation(
    context,
    {
      safeArea: { top: 47, bottom: 34 },
      displayMode: "standalone"
    }
  );

  assert.equal(
    presentation.attributes["data-mo-device-class"],
    "handheld"
  );
  assert.equal(
    presentation.attributes["data-mo-pointer"],
    "coarse"
  );
  assert.equal(
    presentation.attributes["data-mo-hover"],
    "unavailable"
  );
  assert.equal(
    presentation.attributes["data-mo-display-mode"],
    "standalone"
  );
  assert.equal(
    presentation.style["--mo-safe-area-top"],
    "47px"
  );
  assert.equal(
    presentation.style["--mo-viewport-segment-count"],
    "1"
  );
  assert.equal(
    presentation.style["--mo-device-min-target"],
    "48px"
  );
});

test("device adaptation signatures report meaningful profile changes", () => {
  const first = createDeviceAdaptationProfile(
    createMaterialOneContext(preferences, {
      width: 1440,
      height: 900,
      input: "mouse",
      orientation: "landscape"
    })
  );
  const second = createDeviceAdaptationProfile(
    createMaterialOneContext(preferences, {
      width: 1440,
      height: 900,
      input: "mouse",
      orientation: "landscape"
    })
  );
  const third = createDeviceAdaptationProfile(
    createMaterialOneContext(preferences, {
      width: 1440,
      height: 900,
      input: "mixed",
      orientation: "landscape"
    })
  );

  assert.equal(
    createDeviceAdaptationSignature(first),
    createDeviceAdaptationSignature(second)
  );
  assert.equal(hasDeviceAdaptationChanged(first, second), false);
  assert.equal(hasDeviceAdaptationChanged(first, third), true);
});
