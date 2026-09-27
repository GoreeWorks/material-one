import {
  createComponentRuntime,
  materialOneComponentStates,
  type MaterialOneComponentState,
  type MaterialOneContext
} from "@material-one/core";
import {
  semanticCssVariable,
  type SemanticColorRole
} from "@material-one/semantic-colors";
import type {
  MaterialOneAccessibilityPolicy
} from "@material-one/accessibility";
import {
  createTypographyPresentation,
  typographyCssVariable,
  type TypographyRole
} from "@material-one/typography";
import {
  createAdaptiveMotionPresentation,
  motionCssVariables,
  type MotionIntent
} from "@material-one/motion";
import {
  resolveShapeToken,
  shapeCssVariable,
  type ShapeRole,
  type ShapeToken
} from "@material-one/shape";

export type ComponentState = MaterialOneComponentState;
export type ComponentEmphasis =
  | "primary"
  | "secondary"
  | "tertiary"
  | "neutral"
  | "danger";
export type ComponentDensity =
  MaterialOneContext["preferences"]["density"];

export interface AdaptiveComponentContext {
  density: ComponentDensity;
  layout: MaterialOneContext["layout"];
  input: MaterialOneContext["device"]["input"];
  requestedMotion: MaterialOneContext["preferences"]["motion"];
  motion: MaterialOneContext["preferences"]["motion"];
  requestedContrast:
    MaterialOneContext["preferences"]["accessibility"]["contrast"];
  contrast:
    MaterialOneContext["preferences"]["accessibility"]["contrast"];
  highContrast: boolean;
  requestedTextScale: number;
  textScale: number;
  requestedReducedTransparency: boolean;
  reducedTransparency: boolean;
  forcedColors: boolean;
  interactionTarget: number;
  constrainedByAccessibility: boolean;
}

export interface AdaptiveComponentContract {
  component: string;
  state: ComponentState;
  context: AdaptiveComponentContext;
  semanticColorRole: SemanticColorRole;
  typographyRole: TypographyRole;
  motionIntent: MotionIntent;
  shapeRole: ShapeRole;
  shapeToken: ShapeToken;
}

export interface ComponentContractOptions {
  state?: ComponentState;
  semanticColorRole?: SemanticColorRole;
  typographyRole?: TypographyRole;
  motionIntent?: MotionIntent;
  shapeRole?: ShapeRole;
}

export interface ComponentPresentation {
  contract: AdaptiveComponentContract;
  attributes: Record<string, string>;
  style: Record<string, string>;
}

export const componentStates: readonly ComponentState[] =
  materialOneComponentStates;

export function resolveComponentDensity(
  density: ComponentDensity,
  layout: MaterialOneContext["layout"]
): ComponentDensity {
  if (layout === "compact" && density === "spacious") {
    return "comfortable";
  }

  return density;
}

export function createAdaptiveComponentContext(
  context: MaterialOneContext,
  accessibility?: MaterialOneAccessibilityPolicy
): AdaptiveComponentContext {
  const requestedMotion =
    context.preferences.motion;
  const requestedContrast =
    context.preferences.accessibility.contrast;
  const requestedTextScale =
    context.preferences.accessibility.textScale;
  const requestedReducedTransparency =
    context.preferences.accessibility.reducedTransparency;

  const motion =
    accessibility?.motion ??
    requestedMotion;
  const contrast =
    accessibility?.contrast ??
    requestedContrast;
  const textScale =
    accessibility?.textScale ??
    requestedTextScale;
  const reducedTransparency =
    accessibility?.reducedTransparency ??
    requestedReducedTransparency;
  const forcedColors =
    accessibility?.forcedColors ??
    false;
  const interactionTarget =
    Math.max(
      context.interactionTarget,
      accessibility?.minTargetSize ?? 0
    );

  return {
    density: resolveComponentDensity(
      context.preferences.density,
      context.layout
    ),
    layout: context.layout,
    input: context.device.input,
    requestedMotion,
    motion,
    requestedContrast,
    contrast,
    highContrast:
      contrast === "high",
    requestedTextScale,
    textScale,
    requestedReducedTransparency,
    reducedTransparency,
    forcedColors,
    interactionTarget,
    constrainedByAccessibility:
      motion !== requestedMotion ||
      contrast !== requestedContrast ||
      textScale !== requestedTextScale ||
      reducedTransparency !==
        requestedReducedTransparency ||
      interactionTarget !==
        context.interactionTarget
  };
}

