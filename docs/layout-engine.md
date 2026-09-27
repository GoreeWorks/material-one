# Material One Layout Engine

Material One separates layout-mode selection from layout geometry.

Core remains authoritative for choosing the current `compact`, `expanded`, or `workspace` mode from device context and the user's optional layout preference. The layout package consumes that resolved mode and turns it into semantic geometry for products, patterns, shells, and framework adapters.

## Contract boundary

The layout engine owns:

- content padding
- default content width
- adaptive grid column count
- maximum column capacity
- minimum useful column width
- pane strategy
- secondary-pane availability
- context-pane availability
- portable layout presentation metadata

The layout engine does not reclassify viewport width. Device adaptation describes physical capabilities, while core owns the effective layout mode.

## Layout modes

### Compact

Compact uses a single-column default, stacked pane strategy, 16px content padding, and a 720px content ceiling.

Secondary and context panes are unavailable as simultaneous persistent regions. Higher-level product flows may still present secondary content sequentially or through overlays.

### Expanded

Expanded uses a two-column default, split-pane strategy, 24px content padding, and an 1120px content ceiling.

A secondary pane is available, while a persistent context pane remains unavailable by default.

### Workspace

Workspace uses a three-column default with capacity for four columns, a multi-pane strategy, 32px content padding, and fluid content by default.

Both secondary and context panes are available.

## Column capacity

`resolveLayoutColumns()` accepts either automatic column selection or an explicit request from one through four columns.

Requested columns are clamped to the current layout capacity:

- compact: one column
- expanded: up to two columns
- workspace: up to four columns

This keeps product intent visible without allowing a local component or pattern to exceed the structural capacity of the current layout.

## Pane strategy

Pane strategy is semantic rather than component-specific:

- compact → stacked
- expanded → split
- workspace → multi-pane

Application shells and product patterns may interpret those strategies according to their own domain, but they should not invent a second layout-mode vocabulary.

## Framework-portable presentation

`createLayoutPresentation()` emits plain data attributes and CSS custom properties.

Attributes include:

- `data-mo-layout`
- `data-mo-layout-pane-strategy`
- `data-mo-layout-grid-columns`
- `data-mo-layout-column-capacity`
- `data-mo-layout-secondary-pane`
- `data-mo-layout-context-pane`

CSS variables include:

- `--mo-layout-content-padding`
- `--mo-layout-content-max`
- `--mo-layout-grid-columns`
- `--mo-layout-column-capacity`
- `--mo-layout-min-column`

The accompanying CSS also provides generic layout container, grid, stack, split, and multi-pane primitives.

## Shell and pattern integration

The application shell consumes the layout engine's resolved content padding and maximum content width instead of maintaining separate layout geometry constants.

Pattern CSS consumes layout variables for default page width and grid columns while preserving pattern-specific overrides where a product explicitly requests them.

## Integration order

1. Core resolves preferences, device context, layout mode, and interaction target.
2. Accessibility strengthens effective safeguards when needed.
3. Personalization combines requested and effective presentation state.
4. Device adaptation describes physical capability and viewport facts.
5. Layout resolves semantic geometry from the authoritative core layout mode.
6. Shape, components, patterns, shell, and product adapters consume the relevant semantic contracts.

## Principle

Layout should express structural capacity and hierarchy without confusing physical device facts with interface policy. Resolve the mode once, then let one layout engine own the shared geometry derived from it.
