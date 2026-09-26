# Material One Theme Intelligence

## Purpose

Theme Intelligence turns product identity and user personalization into a valid Material One semantic color scheme.

The system adapts visual values without changing semantic meaning.

## Inputs

Theme Intelligence may use:

- primary accent seed
- optional secondary accent seed
- optional tertiary accent seed
- light or dark scheme
- standard or high-contrast preference

## Protected Semantics

User and product accents may influence:

- primary
- secondary
- tertiary
- focus
- selection
- links

They must not redefine the meaning of:

- success
- warning
- error
- information
- disabled states

These roles remain semantic system signals.

## Contrast

Generated themes must preserve readable foreground/background relationships.

Theme Intelligence validates required semantic pairs at a minimum text contrast of 4.5:1.

Accent-dependent links and focus treatments are corrected when needed so personalization does not reduce usability.

## High Contrast

High-contrast mode strengthens semantic hierarchy by:

- using primary content color for muted content
- promoting strong outlines
- increasing hover and pressed overlays
- preserving existing semantic role names

High contrast is an adaptation of the same system, not a separate visual language.

## Personalization Rule

Personalization may change how a role looks.

Personalization must not change what a role means.

## Runtime

The `@material-one/theme-intelligence` package provides:

- semantic scheme generation
- color mixing
- contrast calculation
- readable foreground selection
- accent correction
- high-contrast adaptation
- semantic scheme validation
