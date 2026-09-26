# Material One Token Architecture

## Purpose

Material One tokens define the shared language between design intent and implementation.

## Token Layers

```
Primitive Tokens
       ↓
Semantic Tokens
       ↓
Component Tokens
       ↓
Product Tokens
```

## Primitive Tokens

Represent raw values:

- color values
- spacing units
- typography metrics
- motion durations
- shape values

Primitive tokens should not be referenced directly by application components.

## Semantic Tokens

Represent meaning:

- surface
- content
- emphasis
- interaction
- status
- focus
- disabled

Semantic tokens allow themes and accessibility modes to change without changing component logic.

## Component Tokens

Components consume semantic roles and define local relationships:

- button emphasis
- card elevation
- input focus
- navigation state

## Product Tokens

Products may extend Material One with brand expression while remaining compatible with the semantic foundation.

## Validation

Token validation should detect:

- unresolved references
- invalid semantic mappings
- contrast failures
- missing accessibility values
