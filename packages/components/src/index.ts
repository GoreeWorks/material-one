import {
  materialOneComponentStates,
  type MaterialOneComponentState,
  type MaterialOneContext
} from "@material-one/core";

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
  semanticColorRole: string;
  typographyRole: string;
  motionIntent: string;
}

export interface ComponentContractOptions {
  state?: ComponentState;
  semanticColorRole?: string;
  typographyRole?: string;
  motionIntent?: string;
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

export function createComponentContract(
  component: string,
  context: MaterialOneContext,
  options: ComponentContractOptions = {}
): AdaptiveComponentContract {
  return {
    component,
    state: options.state ?? "default",
    context: createAdaptiveComponentContext(context),
    semanticColorRole:
      options.semanticColorRole ?? "surface-container",
    typographyRole: options.typographyRole ?? "body",
    motionIntent: options.motionIntent ?? "feedback"
  };
}

export interface ComponentRecipe {
  state: ComponentState;
  emphasis: ComponentEmphasis;
  minTargetSize: number;
  radius:
    | "extra-small"
    | "small"
    | "medium"
    | "large"
    | "pill";
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
    radius:
      options.iconOnly || options.floating ? "pill" : "medium",
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
    radius: options.floating ? "large" : "medium",
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
    radius:
      context.preferences.experienceMode === "minimal"
        ? "small"
        : "large",
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
    radius: "medium",
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
    radius: context.layout === "compact" ? "large" : "medium",
    elevation: context.layout === "compact" ? 1 : 0,
    motion: motionFor(context),
    presentation
  };
}
