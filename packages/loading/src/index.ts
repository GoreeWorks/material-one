export type SkeletonKind = "text" | "title" | "avatar" | "thumbnail" | "button" | "card" | "table-row" | "custom";
export type SkeletonMotion = "shimmer" | "pulse" | "static";

export interface SkeletonRecipe {
  kind: SkeletonKind;
  motion: SkeletonMotion;
  delayMs: number;
  minimumVisibleMs: number;
}

export function createSkeletonRecipe(
  kind: SkeletonKind,
  reducedMotion = false
): SkeletonRecipe {
  return {
    kind,
    motion: reducedMotion ? "static" : "shimmer",
    delayMs: 180,
    minimumVisibleMs: 300
  };
}

export function shouldShowSkeleton(elapsedMs: number, recipe: SkeletonRecipe): boolean {
  return elapsedMs >= recipe.delayMs;
}
