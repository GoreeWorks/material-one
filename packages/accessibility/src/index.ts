import type {
  MaterialOneContext,
  MotionPreference
} from "@material-one/core";

export type AccessibilityMode = "standard" | "enhanced";
export type AccessibilityContrast = "standard" | "high";
export type LiveRegionPriority = "polite" | "urgent";

export interface AccessibilityEnvironment {
  prefersReducedMotion?: boolean;
  prefersHighContrast?: boolean;
  prefersReducedTransparency?: boolean;
  forcedColors?: boolean;
}

export interface MaterialOneAccessibilityPolicy {
  mode: AccessibilityMode;
  contrast: AccessibilityContrast;
  textScale: number;
  reducedTransparency: boolean;
  motion: MotionPreference;
  minTargetSize: number;
  focusRingWidth: number;
  focusRingOffset: number;
  forcedColors: boolean;
  requireRedundantCues: true;
}

export interface AccessibilityPresentation {
  policy: MaterialOneAccessibilityPolicy;
  attributes: Record<string, string>;
  style: Record<string, string>;
}

export interface InteractionTargetAudit {
  actual: number;
  required: number;
  passes: boolean;
  shortfall: number;
}

export const accessibilityTextScaleRange = {
  minimum: 0.8,
  maximum: 2
} as const;

export function clampAccessibilityTextScale(value: number): number {
  if (!Number.isFinite(value)) return 1;

  const clamped = Math.min(
    accessibilityTextScaleRange.maximum,
    Math.max(accessibilityTextScaleRange.minimum, value)
  );

  return Math.round(clamped * 100) / 100;
}

export function resolveAccessibilityMotion(
  context: MaterialOneContext,
  environment: AccessibilityEnvironment = {}
): MotionPreference {
  if (context.preferences.motion === "none") return "none";

  if (
    context.preferences.motion === "reduced" ||
    environment.prefersReducedMotion
  ) {
    return "reduced";
  }

  return "full";
}

export function createAccessibilityPolicy(
  context: MaterialOneContext,
  environment: AccessibilityEnvironment = {}
): MaterialOneAccessibilityPolicy {
  const forcedColors = environment.forcedColors ?? false;
  const highContrast =
    context.preferences.accessibility.contrast === "high" ||
    environment.prefersHighContrast === true ||
    forcedColors;
  const reducedTransparency =
    context.preferences.accessibility.reducedTransparency ||
    environment.prefersReducedTransparency === true;
  const textScale = clampAccessibilityTextScale(
    context.preferences.accessibility.textScale
  );
  const motion = resolveAccessibilityMotion(context, environment);

  const mode: AccessibilityMode =
    context.preferences.experienceMode === "accessibility" ||
    highContrast ||
    reducedTransparency ||
    textScale !== 1 ||
    motion !== "full" ||
    forcedColors
      ? "enhanced"
      : "standard";

  return {
    mode,
    contrast: highContrast ? "high" : "standard",
    textScale,
    reducedTransparency,
    motion,
    minTargetSize: Math.max(
      context.interactionTarget,
      context.preferences.experienceMode === "accessibility" ? 48 : 0
    ),
    focusRingWidth: highContrast ? 3 : 2,
    focusRingOffset: highContrast ? 3 : 2,
    forcedColors,
    requireRedundantCues: true
  };
}

export function createAccessibilityPresentation(
  context: MaterialOneContext,
  environment: AccessibilityEnvironment = {}
): AccessibilityPresentation {
  const policy = createAccessibilityPolicy(context, environment);

  return {
    policy,
    attributes: {
      "data-mo-accessibility": policy.mode,
      "data-mo-contrast": policy.contrast,
      "data-mo-motion": policy.motion,
      "data-mo-transparency": policy.reducedTransparency
        ? "reduced"
        : "standard",
      "data-mo-forced-colors": policy.forcedColors
        ? "active"
        : "inactive"
    },
    style: {
      "--mo-a11y-text-scale": String(policy.textScale),
      "--mo-a11y-min-target": `${policy.minTargetSize}px`,
      "--mo-a11y-focus-ring-width": `${policy.focusRingWidth}px`,
      "--mo-a11y-focus-ring-offset": `${policy.focusRingOffset}px`
    }
  };
}

export function auditInteractionTarget(
  actual: number,
  policy: MaterialOneAccessibilityPolicy
): InteractionTargetAudit {
  const normalizedActual = Number.isFinite(actual)
    ? Math.max(0, actual)
    : 0;
  const shortfall = Math.max(
    0,
    policy.minTargetSize - normalizedActual
  );

  return {
    actual: normalizedActual,
    required: policy.minTargetSize,
    passes: shortfall === 0,
    shortfall
  };
}

export function createLiveRegionAttributes(
  priority: LiveRegionPriority = "polite"
): Record<string, string> {
  if (priority === "urgent") {
    return {
      role: "alert",
      "aria-live": "assertive",
      "aria-atomic": "true"
    };
  }

  return {
    role: "status",
    "aria-live": "polite",
    "aria-atomic": "true"
  };
}
