export const typographyRoles = [
  "display",
  "largeTitle",
  "sectionHeading",
  "title",
  "body",
  "label",
  "supporting"
] as const;

export type TypographyRole = (typeof typographyRoles)[number];
export type TypographyLayout = "compact" | "expanded" | "workspace";
export type TypographyDensity = "compact" | "comfortable" | "spacious";

export interface TypographyRoleSpec {
  role: TypographyRole;
  fontSizeRem: number;
  lineHeight: number;
  fontWeight: number;
  letterSpacingEm: number;
  maxLineLengthCh?: number;
}

export interface TypographyContext {
  layout: TypographyLayout;
  textScale?: number;
  density?: TypographyDensity;
}

const baseSpecs: Record<TypographyRole, Omit<TypographyRoleSpec, "role">> = {
  display: {
    fontSizeRem: 3.5,
    lineHeight: 1.02,
    fontWeight: 720,
    letterSpacingEm: -0.035,
    maxLineLengthCh: 18
  },
  largeTitle: {
    fontSizeRem: 2.5,
    lineHeight: 1.08,
    fontWeight: 700,
    letterSpacingEm: -0.028,
    maxLineLengthCh: 24
  },
  sectionHeading: {
    fontSizeRem: 1.5,
    lineHeight: 1.2,
    fontWeight: 680,
    letterSpacingEm: -0.015,
    maxLineLengthCh: 34
  },
  title: {
    fontSizeRem: 2,
    lineHeight: 1.12,
    fontWeight: 700,
    letterSpacingEm: -0.022,
    maxLineLengthCh: 28
  },
  body: {
    fontSizeRem: 1,
    lineHeight: 1.5,
    fontWeight: 420,
    letterSpacingEm: 0,
    maxLineLengthCh: 72
  },
  label: {
    fontSizeRem: 0.875,
    lineHeight: 1.3,
    fontWeight: 620,
    letterSpacingEm: 0.01,
    maxLineLengthCh: 42
  },
  supporting: {
    fontSizeRem: 0.75,
    lineHeight: 1.4,
    fontWeight: 500,
    letterSpacingEm: 0.012,
    maxLineLengthCh: 58
  }
};

const layoutScale: Record<TypographyLayout, number> = {
  compact: 0.92,
  expanded: 1,
  workspace: 1.06
};

const densityScale: Record<TypographyDensity, number> = {
  compact: 0.97,
  comfortable: 1,
  spacious: 1.03
};

function clampTextScale(scale: number): number {
  if (!Number.isFinite(scale)) return 1;
  return Math.max(0.9, Math.min(2, scale));
}

export function resolveTypographyRole(
  role: TypographyRole,
  context: TypographyContext
): TypographyRoleSpec {
  const base = baseSpecs[role];
  const textScale = clampTextScale(context.textScale ?? 1);
  const density = densityScale[context.density ?? "comfortable"];
  const layout = layoutScale[context.layout];

  const structuralScale =
    role === "body" || role === "label" || role === "supporting"
      ? 1
      : layout * density;

  return {
    role,
    ...base,
    fontSizeRem: Number((base.fontSizeRem * structuralScale * textScale).toFixed(4))
  };
}

export function resolveTypographyScale(
  context: TypographyContext
): Record<TypographyRole, TypographyRoleSpec> {
  return Object.fromEntries(
    typographyRoles.map((role) => [role, resolveTypographyRole(role, context)])
  ) as Record<TypographyRole, TypographyRoleSpec>;
}

export function readableLineLength(
  role: TypographyRole
): number | undefined {
  return baseSpecs[role].maxLineLengthCh;
}

export function typographyCssVariable(role: TypographyRole): string {
  const kebab = role.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return `--mo-type-${kebab}`;
}

export function typographyStyle(
  role: TypographyRole,
  context: TypographyContext
): Record<string, string> {
  const spec = resolveTypographyRole(role, context);

  return {
    fontSize: `${spec.fontSizeRem}rem`,
    lineHeight: String(spec.lineHeight),
    fontWeight: String(spec.fontWeight),
    letterSpacing: `${spec.letterSpacingEm}em`,
    ...(spec.maxLineLengthCh
      ? { maxInlineSize: `${spec.maxLineLengthCh}ch` }
      : {})
  };
}
