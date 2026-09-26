import {
  semanticCssVariable,
  type SemanticColorRole
} from "@material-one/semantic-colors";

export interface MaterialOneThemeColors {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  background: string;
  surface: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  floating: string;
  text: string;
  textMuted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  information: string;
}

export interface MaterialOneTheme {
  name: string;
  scheme: "light" | "dark";
  colors: MaterialOneThemeColors;
  semantic?: Partial<Record<SemanticColorRole, string>>;
}

const cssVariableMap: Record<keyof MaterialOneThemeColors, string> = {
  primary: "--mo-color-primary",
  onPrimary: "--mo-color-on-primary",
  primaryContainer: "--mo-color-primary-container",
  onPrimaryContainer: "--mo-color-on-primary-container",
  secondary: "--mo-color-secondary",
  onSecondary: "--mo-color-on-secondary",
  secondaryContainer: "--mo-color-secondary-container",
  onSecondaryContainer: "--mo-color-on-secondary-container",
  tertiary: "--mo-color-tertiary",
  onTertiary: "--mo-color-on-tertiary",
  tertiaryContainer: "--mo-color-tertiary-container",
  onTertiaryContainer: "--mo-color-on-tertiary-container",
  background: "--mo-surface-background",
  surface: "--mo-surface-base",
  surfaceContainer: "--mo-surface-container",
  surfaceContainerHigh: "--mo-surface-container-high",
  floating: "--mo-surface-floating",
  text: "--mo-text-primary",
  textMuted: "--mo-text-muted",
  border: "--mo-border",
  success: "--mo-status-success",
  warning: "--mo-status-warning",
  error: "--mo-status-error",
  information: "--mo-status-information"
};

export function themeToCssVariables(
  theme: MaterialOneTheme
): Record<string, string> {
  const legacyVariables = Object.fromEntries(
    Object.entries(theme.colors).map(([key, value]) => [
      cssVariableMap[key as keyof MaterialOneThemeColors],
      value
    ])
  );

  const semanticVariables = Object.fromEntries(
    Object.entries(theme.semantic ?? {}).map(([role, value]) => [
      semanticCssVariable(role as SemanticColorRole),
      value
    ])
  );

  return {
    ...legacyVariables,
    ...semanticVariables
  };
}

export function serializeTheme(
  theme: MaterialOneTheme,
  selector = `[data-mo-theme="${theme.name}"]`
): string {
  const variables = themeToCssVariables(theme);
  const body = Object.entries(variables)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n");

  return `${selector} {\n${body}\n}`;
}
