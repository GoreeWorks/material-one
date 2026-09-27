import type { MaterialOneContext } from "@material-one/core";
import {
  createComponentPresentation,
  type ComponentPresentation,
  type ComponentState
} from "@material-one/components";

export type ControlState = ComponentState;

export type ControlKind =
  | "toggle"
  | "slider"
  | "segmented"
  | "tabs"
  | "chip"
  | "data-table"
  | "pagination"
  | "progress";

export type ControlSize =
  | "compact"
  | "comfortable"
  | "touch";

export interface ControlRecipe {
  control: ControlKind;
  state: ControlState;
  size: ControlSize;
  minTargetSize: number;
  motion: "none" | "small" | "standard";
}

export interface ToggleRecipe extends ControlRecipe {
  control: "toggle";
  kind: "switch" | "checkbox" | "radio";
  checked: boolean;
}

export interface SliderRecipe extends ControlRecipe {
  control: "slider";
  orientation: "horizontal" | "vertical";
  showValue: boolean;
}

export interface SegmentedRecipe extends ControlRecipe {
  control: "segmented";
  presentation: "contained" | "scrollable";
  equalWidth: boolean;
}

export interface TabsRecipe extends ControlRecipe {
  control: "tabs";
  presentation: "fixed" | "scrollable";
  placement: "top" | "side";
}

export interface ChipRecipe extends ControlRecipe {
  control: "chip";
  kind: "assist" | "filter" | "input" | "suggestion";
  selected: boolean;
  removable: boolean;
}

export interface DataTableRecipe extends ControlRecipe {
  control: "data-table";
  presentation: "table" | "cards";
  rowHeight: number;
  stickyHeader: boolean;
  columnPriority: "all" | "essential-first";
}

export interface PaginationRecipe extends ControlRecipe {
  control: "pagination";
  presentation: "numbered" | "compact";
  visiblePages: number;
}

export interface ProgressRecipe extends ControlRecipe {
  control: "progress";
  kind: "linear" | "circular";
  determinate: boolean;
}

export type AnyControlRecipe =
  | ToggleRecipe
  | SliderRecipe
  | SegmentedRecipe
  | TabsRecipe
  | ChipRecipe
  | DataTableRecipe
  | PaginationRecipe
  | ProgressRecipe;

export interface ControlPresentation {
  recipe: AnyControlRecipe;
  component: ComponentPresentation;
  attributes: Record<string, string>;
  style: Record<string, string>;
}

function controlSize(
  context: MaterialOneContext
): ControlSize {
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
  control: ControlKind,
  context: MaterialOneContext,
  state: ControlState = "default"
): ControlRecipe {
  return {
    control,
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
    ...baseRecipe("toggle", context, state),
    control: "toggle",
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
    ...baseRecipe(
      "slider",
      context,
      options.state
    ),
    control: "slider",
    orientation:
      options.orientation ?? "horizontal",
    showValue:
      options.showValue ??
      context.layout !== "compact"
  };
}

export function createSegmentedRecipe(
  context: MaterialOneContext,
  segmentCount: number
): SegmentedRecipe {
  return {
    ...baseRecipe(
      "segmented",
      context
    ),
    control: "segmented",
    presentation:
      context.layout === "compact" &&
      segmentCount > 3
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
    ...baseRecipe("tabs", context),
    control: "tabs",
    presentation:
      context.layout === "compact" ||
      tabCount > 5
        ? "scrollable"
        : "fixed",
    placement:
      context.layout === "workspace" &&
      tabCount > 6
        ? "side"
        : "top"
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
    ...baseRecipe(
      "chip",
      context,
      options.state
    ),
    control: "chip",
    kind: options.kind ?? "assist",
    selected:
      options.selected ?? false,
    removable:
      options.removable ??
      options.kind === "input"
  };
}

export function createDataTableRecipe(
  context: MaterialOneContext,
  options: {
    columns: number;
    state?: ControlState;
  }
): DataTableRecipe {
  const compact =
    context.layout === "compact";

  return {
    ...baseRecipe(
      "data-table",
      context,
      options.state
    ),
    control: "data-table",
    presentation:
      compact ? "cards" : "table",
    rowHeight:
      context.preferences.density ===
      "compact"
        ? 40
        : context.preferences.density ===
            "spacious"
          ? 56
          : 48,
    stickyHeader: !compact,
    columnPriority:
      compact || options.columns > 8
        ? "essential-first"
        : "all"
  };
}

export function createPaginationRecipe(
  context: MaterialOneContext,
  totalPages: number
): PaginationRecipe {
  const compact =
    context.layout === "compact";

  return {
    ...baseRecipe(
      "pagination",
      context
    ),
    control: "pagination",
    presentation:
      compact ? "compact" : "numbered",
    visiblePages:
      compact
        ? Math.min(3, totalPages)
        : Math.min(7, totalPages)
  };
}

