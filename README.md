# Material One Design Language

Material One is an adaptive, human-centered User Interface Design Language created by GoreeWorks.

> A unified adaptive interface system where digital experiences continuously adjust to the human, device, and context while maintaining clarity, consistency, and usability.

## Vision

Material One transforms interfaces from static visual layers into intelligent systems that respond to:

- user identity and preferences
- device environment
- interaction method
- accessibility needs
- workflow context

## Core Principles

### Adaptive
Interfaces intelligently transform around screen size, input method, orientation, environment, settings, and workflow requirements.

### Human-Centered
Design decisions consider reachability, comfort, attention, cognitive load, visual clarity, and interaction speed.

### Expressive
Interfaces communicate through color, motion, typography, shape, depth, and spatial relationships.

### Personal
Users can customize themes, density, typography, motion, layouts, and accessibility preferences.

### Consistent
The same system applies across mobile, tablet, desktop, wearable, embedded, and future device categories.

## Architecture

```
Material One
├── Design Tokens
├── Color Intelligence System
├── Semantic Color System
├── Color Coding System
├── Theme Intelligence System
├── Data Visualization System
├── Typography Framework
├── Shape Framework
├── Layout Engine
├── Component System
├── Controls and Interactions
├── Application Shell
├── Iconography System
├── Motion Framework
├── Skeleton Loading Framework
├── Accessibility Layer
├── Personalization Engine
└── Device Adaptation System
```

## Implementation Packages

```
packages/
├── tokens/             Typed validation, lookup, inventory, and CSS tracing for canonical design tokens
├── core/               Adaptive context and preference engine
├── components/         Component recipes and CSS primitives
├── controls/           Canonical-state selection, form, data, disclosure, and feedback controls
├── color-intelligence/ Color-purpose routing across semantic, status, categorical, and priority systems
├── semantic-colors/    Semantic roles, schemes, status pairs, and interaction colors
├── color-coding/       Categorical color coding and data color intelligence
├── theme-intelligence/ Adaptive semantic theme generation and contrast validation
├── data-visualization/ Accessible chart encodings, patterns, legends, and data states
├── typography/         Core-layout, Accessibility-effective semantic typography and presentation
├── shape/              Semantic shape roles, adaptive geometry, and CSS aliases
├── layout/             Adaptive geometry, columns, pane strategy, and layout presentation
├── motion/             Semantic motion intents and reduced-motion adaptation
├── loading/            Accessibility-aware loading orchestration, skeletons, and progressive feedback
├── patterns/           Typed page, grid, master/detail, settings, and catalog patterns
├── shell/              Typed navigation, context, command, overlay, and shell presentation
├── themes/             Semantic theme contracts and CSS-variable generation
├── icons/              Icon geometry and state contracts
├── accessibility/      Adaptive accessibility policy, focus, target, and assistive contracts
├── personalization/    Requested/effective preference orchestration and presentation
└── device-adaptation/  Device capability, viewport, safe-area, and presentation contracts

tokens/
├── material-one.tokens.json
└── css/
    └── material-one.css
```

## Product Scope

Material One is intended to provide the shared interface foundation for GoreeWorks:

- websites
- applications
- dashboards
- ecommerce experiences
- services
- themes
- icon systems
- professional tools
- future device experiences

Products may have their own identity while extending the same Material One behavioral and semantic foundation.

## Design Tokens

Material One keeps token values in one canonical JSON source and one canonical CSS representation. The `@material-one/tokens` package adds typed validation, deterministic enumeration, dotted-path lookup, primitive-kind classification, token inventory manifests, and CSS-variable traceability without duplicating token values into another registry. Its stylesheet export wraps the canonical token CSS so runtime and browser consumers can use one named package boundary.

## Color Intelligence

Color Intelligence routes a color decision to the correct authoritative subsystem. Interface roles and status meanings remain semantic; peer identity, categories, workflows, and GoreeWorks priority remain categorical. The runtime emits typed source/intent metadata and shared presentation aliases while preserving required redundant cues whenever hue carries user-relevant meaning. GoreeWorks priority uses the authoritative Horizon, Current, Pulse, Beacon, Surge, and Apex vocabulary rather than generic low/medium/high labels.

## Semantic Colors

Semantic colors are a first-class Material One communication layer. Components request colors by meaning rather than hue: primary, surface, focus, selection, disabled, success, warning, error, and information. Light and dark schemes map those roles independently, and required foreground/background pairs are validated for contrast. Theme overrides may change a role's visual value without changing its meaning.

