import {
  semanticCssVariable,
  semanticScheme,
  semanticSchemeToCssVariables,
  type SemanticColorRole,
  type SemanticColorScheme,
  type SemanticColorSchemeName
} from "@material-one/semantic-colors";
import {
  createValidatedSemanticScheme,
  validateSemanticTheme,
  type ThemeIntelligenceOptions,
  type ThemeValidationResult
} from "@material-one/theme-intelligence";

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

export interface LegacyMaterialOneTheme {
  name: string;
  scheme: SemanticColorSchemeName;
  colors: MaterialOneThemeColors;
  semantic?: Partial<
    Record<SemanticColorRole, string>
  >;
}

export interface SemanticMaterialOneTheme {
  name: string;
  scheme: SemanticColorSchemeName;
  semantic: SemanticColorScheme;
  colors?: MaterialOneThemeColors;
}

export type MaterialOneTheme =
  | LegacyMaterialOneTheme
  | SemanticMaterialOneTheme;

export interface AdaptiveMaterialOneThemeOptions
  extends ThemeIntelligenceOptions {
  name: string;
}

export interface ThemePresentation {
  theme: MaterialOneTheme;
  semantic: SemanticColorScheme;
  validation: ThemeValidationResult;
  attributes: Record<string, string>;
  style: Record<string, string>;
}

export type MaterialOneThemeRegistry =
  Readonly<Record<string, MaterialOneTheme>>;

const legacyCssVariableMap: Record<
  keyof MaterialOneThemeColors,
  string
> = {
  primary: "--mo-color-primary",
  onPrimary: "--mo-color-on-primary",
  primaryContainer:
    "--mo-color-primary-container",
  onPrimaryContainer:
    "--mo-color-on-primary-container",
  secondary: "--mo-color-secondary",
  onSecondary: "--mo-color-on-secondary",
  secondaryContainer:
    "--mo-color-secondary-container",
  onSecondaryContainer:
    "--mo-color-on-secondary-container",
  tertiary: "--mo-color-tertiary",
  onTertiary: "--mo-color-on-tertiary",
  tertiaryContainer:
    "--mo-color-tertiary-container",
  onTertiaryContainer:
    "--mo-color-on-tertiary-container",
  background:
    "--mo-surface-background",
  surface: "--mo-surface-base",
  surfaceContainer:
    "--mo-surface-container",
  surfaceContainerHigh:
    "--mo-surface-container-high",
  floating:
    "--mo-surface-floating",
  text: "--mo-text-primary",
  textMuted: "--mo-text-muted",
  border: "--mo-border",
  success: "--mo-status-success",
  warning: "--mo-status-warning",
  error: "--mo-status-error",
  information:
    "--mo-status-information"
};

const legacySemanticRoleMap: Record<
  keyof MaterialOneThemeColors,
  SemanticColorRole
> = {
  primary: "primary",
  onPrimary: "onPrimary",
  primaryContainer:
    "primaryContainer",
  onPrimaryContainer:
    "onPrimaryContainer",
  secondary: "secondary",
  onSecondary: "onSecondary",
  secondaryContainer:
    "secondaryContainer",
  onSecondaryContainer:
    "onSecondaryContainer",
  tertiary: "tertiary",
  onTertiary: "onTertiary",
  tertiaryContainer:
    "tertiaryContainer",
  onTertiaryContainer:
    "onTertiaryContainer",
  background: "background",
  surface: "surface",
  surfaceContainer:
    "surfaceContainer",
  surfaceContainerHigh:
    "surfaceContainerHigh",
  floating: "surfaceFloating",
  text: "onSurface",
  textMuted: "onSurfaceMuted",
  border: "outline",
  success: "success",
  warning: "warning",
  error: "error",
  information: "information"
};

function themeColors(
  theme: MaterialOneTheme
): MaterialOneThemeColors | undefined {
  return "colors" in theme
    ? theme.colors
    : undefined;
}

