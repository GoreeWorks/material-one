export type ExperienceMode =
  | "minimal"
  | "expressive"
  | "professional"
  | "creative"
  | "focused"
  | "accessibility";

export interface MaterialOnePreferences {
  theme: "light" | "dark" | "system";
  density: "compact" | "comfortable" | "spacious";
  motion: "full" | "reduced" | "none";
  experienceMode: ExperienceMode;
}

export interface DeviceContext {
  width: number;
  height: number;
  input: "touch" | "mouse" | "keyboard" | "mixed";
  orientation: "portrait" | "landscape";
}

export function resolveLayout(device: DeviceContext) {
  if (device.width < 600) return "compact";
  if (device.width < 1200) return "expanded";
  return "workspace";
}

export function createMaterialOneContext(
  preferences: MaterialOnePreferences,
  device: DeviceContext
) {
  return {
    preferences,
    device,
    layout: resolveLayout(device)
  };
}
