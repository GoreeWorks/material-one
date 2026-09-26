export const materialOneComponentStates = [
  "default",
  "hovered",
  "focused",
  "pressed",
  "selected",
  "disabled",
  "loading",
  "success",
  "warning",
  "error"
] as const;

export type MaterialOneComponentState =
  (typeof materialOneComponentStates)[number];

export type MaterialOneLegacyComponentState =
  | "idle"
  | "hover"
  | "focus"
  | "active";

export type MaterialOneComponentStateInput =
  | MaterialOneComponentState
  | MaterialOneLegacyComponentState;

export interface MaterialOneComponentRuntime {
  component: string;
  state: MaterialOneComponentState;
  semanticRole?: string;
  tokens: Record<string, string>;
  attributes: Record<string, string>;
}

export interface ComponentRuntimeOptions {
  component: string;
  state?: MaterialOneComponentStateInput;
  semanticRole?: string;
  tokens?: Record<string, string>;
}

export function normalizeComponentState(
  state: MaterialOneComponentStateInput = "default"
): MaterialOneComponentState {
  switch (state) {
    case "idle":
      return "default";
    case "hover":
      return "hovered";
    case "focus":
      return "focused";
    case "active":
      return "pressed";
    default:
      return state;
  }
}

export function createComponentRuntime(
  options: ComponentRuntimeOptions
): MaterialOneComponentRuntime {
  const state = normalizeComponentState(options.state);

  return {
    component: options.component,
    state,
    semanticRole: options.semanticRole,
    tokens: options.tokens ?? {},
    attributes: {
      "data-mo-component": options.component,
      "data-mo-state": state
    }
  };
}

export function resolveComponentState(
  state: MaterialOneComponentStateInput
): string {
  const normalizedState = normalizeComponentState(state);

  switch (normalizedState) {
    case "disabled":
      return "disabled";
    case "error":
      return "negative";
    case "loading":
      return "busy";
    case "success":
      return "positive";
    case "warning":
      return "caution";
    default:
      return normalizedState;
  }
}
