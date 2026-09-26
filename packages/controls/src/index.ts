import type { MaterialOneContext } from "@material-one/core";

export type ControlState =
  | "default"
  | "focused"
  | "pressed"
  | "selected"
  | "disabled"
  | "loading"
  | "success"
  | "warning"
  | "error";

export type ControlSize = "compact" | "comfortable" | "touch";

export interface ControlRecipe {
  state: ControlState;
  size: ControlSize;
  minTargetSize: number;
  motion: "none" | "small" | "standard";
}

export interface ToggleRecipe extends ControlRecipe {
  kind: "switch" | "checkbox" | "radio";
  checked: boolean;
}

export interface SliderRecipe extends ControlRecipe {
  orientation: "horizontal" | "vertical";
  showValue: boolean;
}

export interface SegmentedRecipe extends ControlRecipe {
  presentation: "contained" | "scrollable";
  equalWidth: boolean;
}

export interface TabsRecipe extends ControlRecipe {
  presentation: "fixed" | "scrollable";
  placement: "top" | "side";
}

export interface ChipRecipe extends ControlRecipe {
  kind: "assist" | "filter" | "input" | "suggestion";
  selected: boolean;
  removable: boolean;
}

export interface DataTableRecipe extends ControlRecipe {
  presentation: "table" | "cards";
  rowHeight: number;
  stickyHeader: boolean;
  columnPriority: "all" | "essential-first";
}

export interface PaginationRecipe extends ControlRecipe {
  presentation: "numbered" | "compact";
  visiblePages: number;
}

export interface ProgressRecipe extends ControlRecipe {
  kind: "linear" | "circular";
  determinate: boolean;
}

function controlSize(context: MaterialOneContext): ControlSize {
  if (context.interactionTarget >= 48) return "touch";
  if (context.interactionTarget <= 36) return "compact";
  return "comfortable";
}

function controlMotion(
  context: MaterialOneContext
): ControlRecipe["motion"] {
  if (context.preferences.motion === "none") return "none";
  if (context.preferences.motion === "reduced") return "small";
  return "standard";
}

function baseRecipe(
  context: MaterialOneContext,
  state: ControlState = "default"
): ControlRecipe {
  return {
    state,
    size: controlSize(context),
    minTargetSize: context.interactionTarget,
    motion: controlMotion(context)
  };
}

export function createToggleRecipe(
  context: MaterialOneContext,
  kind: ToggleRecipe["kind"],
  checked = false,
  state: ControlState = "default"
): ToggleRecipe {
  return {
    ...baseRecipe(context, state),
    kind,
    checked
  };
}

export function createSliderRecipe(
  context: MaterialOneContext,
  options: {
    orientation?: SliderRecipe["orientation"];
    showValue?: boolean;
    state?: ControlState;
  } = {}
): SliderRecipe {
  return {
    ...baseRecipe(context, options.state),
    orientation: options.orientation ?? "horizontal",
    showValue: options.showValue ?? context.layout !== "compact"
  };
}

export function createSegmentedRecipe(
  context: MaterialOneContext,
  segmentCount: number
): SegmentedRecipe {
  return {
    ...baseRecipe(context),
    presentation:
      context.layout === "compact" && segmentCount > 3
        ? "scrollable"
        : "contained",
    equalWidth: segmentCount <= 4
  };
}

export function createTabsRecipe(
  context: MaterialOneContext,
  tabCount: number
): TabsRecipe {
  return {
    ...baseRecipe(context),
    presentation:
      context.layout === "compact" || tabCount > 5
        ? "scrollable"
        : "fixed",
    placement: context.layout === "workspace" && tabCount > 6 ? "side" : "top"
  };
}

export function createChipRecipe(
  context: MaterialOneContext,
  options: {
    kind?: ChipRecipe["kind"];
    selected?: boolean;
    removable?: boolean;
    state?: ControlState;
  } = {}
): ChipRecipe {
  return {
    ...baseRecipe(context, options.state),
    kind: options.kind ?? "assist",
    selected: options.selected ?? false,
    removable: options.removable ?? options.kind === "input"
  };
}

export function createDataTableRecipe(
  context: MaterialOneContext,
  options: {
    columns: number;
    state?: ControlState;
  }
): DataTableRecipe {
  const compact = context.layout === "compact";

  return {
    ...baseRecipe(context, options.state),
    presentation: compact ? "cards" : "table",
    rowHeight:
      context.preferences.density === "compact"
        ? 40
        : context.preferences.density === "spacious"
          ? 56
          : 48,
    stickyHeader: !compact,
    columnPriority: compact || options.columns > 8 ? "essential-first" : "all"
  };
}

export function createPaginationRecipe(
  context: MaterialOneContext,
  totalPages: number
): PaginationRecipe {
  const compact = context.layout === "compact";

  return {
    ...baseRecipe(context),
    presentation: compact ? "compact" : "numbered",
    visiblePages: compact ? Math.min(3, totalPages) : Math.min(7, totalPages)
  };
}

export function createProgressRecipe(
  context: MaterialOneContext,
  kind: ProgressRecipe["kind"] = "linear",
  determinate = true
): ProgressRecipe {
  return {
    ...baseRecipe(context, determinate ? "default" : "loading"),
    kind,
    determinate
  };
}

export function disclosurePresentation(
  context: MaterialOneContext,
  kind: "tooltip" | "accordion" | "breadcrumb"
): "hover" | "press" | "expanded" | "collapsed" | "full" | "compact" {
  if (kind === "tooltip") {
    return context.device.input === "touch" ? "press" : "hover";
  }

  if (kind === "accordion") {
    return context.layout === "workspace" ? "expanded" : "collapsed";
  }

  return context.layout === "compact" ? "compact" : "full";
}
