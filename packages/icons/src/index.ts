export type MaterialOneIconStyle = "outline" | "filled";
export type MaterialOneIconWeight = "light" | "regular" | "bold";

export interface MaterialOneIconState {
  name: string;
  paths: string[];
}

export interface MaterialOneIconDefinition {
  name: string;
  viewBox: "0 0 24 24";
  style: MaterialOneIconStyle;
  weight: MaterialOneIconWeight;
  paths: string[];
  states?: MaterialOneIconState[];
  label?: string;
}

export const materialOneIconGrid = {
  canvas: 24,
  liveArea: 20,
  opticalPadding: 2,
  defaultStroke: 1.75,
  cornerLanguage: "soft-geometric"
} as const;

export function defineMaterialOneIcon(
  icon: Omit<MaterialOneIconDefinition, "viewBox">
): MaterialOneIconDefinition {
  if (!icon.name.trim()) {
    throw new Error("Material One icons require a name.");
  }

  if (icon.paths.length === 0) {
    throw new Error(`Material One icon "${icon.name}" requires at least one path.`);
  }

  return {
    ...icon,
    viewBox: "0 0 24 24"
  };
}

export function getIconState(
  icon: MaterialOneIconDefinition,
  stateName: string
): string[] {
  return icon.states?.find((state) => state.name === stateName)?.paths ?? icon.paths;
}
