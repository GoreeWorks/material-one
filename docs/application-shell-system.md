# Material One Application Shell

The Application Shell composes Material One layout policy into the persistent frame around a product: top bar, primary navigation, main content, optional context pane, command surfaces, and overlays.

Core remains authoritative for effective layout mode. The Layout Engine remains authoritative for shared content geometry. The shell derives navigation and overlay presentation from those inputs and exposes the result through framework-portable metadata.

## Contract boundary

The Application Shell owns:

- primary navigation presentation
- top-bar height
- navigation geometry
- optional context-pane presentation
- command-surface presentation
- shell-specific content geometry aliases
- overlay presentation
- overlay modality and backdrop behavior
- shell and overlay portable presentation metadata

The shell does not reclassify viewport width or redefine Material One layout modes.

## Shell navigation

Primary navigation resolves from the authoritative layout mode:

- compact → bottom navigation
- expanded → navigation rail
- workspace → sidebar

The runtime presentation exposes this decision through `data-mo-shell-navigation` and CSS variables for navigation size.

Media queries remain progressive fallbacks for hosts that load the stylesheet without applying the typed presentation contract. Runtime attributes are placed after those fallbacks in the CSS cascade so explicit Material One layout overrides remain authoritative.

## Context pane

Persistent or contextual right-side content is available only in workspace layout.

Compact and expanded layouts resolve context presentation to `none`, even if a product asks for a context pane. This prevents a product-level option from exceeding the structural capacity of the current Material One layout.

The presentation exposes:

- `data-mo-shell-context`
- `--mo-shell-context-width`

## Command surface

Command and search presentation adapts by layout:

- compact → overlay
- expanded → inline
- workspace → anchored

Products may explicitly request a command-surface presentation through the existing shell options.

The presentation exposes `data-mo-shell-command-surface` so framework adapters can coordinate command UI without inventing a parallel breakpoint vocabulary.

## Shell presentation

`createApplicationShellPresentation()` returns the resolved recipe plus portable attributes and CSS variables.

Attributes include:

- `data-mo-shell`
- `data-mo-layout`
- `data-mo-shell-navigation`
- `data-mo-shell-context`
- `data-mo-shell-command-surface`

CSS variables include:

- `--mo-shell-topbar-height`
- `--mo-shell-nav-width`
- `--mo-shell-bottom-nav-height`
- `--mo-shell-context-width`
- `--mo-shell-content-padding`
- `--mo-shell-content-max`

## Overlay model

Material One overlays are requested by semantic kind and resolve into a concrete presentation.

Kinds:

- menu
- dialog
- sheet
- command
- notification

Presentations:

- popover
- dialog
- sheet
- fullscreen
- toast

The existing layout-aware resolution remains authoritative. Compact layouts can promote menus and dialogs into sheets, while command surfaces can become fullscreen.

## Overlay presentation

`createOverlayPresentation()` exposes:

- `data-mo-overlay-kind`
- `data-mo-overlay-presentation`
- `data-mo-overlay-modal`
- `data-mo-overlay-dismiss-backdrop`
- `--mo-overlay-max-width` when applicable

It also supplies recommended accessibility attributes:

- menu → `role="menu"`
- notification → `role="status"` and polite live announcement
- modal dialog/sheet/command → `role="dialog"` and `aria-modal="true"`

These attributes are presentation guidance. Product implementations remain responsible for complete keyboard, focus-management, and dismissal behavior appropriate to the chosen overlay.

## CSS integration

The shell stylesheet consumes typed navigation, context, and overlay presentation metadata after its viewport-based fallback rules.

This means an explicit compact/expanded/workspace preference can control shell structure even when the physical viewport alone would otherwise imply a different navigation arrangement.

Overlay presentation metadata can likewise turn a dialog surface into a sheet or fullscreen surface without duplicating layout logic in framework-specific code.

## Principle

The shell is a composition layer, not a second responsive system. Resolve layout once, derive shell structure from it, and expose the result through stable runtime metadata so every GoreeWorks product can implement the same frame consistently.
