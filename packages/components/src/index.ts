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
import {
  typographyCssVariable,
  type TypographyRole
} from "@material-one/typography";
import {
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
  motion: MaterialOneContext["preferences"]["motion"];
  highContrast: boolean;
  textScale: number;
  interactionTarget: number;
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
  context: MaterialOneContext
): AdaptiveComponentContext {
  return {
    density: resolveComponentDensity(
      context.preferences.density,
      context.layout
    ),
    layout: context.layout,
    input: context.device.input,
    motion: context.preferences.motion,
    highContrast:
      context.preferences.accessibility.contrast === "high",
    textScale: context.preferences.accessibility.textScale,
    interactionTarget: context.interactionTarget
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
  options: ComponentContractOptions = {}
): AdaptiveComponentContract {
  const shapeRole =
    options.shapeRole ?? defaultShapeRole(component);

  return {
    component,
    state: options.state ?? "default",
    context: createAdaptiveComponentContext(context),
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
