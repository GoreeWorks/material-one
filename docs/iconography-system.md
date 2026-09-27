# Material One Iconography System

Material One iconography defines a consistent visual, semantic, directional, and accessibility contract for interface icons.

The icon package owns the canonical 24 × 24 geometry grid, outline/filled styles, weight-to-stroke mapping, icon-state geometry, semantic purpose, runtime presentation metadata, RTL mirroring policy, registry integrity, and icon-specific accessibility behavior.

## Geometry

Material One icons use:

- 24 × 24 canvas
- 20-unit live area
- 2-unit optical padding
- 1.75 default regular stroke
- soft-geometric corner language

Icons may use outline or filled presentation. Outline icons inherit the Material One weight-to-stroke contract. Filled icons use the same geometry but render with fill rather than stroke.

## Weight

Material One supports three icon weights:

- light → 1.5
- regular → 1.75
- bold → 2.25

Weight is a presentation contract and does not change the semantic identity of the icon.

## Size

Material One exposes semantic icon sizes:

- compact → 18px
- standard → 24px
- large → 32px
- display → 48px

The standard size matches the native icon canvas.

## Purpose

Icon purpose determines accessibility treatment:

- decorative
- informative
- action
- navigation
- status

Decorative icons are hidden from the accessibility tree.

Informative, action, navigation, and status icons require an accessible label from either the icon definition or the presentation request. If no label exists, Material One rejects the presentation rather than silently exposing an unnamed graphic.

When an icon appears inside an already-labelled control, the icon should normally use decorative purpose so the control owns the accessible name.

## State geometry

An icon may define named geometry states, such as active, selected, expanded, collapsed, connected, or disconnected.

State geometry changes the rendered path set without changing the icon's semantic identity. Unknown state requests fall back to the base geometry.

State names must be unique within one icon definition.

## Direction and RTL

Directional icons declare `mirrorInRtl: true` when horizontal direction should reverse in right-to-left interfaces.

Mirroring is opt-in at the definition level. Material One does not mirror every icon globally because symbols such as media controls, logos, clocks, and many status marks may have fixed visual direction.

## Registry

`createMaterialOneIconRegistry()` creates a named icon registry and rejects duplicate icon names.

`getMaterialOneIcon()` retrieves one definition by canonical name and throws for missing icons. This gives products a deterministic runtime surface rather than requiring ad hoc array searches.

## Framework-portable presentation

`createIconPresentation()` resolves:

- state geometry
- semantic purpose
- icon size
- stroke width
- text direction
- RTL mirroring
- accessibility metadata

It emits portable attributes including:

- `data-mo-icon`
- `data-mo-icon-style`
- `data-mo-icon-weight`
- `data-mo-icon-purpose`
- `data-mo-icon-size`
- `data-mo-icon-state`
- `data-mo-icon-mirrored`

It also emits:

- `--mo-icon-size`
- `--mo-icon-stroke-width`

The package stylesheet consumes these contracts while preserving `currentColor` so semantic color remains owned by the surrounding Material One component or context.

## Validation

`defineMaterialOneIcon()` rejects empty names, empty base geometry, blank path data, duplicate state names, or states without geometry.

Runtime tests cover geometry, state fallback, weight and size resolution, registry behavior, accessibility purpose, and directional mirroring.

## Principle

Icons communicate through consistent geometry and purpose, not isolated SVG styling. Keep visual language centralized, make directional behavior explicit, and ensure meaningful icons always have a non-visual accessible name.
