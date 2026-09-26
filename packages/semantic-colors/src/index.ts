export const semanticColorRoles = [
  "primary",
  "onPrimary",
  "primaryContainer",
  "onPrimaryContainer",
  "secondary",
  "onSecondary",
  "secondaryContainer",
  "onSecondaryContainer",
  "tertiary",
  "onTertiary",
  "tertiaryContainer",
  "onTertiaryContainer",
  "background",
  "onBackground",
  "surface",
  "onSurface",
  "surfaceSubtle",
  "surfaceContainer",
  "surfaceContainerHigh",
  "surfaceContainerHighest",
  "surfaceFloating",
  "surfaceInverse",
  "onSurfaceInverse",
  "outline",
  "outlineStrong",
  "success",
  "onSuccess",
  "successContainer",
  "onSuccessContainer",
  "warning",
  "onWarning",
  "warningContainer",
  "onWarningContainer",
  "error",
  "onError",
  "errorContainer",
  "onErrorContainer",
  "information",
  "onInformation",
  "informationContainer",
  "onInformationContainer",
  "focus",
  "selection",
  "selectionContainer",
  "hoverOverlay",
  "pressedOverlay",
  "disabled",
  "onDisabled",
  "link",
  "visitedLink"
] as const;

export type SemanticColorRole = (typeof semanticColorRoles)[number];
export type SemanticColorSchemeName = "light" | "dark";
export type SemanticStatus = "success" | "warning" | "error" | "information";

export type SemanticColorScheme = Record<SemanticColorRole, string>;

export interface SemanticColorPair {
  background: string;
  foreground: string;
  container: string;
  onContainer: string;
}

export const materialOneLightSemanticScheme: SemanticColorScheme = {
  primary: "#4F5FD7",
  onPrimary: "#FFFFFF",
  primaryContainer: "#E7E9FF",
  onPrimaryContainer: "#171D61",
  secondary: "#596078",
  onSecondary: "#FFFFFF",
  secondaryContainer: "#E0E4F8",
  onSecondaryContainer: "#171B2C",
  tertiary: "#A43F7A",
  onTertiary: "#FFFFFF",
  tertiaryContainer: "#FFD8EA",
  onTertiaryContainer: "#3D0027",
  background: "#FBFBFE",
  onBackground: "#1B1B20",
  surface: "#FFFFFF",
  onSurface: "#1B1B20",
  surfaceSubtle: "#F8F8FB",
  surfaceContainer: "#F4F4F8",
  surfaceContainerHigh: "#ECECF2",
  surfaceContainerHighest: "#E4E4EB",
  surfaceFloating: "#FFFFFF",
  surfaceInverse: "#303037",
  onSurfaceInverse: "#F4F4F8",
  outline: "#767680",
  outlineStrong: "#575761",
  success: "#176B43",
  onSuccess: "#FFFFFF",
  successContainer: "#C7F1D9",
  onSuccessContainer: "#0C3825",
  warning: "#8A5200",
  onWarning: "#FFFFFF",
  warningContainer: "#FFE1A8",
  onWarningContainer: "#4A2B00",
  error: "#B3261E",
  onError: "#FFFFFF",
  errorContainer: "#FFDAD6",
  onErrorContainer: "#410002",
  information: "#365E9D",
  onInformation: "#FFFFFF",
  informationContainer: "#D8E7FF",
  onInformationContainer: "#0B284F",
  focus: "#4F5FD7",
  selection: "#4F5FD7",
  selectionContainer: "#E7E9FF",
  hoverOverlay: "rgba(27, 27, 32, 0.08)",
  pressedOverlay: "rgba(27, 27, 32, 0.12)",
  disabled: "#E2E2E8",
  onDisabled: "#64646E",
  link: "#304F9B",
  visitedLink: "#6D4BC2"
};

export const materialOneDarkSemanticScheme: SemanticColorScheme = {
  primary: "#BEC2FF",
  onPrimary: "#202A72",
  primaryContainer: "#353F8F",
  onPrimaryContainer: "#E2E4FF",
  secondary: "#C1C6DF",
  onSecondary: "#2B3046",
  secondaryContainer: "#41465D",
  onSecondaryContainer: "#E0E4F8",
  tertiary: "#FFAFD3",
  onTertiary: "#5D153D",
  tertiaryContainer: "#7A2D55",
  onTertiaryContainer: "#FFD8EA",
  background: "#111116",
  onBackground: "#F0F0F6",
  surface: "#18181F",
  onSurface: "#F0F0F6",
  surfaceSubtle: "#1C1C23",
  surfaceContainer: "#202028",
  surfaceContainerHigh: "#292933",
  surfaceContainerHighest: "#32323D",
  surfaceFloating: "#25252D",
  surfaceInverse: "#F0F0F6",
  onSurfaceInverse: "#2A2A31",
  outline: "#92929E",
  outlineStrong: "#B8B8C3",
  success: "#8FD7AD",
  onSuccess: "#063823",
  successContainer: "#164D34",
  onSuccessContainer: "#C7F1D9",
  warning: "#F6C35B",
  onWarning: "#412D00",
  warningContainer: "#4B3515",
  onWarningContainer: "#FFE1A8",
  error: "#FFB4AB",
  onError: "#690005",
  errorContainer: "#681414",
  onErrorContainer: "#FFDAD6",
  information: "#AFCBFF",
  onInformation: "#12325D",
  informationContainer: "#1C355B",
  onInformationContainer: "#D8E7FF",
  focus: "#BEC2FF",
  selection: "#BEC2FF",
  selectionContainer: "#353F8F",
  hoverOverlay: "rgba(240, 240, 246, 0.08)",
  pressedOverlay: "rgba(240, 240, 246, 0.12)",
  disabled: "#2A2A31",
  onDisabled: "#9B9BA6",
  link: "#AFCBFF",
  visitedLink: "#D3BCFF"
};

export function semanticScheme(
  name: SemanticColorSchemeName
): SemanticColorScheme {
  return name === "dark"
    ? materialOneDarkSemanticScheme
    : materialOneLightSemanticScheme;
}

export function semanticColor(
  role: SemanticColorRole,
  scheme: SemanticColorSchemeName = "light"
): string {
  return semanticScheme(scheme)[role];
}

export function semanticStatusPair(
  status: SemanticStatus,
  scheme: SemanticColorSchemeName = "light"
): SemanticColorPair {
  const colors = semanticScheme(scheme);
  const role = status[0].toUpperCase() + status.slice(1);

  return {
    background: colors[status],
    foreground: colors[`on${role}` as SemanticColorRole],
    container: colors[`${status}Container` as SemanticColorRole],
    onContainer: colors[`on${role}Container` as SemanticColorRole]
  };
}

const cssVariableByRole = Object.fromEntries(
  semanticColorRoles.map((role) => [
    role,
    `--mo-sem-${role.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`
  ])
) as Record<SemanticColorRole, string>;

export function semanticCssVariable(role: SemanticColorRole): string {
  return cssVariableByRole[role];
}

export function semanticSchemeToCssVariables(
  scheme: SemanticColorScheme
): Record<string, string> {
  return Object.fromEntries(
    semanticColorRoles.map((role) => [
      semanticCssVariable(role),
      scheme[role]
    ])
  );
}