export function resolveThemeSemanticScheme(
  theme: MaterialOneTheme
): SemanticColorScheme {
  const resolved: SemanticColorScheme = {
    ...semanticScheme(theme.scheme)
  };

  const colors = themeColors(theme);
  if (colors) {
    for (const [
      legacyRole,
      value
    ] of Object.entries(colors)) {
      resolved[
        legacySemanticRoleMap[
          legacyRole as keyof MaterialOneThemeColors
        ]
      ] = value;
    }
  }

  for (const [
    role,
    value
  ] of Object.entries(
    theme.semantic ?? {}
  )) {
    if (typeof value === "string") {
      resolved[
        role as SemanticColorRole
      ] = value;
    }
  }

  return resolved;
}

export function semanticSchemeToLegacyVariables(
  scheme: SemanticColorScheme
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(
      legacySemanticRoleMap
    ).map(
      ([
        legacyRole,
        semanticRole
      ]) => [
        legacyCssVariableMap[
          legacyRole as keyof MaterialOneThemeColors
        ],
        scheme[semanticRole]
      ]
    )
  );
}

export function themeToCssVariables(
  theme: MaterialOneTheme
): Record<string, string> {
  const semantic =
    resolveThemeSemanticScheme(theme);

  return {
    ...semanticSchemeToLegacyVariables(
      semantic
    ),
    ...semanticSchemeToCssVariables(
      semantic
    )
  };
}

export function createSemanticTheme(
  name: string,
  schemeName: SemanticColorSchemeName,
  semantic: SemanticColorScheme =
    semanticScheme(schemeName)
): SemanticMaterialOneTheme {
  const normalizedName = name.trim();

  if (!normalizedName) {
    throw new Error(
      "Material One themes require a name."
    );
  }

  return {
    name: normalizedName,
    scheme: schemeName,
    semantic: {
      ...semantic
    }
  };
}

export function createAdaptiveTheme(
  options: AdaptiveMaterialOneThemeOptions
): SemanticMaterialOneTheme {
  const {
    name,
    ...intelligence
  } = options;
  const schemeName =
    intelligence.scheme ?? "light";

  return createSemanticTheme(
    name,
    schemeName,
    createValidatedSemanticScheme({
      ...intelligence,
      scheme: schemeName
    })
  );
}

export function validateMaterialOneTheme(
  theme: MaterialOneTheme
): ThemeValidationResult {
  return validateSemanticTheme(
    resolveThemeSemanticScheme(theme)
  );
}

export function createMaterialOneThemeRegistry(
  themes: readonly MaterialOneTheme[]
): MaterialOneThemeRegistry {
  const registry: Record<
    string,
    MaterialOneTheme
  > = {};

  for (const theme of themes) {
    const name = theme.name.trim();

    if (!name) {
      throw new Error(
        "Material One themes require a name."
      );
    }

    if (registry[name]) {
      throw new Error(
        `Duplicate Material One theme "${name}".`
      );
    }

    registry[name] = theme;
  }

  return Object.freeze(registry);
}

export function getMaterialOneTheme(
  registry: MaterialOneThemeRegistry,
  name: string
): MaterialOneTheme {
  const theme = registry[name];

  if (!theme) {
    throw new Error(
      `Unknown Material One theme "${name}".`
    );
  }

  return theme;
}

export function createThemePresentation(
  theme: MaterialOneTheme
): ThemePresentation {
  const semantic =
    resolveThemeSemanticScheme(theme);
  const validation =
    validateSemanticTheme(semantic);

  if (!validation.valid) {
    throw new Error(
      `Material One theme "${theme.name}" failed semantic contrast validation.`
    );
  }

  return {
    theme,
    semantic,
    validation,
    attributes: {
      "data-mo-theme":
        theme.name,
      "data-mo-theme-scheme":
        theme.scheme
    },
    style:
      themeToCssVariables(theme)
  };
}

function escapeThemeSelectorValue(
  value: string
): string {
  return value.replace(
    /[\\"\n\r]/g,
    (character) =>
      `\\${character}`
  );
}

export function serializeTheme(
  theme: MaterialOneTheme,
  selector =
    `[data-mo-theme="${escapeThemeSelectorValue(
      theme.name
    )}"]`
): string {
  const variables =
    themeToCssVariables(theme);
  const body =
    Object.entries(variables)
      .map(
        ([name, value]) =>
          `  ${name}: ${value};`
      )
      .join("\n");

  return `${selector} {\n${body}\n}`;
}

export {
  semanticCssVariable
};