## Color Coding

Color coding is a separate first-class Material One communication layer. Categorical colors stay stable for the same identity or category, while status colors remain reserved for success, warning, error, and information. The color intelligence runtime can assign deterministic colors, spread small category sets across the palette, and map ordinal priority without changing status semantics. Color must always be reinforced by text, iconography, shape, position, or another non-color cue.

## Theme Intelligence

Theme Intelligence adapts Material One semantic schemes from product or user accent colors while preserving the meaning of success, warning, error, information, disabled, and other system roles. Generated themes validate required contrast and can strengthen muted content, outlines, and interaction overlays in high-contrast contexts.

## Theme Runtime

The Themes package is now a semantic-first runtime bridge rather than a second color model. Theme Intelligence generates validated semantic schemes, Semantic Colors owns the role vocabulary, and `@material-one/themes` resolves named themes into one authoritative scheme before emitting `--mo-sem-*` variables and legacy CSS aliases. Existing `colors` theme input remains supported only as a migration boundary; explicit semantic overrides win, adaptive themes can be generated directly from Theme Intelligence seeds, and runtime presentation includes validation, registry, and portable theme metadata.

## Data Visualization

Data visualization uses categorical Material One color coding for peer series and semantic colors for meaningful states. Charts pair color with labels, values, patterns, focus treatment, and accessible summaries so information remains understandable when color perception, forced-colors mode, or display conditions change.

## Adaptive Typography

Typography uses semantic roles rather than arbitrary font sizes. Core owns the resolved compact/expanded/workspace layout, density, and requested text scale; Accessibility owns the effective text scale after clamping; Typography owns semantic role geometry and presentation derived from those values. `createTypographyPolicy()` exposes requested/effective scale and whether Accessibility constrained it, while `createTypographyPresentation()` emits portable role/layout/density/scale metadata and implementation values. The canonical text-scale range is now aligned at 0.8–2.0 across tokens, Accessibility, and Typography. Body and utility text preserve structural readability while large hierarchy roles adapt to layout and density.

## Semantic Shape

Shape is organized by interface purpose rather than component-specific radius constants. Stable raw tokens feed semantic roles for controls, fields, surfaces, cards, navigation, floating surfaces, icon buttons, and chips. Experience modes resolve to minimal, balanced, or expressive geometry, while compact layouts can strengthen navigation enclosure independently. Components consume typed shape roles and tokens, and framework adapters can apply portable semantic CSS aliases.

## Adaptive Layout

Core selects the authoritative compact, expanded, or workspace layout mode. The Layout Engine turns that mode into shared structural geometry: content padding and width, adaptive grid columns and capacity, minimum useful column widths, pane strategy, and secondary/context-pane availability. Application shell and product patterns consume the same layout contracts so responsive structure does not drift into component-specific breakpoint logic.

## Controls and Interactions

Controls specialize the canonical Material One component contract for selection, input, navigation, data, feedback, and disclosure. Control state now aliases the shared component state vocabulary—including hovered—and `createControlPresentation()` extends the component presentation bridge with control-specific checked, orientation, presentation, placement, selection, table, pagination, and progress metadata plus adaptive target-size CSS variables.

## Product Patterns

Product Patterns compose Material One contracts at page scale. Typed recipes cover page width/header structure, adaptive grids, master/detail flows, settings navigation, and catalog filtering. Patterns derive structural decisions from the authoritative core layout mode and Layout Engine, then expose portable attributes and CSS variables so explicit layout overrides do not get lost behind viewport-only media queries.

## Application Shell

The Application Shell composes the authoritative Material One layout mode into top bar, primary navigation, main content, optional context pane, command surfaces, and overlays. `createApplicationShellPresentation()` emits runtime navigation, context, command, and geometry metadata so explicit compact/expanded/workspace choices can override viewport-only fallbacks. `createOverlayPresentation()` exposes presentation, modality, backdrop behavior, max-width, and recommended accessibility metadata for menus, dialogs, sheets, commands, and notifications.

## Iconography

Material One iconography uses a canonical 24 × 24 soft-geometric grid with semantic compact, standard, large, and display sizes plus light, regular, and bold weight contracts. Icon definitions can expose named geometry states and opt into RTL mirroring. `createIconPresentation()` resolves purpose, size, weight, state, direction, accessibility metadata, and portable CSS variables; meaningful icons require an accessible label, while decorative icons are hidden from the accessibility tree. Registries reject duplicate icon names.

