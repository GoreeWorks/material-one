# Material One Semantic Colors

## Purpose

Material One uses semantic colors as a primary communication system.

Components and product patterns should request color by meaning, not by hue. A control should ask for `primary`, `surface`, `error`, `focus`, or `selection` rather than asking for blue, red, gray, or any other literal color.

This allows Material One to adapt themes, contrast, personalization, and device context without changing component meaning.

## Color Layers

Material One separates color into three layers.

### Brand and theme colors

These establish product identity through primary, secondary, tertiary, and surface families.

### Semantic colors

These communicate interface meaning:

- primary action
- secondary action
- tertiary emphasis
- background and surface hierarchy
- readable content on each surface
- focus
- selection
- disabled state
- links
- success
- warning
- error
- information

### Categorical color coding

Categorical colors distinguish peer groups, owners, series, filters, tags, priorities, and data categories.

Categorical colors must not replace semantic status colors.

## Semantic Pairs

Foreground and background roles are defined together.

Examples:

- `primary` / `onPrimary`
- `primaryContainer` / `onPrimaryContainer`
- `surface` / `onSurface`
- `error` / `onError`
- `errorContainer` / `onErrorContainer`

Components should not assume that a foreground which works on one semantic surface will work on another.

## Surfaces

Material One defines layered semantic surfaces:

1. Background
2. Surface
3. Subtle Surface
4. Container
5. High Container
6. Highest Container
7. Floating Surface
8. Inverse Surface

Surface roles express hierarchy without forcing every section into a card.

## Status Colors

Success, warning, error, and information each provide:

- base color
- readable foreground
- container color
- readable container foreground

Status must also include text, iconography, labels, or another non-color cue when it carries important meaning.

## Interaction Colors

Material One defines semantic roles for:

- focus
- selection
- selection container
- hover overlay
- pressed overlay
- disabled surface
- disabled content

These roles let interaction behavior remain consistent across products even when brand accents change.

## Light and Dark Schemes

Semantic roles are mapped independently for light and dark themes.

Dark theme is not a simple inversion. Material One selects different foregrounds, containers, status tones, outlines, and interaction colors to preserve hierarchy and contrast.

## Personalization

Products may override semantic roles through the Material One theme system.

Overrides should preserve the meaning of the role. A theme may change the visual value of `primary`, but it should not redefine `error` as a decorative category color or use `disabled` as an emphasis color.

## Accessibility

Material One validates required semantic foreground/background pairs at a minimum contrast ratio of 4.5:1.

Forced-colors mode may replace semantic values with system colors while preserving the role structure.

Semantic color never replaces semantic HTML, ARIA state, text, iconography, or other non-color communication.

## Implementation

Semantic roles are defined by:

- `tokens/material-one.tokens.json`
- `tokens/css/material-one.css`
- `@material-one/semantic-colors`

The semantic colors package provides:

- typed role names
- light and dark schemes
- semantic status pairs
- CSS variable mapping
- theme serialization support
- semantic surface and state utilities
