export type MaterialOneComponentState =
  | "idle"
  | "hover"
  | "focus"
  | "active"
  | "disabled"
  | "loading"
  | "error";

export interface MaterialOneComponentRuntime {
  component: string;
  state: MaterialOneComponentState;
  semanticRole?: string;
  tokens: Record<string, string>;
  attributes: Record<string, string>;
}

export interface ComponentRuntimeOptions {
  component: string;
  state?: MaterialOneComponentState;
  semanticRole?: string;
  tokens?: Record<string, string>;
}

export function createComponentRuntime(
  options: ComponentRuntimeOptions
): MaterialOneComponentRuntime {
  const state = options.state ?? "idle";

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
  state: MaterialOneComponentState
): string {
  switch (state) {
    case "disabled":
      return "disabled";
    case "error":
      return "negative";
    case "loading":
      return "busy";
    default:
      return state;
  }
}
