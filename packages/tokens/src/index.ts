export const materialOneTokenGroups = [
  "color",
  "typography",
  "spacing",
  "shape",
  "motion",
  "interaction",
  "loading",
  "elevation",
  "themeIntelligence",
  "visualization"
] as const;

export type MaterialOneTokenGroup =
  (typeof materialOneTokenGroups)[number];

export type MaterialOneTokenPath =
  `${MaterialOneTokenGroup}.${string}`;

export type MaterialOneTokenScalar =
  | string
  | number
  | boolean;

export type MaterialOneTokenValue =
  | MaterialOneTokenScalar
  | readonly MaterialOneTokenScalar[];

export type MaterialOneTokenKind =
  | "color"
  | "dimension"
  | "duration"
  | "easing"
  | "shadow"
  | "font-family"
  | "number"
  | "boolean"
  | "list"
  | "string";

export type MaterialOneTokenDocument =
  Record<MaterialOneTokenGroup, unknown> & {
    name: string;
    version: string;
  };

export interface MaterialOneTokenEntry {
  path: MaterialOneTokenPath;
  group: MaterialOneTokenGroup;
  value: MaterialOneTokenValue;
  kind: MaterialOneTokenKind;
  cssVariable: string | null;
}

export interface MaterialOneTokenManifest {
  name: string;
  version: string;
  totalTokens: number;
  groups: Record<MaterialOneTokenGroup, number>;
}

