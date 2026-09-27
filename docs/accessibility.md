# Material One Accessibility Layer

## Purpose

Accessibility is a first-class adaptive subsystem in Material One. It translates user preferences, Material One context, and platform accessibility signals into a portable policy that downstream products can apply consistently.

The accessibility layer does not replace native semantics or product-specific accessibility testing. It coordinates shared Material One behavior so components, shells, patterns, and future personalization features do not invent separate accessibility rules.

## Inputs

`createAccessibilityPolicy()` combines:

- the current `MaterialOneContext`
- user contrast and text-scale preferences
- reduced-transparency preference
- Material One motion preference
- accessibility experience mode
- platform reduced-motion signals
- platform higher-contrast signals
- platform reduced-transparency signals
- forced-colors state

Platform signals can strengthen accessibility behavior but do not increase motion beyond the user's Material One preference.

## Resolved policy

The runtime resolves:

- standard or enhanced accessibility mode
- standard or high contrast
- bounded text scale
- reduced-transparency behavior
- full, reduced, or no-motion behavior
- minimum interaction-target size
- focus-ring width and offset
- forced-colors state
- redundant-cue requirement

The redundant-cue requirement is always enabled. Color must never be the only carrier of meaning in Material One.

## Presentation bridge

`createAccessibilityPresentation()` exposes framework-portable attributes and CSS variables:

- `data-mo-accessibility`
- `data-mo-contrast`
- `data-mo-motion`
- `data-mo-transparency`
- `data-mo-forced-colors`
- `--mo-a11y-text-scale`
- `--mo-a11y-min-target`
- `--mo-a11y-focus-ring-width`
- `--mo-a11y-focus-ring-offset`

These outputs can be applied to a product root, application shell, region, or adapter boundary.

## Interaction target audits

`auditInteractionTarget()` compares an actual target dimension to the target resolved by Material One core. This keeps the accessibility layer aligned with device input, density, and accessibility experience mode instead of introducing a separate sizing vocabulary.

## Assistive announcements

`createLiveRegionAttributes()` provides explicit polite and urgent live-region contracts for asynchronous feedback. Products should still provide concise, meaningful announcement text and avoid announcing decorative or redundant updates.

## CSS primitives

The accessibility stylesheet provides shared focus treatment and media-query adaptation for:

- reduced motion
- increased contrast
- forced colors
- reduced transparency

Downstream products should consume these primitives with native HTML semantics, keyboard support, accessible names, correct reading order, and product-specific testing.

## Integration order

Accessibility consumes Material One core context and should be resolved before higher-level personalization chooses optional presentation changes.

1. Core context
2. Accessibility policy
3. Personalization
4. Components, patterns, and shell presentation

This order ensures personalization cannot silently weaken accessibility requirements.
