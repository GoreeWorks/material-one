import {
  materialOneDarkSemanticScheme,
  materialOneLightSemanticScheme,
  type SemanticColorScheme,
  type SemanticColorSchemeName
} from "@material-one/semantic-colors";

export type ThemeContrast = "standard" | "high";

export interface ThemeIntelligenceOptions {
  seed: string;
  secondarySeed?: string;
  tertiarySeed?: string;
  scheme?: SemanticColorSchemeName;
  contrast?: ThemeContrast;
}

export interface ThemeValidationIssue {
  backgroundRole: keyof SemanticColorScheme;
  foregroundRole: keyof SemanticColorScheme;
  ratio: number;
  required: number;
}

export interface ThemeValidationResult {
  valid: boolean;
  minimumContrast: number;
  issues: ThemeValidationIssue[];
}

function normalizedHex(hex: string): string {
  const value = hex.trim().replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(value)) {
    throw new Error(`Expected a six-digit hex color, received "${hex}".`);
  }
  return `#${value.toUpperCase()}`;
}

function channels(hex: string): [number, number, number] {
  const value = normalizedHex(hex).slice(1);
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16)
  ];
}

function channelToLinear(value: number): number {
  const channel = value / 255;
  return channel <= 0.04045
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4;
}

function toHex(value: number): string {
  return Math.round(Math.max(0, Math.min(255, value)))
    .toString(16)
    .padStart(2, "0")
    .toUpperCase();
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = channels(hex).map(channelToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(background: string, foreground: string): number {
  const a = relativeLuminance(background);
  const b = relativeLuminance(foreground);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export function mixHex(
  foreground: string,
  background: string,
  backgroundWeight: number
): string {
  const left = channels(foreground);
  const right = channels(background);
  const weight = Math.max(0, Math.min(1, backgroundWeight));

  return `#${left
    .map((value, index) => toHex(value * (1 - weight) + right[index] * weight))
    .join("")}`;
}

export function readableForeground(
  background: string,
  candidates: readonly string[] = ["#000000", "#FFFFFF"]
): string {
  if (candidates.length === 0) {
    throw new Error("At least one foreground candidate is required.");
  }

  return candidates
    .map((candidate) => ({
      candidate: normalizedHex(candidate),
      ratio: contrastRatio(background, candidate)
    }))
    .sort((a, b) => b.ratio - a.ratio)[0].candidate;
}

function baseScheme(name: SemanticColorSchemeName): SemanticColorScheme {
  return {
    ...(name === "dark"
      ? materialOneDarkSemanticScheme
      : materialOneLightSemanticScheme)
  };
}

function accentForScheme(
  seed: string,
  scheme: SemanticColorSchemeName
): string {
  const normalized = normalizedHex(seed);
  return scheme === "dark"
    ? mixHex(normalized, "#FFFFFF", 0.42)
    : mixHex(normalized, "#000000", 0.08);
}

function accentContainer(
  accent: string,
  scheme: SemanticColorSchemeName
): string {
  return scheme === "dark"
    ? mixHex(accent, "#111116", 0.66)
    : mixHex(accent, "#FFFFFF", 0.84);
}

function applyAccentFamily(
  scheme: SemanticColorScheme,
  family: "primary" | "secondary" | "tertiary",
  seed: string,
  schemeName: SemanticColorSchemeName
): void {
  const accent = accentForScheme(seed, schemeName);
  const container = accentContainer(accent, schemeName);
  const onAccent = readableForeground(accent);
  const onContainer = readableForeground(container, [
    scheme.onSurface,
    scheme.onSurfaceInverse,
    "#000000",
    "#FFFFFF"
  ]);

  if (family === "primary") {
    scheme.primary = accent;
    scheme.onPrimary = onAccent;
    scheme.primaryContainer = container;
    scheme.onPrimaryContainer = onContainer;
    scheme.focus = accent;
    scheme.selection = accent;
    scheme.selectionContainer = container;
    scheme.link = accent;
    return;
  }

  if (family === "secondary") {
    scheme.secondary = accent;
    scheme.onSecondary = onAccent;
    scheme.secondaryContainer = container;
    scheme.onSecondaryContainer = onContainer;
    return;
  }

  scheme.tertiary = accent;
  scheme.onTertiary = onAccent;
  scheme.tertiaryContainer = container;
  scheme.onTertiaryContainer = onContainer;
  scheme.visitedLink = accent;
}

export function createAdaptiveSemanticScheme(
  options: ThemeIntelligenceOptions
): SemanticColorScheme {
  const schemeName = options.scheme ?? "light";
  const contrast = options.contrast ?? "standard";
  const scheme = baseScheme(schemeName);

  applyAccentFamily(scheme, "primary", options.seed, schemeName);
  applyAccentFamily(
    scheme,
    "secondary",
    options.secondarySeed ?? mixHex(options.seed, scheme.secondary, 0.46),
    schemeName
  );
  applyAccentFamily(
    scheme,
    "tertiary",
    options.tertiarySeed ?? mixHex(options.seed, scheme.tertiary, 0.54),
    schemeName
  );

  if (contrast === "high") {
    scheme.onSurfaceMuted = scheme.onSurface;
    scheme.outline = scheme.outlineStrong;
    scheme.hoverOverlay =
      schemeName === "dark"
        ? "rgba(255, 255, 255, 0.14)"
        : "rgba(0, 0, 0, 0.12)";
    scheme.pressedOverlay =
      schemeName === "dark"
        ? "rgba(255, 255, 255, 0.20)"
        : "rgba(0, 0, 0, 0.18)";
  }

  return scheme;
}

const requiredContrastPairs: ReadonlyArray<
  readonly [keyof SemanticColorScheme, keyof SemanticColorScheme]
> = [
  ["primary", "onPrimary"],
  ["primaryContainer", "onPrimaryContainer"],
  ["secondary", "onSecondary"],
  ["secondaryContainer", "onSecondaryContainer"],
  ["tertiary", "onTertiary"],
  ["tertiaryContainer", "onTertiaryContainer"],
  ["background", "onBackground"],
  ["surface", "onSurface"],
  ["surface", "onSurfaceMuted"],
  ["surfaceInverse", "onSurfaceInverse"],
  ["success", "onSuccess"],
  ["successContainer", "onSuccessContainer"],
  ["warning", "onWarning"],
  ["warningContainer", "onWarningContainer"],
  ["error", "onError"],
  ["errorContainer", "onErrorContainer"],
  ["information", "onInformation"],
  ["informationContainer", "onInformationContainer"],
  ["disabled", "onDisabled"],
  ["surface", "link"]
];

export function validateSemanticTheme(
  scheme: SemanticColorScheme,
  required = 4.5
): ThemeValidationResult {
  const issues: ThemeValidationIssue[] = [];
  let minimumContrast = Number.POSITIVE_INFINITY;

  for (const [backgroundRole, foregroundRole] of requiredContrastPairs) {
    const background = scheme[backgroundRole];
    const foreground = scheme[foregroundRole];

    if (!background.startsWith("#") || !foreground.startsWith("#")) {
      continue;
    }

    const ratio = contrastRatio(background, foreground);
    minimumContrast = Math.min(minimumContrast, ratio);

    if (ratio < required) {
      issues.push({
        backgroundRole,
        foregroundRole,
        ratio: Number(ratio.toFixed(2)),
        required
      });
    }
  }

  return {
    valid: issues.length === 0,
    minimumContrast: Number(minimumContrast.toFixed(2)),
    issues
  };
}

export function createValidatedSemanticScheme(
  options: ThemeIntelligenceOptions
): SemanticColorScheme {
  const scheme = createAdaptiveSemanticScheme(options);
  const result = validateSemanticTheme(scheme);

  if (!result.valid) {
    const summary = result.issues
      .map(
        ({ backgroundRole, foregroundRole, ratio }) =>
          `${String(backgroundRole)}/${String(foregroundRole)} ${ratio}:1`
      )
      .join(", ");

    throw new Error(`Generated Material One theme failed contrast: ${summary}`);
  }

  return scheme;
}
