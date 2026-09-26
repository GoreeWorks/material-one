import type {
  MaterialOneComponentState,
  MaterialOneContext
} from "@material-one/core";

export type AriaBoolean = "true" | "false";
export type AriaTristate = AriaBoolean | "mixed";
export type AriaInvalid =
  | AriaBoolean
  | "grammar"
  | "spelling";

export type MaterialOneAriaRole =
  | "alert"
  | "button"
  | "checkbox"
  | "option"
  | "progressbar"
  | "radio"
  | "slider"
  | "status"
  | "switch"
  | "tab"
  | "treeitem";

export type AccessibilityAttributeName =
  | "role"
  | "aria-atomic"
  | "aria-busy"
  | "aria-checked"
  | "aria-controls"
  | "aria-current"
  | "aria-describedby"
  | "aria-disabled"
  | "aria-expanded"
  | "aria-invalid"
  | "aria-label"
  | "aria-labelledby"
  | "aria-live"
  | "aria-orientation"
  | "aria-pressed"
  | "aria-readonly"
  | "aria-required"
  | "aria-selected"
  | "aria-valuemax"
  | "aria-valuemin"
  | "aria-valuenow"
  | "aria-valuetext";

export type AccessibilityAttributes = Partial<
  Record<AccessibilityAttributeName, string>
>;

export interface AccessibilityContext {
  contrast: "standard" | "high";
  textScale: number;
  reducedTransparency: boolean;
  reducedMotion: boolean;
  interactionTarget: number;
}

export interface CommonAccessibilityOptions {
  disabled?: boolean;
  busy?: boolean;
  label?: string;
  labelledBy?: string;
  describedBy?: string;
  controls?: string;
}

export interface AccessibilityIssue {
  code: "missing-required-property";
  role: MaterialOneAriaRole;
  attribute: AccessibilityAttributeName;
  message: string;
}

function ariaBoolean(value: boolean): AriaBoolean {
  return value ? "true" : "false";
}

function commonAccessibilityAttributes(
  options: CommonAccessibilityOptions
): AccessibilityAttributes {
  return {
    ...(options.disabled
      ? { "aria-disabled": "true" }
      : {}),
    ...(options.busy
      ? { "aria-busy": "true" }
      : {}),
    ...(options.label
      ? { "aria-label": options.label }
      : {}),
    ...(options.labelledBy
      ? { "aria-labelledby": options.labelledBy }
      : {}),
    ...(options.describedBy
      ? { "aria-describedby": options.describedBy }
      : {}),
    ...(options.controls
      ? { "aria-controls": options.controls }
      : {})
  };
}

export function createAccessibilityContext(
  context: MaterialOneContext
): AccessibilityContext {
  return {
    contrast: context.preferences.accessibility.contrast,
    textScale: context.preferences.accessibility.textScale,
    reducedTransparency:
      context.preferences.accessibility.reducedTransparency,
    reducedMotion:
      context.preferences.motion === "reduced" ||
      context.preferences.motion === "none",
    interactionTarget: context.interactionTarget
  };
}

export function componentStateAccessibilityAttributes(
  state: MaterialOneComponentState
): AccessibilityAttributes {
  switch (state) {
    case "disabled":
      return { "aria-disabled": "true" };
    case "loading":
      return { "aria-busy": "true" };
    default:
      return {};
  }
}

export function mergeAccessibilityAttributes(
  ...attributeSets: Array<
    AccessibilityAttributes | undefined
  >
): AccessibilityAttributes {
  return Object.assign({}, ...attributeSets);
}

export interface AriaButtonOptions
  extends CommonAccessibilityOptions {
  pressed?: boolean | "mixed";
  expanded?: boolean;
}

export function createAriaButtonSemantics(
  options: AriaButtonOptions = {}
): AccessibilityAttributes {
  return {
    role: "button",
    ...commonAccessibilityAttributes(options),
    ...(options.pressed !== undefined
      ? {
          "aria-pressed":
            options.pressed === "mixed"
              ? "mixed"
              : ariaBoolean(options.pressed)
        }
      : {}),
    ...(options.expanded !== undefined
      ? { "aria-expanded": ariaBoolean(options.expanded) }
      : {})
  };
}

export type AriaToggleKind =
  | "checkbox"
  | "radio"
  | "switch";

export function createAriaToggleSemantics(
  kind: AriaToggleKind,
  checked: boolean | "mixed",
  options: CommonAccessibilityOptions = {}
): AccessibilityAttributes {
  return {
    role: kind,
    ...commonAccessibilityAttributes(options),
    "aria-checked":
      checked === "mixed"
        ? "mixed"
        : ariaBoolean(checked)
  };
}

export type AriaSelectionRole =
  | "option"
  | "tab"
  | "treeitem";

