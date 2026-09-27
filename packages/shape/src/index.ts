import type {
  ExperienceMode,
  MaterialOneContext
} from "@material-one/core";

export const shapeTokens = [
  "extra-small",
  "small",
  "medium",
  "large",
  "extra-large",
  "pill"
] as const;

export type ShapeToken = (typeof shapeTokens)[number];

export const shapeRoles = [
  "control",
  "field",
  "surface",
  "card",
  "navigation",
  "floating",
  "iconButton",
  "chip"
] as const;

export type ShapeRole = (typeof shapeRoles)[number];

export type ShapeStyle =
  | "minimal"
  | "balanced"
  | "expressive";

export type ShapeRoleMap = Record<ShapeRole, ShapeToken>;

export interface MaterialOneShapePolicy {
  style: ShapeStyle;
  roles: ShapeRoleMap;
}

export interface ShapePresentation {
  policy: MaterialOneShapePolicy;
  attributes: Record<string, string>;
  style: Record<string, string>;
}

const balancedRoles: ShapeRoleMap = {
  control: "medium",
  field: "medium",
  surface: "medium",
  card: "large",
  navigation: "medium",
  floating: "large",
  iconButton: "pill",
  chip: "pill"
};

const minimalRoles: ShapeRoleMap = {
  control: "small",
  field: "small",
  surface: "small",
  card: "small",
  navigation: "small",
  floating: "medium",
  iconButton: "pill",
  chip: "pill"
};

const expressiveRoles: ShapeRoleMap = {
  control: "medium",
  field: "medium",
  surface: "large",
  card: "extra-large",
  navigation: "large",
  floating: "extra-large",
  iconButton: "pill",
  chip: "pill"
};

function cloneRoles(roles: ShapeRoleMap): ShapeRoleMap {
  return { ...roles };
}

function toKebabCase(value: string): string {
  return value.replace(
    /[A-Z]/g,
    (letter) => `-${letter.toLowerCase()}`
  );
}

export function resolveShapeStyle(
  experienceMode: ExperienceMode
): ShapeStyle {
  if (experienceMode === "minimal") return "minimal";

  if (
    experienceMode === "expressive" ||
    experienceMode === "creative"
  ) {
    return "expressive";
  }

  return "balanced";
}

export function createShapePolicy(
  context: MaterialOneContext
): MaterialOneShapePolicy {
  const style = resolveShapeStyle(
    context.preferences.experienceMode
  );
  const roles =
    style === "minimal"
      ? cloneRoles(minimalRoles)
      : style === "expressive"
        ? cloneRoles(expressiveRoles)
        : cloneRoles(balancedRoles);

  if (context.layout === "compact") {
    roles.navigation =
      style === "expressive" ? "extra-large" : "large";
  }

  return { style, roles };
}

export function resolveShapeToken(
  role: ShapeRole,
  context: MaterialOneContext
): ShapeToken {
  return createShapePolicy(context).roles[role];
}

export function shapeCssVariable(
  token: ShapeToken
): string {
  return `--mo-shape-${token}`;
}

export function shapeRoleCssVariable(
  role: ShapeRole
): string {
  return `--mo-shape-${toKebabCase(role)}`;
}

export function createShapePresentation(
  context: MaterialOneContext
): ShapePresentation {
  const policy = createShapePolicy(context);

  return {
    policy,
    attributes: {
      "data-mo-shape-style": policy.style
    },
    style: Object.fromEntries(
      shapeRoles.map((role) => [
        shapeRoleCssVariable(role),
        `var(${shapeCssVariable(policy.roles[role])})`
      ])
    )
  };
}
