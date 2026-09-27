# Material One Architecture

## System Model

Material One is built as a layered adaptive interface system.

## Layers

1. Design Tokens
2. Color Intelligence System
3. Semantic Color System
4. Color Coding System
5. Theme Intelligence System
6. Data Visualization System
7. Typography Framework
8. Shape Framework
9. Layout Engine
10. Component System
11. Controls and Interactions
12. Product Patterns
13. Application Shell
14. Iconography System
15. Motion Framework
16. Skeleton Loading Framework
17. Accessibility Layer
18. Personalization Engine
19. Device Adaptation System

## Design Tokens

Design Tokens are the foundational value layer for Material One.

The canonical token data remains in `tokens/material-one.tokens.json`, while `tokens/css/material-one.css` is the browser-facing custom-property representation. The `@material-one/tokens` package wraps those sources with typed validation, deterministic token enumeration, canonical dotted paths, lookup, search, primitive-kind classification, CSS-variable traceability, and inventory manifests.

The token package does not copy values into a second registry. Higher-level systems such as Semantic Colors, Typography, Shape, Motion, Layout, Loading, and Accessibility continue to own semantic interpretation and adaptive policy.

## Color Intelligence System

Color Intelligence routes each color decision to one authoritative subsystem based on meaning.

Semantic interface roles and status meanings route to Semantic Colors. Peer identities, categories, workflows, and GoreeWorks priority levels route to Color Coding. Theme Intelligence may adapt the semantic scheme but does not redefine the meaning of a color request.

This boundary prevents status colors from becoming arbitrary category colors and prevents categorical identity from consuming success, warning, error, or information semantics.

## Semantic Colors

Semantic colors define meaning independently from literal hue. Material One components consume roles such as primary, surface, focus, selection, disabled, success, warning, error, and information. Each scheme supplies readable foreground/background pairs, layered surfaces, state colors, and interaction colors.

Light and dark schemes map the same semantic roles to different visual values. Product themes may override role values while preserving their meaning.

## Color Coding

Material One separates brand/theme color, semantic status, and categorical color coding.

Status colors are reserved for success, warning, error, and information. Categorical colors use a stable eight-code palette for identity, grouping, charts, filters, tags, and related information. Color coding must never be the only cue for meaning.

## Theme Intelligence

Theme Intelligence converts product identity and user accent inputs into adaptive semantic schemes.

Primary, secondary, and tertiary families may adapt to personalization. Success, warning, error, information, disabled, and other system-meaning roles keep their semantics.

Generated schemes are contrast-validated. High-contrast contexts may strengthen content contrast, outlines, and interaction overlays while preserving the same semantic role model.

## Data Visualization

Material One data visualization shares the same color architecture as the rest of the interface.

Peer data series use categorical color coding. Meaningful system states use semantic colors. A chart must not use a categorical palette to communicate error, warning, success, or information.

Visualizations combine:

- visible labels
- numerical values
- stable categorical colors
- redundant patterns
- semantic status roles
- keyboard focus
- accessible textual summaries
- forced-colors fallbacks
- reduced-motion behavior

This keeps chart meaning intact when palette perception, theme, device, or accessibility context changes.

## Adaptive Typography

Typography roles describe purpose rather than arbitrary size. Display, large title, section heading, title, body, label, and supporting text share a coherent hierarchy.

Large hierarchy roles adapt to compact, expanded, and workspace layouts. Body and utility text preserve their base scale instead of shrinking simply because a device is smaller.

User text scaling is independent of layout adaptation, and readable line-length contracts constrain overly wide text.

## Shape Framework

Material One separates raw shape tokens from semantic shape roles.

The token layer owns the stable geometry primitives: extra-small, small, medium, large, extra-large, and pill. The shape framework maps interface-purpose roles such as control, field, surface, card, navigation, floating surface, icon button, and chip onto those primitives.

Experience modes resolve into minimal, balanced, or expressive shape styles. This lets geometry adapt coherently without allowing each component to invent its own corner language. Compact layout may strengthen navigation enclosure while leaving other role mappings unchanged.