export function createAriaSelectionSemantics(
  role: AriaSelectionRole,
  selected: boolean,
  options: CommonAccessibilityOptions = {}
): AccessibilityAttributes {
  return {
    role,
    ...commonAccessibilityAttributes(options),
    "aria-selected": ariaBoolean(selected)
  };
}

export interface AriaDisclosureOptions
  extends CommonAccessibilityOptions {
  expanded: boolean;
}

export function createAriaDisclosureAttributes(
  options: AriaDisclosureOptions
): AccessibilityAttributes {
  return {
    ...commonAccessibilityAttributes(options),
    "aria-expanded": ariaBoolean(options.expanded)
  };
}

export interface AriaSliderOptions
  extends CommonAccessibilityOptions {
  valueNow: number;
  valueMin?: number;
  valueMax?: number;
  valueText?: string;
  orientation?: "horizontal" | "vertical";
}

export function createAriaSliderSemantics(
  options: AriaSliderOptions
): AccessibilityAttributes {
  return {
    role: "slider",
    ...commonAccessibilityAttributes(options),
    "aria-valuenow": String(options.valueNow),
    "aria-valuemin": String(options.valueMin ?? 0),
    "aria-valuemax": String(options.valueMax ?? 100),
    ...(options.valueText
      ? { "aria-valuetext": options.valueText }
      : {}),
    "aria-orientation":
      options.orientation ?? "horizontal"
  };
}

export interface AriaProgressOptions
  extends CommonAccessibilityOptions {
  valueNow?: number;
  valueMin?: number;
  valueMax?: number;
  valueText?: string;
}

export function createAriaProgressSemantics(
  options: AriaProgressOptions = {}
): AccessibilityAttributes {
  const determinate =
    options.valueNow !== undefined;

  return {
    role: "progressbar",
    ...commonAccessibilityAttributes(options),
    ...(determinate
      ? {
          "aria-valuenow": String(options.valueNow),
          "aria-valuemin": String(options.valueMin ?? 0),
          "aria-valuemax": String(options.valueMax ?? 100),
          ...(options.valueText
            ? { "aria-valuetext": options.valueText }
            : {})
        }
      : {})
  };
}

export interface AriaStatusOptions {
  live?: "off" | "polite" | "assertive";
  atomic?: boolean;
  label?: string;
}

export function createAriaStatusSemantics(
  kind: "status" | "alert" = "status",
  options: AriaStatusOptions = {}
): AccessibilityAttributes {
  return {
    role: kind,
    "aria-live":
      options.live ??
      (kind === "alert" ? "assertive" : "polite"),
    ...(options.atomic !== undefined
      ? { "aria-atomic": ariaBoolean(options.atomic) }
      : {}),
    ...(options.label
      ? { "aria-label": options.label }
      : {})
  };
}

export interface FieldAccessibilityOptions
  extends CommonAccessibilityOptions {
  invalid?: boolean | "grammar" | "spelling";
  required?: boolean;
  readOnly?: boolean;
}

export function createFieldAccessibilityAttributes(
  options: FieldAccessibilityOptions = {}
): AccessibilityAttributes {
  const invalid =
    options.invalid === undefined
      ? undefined
      : options.invalid === "grammar" ||
          options.invalid === "spelling"
        ? options.invalid
        : ariaBoolean(options.invalid);

  return {
    ...commonAccessibilityAttributes(options),
    ...(invalid !== undefined
      ? { "aria-invalid": invalid }
      : {}),
    ...(options.required !== undefined
      ? { "aria-required": ariaBoolean(options.required) }
      : {}),
    ...(options.readOnly !== undefined
      ? { "aria-readonly": ariaBoolean(options.readOnly) }
      : {})
  };
}

const requiredPropertiesByRole: Partial<
  Record<
    MaterialOneAriaRole,
    AccessibilityAttributeName[]
  >
> = {
  checkbox: ["aria-checked"],
  radio: ["aria-checked"],
  switch: ["aria-checked"],
  slider: ["aria-valuenow"]
};

export function auditAccessibilityAttributes(
  attributes: AccessibilityAttributes
): AccessibilityIssue[] {
  const role =
    attributes.role as
      | MaterialOneAriaRole
      | undefined;

  if (!role) return [];

  const required =
    requiredPropertiesByRole[role] ?? [];

  return required
    .filter(
      (attribute) =>
        attributes[attribute] === undefined ||
        attributes[attribute] === ""
    )
    .map((attribute) => ({
      code: "missing-required-property" as const,
      role,
      attribute,
      message:
        `${role} requires ${attribute} for a complete ARIA contract.`
    }));
}

export const materialOneAccessibility = {
  ariaVersion: "1.2",
  preferNativeSemantics: true,
  automaticStateAttributes: [
    "aria-disabled",
    "aria-busy"
  ] as const
};