function defaultShapeRole(component: string): ShapeRole {
  const normalized = component.trim().toLowerCase();

  if (normalized.includes("card")) return "card";
  if (
    normalized.includes("field") ||
    normalized.includes("input") ||
    normalized.includes("select")
  ) {
    return "field";
  }
  if (normalized.includes("nav")) return "navigation";
  if (normalized.includes("surface")) return "surface";
  if (normalized.includes("chip")) return "chip";
  if (
    normalized.includes("icon") ||
    normalized.includes("fab")
  ) {
    return "iconButton";
  }

  return "control";
}

export function createComponentContract(
  component: string,
  context: MaterialOneContext,
  options: ComponentContractOptions = {},
  accessibility?: MaterialOneAccessibilityPolicy
): AdaptiveComponentContract {
  const shapeRole =
    options.shapeRole ?? defaultShapeRole(component);

  return {
    component,
    state: options.state ?? "default",
    context: createAdaptiveComponentContext(
      context,
      accessibility
    ),
    semanticColorRole:
      options.semanticColorRole ?? "surfaceContainer",
    typographyRole: options.typographyRole ?? "body",
    motionIntent: options.motionIntent ?? "feedback",
    shapeRole,
    shapeToken: resolveShapeToken(shapeRole, context)
  };
}

export function createComponentPresentation(
  component: string,
  context: MaterialOneContext,
  options: ComponentContractOptions = {}
): ComponentPresentation {
  const contract = createComponentContract(
    component,
    context,
    options
  );
  const runtime = createComponentRuntime({
    component,
    state: contract.state,
    semanticRole: contract.semanticColorRole
  });

  return {
    contract,
    attributes: {
      ...runtime.attributes,
      "data-mo-density": contract.context.density,
      "data-mo-layout": contract.context.layout,
      "data-mo-input": contract.context.input,
      "data-mo-contrast": contract.context.highContrast
        ? "high"
        : "standard",
      "data-mo-semantic-role": contract.semanticColorRole,
      "data-mo-typography-role": contract.typographyRole,
      "data-mo-motion-intent": contract.motionIntent,
      "data-mo-shape-role": contract.shapeRole,
      "data-mo-shape-token": contract.shapeToken
    },
    style: {
      "--mo-component-semantic-color":
        `var(${semanticCssVariable(contract.semanticColorRole)})`,
      "--mo-component-type-size":
        `var(${typographyCssVariable(contract.typographyRole)})`,
      "--mo-component-radius":
        `var(${shapeCssVariable(contract.shapeToken)})`,
      ...motionCssVariables(
        contract.motionIntent,
        contract.context.motion
      )
    }
  };
}

export function createEffectiveComponentContract(
  component: string,
  context: MaterialOneContext,
  accessibility: MaterialOneAccessibilityPolicy,
  options: ComponentContractOptions = {}
): AdaptiveComponentContract {
  return createComponentContract(
    component,
    context,
    options,
    accessibility
  );
}

export function createAdaptiveComponentPresentation(
  component: string,
  context: MaterialOneContext,
  accessibility: MaterialOneAccessibilityPolicy,
  options: ComponentContractOptions = {}
): ComponentPresentation {
  const contract =
    createEffectiveComponentContract(
      component,
      context,
      accessibility,
      options
    );
  const runtime =
    createComponentRuntime({
      component,
      state: contract.state,
      semanticRole:
        contract.semanticColorRole
    });
  const typography =
    createTypographyPresentation(
      context,
      accessibility,
      contract.typographyRole
    );
  const motion =
    createAdaptiveMotionPresentation(
      context,
      accessibility,
      contract.motionIntent
    );

  return {
    contract,
    attributes: {
      ...runtime.attributes,
      "data-mo-density":
        contract.context.density,
      "data-mo-layout":
        contract.context.layout,
      "data-mo-input":
        contract.context.input,
      "data-mo-motion":
        contract.context.motion,
      "data-mo-motion-requested":
        contract.context.requestedMotion,
      "data-mo-contrast":
        contract.context.contrast,
      "data-mo-text-scale":
        String(
          contract.context.textScale
        ),
      "data-mo-text-scale-requested":
        String(
          contract.context
            .requestedTextScale
        ),
      "data-mo-transparency":
        contract.context
          .reducedTransparency
          ? "reduced"
          : "standard",
      "data-mo-forced-colors":
        contract.context.forcedColors
          ? "active"
          : "inactive",
      "data-mo-accessibility-constrained":
        String(
          contract.context
            .constrainedByAccessibility
        ),
      "data-mo-semantic-role":
        contract.semanticColorRole,
      "data-mo-typography-role":
        contract.typographyRole,
      "data-mo-motion-intent":
        contract.motionIntent,
      "data-mo-shape-role":
        contract.shapeRole,
      "data-mo-shape-token":
        contract.shapeToken
    },
    style: {
      "--mo-component-semantic-color":
        `var(${semanticCssVariable(
          contract.semanticColorRole
        )})`,
      "--mo-component-type-size":
        "var(--mo-type-effective-size)",
      "--mo-component-radius":
        `var(${shapeCssVariable(
          contract.shapeToken
        )})`,
      "--mo-component-min-target":
        `${contract.context.interactionTarget}px`,
      ...typography.style,
      ...motion.style
    }
  };
}

