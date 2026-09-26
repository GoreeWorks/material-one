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

## Semantic contract

Each adaptive component contract combines:

- a canonical component state
- a semantic color role
- a typography role
- a motion intent
- the resolved adaptive context

State must never rely on color alone. Where meaning matters, pair color with text, iconography, shape, position, native semantics, or another redundant cue.

## Foundation recipes

The component package currently provides framework-independent recipes for:

- buttons
- surfaces
- cards
- fields
- navigation

These recipes remain intentionally small. Product-specific components should compose them rather than inventing parallel state, density, accessibility, or motion systems.

## Styling contract

The shared component stylesheet recognizes `data-mo-state` and `data-mo-density` attributes on `.mo-component`. It provides baseline focus, selected, loading, disabled, success, warning, error, density, hover, and pressed behavior while preserving each component's own semantic styling.

Reduced-motion preferences remove component transforms and transitions through the existing Material One motion rules.

## Integration

Components consume the Material One foundations in this order:

1. `@material-one/core` for adaptive context and canonical component state.
2. Semantic tokens for meaning-based color.
3. Typography roles for hierarchy and readability.
4. Motion intents for interaction feedback.
5. Component recipes for shape, elevation, targeting, and presentation.

Downstream GoreeWorks products should import or synchronize these contracts from the current `GoreeWorks/material-one` source rather than defining competing state vocabularies.
