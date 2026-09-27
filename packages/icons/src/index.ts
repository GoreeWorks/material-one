export type MaterialOneIconStyle =
  | "outline"
  | "filled";

export type MaterialOneIconWeight =
  | "light"
  | "regular"
  | "bold";

export type MaterialOneIconPurpose =
  | "decorative"
  | "informative"
  | "action"
  | "navigation"
  | "status";

export type MaterialOneIconSize =
  | "compact"
  | "standard"
  | "large"
  | "display";

export type MaterialOneTextDirection =
  | "ltr"
  | "rtl";

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
  mirrorInRtl?: boolean;
}

export interface MaterialOneIconPresentationOptions {
  state?: string;
  purpose?: MaterialOneIconPurpose;
  size?: MaterialOneIconSize;
  direction?: MaterialOneTextDirection;
  label?: string;
}

export interface MaterialOneIconPresentation {
  icon: MaterialOneIconDefinition;
  state: string | null;
  paths: string[];
  purpose: MaterialOneIconPurpose;
  size: MaterialOneIconSize;
  sizePx: number;
  strokeWidth: number;
  mirrored: boolean;
  attributes: Record<string, string>;
  style: Record<string, string>;
}

export type MaterialOneIconRegistry =
  Readonly<Record<string, MaterialOneIconDefinition>>;

export const materialOneIconGrid = {
  canvas: 24,
  liveArea: 20,
  opticalPadding: 2,
  defaultStroke: 1.75,
  cornerLanguage: "soft-geometric"
} as const;

const iconSizePx: Record<
  MaterialOneIconSize,
  number
> = {
  compact: 18,
  standard: 24,
  large: 32,
  display: 48
};

const iconStrokeWidth: Record<
  MaterialOneIconWeight,
  number
> = {
  light: 1.5,
  regular: 1.75,
  bold: 2.25
};

function validatePaths(
  paths: string[],
  context: string
): void {
  if (paths.length === 0) {
    throw new Error(
      `${context} requires at least one path.`
    );
  }

  if (
    paths.some(
      (path) => !path.trim()
    )
  ) {
    throw new Error(
      `${context} requires non-empty path data.`
    );
  }
}

export function resolveIconSize(
  size: MaterialOneIconSize
): number {
  return iconSizePx[size];
}

export function resolveIconStrokeWidth(
  weight: MaterialOneIconWeight
): number {
  return iconStrokeWidth[weight];
}

export function defineMaterialOneIcon(
  icon: Omit<
    MaterialOneIconDefinition,
    "viewBox"
  >
): MaterialOneIconDefinition {
  const name = icon.name.trim();

  if (!name) {
    throw new Error(
      "Material One icons require a name."
    );
  }

  validatePaths(
    icon.paths,
    `Material One icon "${name}"`
  );

  const stateNames = new Set<string>();
  const states = (icon.states ?? []).map(
    (state) => {
      const stateName =
        state.name.trim();

      if (!stateName) {
        throw new Error(
          `Material One icon "${name}" requires named states.`
        );
      }

      if (stateNames.has(stateName)) {
        throw new Error(
          `Material One icon "${name}" has duplicate state "${stateName}".`
        );
      }

      stateNames.add(stateName);
      validatePaths(
        state.paths,
        `Material One icon "${name}" state "${stateName}"`
      );

      return {
        ...state,
        name: stateName
      };
    }
  );

  return {
    ...icon,
    name,
    viewBox: "0 0 24 24",
    states:
      states.length > 0
        ? states
        : undefined,
    label: icon.label?.trim() || undefined
  };
}

export function getIconState(
  icon: MaterialOneIconDefinition,
  stateName: string
): string[] {
  return (
    icon.states?.find(
      (state) =>
        state.name === stateName.trim()
    )?.paths ?? icon.paths
  );
}

export function createMaterialOneIconRegistry(
  icons: readonly MaterialOneIconDefinition[]
): MaterialOneIconRegistry {
  const registry: Record<
    string,
    MaterialOneIconDefinition
  > = {};

  for (const icon of icons) {
    if (registry[icon.name]) {
      throw new Error(
        `Duplicate Material One icon "${icon.name}".`
      );
    }

    registry[icon.name] = icon;
  }

  return Object.freeze(registry);
}

export function getMaterialOneIcon(
  registry: MaterialOneIconRegistry,
  name: string
): MaterialOneIconDefinition {
  const icon = registry[name];

  if (!icon) {
    throw new Error(
      `Unknown Material One icon "${name}".`
    );
  }

  return icon;
}

export function createIconPresentation(
  icon: MaterialOneIconDefinition,
  options: MaterialOneIconPresentationOptions = {}
): MaterialOneIconPresentation {
  const purpose =
    options.purpose ?? "decorative";
  const size =
    options.size ?? "standard";
  const direction =
    options.direction ?? "ltr";
  const state =
    options.state?.trim() || null;
  const paths =
    state === null
      ? icon.paths
      : getIconState(
          icon,
          state
        );
  const sizePx =
    resolveIconSize(size);
  const strokeWidth =
    resolveIconStrokeWidth(
      icon.weight
    );
  const mirrored =
    Boolean(icon.mirrorInRtl) &&
    direction === "rtl";
  const label =
    options.label?.trim() ||
    icon.label?.trim() ||
    "";

  if (
    purpose !== "decorative" &&
    !label
  ) {
    throw new Error(
      `Material One icon "${icon.name}" requires an accessible label for ${purpose} purpose.`
    );
  }

  const attributes: Record<
    string,
    string
  > = {
    "data-mo-icon": icon.name,
    "data-mo-icon-style":
      icon.style,
    "data-mo-icon-weight":
      icon.weight,
    "data-mo-icon-purpose":
      purpose,
    "data-mo-icon-size": size,
    "data-mo-icon-mirrored":
      String(mirrored)
  };

  if (state !== null) {
    attributes[
      "data-mo-icon-state"
    ] = state;
  }

  if (purpose === "decorative") {
    attributes["aria-hidden"] =
      "true";
  } else {
    attributes.role = "img";
    attributes["aria-label"] =
      label;
  }

  return {
    icon,
    state,
    paths,
    purpose,
    size,
    sizePx,
    strokeWidth,
    mirrored,
    attributes,
    style: {
      "--mo-icon-size":
        `${sizePx}px`,
      "--mo-icon-stroke-width":
        String(strokeWidth)
    }
  };
}
