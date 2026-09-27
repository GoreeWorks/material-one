import type {
  DensityPreference,
  MaterialOneContext,
  MotionPreference
} from "@material-one/core";
import type {
  MaterialOneAccessibilityPolicy
} from "@material-one/accessibility";

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

export type SkeletonMotion =
  | "shimmer"
  | "pulse"
  | "static";

export type LoadingIntent =
  | "content"
  | "navigation"
  | "action"
  | "refresh";

export type LoadingPresentation =
  | "none"
  | "skeleton"
  | "progress"
  | "stale";

export type LoadingDensity =
  DensityPreference;

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
  busy?: boolean;
}

export interface SkeletonBlueprint {
  kind:
    | "card"
    | "list"
    | "table"
    | "detail";
  rows: number;
  linesPerRow: number;
  hasAvatar: boolean;
  hasMedia: boolean;
  density: LoadingDensity;
}

export interface MaterialOneLoadingPolicy {
  motion: MotionPreference;
  density: LoadingDensity;
  skeletonMotion: SkeletonMotion;
  delayMs: number;
  minimumVisibleMs: number;
  preserveLayout: true;
}

export interface AdaptiveLoadingInput
  extends LoadingPresentationInput {
  skeletonKind?: SkeletonKind;
  blueprintKind?: SkeletonBlueprint["kind"];
}

export interface MaterialOneLoadingProfile {
  intent: LoadingIntent;
  presentation: LoadingPresentation;
  busy: boolean;
  expectedLatencyMs: number;
  geometryKnown: boolean;
  staleContentAvailable: boolean;
  policy: MaterialOneLoadingPolicy;
  skeleton: SkeletonRecipe | null;
  blueprint: SkeletonBlueprint | null;
}

export interface LoadingPresentationContract {
  profile: MaterialOneLoadingProfile;
  attributes: Record<string, string>;
  style: Record<string, string>;
}

export interface SkeletonPresentationContract {
  recipe: SkeletonRecipe;
  attributes: Record<string, string>;
  style: Record<string, string>;
}

export const materialOneLoadingTimings = {
  delayMs: 180,
  minimumVisibleMs: 300
} as const;

export function createSkeletonRecipe(
  kind: SkeletonKind,
  reducedMotion = false
): SkeletonRecipe {
  return {
    kind,
    motion:
      reducedMotion
        ? "static"
        : "shimmer",
    delayMs:
      materialOneLoadingTimings.delayMs,
    minimumVisibleMs:
      materialOneLoadingTimings.minimumVisibleMs,
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
  return (
    shownAtMs +
    recipe.minimumVisibleMs
  );
}

export function resolveLoadingPresentation(
  input: LoadingPresentationInput
): LoadingPresentation {
  if (input.busy === false) {
    return "none";
  }

  if (
    input.intent === "refresh" &&
    input.staleContentAvailable
  ) {
    return "stale";
  }

  if (
    input.expectedLatencyMs <
    materialOneLoadingTimings.delayMs
  ) {
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
  const densityRows =
    density === "compact"
      ? 6
      : density === "spacious"
        ? 3
        : 4;

  switch (kind) {
    case "card":
      return {
        kind,
        rows: 1,
        linesPerRow:
          density === "compact"
            ? 2
            : 3,
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

export function createLoadingPolicy(
  context: MaterialOneContext,
  accessibility: MaterialOneAccessibilityPolicy
): MaterialOneLoadingPolicy {
  const motion =
    accessibility.motion;
  const skeletonMotion:
    SkeletonMotion =
      motion === "full"
        ? "shimmer"
        : "static";

  return {
    motion,
    density:
      context.preferences.density,
    skeletonMotion,
    delayMs:
      materialOneLoadingTimings.delayMs,
    minimumVisibleMs:
      materialOneLoadingTimings.minimumVisibleMs,
    preserveLayout: true
  };
}

export function createAdaptiveSkeletonRecipe(
  context: MaterialOneContext,
  accessibility: MaterialOneAccessibilityPolicy,
  kind: SkeletonKind
): SkeletonRecipe {
  const policy =
    createLoadingPolicy(
      context,
      accessibility
    );

  return {
    kind,
    motion:
      policy.skeletonMotion,
    delayMs: policy.delayMs,
    minimumVisibleMs:
      policy.minimumVisibleMs,
    preserveLayout:
      policy.preserveLayout
  };
}

export function createLoadingProfile(
  context: MaterialOneContext,
  accessibility: MaterialOneAccessibilityPolicy,
  input: AdaptiveLoadingInput
): MaterialOneLoadingProfile {
  const policy =
    createLoadingPolicy(
      context,
      accessibility
    );
  const busy =
    input.busy ?? true;
  const presentation =
    resolveLoadingPresentation({
      ...input,
      busy
    });

  const skeleton =
    presentation === "skeleton"
      ? createAdaptiveSkeletonRecipe(
          context,
          accessibility,
          input.skeletonKind ??
            "custom"
        )
      : null;

  const blueprint =
    presentation === "skeleton" &&
    input.blueprintKind
      ? createSkeletonBlueprint(
          input.blueprintKind,
          policy.density
        )
      : null;

  return {
    intent: input.intent,
    presentation,
    busy,
    expectedLatencyMs:
      Math.max(
        0,
        input.expectedLatencyMs
      ),
    geometryKnown:
      input.geometryKnown,
    staleContentAvailable:
      input.staleContentAvailable ??
      false,
    policy,
    skeleton,
    blueprint
  };
}

export function createSkeletonPresentation(
  recipe: SkeletonRecipe
): SkeletonPresentationContract {
  return {
    recipe,
    attributes: {
      "data-mo-kind":
        recipe.kind,
      "data-mo-motion":
        recipe.motion,
      "aria-hidden": "true"
    },
    style: {
      "--mo-loading-delay":
        `${recipe.delayMs}ms`,
      "--mo-loading-minimum-visible":
        `${recipe.minimumVisibleMs}ms`
    }
  };
}

export function createLoadingPresentation(
  profile: MaterialOneLoadingProfile
): LoadingPresentationContract {
  const attributes: Record<
    string,
    string
  > = {
    "data-mo-loading-presentation":
      profile.presentation,
    "data-mo-loading-intent":
      profile.intent,
    "data-mo-loading-motion":
      profile.policy.motion,
    "data-mo-loading-density":
      profile.policy.density,
    "data-mo-loading-geometry":
      profile.geometryKnown
        ? "known"
        : "unknown",
    "data-mo-stale-content":
      String(
        profile.staleContentAvailable
      ),
    "aria-busy":
      String(profile.busy),
    "aria-live": "polite"
  };

  const style: Record<
    string,
    string
  > = {
    "--mo-loading-delay":
      `${profile.policy.delayMs}ms`,
    "--mo-loading-minimum-visible":
      `${profile.policy.minimumVisibleMs}ms`
  };

  if (profile.blueprint) {
    attributes[
      "data-mo-loading-blueprint"
    ] = profile.blueprint.kind;
    style[
      "--mo-loading-blueprint-rows"
    ] = String(
      profile.blueprint.rows
    );
    style[
      "--mo-loading-blueprint-lines"
    ] = String(
      profile.blueprint.linesPerRow
    );
  }

  return {
    profile,
    attributes,
    style
  };
}

export function loadingRegionAria(
  loading: boolean
): {
  "aria-busy": "true" | "false";
  "aria-live": "polite";
} {
  return {
    "aria-busy":
      loading ? "true" : "false",
    "aria-live": "polite"
  };
}
