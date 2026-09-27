# Material One Design Token System

Design Tokens are the foundational value layer of Material One.

The canonical token values remain in `tokens/material-one.tokens.json`, with the matching CSS custom-property surface in `tokens/css/material-one.css`. The `@material-one/tokens` package adds typed validation, enumeration, lookup, classification, and CSS-variable tracing around those authoritative files without copying their values into a second runtime registry.

## Source-of-truth boundary

The JSON token document is authoritative for token data.

The CSS token stylesheet is the framework-neutral browser representation of applicable token values and adaptive media behavior.

The TypeScript token package is authoritative for:

- required token groups
- token-document validation
- canonical dotted token paths
- flattened token enumeration
- primitive token-kind classification
- token lookup
- token search
- CSS-variable traceability
- token inventory manifests

The package does not redefine semantic color, typography, shape, motion, layout, accessibility, or other subsystem policy.

## Required groups

Material One currently requires these top-level token groups:

- color
- typography
- spacing
- shape
- motion
- interaction
- loading
- elevation
- themeIntelligence
- visualization

A token document is invalid when one of these groups is missing, when its name is not `Material One Tokens`, or when its version does not use numeric `x.y.z` versioning.

## Canonical paths

Runtime consumers and tooling can address a leaf token by dotted path.

Examples:

- `spacing.md`
- `shape.extraLarge`
- `interaction.targetTouch`
- `motion.distance.medium`
- `color.semantic.light.primary`
- `color.coding.rose.onContainer`

The token package resolves values directly from the supplied canonical JSON document. It does not maintain a parallel copy of token values.

## Token inventory

`flattenMaterialOneTokens()` produces deterministic path-sorted token entries.

Each entry includes:

- canonical path
- top-level group
- source value
- inferred primitive kind
- matching CSS custom property when Material One exposes one directly

`createTokenManifest()` summarizes token counts by group and total token count. This gives validation, build, documentation, and downstream tooling one consistent inventory surface.

## Token kinds

The registry distinguishes useful primitive kinds without turning primitives into semantic policy:

- color
- dimension
- duration
- easing
- shadow
- font family
- number
- boolean
- list
- string

Higher-level packages remain responsible for interpreting those values semantically.

## CSS traceability

`tokenCssVariable()` maps token paths to canonical CSS variables when a direct public variable exists.

Examples include:

- `spacing.md` → `--mo-space-md`
- `shape.extraLarge` → `--mo-shape-extra-large`
- `interaction.targetTouch` → `--mo-target-touch`
- semantic-color token paths → `--mo-sem-*`
- categorical-color token paths → `--mo-code-*`

Not every configuration or policy token is a CSS primitive. In those cases the function returns `null` rather than inventing an unsupported CSS contract.

## Package stylesheet

`@material-one/tokens/styles` exposes the canonical Material One token stylesheet through the package boundary. The package stylesheet imports the existing source file rather than duplicating its values.

This lets package consumers use the typed runtime and browser token surface through one named package while retaining a single token source of truth.

## Validation

Repository validation checks the token package, source JSON, CSS surface, documentation contract, and generated token inventory report.

Runtime tests load the real canonical JSON file and verify that typed lookup, flattening, classification, CSS tracing, and manifest generation operate against actual repository token data.

## Principle

Maintain token values once, expose them through stable typed and CSS contracts, and let higher-level Material One systems own meaning rather than allowing raw values to become scattered implementation constants.
