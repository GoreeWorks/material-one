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
├── core/               Adaptive context and preference engine
├── components/         Component recipes and CSS primitives
├── controls/           Selection, form, data, disclosure, and feedback controls
├── semantic-colors/    Semantic roles, schemes, status pairs, and interaction colors
├── color-coding/       Categorical color coding and data color intelligence
├── theme-intelligence/ Adaptive semantic theme generation and contrast validation
├── data-visualization/ Accessible chart encodings, patterns, legends, and data states
├── typography/         Adaptive semantic typography and readable scaling
├── shape/              Semantic shape roles, adaptive geometry, and CSS aliases
├── motion/             Semantic motion intents and reduced-motion adaptation
├── loading/            Skeleton loading and progressive loading behavior
├── patterns/           Adaptive page and product patterns
├── shell/              Navigation, workspace shell, commands, and overlays
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

## Semantic Colors

Semantic colors are a first-class Material One communication layer. Components request colors by meaning rather than hue: primary, surface, focus, selection, disabled, success, warning, error, and information. Light and dark schemes map those roles independently, and required foreground/background pairs are validated for contrast. Theme overrides may change a role's visual value without changing its meaning.

## Color Coding

Color coding is a separate first-class Material One communication layer. Categorical colors stay stable for the same identity or category, while status colors remain reserved for success, warning, error, and information. The color intelligence runtime can assign deterministic colors, spread small category sets across the palette, and map ordinal priority without changing status semantics. Color must always be reinforced by text, iconography, shape, position, or another non-color cue.

## Theme Intelligence

Theme Intelligence adapts Material One semantic schemes from product or user accent colors while preserving the meaning of success, warning, error, information, disabled, and other system roles. Generated themes validate required contrast and can strengthen muted content, outlines, and interaction overlays in high-contrast contexts.

## Data Visualization

Data visualization uses categorical Material One color coding for peer series and semantic colors for meaningful states. Charts pair color with labels, values, patterns, focus treatment, and accessible summaries so information remains understandable when color perception, forced-colors mode, or display conditions change.

## Adaptive Typography

Typography uses semantic roles rather than arbitrary font sizes. Display, large title, section heading, title, body, label, and supporting text adapt to layout and user text scale while preserving body readability, line-height, and maximum readable line lengths.

## Semantic Shape

Shape is organized by interface purpose rather than component-specific radius constants. Stable raw tokens feed semantic roles for controls, fields, surfaces, cards, navigation, floating surfaces, icon buttons, and chips. Experience modes resolve to minimal, balanced, or expressive geometry, while compact layouts can strengthen navigation enclosure independently. Components consume typed shape roles and tokens, and framework adapters can apply portable semantic CSS aliases.

## Semantic Motion

Motion is organized by intent: instant, feedback, enter, exit, navigation, transform, emphasis, and loading. Full, reduced, and no-motion preferences share the same state model. Reduced motion removes decorative spatial movement while retaining very short essential feedback when needed to communicate a direct action.

## Adaptive Accessibility

Accessibility is resolved as an adaptive Material One policy rather than a collection of component-specific exceptions. The accessibility runtime combines the current Material One context with platform signals for reduced motion, higher contrast, reduced transparency, and forced colors. It produces portable data attributes and CSS variables, preserves the core interaction-target contract, provides target-size audits and assistive live-region helpers, and requires redundant non-color cues for meaning. Accessibility resolves before higher-level personalization so optional presentation choices cannot silently weaken user accessibility requirements.

## Personalization Orchestration

Personalization combines requested Material One preferences with the effective accessibility policy instead of creating a second preference vocabulary. The runtime preserves requested settings for user-facing controls while exposing effective motion, contrast, text scale, transparency, layout, density, and interaction-target behavior for products and framework adapters. Typed control capability state lets a product expose only the personalization controls it supports while accessibility remains authoritative.

## Device Adaptation System

Device adaptation formalizes the physical and capability environment around the core Material One context without creating a second layout system. The runtime distinguishes physical device class from interface layout, preserves mixed-input and unknown-capability states, normalizes safe-area insets and segmented viewports, and emits portable data attributes and CSS variables for framework adapters. Core remains authoritative for layout and interaction-target resolution while the device layer describes what the host environment actually knows.

## Adaptive Components

Material One uses one canonical component-state vocabulary across core runtime attributes and component recipes: default, hovered, focused, pressed, selected, disabled, loading, success, warning, and error. Adaptive component contracts inherit layout, density, input method, motion preference, contrast preference, text scale, and interaction-target sizing from the current Material One context. Component semantic color, typography, motion, and shape fields are typed directly against their authoritative Material One subsystems, and `createComponentPresentation()` converts those contracts into portable data attributes and CSS variables for framework adapters. Legacy runtime inputs from the first prototype are normalized before `data-mo-state` is emitted so downstream products can migrate without maintaining a second interaction language.

## Skeleton Loading

Skeleton loading is the preferred loading treatment for content whose final layout is predictable. Skeletons preserve layout to reduce visual shift, use a short delay to avoid flashing during fast loads, remain visible long enough to prevent flicker, and become static when reduced motion is requested. Material One loading orchestration chooses between no placeholder, skeletons, progress feedback, and stale-content refresh depending on latency, task type, and whether the final geometry is known.

## Engineering Quality

Material One is validated through GitHub Actions across supported Node versions and GitHub-hosted Linux, Windows, and macOS runners. CI checks repository structure, semantic-token contrast, theme intelligence, visualization behavior, adaptive typography, semantic motion, adaptive accessibility policy and CSS behavior, personalization orchestration, device adaptation, semantic shape behavior, TypeScript contracts, runtime behavior, package integrity, and generated implementation manifests. CodeQL performs JavaScript and TypeScript security analysis.

## Status

Active foundational implementation. Core adaptation, semantic colors, categorical color coding, theme intelligence, accessible data visualization, adaptive typography, semantic shape, semantic motion, components, controls, skeleton loading, patterns, themes, icon contracts, the adaptive accessibility runtime, personalization orchestration, device adaptation runtime, and the adaptive application shell are under development.

## License

Copyright © GoreeWorks
