# Material One Product Pattern System

Product Patterns turn Material One's lower-level layout, component, and interaction contracts into reusable page-level experience structures.

The pattern layer owns common product arrangements such as pages, adaptive grids, master/detail flows, settings layouts, and catalog/filter layouts. It does not replace the Layout Engine, Application Shell, or individual component contracts.

## Contract boundary

The Product Pattern System owns:

- page-width intent
- page-header presentation
- product-grid column intent
- master/detail presentation
- settings navigation presentation
- catalog filter presentation
- pattern-level portable attributes and CSS variables

Core remains authoritative for the effective layout mode. The Layout Engine remains authoritative for structural capacity such as content width and grid-column limits.

## Page pattern

Page patterns can follow the current layout width or request one of four explicit width intents:

- narrow
- standard
- wide
- fluid

Compact layout stacks page-header content. Expanded and workspace layouts use split page-header presentation.

When the page width is `layout`, the pattern inherits the Layout Engine's content width rather than creating a competing breakpoint rule.

## Grid pattern

Grid patterns accept automatic or explicit one-through-four column intent.

Requested columns are resolved through `@material-one/layout`, so a product cannot force four simultaneous columns into a compact or expanded layout that does not support them.

The runtime emits both the resolved column count and the current layout column capacity.

## Master/detail pattern

Master/detail becomes a sequential stacked flow in compact layout and a simultaneous split flow in expanded or workspace layout.

This distinction is derived from the authoritative Material One layout mode, not inferred independently from viewport width.

## Settings pattern

Settings use stacked navigation in compact layout and a split layout with sticky navigation when more structural space is available.

The runtime exposes navigation width and sticky-navigation intent to framework adapters.

## Catalog pattern

Catalogs use a filter drawer in compact and expanded layouts, then promote filters to a sticky sidebar in workspace layout.

Card minimum width adapts independently from filter placement.

This keeps filtering behavior aligned with product structure while allowing the card grid itself to remain responsive.

## Framework-portable presentation

`createProductPatternPresentation()` emits pattern metadata such as:

- `data-mo-pattern`
- `data-mo-pattern-presentation`
- `data-mo-width`
- `data-mo-columns`
- `data-mo-column-capacity`
- `data-mo-detail-priority`
- `data-mo-sticky-navigation`
- `data-mo-filter-presentation`
- `data-mo-sticky-filters`

It also emits pattern CSS variables for page width, grid columns, master-pane width, settings-navigation width, and catalog card minimum width.

## CSS behavior

The existing Material One pattern CSS remains the browser implementation.

Typed presentation attributes now provide an explicit path for framework adapters and layout overrides. Media queries remain progressive fallbacks for hosts that use the CSS without applying runtime pattern metadata.

This is especially important when a user or product explicitly requests a layout mode that differs from the viewport's automatic classification.

## Principle

Use product patterns to compose stable Material One behavior at page scale. Derive structural decisions from core and the Layout Engine, then expose the result through one typed pattern contract rather than re-implementing responsive policy in each product.
