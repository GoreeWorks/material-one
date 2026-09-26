# Material One Controls and Interactions

## Purpose

Material One controls translate the design language into predictable, accessible interaction patterns across websites, applications, services, ecommerce experiences, and professional workspaces.

Controls are not fixed-size visual widgets. Their target size, presentation, motion, density, and information level adapt to the active Material One context.

## Control Families

Material One defines the following interaction families:

- switches
- checkboxes
- radio controls
- sliders
- segmented controls
- tabs
- chips
- badges
- selects
- data tables
- adaptive data cards
- pagination
- progress indicators
- tooltips
- breadcrumbs
- accordions

## Adaptive Rules

### Input Method

Touch and mixed-input environments receive larger targets than dense pointer-only environments.

### Layout

Compact layouts may transform:

- wide data tables into data cards
- numbered pagination into compact pagination
- long breadcrumb trails into a shortened path
- large tab sets into horizontally scrollable tabs
- hover tooltips into press-triggered contextual help

### Density

Density affects row height, target size, spacing, and information packing without changing semantics.

### Motion

Reduced-motion preferences remove decorative transitions and replace continuous indeterminate animation with a stable state.

## Selection Controls

Switches represent immediate binary state changes.

Checkboxes support independent selection.

Radio controls support mutually exclusive selection.

Segmented controls select among a small set of closely related views or modes.

Tabs switch between peer content destinations without implying data submission.

## Data Presentation

Data tables are the preferred expanded and workspace representation for structured datasets.

On compact layouts, products should prioritize essential fields and may transform rows into cards. This is an information-architecture adaptation, not merely a CSS reflow.

## Feedback

Status must never rely on color alone. Success, warning, error, loading, and selection states should combine color with text, iconography, shape, or semantic accessibility attributes.

## Accessibility Requirements

Controls must support:

- keyboard access where applicable
- visible focus
- appropriate ARIA state
- meaningful labels
- sufficient contrast
- touch-safe targets
- reduced motion
- forced-colors/high-contrast modes
- non-color status cues

## Implementation

The runtime recipes are provided by `@material-one/controls`.

The accompanying CSS primitives are exposed through:

`@material-one/controls/styles`

Products may wrap these primitives in React, Web Components, native platform components, or other framework adapters while preserving Material One semantics.
