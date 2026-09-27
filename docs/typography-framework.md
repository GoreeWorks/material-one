# Material One Adaptive Typography Framework

Typography communicates hierarchy and reading purpose through semantic roles while adapting to the authoritative Material One layout, density, and effective accessibility text scale.

The typography package preserves its existing low-level role/context APIs for compatibility and adds an adaptive policy/presentation layer over Core and Accessibility.

## Contract boundary

Typography owns:

- semantic typography roles
- role-specific size, line height, weight, tracking, and readable line length
- structural scaling for large hierarchy roles
- typography presentation metadata
- typography implementation values

Core owns:

- effective layout mode
- density preference
- requested accessibility text scale

Accessibility owns:

- effective text scale after clamping and accessibility policy resolution

Typography does not maintain a separate layout, density, or accessibility preference vocabulary.

## Semantic roles

Material One defines:

- display
- large title
- section heading
- title
- body
- label
- supporting

Roles describe purpose rather than arbitrary type size.

Body, label, and supporting text preserve their structural base size across layout modes. Larger hierarchy roles adapt to layout and density.

## Text-scale range

The canonical Material One text-scale range is:

- minimum: 0.8
- maximum: 2.0

The design token source, Accessibility policy, and Typography runtime use the same range.

This removes the earlier mismatch where Accessibility allowed 0.8 while Typography silently clamped to 0.9.

## Effective text scale

`createTypographyPolicy()` exposes:

- requested text scale from Core preferences
- effective text scale from Accessibility
- whether Accessibility constrained the request
- effective layout
- density

`resolveAdaptiveTypographyRole()` always uses the effective Accessibility text scale.

Products therefore cannot accidentally bypass accessibility clamping by passing the original preference directly into typography.

## Layout and density

Core's resolved compact, expanded, or workspace layout controls structural scaling for large hierarchy roles.

Density provides a small structural adjustment to those same hierarchy roles.

Body and utility text do not shrink merely because a layout becomes compact.

Explicit Material One layout preferences remain authoritative even when physical viewport width would imply a different automatic layout.

## Readability

Material One preserves readable line-length contracts:

- display: 18ch
- large title: 24ch
- section heading: 34ch
- title: 28ch
- body: 72ch
- label: 42ch
- supporting: 58ch

Text scaling changes font size without removing these line-length bounds.

## Presentation

`createTypographyPresentation()` emits:

- `data-mo-type-role`
- `data-mo-layout`
- `data-mo-density`
- `data-mo-text-scale-requested`
- `data-mo-text-scale`
- `data-mo-text-scale-constrained`

It also emits implementation CSS variables for:

- effective font size
- line height
- weight
- tracking
- readable maximum line length

## CSS integration

The typography stylesheet retains viewport media queries as progressive fallbacks.

Runtime `data-mo-layout` selectors follow those fallbacks so explicit Material One layout policy can remain authoritative.

Runtime `data-mo-contrast="high"` strengthens supporting-text color without depending only on `prefers-contrast`.

Elements carrying `data-mo-type-role` consume the exact effective typography values emitted by TypeScript.

## Compatibility

Existing low-level APIs remain available:

- `resolveTypographyRole()`
- `resolveTypographyScale()`
- `readableLineLength()`
- `typographyCssVariable()`
- `typographyStyle()`

The package-local layout and density names now alias Core's canonical types rather than maintaining duplicate unions.

## Principle

Define text purpose once, resolve accessibility once, and render typography from the effective Material One context rather than reconstructing layout, density, or text-scale policy inside each product.