export interface ComponentRecipe {
  state: ComponentState;
  emphasis: ComponentEmphasis;
  minTargetSize: number;
  radius: ShapeToken;
  elevation: 0 | 1 | 2 | 3;
  motion: "none" | "instant" | "small" | "standard" | "large";
}

export interface ButtonOptions {
  emphasis?: ComponentEmphasis;
  state?: ComponentState;
  iconOnly?: boolean;
  floating?: boolean;
}

export interface SurfaceOptions {
  state?: ComponentState;
  floating?: boolean;
  focused?: boolean;
}

export interface FieldOptions {
  state?: Extract<
    ComponentState,
    | "default"
    | "focused"
    | "disabled"
    | "loading"
    | "success"
    | "warning"
    | "error"
  >;
}

function motionFor(
  context: MaterialOneContext
): ComponentRecipe["motion"] {
  if (context.preferences.motion === "none") return "none";
  if (context.preferences.motion === "reduced") return "small";
  return "standard";
}

export function createButtonRecipe(
  context: MaterialOneContext,
  options: ButtonOptions = {}
): ComponentRecipe {
  return {
    state: options.state ?? "default",
    emphasis: options.emphasis ?? "primary",
    minTargetSize: context.interactionTarget,
    radius: resolveShapeToken(
      options.iconOnly || options.floating
        ? "iconButton"
        : "control",
      context
    ),
    elevation: options.floating ? 2 : 0,
    motion: motionFor(context)
  };
}

export function createSurfaceRecipe(
  context: MaterialOneContext,
  options: SurfaceOptions = {}
): ComponentRecipe {
  return {
    state: options.state ?? "default",
    emphasis: "neutral",
    minTargetSize: 0,
    radius: resolveShapeToken(
      options.floating ? "floating" : "surface",
      context
    ),
    elevation: options.floating ? 2 : options.focused ? 1 : 0,
    motion: motionFor(context)
  };
}

export function createCardRecipe(
  context: MaterialOneContext,
  interactive = false
): ComponentRecipe {
  return {
    state: "default",
    emphasis: "neutral",
    minTargetSize: interactive ? context.interactionTarget : 0,
    radius: resolveShapeToken("card", context),
    elevation: interactive ? 1 : 0,
    motion: motionFor(context)
  };
}

export function createFieldRecipe(
  context: MaterialOneContext,
  options: FieldOptions = {}
): ComponentRecipe {
  return {
    state: options.state ?? "default",
    emphasis: options.state === "error" ? "danger" : "neutral",
    minTargetSize: context.interactionTarget,
    radius: resolveShapeToken("field", context),
    elevation: 0,
    motion: motionFor(context)
  };
}

export function createNavigationRecipe(
  context: MaterialOneContext
): ComponentRecipe & {
  presentation: "bar" | "rail" | "sidebar";
} {
  const presentation =
    context.layout === "compact"
      ? "bar"
      : context.layout === "expanded"
        ? "rail"
        : "sidebar";

  return {
    state: "default",
    emphasis: "neutral",
    minTargetSize: context.interactionTarget,
    radius: resolveShapeToken("navigation", context),
    elevation: context.layout === "compact" ? 1 : 0,
    motion: motionFor(context),
    presentation
  };
}