## Adaptive Motion

Motion is organized by semantic intent: instant, feedback, enter, exit, navigation, transform, emphasis, and loading. Core owns the canonical requested motion preference, while Accessibility owns the effective preference after platform and user safeguards are combined. `createAdaptiveMotionPresentation()` resolves recipes from that effective policy and exposes portable intent, requested/effective state, accessibility-constraint metadata, and implementation CSS variables. Reduced motion removes decorative spatial movement while retaining very short essential feedback; no-motion disables every animation while preserving state through other cues.

## Adaptive Accessibility

Accessibility is resolved as an adaptive Material One policy rather than a collection of component-specific exceptions. The accessibility runtime combines the current Material One context with platform signals for reduced motion, higher contrast, reduced transparency, and forced colors. It produces portable data attributes and CSS variables, preserves the core interaction-target contract, provides target-size audits and assistive live-region helpers, and requires redundant non-color cues for meaning. Accessibility resolves before higher-level personalization so optional presentation choices cannot silently weaken user accessibility requirements.

## Personalization Orchestration

Personalization combines requested Material One preferences with the effective accessibility policy instead of creating a second preference vocabulary. The runtime preserves requested settings for user-facing controls while exposing effective motion, contrast, text scale, transparency, layout, density, and interaction-target behavior for products and framework adapters. Typed control capability state lets a product expose only the personalization controls it supports while accessibility remains authoritative.

## Device Adaptation System

Device adaptation formalizes the physical and capability environment around the core Material One context without creating a second layout system. The runtime distinguishes physical device class from interface layout, preserves mixed-input and unknown-capability states, normalizes safe-area insets and segmented viewports, and emits portable data attributes and CSS variables for framework adapters. Core remains authoritative for layout and interaction-target resolution while the device layer describes what the host environment actually knows.

## Adaptive Components

Material One uses one canonical component-state vocabulary across core runtime attributes and component recipes: default, hovered, focused, pressed, selected, disabled, loading, success, warning, and error. Adaptive component contracts inherit layout, density, input method, motion preference, contrast preference, text scale, and interaction-target sizing from the current Material One context. Component semantic color, typography, motion, and shape fields are typed directly against their authoritative Material One subsystems, and `createComponentPresentation()` converts those contracts into portable data attributes and CSS variables for framework adapters. Legacy runtime inputs from the first prototype are normalized before `data-mo-state` is emitted so downstream products can migrate without maintaining a second interaction language.

## Adaptive Loading

Loading is resolved from intent, latency, known geometry, stale-content availability, and the authoritative Material One context. `createLoadingProfile()` consumes the effective Accessibility motion policy so operating-system or user reduced-motion requirements cannot be bypassed by skeleton behavior, while blueprint density comes directly from Core. The runtime chooses between no placeholder, skeleton, progress, and stale-content presentation; skeleton geometry is hidden from the accessibility tree and the loading region carries busy/live semantics through portable metadata. Existing low-level skeleton helpers remain supported.

## Engineering Quality

Material One is validated through GitHub Actions across supported Node versions and GitHub-hosted Linux, Windows, and macOS runners. CI checks repository structure, design-token source integrity and typed token contracts, semantic-token contrast, color intelligence routing, theme intelligence, semantic-first theme runtime behavior, visualization behavior, accessibility-aware adaptive typography, accessibility-aware semantic motion, adaptive accessibility policy and CSS behavior, personalization orchestration, device adaptation, semantic shape behavior, adaptive layout behavior, typed product patterns, canonical control presentation, iconography accessibility and RTL behavior, application-shell presentation and overlay behavior, adaptive loading orchestration and accessibility-aware motion, TypeScript contracts, runtime behavior, package integrity, and generated implementation manifests. CodeQL performs JavaScript and TypeScript security analysis.

## Status

Active foundational implementation. Design tokens, core adaptation, color intelligence, semantic colors, categorical color coding, theme intelligence, accessible data visualization, adaptive typography, semantic shape, adaptive layout, typed product patterns, semantic motion, components, controls, adaptive loading, themes, the typed iconography system, the adaptive accessibility runtime, personalization orchestration, device adaptation runtime, and the adaptive application shell are under development.

## License

Copyright © GoreeWorks