export interface MaterialOneTokenValidation {
  valid: boolean;
  issues: string[];
  manifest?: MaterialOneTokenManifest;
}

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isScalar(
  value: unknown
): value is MaterialOneTokenScalar {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

function isTokenValue(
  value: unknown
): value is MaterialOneTokenValue {
  return (
    isScalar(value) ||
    (
      Array.isArray(value) &&
      value.length > 0 &&
      value.every(isScalar)
    )
  );
}

function toKebabCase(value: string): string {
  return value
    .replace(
      /([a-z0-9])([A-Z])/g,
      "$1-$2"
    )
    .replace(/_/g, "-")
    .toLowerCase();
}

function semanticRoleVariable(
  role: string
): string {
  return `--mo-sem-${toKebabCase(role)}`;
}

export function tokenCssVariable(
  path: MaterialOneTokenPath
): string | null {
  const parts = path.split(".");
  const [group, ...segments] = parts;
  const last = segments.at(-1);

  if (!last) return null;

  if (group === "spacing" && segments.length === 1) {
    return `--mo-space-${toKebabCase(last)}`;
  }

  if (group === "shape" && segments.length === 1) {
    return `--mo-shape-${toKebabCase(last)}`;
  }

  if (
    group === "elevation" &&
    segments.length === 1 &&
    /^level\d+$/.test(last)
  ) {
    return `--mo-elevation-${last.replace("level", "")}`;
  }

  if (group === "interaction" && segments.length === 1) {
    if (last === "focusRing") return "--mo-focus-ring";
    if (last.startsWith("target")) {
      return `--mo-target-${toKebabCase(
        last.replace(/^target/, "")
      )}`;
    }
  }

  if (group === "loading" && segments.length === 1) {
    if (last === "skeletonDelay") {
      return "--mo-skeleton-delay";
    }
    if (last === "skeletonMinimumVisible") {
      return "--mo-skeleton-minimum-visible";
    }
  }

  if (group === "motion") {
    if (
      segments.length === 1 &&
      [
        "instant",
        "small",
        "standard",
        "large",
        "feedback",
        "enter",
        "exit",
        "navigation",
        "transform",
        "emphasis",
        "loading"
      ].includes(last)
    ) {
      return `--mo-motion-${toKebabCase(last)}`;
    }

    if (segments.length === 1 && last === "skeleton") {
      return "--mo-skeleton-duration";
    }

    if (
      segments.length === 1 &&
      last.startsWith("easing")
    ) {
      return `--mo-ease-${toKebabCase(
        last.replace(/^easing/, "")
      )}`;
    }

    if (
      segments.length === 2 &&
      segments[0] === "distance"
    ) {
      return `--mo-motion-distance-${toKebabCase(last)}`;
    }
  }

  if (group === "typography") {
    if (
      segments.length === 1 &&
      [
        "display",
        "largeTitle",
        "title",
        "heading",
        "sectionHeading",
        "body",
        "label",
        "supporting"
      ].includes(last)
    ) {
      return `--mo-type-${toKebabCase(last)}`;
    }

    if (
      segments.length === 2 &&
      segments[0] === "fontFamily"
    ) {
      return `--mo-font-${toKebabCase(last)}`;
    }

    if (
      segments.length === 2 &&
      segments[0] === "weights"
    ) {
      return `--mo-type-weight-${toKebabCase(last)}`;
    }

    if (
      segments.length === 2 &&
      segments[0] === "lineHeight"
    ) {
      return `--mo-line-${toKebabCase(last)}`;
    }

    if (
      segments.length === 2 &&
      segments[0] === "tracking"
    ) {
      return `--mo-tracking-${toKebabCase(last)}`;
    }
  }

  if (
    group === "color" &&
    segments.length >= 3 &&
    segments[0] === "semantic" &&
    (
      segments[1] === "light" ||
      segments[1] === "dark"
    )
  ) {
    return semanticRoleVariable(
      segments.slice(2).join("-")
    );
  }

  if (
    group === "color" &&
    segments.length >= 3 &&
    (
      segments[0] === "coding" ||
      segments[0] === "codingDark"
    )
  ) {
    const [, code, property] = segments;
    if (property === "base") {
      return `--mo-code-${toKebabCase(code)}`;
    }
    if (property === "container") {
      return `--mo-code-${toKebabCase(code)}-container`;
    }
    if (property === "onContainer") {
      return `--mo-code-${toKebabCase(code)}-on-container`;
    }
  }

  return null;
}

export function inferTokenKind(
  path: MaterialOneTokenPath,
  value: MaterialOneTokenValue
): MaterialOneTokenKind {
  if (Array.isArray(value)) return "list";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";

  if (
    path.startsWith("color.") ||
    /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value) ||
    /^rgba?\(/i.test(value)
  ) {
    return "color";
  }

  if (/^-?\d*\.?\d+(px|rem|em|ch|vh|vw|dvh|dvw|%)$/.test(value)) {
    return "dimension";
  }

  if (/^-?\d*\.?\d+(ms|s)$/.test(value)) {
    return "duration";
  }

  if (/^(cubic-bezier|linear|steps)\(/.test(value)) {
    return "easing";
  }

  if (
    path.startsWith("elevation.") ||
    /\brgba?\(/.test(value)
  ) {
    return "shadow";
  }

  if (path.startsWith("typography.fontFamily.")) {
    return "font-family";
  }

  return "string";
}

function flattenNode(
  group: MaterialOneTokenGroup,
  value: unknown,
  segments: string[],
  entries: MaterialOneTokenEntry[],
  issues: string[]
): void {
  if (isTokenValue(value)) {
    if (segments.length === 0) {
      issues.push(
        `${group} must contain named token values.`
      );
      return;
    }

    const path =
      `${group}.${segments.join(".")}` as MaterialOneTokenPath;

    entries.push({
      path,
      group,
      value,
      kind: inferTokenKind(path, value),
      cssVariable: tokenCssVariable(path)
    });
    return;
  }

  if (!isRecord(value)) {
    issues.push(
      `${group}.${segments.join(".") || "<root>"} contains an unsupported token value.`
    );
    return;
  }

  const keys = Object.keys(value);
  if (keys.length === 0) {
    issues.push(
      `${group}.${segments.join(".") || "<root>"} must not be empty.`
    );
    return;
  }

  for (const key of keys) {
    flattenNode(
      group,
      value[key],
      [...segments, key],
      entries,
      issues
    );
  }
}

export function flattenMaterialOneTokens(
  document: MaterialOneTokenDocument
): MaterialOneTokenEntry[] {
  const issues: string[] = [];
  const entries: MaterialOneTokenEntry[] = [];

  for (const group of materialOneTokenGroups) {
    flattenNode(
      group,
      document[group],
      [],
      entries,
      issues
    );
  }

  if (issues.length > 0) {
    throw new Error(
      `Invalid Material One token document: ${issues.join(" ")}`
    );
  }

  return entries.sort(
    (left, right) =>
      left.path.localeCompare(right.path)
  );
}

export function createTokenManifest(
  document: MaterialOneTokenDocument
): MaterialOneTokenManifest {
  const entries = flattenMaterialOneTokens(document);
  const groups = Object.fromEntries(
    materialOneTokenGroups.map((group) => [
      group,
      entries.filter(
        (entry) => entry.group === group
      ).length
    ])
  ) as Record<MaterialOneTokenGroup, number>;

  return {
    name: document.name,
    version: document.version,
    totalTokens: entries.length,
    groups
  };
}

export function validateMaterialOneTokens(
  value: unknown
): MaterialOneTokenValidation {
  const issues: string[] = [];

  if (!isRecord(value)) {
    return {
      valid: false,
      issues: [
        "Material One tokens must be a JSON object."
      ]
    };
  }

  if (value.name !== "Material One Tokens") {
    issues.push(
      'Token document name must be "Material One Tokens".'
    );
  }

  if (
    typeof value.version !== "string" ||
    !/^\d+\.\d+\.\d+$/.test(value.version)
  ) {
    issues.push(
      "Token document version must use x.y.z numeric versioning."
    );
  }

  for (const group of materialOneTokenGroups) {
    if (!(group in value)) {
      issues.push(
        `Token document is missing required group ${group}.`
      );
    }
  }

  if (issues.length > 0) {
    return { valid: false, issues };
  }

  try {
    const document =
      value as unknown as MaterialOneTokenDocument;
    const manifest = createTokenManifest(document);

    return {
      valid: true,
      issues: [],
      manifest
    };
  } catch (error) {
    return {
      valid: false,
      issues: [
        error instanceof Error
          ? error.message
          : String(error)
      ]
    };
  }
}

export function readMaterialOneToken(
  document: MaterialOneTokenDocument,
  path: MaterialOneTokenPath
): MaterialOneTokenValue {
  const [group, ...segments] = path.split(".");
  let current: unknown =
    document[group as MaterialOneTokenGroup];

  for (const segment of segments) {
    if (!isRecord(current) || !(segment in current)) {
      throw new Error(
        `Unknown Material One token path: ${path}`
      );
    }
    current = current[segment];
  }

  if (!isTokenValue(current)) {
    throw new Error(
      `Material One token path does not resolve to a token value: ${path}`
    );
  }

  return current;
}

export function findMaterialOneTokens(
  document: MaterialOneTokenDocument,
  query: string
): MaterialOneTokenEntry[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return flattenMaterialOneTokens(document);
  }

  return flattenMaterialOneTokens(document).filter(
    (entry) =>
      entry.path.toLowerCase().includes(normalized) ||
      String(entry.value)
        .toLowerCase()
        .includes(normalized)
  );
}
