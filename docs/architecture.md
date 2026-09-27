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

## Theme Runtime Bridge

The Themes package is the runtime projection layer for semantic themes rather than an independent color authority.

Semantic Colors owns the canonical role vocabulary and base light/dark schemes. Theme Intelligence owns adaptive generation and contrast validation. The Themes package resolves legacy theme input into those semantic roles, applies explicit semantic overrides last, and derives both modern `--mo-sem-*` variables and legacy compatibility aliases from the same resolved scheme.

New themes should use complete semantic schemes or `createAdaptiveTheme()`. Legacy `MaterialOneThemeColors` input remains supported only as a migration boundary. `createThemePresentation()` validates the resolved semantic scheme before emitting runtime metadata, while named theme registries provide deterministic lookup for products and framework adapters.

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

## Adaptive Typography Framework

Typography roles describe purpose rather than arbitrary size. Display, large title, section heading, title, body, label, and supporting text share a coherent hierarchy.

Core owns the resolved compact, expanded, or workspace layout, density preference, and requested accessibility text scale. Accessibility owns the effective text scale after applying the canonical 0.8–2.0 range. Typography consumes those authoritative values rather than maintaining independent layout, density, or accessibility preference unions.

Large hierarchy roles adapt to layout and density. Body and utility text preserve their structural base scale instead of shrinking simply because a device is smaller. Text scaling then applies independently across every role.

`createTypographyPolicy()` exposes requested versus effective text scale and whether Accessibility constrained the request. `resolveAdaptiveTypographyRole()` and `createTypographyPresentation()` use the effective Accessibility value and emit portable runtime metadata and implementation CSS variables.

Readable line-length contracts constrain overly wide text, while runtime layout and contrast selectors follow viewport/environment fallbacks so explicit Material One policy remains authoritative.

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

## Application Shell

The Application Shell composes the effective Material One layout into the persistent product frame.

Primary navigation resolves to bottom navigation in compact layout, a rail in expanded layout, and a sidebar in workspace layout. Context panes are available only when the workspace layout has structural capacity for them. Command surfaces adapt independently as overlay, inline, or anchored presentation.

`createApplicationShellPresentation()` exposes navigation, context, command-surface, top-bar, navigation-size, content, and context-pane geometry through portable data attributes and CSS variables. Runtime selectors follow viewport media-query fallbacks in the cascade so an explicit Material One layout preference remains authoritative even when physical viewport width would imply another shell.

Overlay kind remains semantic—menu, dialog, sheet, command, or notification—while layout resolves the concrete popover, dialog, sheet, fullscreen, or toast presentation. `createOverlayPresentation()` adds portable modality, backdrop, max-width, and recommended accessibility metadata while products retain responsibility for complete focus management and keyboard behavior.

## Iconography System

Iconography defines the shared visual and semantic contract for Material One interface icons.

Icons use a canonical 24 × 24 geometry grid, semantic size classes, outline or filled style, and light, regular, or bold weight. Definitions may expose named state geometry and opt into right-to-left mirroring when horizontal direction is semantically meaningful.

Icon purpose controls accessibility behavior. Decorative icons are hidden from assistive technology, while informative, action, navigation, and status icons require an accessible label. When an icon appears inside an already-labelled control, the control should normally own the accessible name and the icon should use decorative purpose.

Typed registries enforce unique names, and `createIconPresentation()` emits portable state, size, weight, purpose, direction, mirroring, accessibility, and CSS-variable metadata. Semantic color remains owned by the surrounding Material One component through `currentColor`.

## Adaptive Motion Framework

Motion is organized by intent rather than by component-specific animation constants.

Material One defines instant, feedback, enter, exit, navigation, transform, emphasis, and loading intents. Core owns the canonical requested motion preference vocabulary. Accessibility owns the effective preference after platform and user safeguards are combined. Motion owns the semantic recipes derived from that effective value.

`createMotionPolicy()` exposes requested versus effective motion and whether Accessibility constrained the request. `createAdaptiveMotionPresentation()` emits the resolved recipe plus portable runtime attributes and CSS variables, preventing products from accidentally re-enabling decorative movement after an accessibility reduction.

Reduced motion removes non-essential spatial movement and scaling while preserving short essential feedback. No Motion disables animation and transition behavior entirely while preserving state through other cues.

## Adaptive Loading Framework

Loading is a presentation-orchestration layer over Core and Accessibility rather than a parallel preference system.

Intent, expected latency, known geometry, stale-content availability, and busy state determine whether the interface uses no placeholder, skeletons, progress feedback, or visible stale content. Core supplies the canonical density preference. Accessibility supplies the effective motion policy after user and platform requirements are combined.

`createLoadingProfile()` produces the resolved loading presentation, optional skeleton recipe, and optional density-aware blueprint. `createLoadingPresentation()` and `createSkeletonPresentation()` expose portable metadata and CSS variables while keeping decorative skeleton geometry out of the accessibility tree. Existing low-level loading helpers remain compatible.

Runtime loading metadata can disable reveal/shimmer motion even when media-query signals are unavailable. CSS media queries remain progressive environmental fallbacks for reduced motion, compact viewports, and forced-colors mode.

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
