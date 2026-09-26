export type ExperienceMode =
  | "minimal"
  | "expressive"
  | "professional"
  | "creative"
  | "focused"
  | "accessibility";

export type LayoutMode = "compact" | "expanded" | "workspace";
export type ThemePreference = "light" | "dark" | "system";
export type DensityPreference = "compact" | "comfortable" | "spacious";
export type MotionPreference = "full" | "reduced" | "none";

export interface AccessibilityPreferences {
  contrast: "standard" | "high";
  textScale: number;
  reducedTransparency: boolean;
}

export interface MaterialOnePreferences {
  theme: ThemePreference;
  density: DensityPreference;
  motion: MotionPreference;
  experienceMode: ExperienceMode;
  layoutPreference?: "automatic" | LayoutMode;
  accessibility?: Partial<AccessibilityPreferences>;
}

export interface DeviceContext {
  width: number;
  height: number;
  input: "touch" | "mouse" | "keyboard" | "mixed";
  orientation: "portrait" | "landscape";
  pixelRatio?: number;
}

export interface MaterialOneContext {
  preferences: MaterialOnePreferences & {
    layoutPreference: "automatic" | LayoutMode;
    accessibility: AccessibilityPreferences;
  };
  device: DeviceContext;
  layout: LayoutMode;
  interactionTarget: number;
}

const defaultAccessibility: AccessibilityPreferences = {
  contrast: "standard",
  textScale: 1,
  reducedTransparency: false
};

export function normalizePreferences(
  preferences: MaterialOnePreferences
): MaterialOneContext["preferences"] {
  return {
    ...preferences,
    layoutPreference: preferences.layoutPreference ?? "automatic",
    accessibility: {
      ...defaultAccessibility,
      ...preferences.accessibility
    }
  };
}

export function resolveLayout(
  device: DeviceContext,
  preferences?: MaterialOnePreferences
): LayoutMode {
  const requested = preferences?.layoutPreference;
  if (requested && requested !== "automatic") return requested;

  if (device.width < 600) return "compact";
  if (device.width < 1200) return "expanded";
  return "workspace";
}

export function resolveInteractionTarget(
  preferences: MaterialOnePreferences,
  device: DeviceContext
): number {
  if (preferences.experienceMode === "accessibility") return 48;
  if (device.input === "touch" || device.input === "mixed") return 48;
  if (preferences.density === "compact") return 36;
  if (preferences.density === "spacious") return 48;
  return 44;
}

export function createMaterialOneContext(
  preferences: MaterialOnePreferences,
  device: DeviceContext
): MaterialOneContext {
  const normalizedPreferences = normalizePreferences(preferences);

  return {
    preferences: normalizedPreferences,
    device,
    layout: resolveLayout(device, normalizedPreferences),
    interactionTarget: resolveInteractionTarget(normalizedPreferences, device)
  };
}