export function createProgressRecipe(
  context: MaterialOneContext,
  kind: ProgressRecipe["kind"] = "linear",
  determinate = true
): ProgressRecipe {
  return {
    ...baseRecipe(
      "progress",
      context,
      determinate
        ? "default"
        : "loading"
    ),
    control: "progress",
    kind,
    determinate
  };
}

function semanticRoleForState(
  state: ControlState
):
  | "surfaceContainer"
  | "selectionContainer"
  | "disabled"
  | "successContainer"
  | "warningContainer"
  | "errorContainer" {
  switch (state) {
    case "selected":
      return "selectionContainer";
    case "disabled":
      return "disabled";
    case "success":
      return "successContainer";
    case "warning":
      return "warningContainer";
    case "error":
      return "errorContainer";
    default:
      return "surfaceContainer";
  }
}

function shapeRoleForControl(
  control: ControlKind
):
  | "control"
  | "navigation"
  | "chip"
  | "card" {
  switch (control) {
    case "tabs":
      return "navigation";
    case "chip":
      return "chip";
    case "data-table":
      return "card";
    default:
      return "control";
  }
}

export function createControlPresentation(
  context: MaterialOneContext,
  recipe: AnyControlRecipe
): ControlPresentation {
  const component =
    createComponentPresentation(
      `control:${recipe.control}`,
      context,
      {
        state: recipe.state,
        semanticColorRole:
          semanticRoleForState(
            recipe.state
          ),
        typographyRole: "label",
        motionIntent:
          recipe.control === "progress" &&
          !recipe.determinate
            ? "loading"
            : "feedback",
        shapeRole:
          shapeRoleForControl(
            recipe.control
          )
      }
    );

  const attributes: Record<
    string,
    string
  > = {
    ...component.attributes,
    "data-mo-control":
      recipe.control,
    "data-mo-control-size":
      recipe.size,
    "data-mo-control-motion":
      recipe.motion
  };

  const style: Record<string, string> = {
    ...component.style,
    "--mo-control-target-size":
      `${recipe.minTargetSize}px`
  };

  switch (recipe.control) {
    case "toggle":
      attributes["data-mo-control-kind"] =
        recipe.kind;
      attributes["data-mo-checked"] =
        String(recipe.checked);
      break;
    case "slider":
      attributes["data-mo-orientation"] =
        recipe.orientation;
      attributes["data-mo-show-value"] =
        String(recipe.showValue);
      break;
    case "segmented":
      attributes["data-mo-presentation"] =
        recipe.presentation;
      attributes["data-mo-scrollable"] =
        String(
          recipe.presentation ===
            "scrollable"
        );
      attributes["data-mo-equal-width"] =
        String(recipe.equalWidth);
      break;
    case "tabs":
      attributes["data-mo-presentation"] =
        recipe.presentation;
      attributes["data-mo-placement"] =
        recipe.placement;
      break;
    case "chip":
      attributes["data-mo-control-kind"] =
        recipe.kind;
      attributes["data-mo-selected"] =
        String(recipe.selected);
      attributes["data-mo-removable"] =
        String(recipe.removable);
      break;
    case "data-table":
      attributes["data-mo-presentation"] =
        recipe.presentation;
      attributes["data-mo-sticky-header"] =
        String(recipe.stickyHeader);
      attributes["data-mo-column-priority"] =
        recipe.columnPriority;
      style["--mo-control-row-height"] =
        `${recipe.rowHeight}px`;
      break;
    case "pagination":
      attributes["data-mo-presentation"] =
        recipe.presentation;
      attributes["data-mo-visible-pages"] =
        String(recipe.visiblePages);
      break;
    case "progress":
      attributes["data-mo-control-kind"] =
        recipe.kind;
      attributes["data-mo-determinate"] =
        String(recipe.determinate);
      attributes["data-mo-indeterminate"] =
        String(!recipe.determinate);
      break;
  }

  return {
    recipe,
    component,
    attributes,
    style
  };
}

export function disclosurePresentation(
  context: MaterialOneContext,
  kind:
    | "tooltip"
    | "accordion"
    | "breadcrumb"
):
  | "hover"
  | "press"
  | "expanded"
  | "collapsed"
  | "full"
  | "compact" {
  if (kind === "tooltip") {
    return context.device.input ===
      "touch"
      ? "press"
      : "hover";
  }

  if (kind === "accordion") {
    return context.layout ===
      "workspace"
      ? "expanded"
      : "collapsed";
  }

  return context.layout ===
    "compact"
    ? "compact"
    : "full";
}