Components consume typed `ShapeRole` and `ShapeToken` contracts. Framework-portable presentation exposes `data-mo-shape-style` and semantic CSS aliases while raw token meaning remains stable.

## Layout Engine

Core owns effective layout-mode selection: compact, expanded, or workspace. The Layout Engine consumes that resolved mode and owns the shared geometry derived from it.

The layout layer defines content padding and width, automatic grid columns, column capacity, minimum useful column width, pane strategy, and secondary/context-pane availability. It does not reclassify physical viewport width or create a second layout preference vocabulary.

Application Shell and Product Patterns consume these contracts so responsive geometry remains centralized. Device Adaptation continues to describe physical viewport and capability facts independently from interface layout policy.

## Controls and Interactions

Controls are specialized adaptive components and share the canonical Material One component state vocabulary rather than maintaining a parallel interaction model.

The controls layer owns recipes for toggles, sliders, segmented controls, tabs, chips, data tables, pagination, progress, and disclosure behavior. Recipes inherit the core interaction target, layout, input method, density, and motion preference.

`createControlPresentation()` extends the component presentation bridge with control-specific metadata while preserving canonical `data-mo-state`, semantic color, typography, motion, and shape contracts. This keeps framework adapters and CSS aligned with the same runtime state language used by the Component System.

## Product Patterns

Product Patterns compose lower-level Material One contracts into reusable page-scale structures.

The pattern layer owns page-width intent, page-header presentation, adaptive product-grid intent, master/detail sequencing, settings navigation structure, and catalog filter placement. Core remains authoritative for effective layout mode, while the Layout Engine remains authoritative for structural capacity and column limits.

Typed pattern presentation metadata allows products to honor explicit Material One layout overrides even when raw viewport media queries would imply a different arrangement. Existing CSS media queries remain progressive fallbacks for hosts that do not apply runtime metadata.

## Semantic Motion

Motion is organized by intent rather than by component-specific animation constants.

Material One defines instant, feedback, enter, exit, navigation, transform, emphasis, and loading motion intents. Each intent has a duration, easing, spatial distance, scale behavior, opacity behavior, and accessibility policy.

Reduced motion removes non-essential spatial movement and scaling while preserving short essential interaction feedback. No Motion disables animation and transition behavior entirely while preserving state through other cues.

## Loading Model

Predictable content uses skeleton loading that preserves the final layout. Material One applies a short delay before skeletons appear, keeps visible skeletons on screen long enough to avoid flicker, and disables shimmer for reduced-motion contexts.

## Personalization Engine

Personalization is an orchestration layer over existing Material One contracts. Core retains ownership of requested user preferences and device-derived context. Accessibility then resolves effective safeguards. Personalization combines both into a framework-portable profile containing requested and effective presentation state.

Products may limit which settings controls they expose, but capability policy never weakens the effective accessibility policy. Theme, color, typography, shape, motion, and other subsystem-specific choices continue to use their authoritative typed contracts rather than parallel personalization strings.

## Device Adaptation System

Device adaptation describes the physical and capability environment after core has resolved the authoritative Material One context.

The device adaptation layer preserves the distinction between:

- physical viewport class and interface layout
- primary input and broader hardware capability
- known capability and unknown capability
- one continuous viewport and segmented or foldable viewports
- ordinary browser presentation and installed or fullscreen presentation

It normalizes safe-area insets, pixel ratio, pointer and hover capability, keyboard and touch capability, display mode, and viewport segments into framework-portable presentation metadata.

Core remains authoritative for layout resolution and interaction targets. Accessibility remains authoritative for effective safeguards. Personalization remains authoritative for requested-versus-effective preference orchestration. Device adaptation adds environmental facts without redefining those systems.

## Adaptive Experience

Material One adapts based on:

- device capabilities
- screen dimensions
- input method
- user preferences
- accessibility requirements
- task complexity

## Experience Modes

- Minimal
- Expressive
- Professional
- Creative
- Focused
- Accessibility
