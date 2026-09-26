import type { MaterialOneContext } from "@material-one/core";

export type OverlayState =
  | "closed"
  | "opening"
  | "open"
  | "closing";

export type NavigationMode = "bar" | "rail" | "sidebar";

export interface DialogRecipe {
  state: OverlayState;
  surface: "surface" | "focused-surface";
  modal: boolean;
  motion: "none" | "standard" | "large";
  radius: "large" | "extra-large";
}

export interface MenuRecipe {
  density: "compact" | "comfortable" | "spacious";
  surfaceElevation: 1 | 2 | 3;
  motion: "none" | "standard";
}

export interface DataSurfaceRecipe {
  density: "compact" | "comfortable";
  responsive: "stack" | "grid" | "table";
  loadingPattern: "skeleton" | "progressive" | "content";
}

function componentMotion(context: MaterialOneContext): "none" | "standard" | "large" {
  if (context.preferences.motion === "none") return "none";
  if (context.preferences.motion === "reduced") return "standard";
  return "large";
}

export function createDialogRecipe(
  context: MaterialOneContext,
  modal = true
): DialogRecipe {
  return {
    state: "closed",
    surface: "focused-surface",
    modal,
    motion: componentMotion(context),
    radius: "extra-large"
  };
}

export function createMenuRecipe(
  context: MaterialOneContext
): MenuRecipe {
  return {
    density: context.density,
    surfaceElevation: 2,
    motion: context.preferences.motion === "none" ? "none" : "standard"
  };
}

export function createDataSurfaceRecipe(
  context: MaterialOneContext,
  rows = 0
): DataSurfaceRecipe {
  return {
    density: context.density === "compact" ? "compact" : "comfortable",
    responsive:
      context.layout === "compact"
        ? "stack"
        : context.layout === "expanded"
          ? "grid"
          : "table",
    loadingPattern: rows === 0 ? "skeleton" : "content"
  };
}

export function createNavigationPattern(
  context: MaterialOneContext
): NavigationMode {
  if (context.layout === "compact") return "bar";
  if (context.layout === "expanded") return "rail";
  return "sidebar";
}
