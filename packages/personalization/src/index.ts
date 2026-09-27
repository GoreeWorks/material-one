import type {
  DensityPreference,
  ExperienceMode,
  LayoutMode,
  MaterialOneContext,
  MotionPreference,
  ThemePreference
} from "@material-one/core";
import type {
  AccessibilityContrast,
  AccessibilityMode,
  MaterialOneAccessibilityPolicy
} from "@material-one/accessibility";

export const personalizationControls = [
  "theme",
  "density",
  "motion",
  "experienceMode",
  "layout",
  "textScale",
  "contrast",
  "transparency"
] as const;

export type PersonalizationControl =
  (typeof personalizationControls)[number];

export type PersonalizationCapabilities = Partial<
  Record<PersonalizationControl, boolean>
>;

export interface MaterialOnePersonalizationProfile {
  themePreference: ThemePreference;
  density: DensityPreference;
  experienceMode: ExperienceMode;
  layout: LayoutMode;
  layoutPreference: "automatic" | LayoutMode;
  requestedMotion: MotionPreference;
  motion: MotionPreference;
  requestedTextScale: number;
  textScale: number;
  requestedContrast: AccessibilityContrast;
  contrast: AccessibilityContrast;
  requestedReducedTransparency: boolean;
  reducedTransparency: boolean;
  interactionTarget: number;
  accessibilityMode: AccessibilityMode;
  forcedColors: boolean;
}

export interface PersonalizationPresentation {
  profile: MaterialOnePersonalizationProfile;
  attributes: Record<string, string>;
  style: Record<string, string>;
}

export interface PersonalizationControlState {
  control: PersonalizationControl;
  enabled: boolean;
  constrainedByAccessibility: boolean;
}

function capabilityEnabled(
  capabilities: PersonalizationCapabilities,
  control: PersonalizationControl
): boolean {
  return capabilities[control] ?? true;
}

export function createPersonalizationProfile(
  context: MaterialOneContext,
  accessibility: MaterialOneAccessibilityPolicy
): MaterialOnePersonalizationProfile {
  return {
    themePreference: context.preferences.theme,
    density: context.preferences.density,
    experienceMode: context.preferences.experienceMode,
    layout: context.layout,
    layoutPreference: context.preferences.layoutPreference,
    requestedMotion: context.preferences.motion,
    motion: accessibility.motion,
    requestedTextScale:
      context.preferences.accessibility.textScale,
    textScale: accessibility.textScale,
    requestedContrast:
      context.preferences.accessibility.contrast,
    contrast: accessibility.contrast,
    requestedReducedTransparency:
      context.preferences.accessibility.reducedTransparency,
    reducedTransparency: accessibility.reducedTransparency,
    interactionTarget: Math.max(
      context.interactionTarget,
      accessibility.minTargetSize
    ),
    accessibilityMode: accessibility.mode,
    forcedColors: accessibility.forcedColors
  };
}

export function createPersonalizationPresentation(
  context: MaterialOneContext,
  accessibility: MaterialOneAccessibilityPolicy
): PersonalizationPresentation {
  const profile = createPersonalizationProfile(
    context,
    accessibility
  );

  return {
    profile,
    attributes: {
      "data-mo-experience": profile.experienceMode,
      "data-mo-theme-preference": profile.themePreference,
      "data-mo-density": profile.density,
      "data-mo-layout": profile.layout,
      "data-mo-layout-preference": profile.layoutPreference,
      "data-mo-motion-preference": profile.requestedMotion,
      "data-mo-motion": profile.motion,
      "data-mo-contrast": profile.contrast,
      "data-mo-transparency": profile.reducedTransparency
        ? "reduced"
        : "standard",
      "data-mo-accessibility": profile.accessibilityMode,
      "data-mo-forced-colors": profile.forcedColors
        ? "active"
        : "inactive"
    },
    style: {
      "--mo-personalization-text-scale":
        String(profile.textScale),
      "--mo-personalization-min-target":
        `${profile.interactionTarget}px`
    }
  };
}

export function createPersonalizationControlStates(
  context: MaterialOneContext,
  accessibility: MaterialOneAccessibilityPolicy,
  capabilities: PersonalizationCapabilities = {}
): PersonalizationControlState[] {
  const profile = createPersonalizationProfile(
    context,
    accessibility
  );

  const constrained = new Set<PersonalizationControl>();

  if (profile.motion !== profile.requestedMotion) {
    constrained.add("motion");
  }
  if (profile.textScale !== profile.requestedTextScale) {
    constrained.add("textScale");
  }
  if (profile.contrast !== profile.requestedContrast) {
    constrained.add("contrast");
  }
  if (
    profile.reducedTransparency !==
    profile.requestedReducedTransparency
  ) {
    constrained.add("transparency");
  }

  return personalizationControls.map((control) => ({
    control,
    enabled: capabilityEnabled(capabilities, control),
    constrainedByAccessibility: constrained.has(control)
  }));
}

export function isPersonalizationConstrained(
  context: MaterialOneContext,
  accessibility: MaterialOneAccessibilityPolicy
): boolean {
  return createPersonalizationControlStates(
    context,
    accessibility
  ).some((state) => state.constrainedByAccessibility);
}
