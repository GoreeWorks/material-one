export type SemanticIntent =
  | "surface"
  | "content"
  | "interaction"
  | "status"
  | "focus";

export interface SemanticValue {
  intent: SemanticIntent;
  token: string;
}

export interface SemanticComponentMap {
  background: SemanticValue;
  foreground: SemanticValue;
  action: SemanticValue;
  focus: SemanticValue;
}

export function createSemanticComponentMap(): SemanticComponentMap {
  return {
    background: { intent: "surface", token: "surfaceContainer" },
    foreground: { intent: "content", token: "onSurface" },
    action: { intent: "interaction", token: "primary" },
    focus: { intent: "focus", token: "focus" }
  };
}
