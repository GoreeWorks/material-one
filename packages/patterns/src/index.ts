import type {
  MaterialOneContext
} from "@material-one/core";
import {
  createLayoutProfile,
  resolveLayoutColumns,
  type LayoutColumnCount
} from "@material-one/layout";

export type ProductPatternKind =
  | "page"
  | "grid"
  | "master-detail"
  | "settings"
  | "catalog";

export type PatternPresentationMode =
  | "stacked"
  | "split"
  | "grid";

export type PagePatternWidth =
  | "layout"
  | "narrow"
  | "standard"
  | "wide"
  | "fluid";

export interface PagePatternOptions {
  width?: PagePatternWidth;
}

export interface GridPatternOptions {
  columns?: "automatic" | LayoutColumnCount;
}

export interface PagePatternRecipe {
  kind: "page";
  presentation: "stacked" | "split";
  width: PagePatternWidth;
  maxWidth: number | "fluid";
}

export interface GridPatternRecipe {
  kind: "grid";
  presentation: "grid";
  columns: LayoutColumnCount;
  columnCapacity: LayoutColumnCount;
}

export interface MasterDetailPatternRecipe {
  kind: "master-detail";
  presentation: "stacked" | "split";
  masterPaneWidth: number;
  detailPriority: "sequential" | "simultaneous";
}

export interface SettingsPatternRecipe {
  kind: "settings";
  presentation: "stacked" | "split";
  stickyNavigation: boolean;
  navigationWidth: number;
}

export interface CatalogPatternRecipe {
  kind: "catalog";
  presentation: "stacked" | "split";
  filterPresentation: "drawer" | "sidebar";
  minimumCardWidth: number;
  stickyFilters: boolean;
}

export type ProductPatternRecipe =
  | PagePatternRecipe
  | GridPatternRecipe
  | MasterDetailPatternRecipe
  | SettingsPatternRecipe
  | CatalogPatternRecipe;

export interface ProductPatternPresentation {
  recipe: ProductPatternRecipe;
  attributes: Record<string, string>;
  style: Record<string, string>;
}

const explicitPageWidths: Record<
  Exclude<PagePatternWidth, "layout">,
  number | "fluid"
> = {
  narrow: 720,
  standard: 1040,
  wide: 1280,
  fluid: "fluid"
};

export function createPagePattern(
  context: MaterialOneContext,
  options: PagePatternOptions = {}
): PagePatternRecipe {
  const layout = createLayoutProfile(context);
  const width = options.width ?? "layout";
  const maxWidth =
    width === "layout"
      ? layout.contentMaxWidth
      : explicitPageWidths[width];

  return {
    kind: "page",
    presentation:
      context.layout === "compact"
        ? "stacked"
        : "split",
    width,
    maxWidth
  };
}

export function createGridPattern(
  context: MaterialOneContext,
  options: GridPatternOptions = {}
): GridPatternRecipe {
  const layout = createLayoutProfile(context);

  return {
    kind: "grid",
    presentation: "grid",
    columns: resolveLayoutColumns(
      context.layout,
      options.columns
    ),
    columnCapacity: layout.columnCapacity
  };
}

export function createMasterDetailPattern(
  context: MaterialOneContext
): MasterDetailPatternRecipe {
  const stacked = context.layout === "compact";

  return {
    kind: "master-detail",
    presentation: stacked
      ? "stacked"
      : "split",
    masterPaneWidth: stacked ? 0 : 260,
    detailPriority: stacked
      ? "sequential"
      : "simultaneous"
  };
}

export function createSettingsPattern(
  context: MaterialOneContext
): SettingsPatternRecipe {
  const stacked = context.layout === "compact";

  return {
    kind: "settings",
    presentation: stacked
      ? "stacked"
      : "split",
    stickyNavigation: !stacked,
    navigationWidth: stacked ? 0 : 260
  };
}

export function createCatalogPattern(
  context: MaterialOneContext
): CatalogPatternRecipe {
  const stacked = context.layout !== "workspace";

  return {
    kind: "catalog",
    presentation: stacked
      ? "stacked"
      : "split",
    filterPresentation: stacked
      ? "drawer"
      : "sidebar",
    minimumCardWidth:
      context.layout === "compact"
        ? 200
        : 230,
    stickyFilters: !stacked
  };
}

export function createProductPattern(
  context: MaterialOneContext,
  kind: ProductPatternKind
): ProductPatternRecipe {
  switch (kind) {
    case "page":
      return createPagePattern(context);
    case "grid":
      return createGridPattern(context);
    case "master-detail":
      return createMasterDetailPattern(context);
    case "settings":
      return createSettingsPattern(context);
    case "catalog":
      return createCatalogPattern(context);
  }
}

export function createProductPatternPresentation(
  recipe: ProductPatternRecipe
): ProductPatternPresentation {
  const attributes: Record<string, string> = {
    "data-mo-pattern": recipe.kind,
    "data-mo-pattern-presentation":
      recipe.presentation
  };
  const style: Record<string, string> = {};

  if (recipe.kind === "page") {
    if (recipe.width !== "layout") {
      attributes["data-mo-width"] =
        recipe.width;
    }
    style["--mo-pattern-page-max"] =
      recipe.maxWidth === "fluid"
        ? "none"
        : `${recipe.maxWidth}px`;
  }

  if (recipe.kind === "grid") {
    attributes["data-mo-columns"] =
      String(recipe.columns);
    attributes[
      "data-mo-column-capacity"
    ] = String(recipe.columnCapacity);
    style["--mo-pattern-columns"] =
      String(recipe.columns);
  }

  if (recipe.kind === "master-detail") {
    attributes["data-mo-detail-priority"] =
      recipe.detailPriority;
    style["--mo-pattern-master-width"] =
      `${recipe.masterPaneWidth}px`;
  }

  if (recipe.kind === "settings") {
    attributes[
      "data-mo-sticky-navigation"
    ] = recipe.stickyNavigation
      ? "true"
      : "false";
    style["--mo-pattern-settings-nav-width"] =
      `${recipe.navigationWidth}px`;
  }

  if (recipe.kind === "catalog") {
    attributes[
      "data-mo-filter-presentation"
    ] = recipe.filterPresentation;
    attributes["data-mo-sticky-filters"] =
      recipe.stickyFilters
        ? "true"
        : "false";
    style["--mo-pattern-card-min"] =
      `${recipe.minimumCardWidth}px`;
  }

  return {
    recipe,
    attributes,
    style
  };
}
