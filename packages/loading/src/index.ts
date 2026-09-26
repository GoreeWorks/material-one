export type SkeletonKind =
  | "text"
  | "title"
  | "avatar"
  | "thumbnail"
  | "button"
  | "card"
  | "list-item"
  | "table-row"
  | "custom";

export type SkeletonMotion = "shimmer" | "pulse" | "static";
export type LoadingIntent = "content" | "navigation" | "action" | "refresh";
export type LoadingPresentation = "none" | "skeleton" | "progress" | "stale";
export type LoadingDensity = "compact" | "comfortable" | "spacious";

export interface SkeletonRecipe {
  kind: SkeletonKind;
  motion: SkeletonMotion;
  delayMs: number;
  minimumVisibleMs: number;
  preserveLayout: true;
}

export interface LoadingPresentationInput {
  expectedLatencyMs: number;
  geometryKnown: boolean;
  intent: LoadingIntent;
  staleContentAvailable?: boolean;
}

export interface SkeletonBlueprint {
  kind: "card" | "list" | "table" | "detail";
  rows: number;
  linesPerRow: number;
  hasAvatar: boolean;
  hasMedia: boolean;
  density: LoadingDensity;
}

export function createSkeletonRecipe(
  kind: SkeletonKind,
  reducedMotion = false
): SkeletonRecipe {
  return {
    kind,
    motion: reducedMotion ? "static" : "shimmer",
    delayMs: 180,
    minimumVisibleMs: 300,
    preserveLayout: true
  };
}

export function shouldShowSkeleton(
  elapsedMs: number,
  recipe: SkeletonRecipe
): boolean {
  return elapsedMs >= recipe.delayMs;
}

export function minimumSkeletonHideAt(
  shownAtMs: number,
  recipe: SkeletonRecipe
): number {
  return shownAtMs + recipe.minimumVisibleMs;
}

export function resolveLoadingPresentation(
  input: LoadingPresentationInput
): LoadingPresentation {
  if (input.intent === "refresh" && input.staleContentAvailable) {
    return "stale";
  }

  if (input.expectedLatencyMs < 180) {
    return "none";
  }

  if (input.intent === "action") {
    return "progress";
  }

  if (input.geometryKnown) {
    return "skeleton";
  }

  return "progress";
}

export function createSkeletonBlueprint(
  kind: SkeletonBlueprint["kind"],
  density: LoadingDensity = "comfortable"
): SkeletonBlueprint {
  const densityRows = density === "compact" ? 6 : density === "spacious" ? 3 : 4;

  switch (kind) {
    case "card":
      return {
        kind,
        rows: 1,
        linesPerRow: density === "compact" ? 2 : 3,
        hasAvatar: false,
        hasMedia: true,
        density
      };
    case "list":
      return {
        kind,
        rows: densityRows,
        linesPerRow: 2,
        hasAvatar: true,
        hasMedia: false,
        density
      };
    case "table":
      return {
        kind,
        rows: densityRows,
        linesPerRow: 3,
        hasAvatar: false,
        hasMedia: false,
        density
      };
    case "detail":
      return {
        kind,
        rows: 3,
        linesPerRow: 3,
        hasAvatar: false,
        hasMedia: true,
        density
      };
  }
}

export function loadingRegionAria(
  loading: boolean
): { "aria-busy": "true" | "false"; "aria-live": "polite" } {
  return {
    "aria-busy": loading ? "true" : "false",
    "aria-live": "polite"
  };
}
