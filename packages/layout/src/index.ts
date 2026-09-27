import type {
  LayoutMode,
  MaterialOneContext
} from "@material-one/core";

export type LayoutColumnCount = 1 | 2 | 3 | 4;

export type LayoutPaneStrategy =
  | "stacked"
  | "split"
  | "multi-pane";

export type LayoutContentWidth =
  | 720
  | 1120
  | "fluid";

export interface LayoutEngineOptions {
  columns?: "automatic" | LayoutColumnCount;
  preferFluidContent?: boolean;
}

export interface MaterialOneLayoutProfile {
  mode: LayoutMode;
  contentPadding: number;
  contentMaxWidth: LayoutContentWidth;
  gridColumns: LayoutColumnCount;
  columnCapacity: LayoutColumnCount;
  minimumColumnWidth: number;
  paneStrategy: LayoutPaneStrategy;
  supportsSecondaryPane: boolean;
  supportsContextPane: boolean;
}

export interface LayoutPresentation {
  profile: MaterialOneLayoutProfile;
  attributes: Record<string, string>;
  style: Record<string, string>;
}

const automaticColumns: Record<LayoutMode, LayoutColumnCount> = {
  compact: 1,
  expanded: 2,
  workspace: 3
};

const columnCapacity: Record<LayoutMode, LayoutColumnCount> = {
  compact: 1,
  expanded: 2,
  workspace: 4
};

const contentPadding: Record<LayoutMode, number> = {
  compact: 16,
  expanded: 24,
  workspace: 32
};

const minimumColumnWidth: Record<LayoutMode, number> = {
  compact: 240,
  expanded: 280,
  workspace: 320
};

export function resolveLayoutColumns(
  mode: LayoutMode,
  requested: "automatic" | LayoutColumnCount = "automatic"
): LayoutColumnCount {
  const capacity = columnCapacity[mode];

  if (requested === "automatic") {
    return automaticColumns[mode];
  }

  return Math.min(requested, capacity) as LayoutColumnCount;
}

export function resolveLayoutPaneStrategy(
  mode: LayoutMode
): LayoutPaneStrategy {
  if (mode === "compact") return "stacked";
  if (mode === "expanded") return "split";
  return "multi-pane";
}

export function resolveLayoutContentWidth(
  mode: LayoutMode,
  preferFluidContent = false
): LayoutContentWidth {
  if (preferFluidContent || mode === "workspace") {
    return "fluid";
  }

  return mode === "compact" ? 720 : 1120;
}

export function createLayoutProfile(
  context: MaterialOneContext,
  options: LayoutEngineOptions = {}
): MaterialOneLayoutProfile {
  const mode = context.layout;

  return {
    mode,
    contentPadding: contentPadding[mode],
    contentMaxWidth: resolveLayoutContentWidth(
      mode,
      options.preferFluidContent
    ),
    gridColumns: resolveLayoutColumns(
      mode,
      options.columns
    ),
    columnCapacity: columnCapacity[mode],
    minimumColumnWidth: minimumColumnWidth[mode],
    paneStrategy: resolveLayoutPaneStrategy(mode),
    supportsSecondaryPane: mode !== "compact",
    supportsContextPane: mode === "workspace"
  };
}

export function createLayoutPresentation(
  context: MaterialOneContext,
  options: LayoutEngineOptions = {}
): LayoutPresentation {
  const profile = createLayoutProfile(context, options);

  return {
    profile,
    attributes: {
      "data-mo-layout": profile.mode,
      "data-mo-layout-pane-strategy": profile.paneStrategy,
      "data-mo-layout-grid-columns": String(
        profile.gridColumns
      ),
      "data-mo-layout-column-capacity": String(
        profile.columnCapacity
      ),
      "data-mo-layout-secondary-pane":
        profile.supportsSecondaryPane
          ? "available"
          : "unavailable",
      "data-mo-layout-context-pane":
        profile.supportsContextPane
          ? "available"
          : "unavailable"
    },
    style: {
      "--mo-layout-content-padding":
        `${profile.contentPadding}px`,
      "--mo-layout-content-max":
        profile.contentMaxWidth === "fluid"
          ? "none"
          : `${profile.contentMaxWidth}px`,
      "--mo-layout-grid-columns":
        String(profile.gridColumns),
      "--mo-layout-column-capacity":
        String(profile.columnCapacity),
      "--mo-layout-min-column":
        `${profile.minimumColumnWidth}px`
    }
  };
}
