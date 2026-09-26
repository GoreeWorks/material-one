# Material One Component System

Material One components are:

- adaptive
- state-aware
- accessible
- reusable
- color-aware
- loading-aware

## Component States

Every component supports:

- Default
- Focused
- Pressed
- Selected
- Disabled
- Loading
- Success
- Warning
- Error

## Color-Coded Components

Material One may use stable categorical color codes for grouping, identity, filters, tags, charts, priorities, and related information.

Color coding must not be the only signal. Components pair color with readable text, iconography, shape, pattern, placement, or another non-color cue.

Status colors remain reserved for success, warning, error, and information so categorical color never changes the meaning of system feedback.

## Loading Components

When the final content geometry is predictable, the Loading state should use a skeleton that preserves the expected layout.

Skeletons:

- appear after a short delay to avoid flashing during fast loads
- remain visible long enough to prevent flicker
- match the approximate shape of the content they replace
- avoid exposing placeholder content to assistive technology
- use the surrounding region to communicate busy state
- become static when reduced motion is requested

Small action controls may use progress indicators when a full skeleton would not preserve useful context.

## Intelligent Components

Components may adapt:

- size
- density
- arrangement
- available actions
- interaction style
- color coding
- loading treatment

based on device, preferences, accessibility requirements, and context.
