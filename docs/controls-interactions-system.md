# Material One Controls and Interactions System

Controls and Interactions specialize the canonical Material One component contract for selection, input, navigation, data, feedback, and disclosure behavior.

The controls package does not define a second interaction-state vocabulary. Control state is the same Material One component state used by core and components: default, hovered, focused, pressed, selected, disabled, loading, success, warning, and error.

## Contract boundary

The Controls and Interactions System owns:

- control-specific adaptive recipes
- control sizing derived from the Material One interaction target
- control-specific structural presentation
- control presentation metadata
- control state-to-semantic presentation defaults
- data-table row density
- disclosure behavior

Core remains authoritative for layout, input, preferences, and interaction target. Components remain authoritative for the canonical component state and base presentation bridge.

## Canonical state

`ControlState` aliases the canonical `ComponentState`.

This prevents controls from maintaining a parallel state list and guarantees that hovered, focused, pressed, selected, disabled, loading, success, warning, and error mean the same thing across components and controls.

## Adaptive recipes

Typed recipes exist for:

- toggles
- sliders
- segmented controls
- tabs
- chips
- data tables
- pagination
- progress

Each recipe carries a `control` discriminator plus the shared state, target size, size class, and motion policy.

Control-specific recipe fields remain explicit, such as checked state, orientation, scrolling presentation, tab placement, selected/removable chip behavior, data-table card transformation, pagination density, and determinate progress.

## Presentation bridge

`createControlPresentation()` builds on `createComponentPresentation()`.

The resulting attributes include the canonical component metadata plus control-specific metadata such as:

- `data-mo-control`
- `data-mo-state`
- `data-mo-control-size`
- `data-mo-control-motion`
- `data-mo-checked`
- `data-mo-orientation`
- `data-mo-presentation`
- `data-mo-placement`
- `data-mo-selected`
- `data-mo-sticky-header`
- `data-mo-column-priority`
- `data-mo-visible-pages`
- `data-mo-indeterminate`

The presentation also emits `--mo-control-target-size` and recipe-specific CSS variables such as data-table row height.

## Semantic defaults

Control state chooses a default semantic presentation role without redefining semantic color:

- success → success container
- warning → warning container
- error → error container
- selected → selection container
- disabled → disabled
- other interaction states → surface container

Products can still use lower-level component contracts when they require a deliberately different semantic role.

## CSS integration

The controls stylesheet consumes portable runtime metadata where useful while retaining ARIA and native-state selectors.

Typed metadata can therefore drive behavior in framework adapters without removing semantic HTML or accessibility attributes.

Data-table row height consumes the runtime CSS variable. Segmented scrolling accepts the typed presentation attribute. Disabled control metadata receives the same disabled affordance as native disabled/ARIA states.

## Disclosure behavior

Tooltip, accordion, and breadcrumb presentation remains derived from the authoritative context:

- tooltips use press interaction for touch input and hover where hover interaction is available
- accordions expand by default in workspace layout and collapse in smaller layouts
- breadcrumbs use compact presentation in compact layout and full presentation otherwise

## Principle

Controls are specialized components, not a separate design system. Share one state vocabulary, inherit one adaptive context, and expose control-specific behavior through portable metadata rather than duplicating component runtime policy.
