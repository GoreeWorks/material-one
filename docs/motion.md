# Material One Motion

## Purpose

Material One motion explains state, relationship, continuity, and change.

Motion is semantic. Interfaces choose an intent such as feedback, navigation, transformation, or emphasis rather than inventing arbitrary durations and easing curves for each component.

## Motion Intents

Material One defines:

- Instant
- Feedback
- Enter
- Exit
- Navigation
- Transform
- Emphasis
- Loading

Each intent has a default duration, easing curve, spatial distance, scale behavior, and opacity behavior.

## Motion Principles

Motion should:

- explain where content came from or where it went
- preserve continuity between related surfaces
- communicate direct interaction feedback
- clarify hierarchy changes
- feel physically coherent
- remain subordinate to the user's task

Motion should not:

- delay routine interaction
- create decorative movement that competes with content
- be required to understand state
- move large regions without an explanatory relationship

## Timing

Fast feedback uses shorter timing than navigation and transformation.

Large transformations receive more time because the user must visually track more change.

Timing is a system contract, not a target that every animation must use regardless of context.

## Continuity

Material One supports shared-element continuity and browser view transitions when available.

A transition should preserve the perceived identity of an element when it moves between interface contexts rather than making the old element disappear and an unrelated new element appear.

## Reduced Motion

Reduced motion is not a separate design system.

Material One keeps the same states and relationships while removing unnecessary spatial movement, scaling, and decorative animation.

Non-essential motion becomes immediate.

Short essential interaction feedback may remain when it communicates a direct action, but it is capped at 100 milliseconds and avoids translation or scaling.

## No Motion

The No Motion preference disables animations and transitions entirely.

State changes remain visible through color, shape, text, iconography, visibility, or layout.

## Loading

Continuous loading animation follows the Material One loading system.

When reduced motion is requested, skeleton shimmer and other continuous decorative loading motion become static while busy-state semantics remain.

## Implementation

The `@material-one/motion` package provides:

- semantic motion intents
- full, reduced, and none preferences
- duration resolution
- spatial motion removal
- essential-feedback preservation
- CSS variable serialization

The CSS package provides semantic motion intents, entrance and emphasis recipes, interaction feedback, shared transition hooks, view-transition integration, reduced-motion behavior, and a no-motion override.
