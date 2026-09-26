# Material One Adaptive Components

## Purpose

Material One components are semantic systems, not isolated visual widgets. Component behavior is derived from the shared Material One context so the same interaction model can adapt across websites, applications, storefronts, tools, and future device classes.

## Canonical component state model

The canonical state vocabulary is owned by `@material-one/core` and consumed by `@material-one/components`:

- `default`
- `hovered`
- `focused`
- `pressed`
- `selected`
- `disabled`
- `loading`
- `success`
- `warning`
- `error`

Framework adapters should emit canonical values through `data-mo-state`.

For compatibility with the first component runtime prototype, core also accepts the legacy inputs `idle`, `hover`, `focus`, and `active`. They normalize to `default`, `hovered`, `focused`, and `pressed` before runtime attributes are emitted. New code should use canonical names.

## Adaptive context

A component contract inherits the current Material One context, including:

- layout mode
- density preference
- input method
- motion preference
- contrast preference
- text scale
- resolved interaction target

Compact layouts may reduce `spacious` component density to `comfortable` so large presentation spacing does not overwhelm narrow viewports. The Material One density vocabulary remains `compact`, `comfortable`, and `spacious` across core and components.

## Typed semantic contract

Component contracts do not accept arbitrary design-system strings. They are typed directly against the authoritative subsystem contracts:

- `SemanticColorRole` from `@material-one/semantic-colors`
- `TypographyRole` from `@material-one/typography`
- `MotionIntent` from `@material-one/motion`

This means a component cannot reference a misspelled or nonexistent semantic color, typography role, or motion intent without failing TypeScript validation.

The default component semantic contract uses `surfaceContainer`, `body`, and `feedback`.

State must never rely on color alone. Where meaning matters, pair color with text, iconography, shape, position, native semantics, or another redundant cue.

## Presentation bridge

`createComponentPresentation()` converts the typed component contract into framework-portable presentation metadata.

It emits:

- canonical `data-mo-component` and `data-mo-state` attributes
- resolved density, layout, input, and contrast attributes
- semantic-color, typography, and motion role attributes
- `--mo-component-semantic-color`
- `--mo-component-type-size`
- reduced/full/no-motion variables from the Material One motion subsystem

The output is intentionally plain attributes and CSS custom properties so React, Vue, Svelte, server-rendered HTML, browser extensions, and other adapters can consume the same contract without a framework-specific component dependency.

## Foundation recipes

The component package provides framework-independent recipes for:

- buttons
- surfaces
- cards
- fields
- navigation

These recipes remain intentionally small. Product-specific components should compose them rather than inventing parallel state, density, accessibility, semantic-color, typography, or motion systems.

## Styling contract

The shared component stylesheet recognizes `data-mo-state` and `data-mo-density` attributes on `.mo-component`. It provides baseline focus, selected, loading, disabled, success, warning, error, density, hover, and pressed behavior while preserving each component's own semantic styling.

Component transition timing can consume the motion variables emitted by the presentation bridge. Reduced-motion preferences therefore use the same semantic motion resolver as the rest of Material One instead of a separate component timing system.

## Integration

Components consume the Material One foundations in this order:

1. `@material-one/core` for adaptive context and canonical component state.
2. `@material-one/semantic-colors` for typed meaning-based color.
3. `@material-one/typography` for typed hierarchy and readability roles.
4. `@material-one/motion` for typed interaction intent and motion preference adaptation.
5. Component recipes for shape, elevation, targeting, and presentation.

Downstream GoreeWorks products should consume these current contracts from `GoreeWorks/material-one` rather than defining competing component state, semantic, typography, or motion vocabularies.
