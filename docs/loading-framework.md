# Material One Adaptive Loading Framework

Loading is a presentation-orchestration layer that decides how an in-progress experience should communicate waiting without creating a second motion, density, or accessibility system.

The loading package preserves the existing low-level skeleton and progressive-loading helpers while adding an adaptive profile derived from the authoritative Material One context and effective accessibility policy.

## Contract boundary

The Adaptive Loading Framework owns:

- loading intent
- visual loading presentation
- skeleton timing
- skeleton geometry choice
- loading-region metadata
- skeleton accessibility metadata
- loading blueprint density
- portable loading attributes and CSS variables

Core remains authoritative for density and requested motion.

Accessibility remains authoritative for effective motion after user and platform preferences are combined.

Motion remains authoritative for the broader semantic animation language.

## Loading intent

Material One distinguishes four loading intents:

- content
- navigation
- action
- refresh

Intent describes why the user is waiting rather than how the interface should look.

## Presentation policy

Loading presentation resolves to one of four modes:

- none
- skeleton
- progress
- stale

Fast work below the skeleton-delay threshold uses no placeholder.

Action work uses progress feedback.

Known content geometry may use skeletons.

Refresh work with usable stale content keeps that content visible and marks it as stale instead of replacing it with a blank loading state.

## Effective motion

`createLoadingPolicy()` consumes both `MaterialOneContext` and `MaterialOneAccessibilityPolicy`.

The loading system therefore uses the effective accessibility motion value rather than looking only at the originally requested core preference.

- full → shimmer skeleton
- reduced → static skeleton
- none → static skeleton

This prevents operating-system or accessibility reduced-motion requirements from being lost inside loading orchestration.

## Density

Loading blueprints use the canonical core density preference.

The loading package does not maintain a second compact/comfortable/spacious vocabulary.

Compact layouts can show denser list and table skeleton rows, while spacious density reduces repeated placeholder rows.

## Adaptive profile

`createLoadingProfile()` combines:

- intent
- expected latency
- known or unknown geometry
- stale-content availability
- busy state
- effective loading policy
- optional skeleton kind
- optional content blueprint

The result includes the resolved presentation plus any skeleton recipe and density-aware blueprint needed to render it.

## Skeleton presentation

`createSkeletonPresentation()` emits:

- `data-mo-kind`
- `data-mo-motion`
- `aria-hidden="true"`
- loading timing CSS variables

Skeleton geometry is decorative and must not be exposed as substitute content to assistive technology.

The real loading region carries the busy/live-region semantics.

## Loading-region presentation

`createLoadingPresentation()` emits:

- `data-mo-loading-presentation`
- `data-mo-loading-intent`
- `data-mo-loading-motion`
- `data-mo-loading-density`
- `data-mo-loading-geometry`
- `data-mo-stale-content`
- `data-mo-loading-blueprint` when present
- `aria-busy`
- `aria-live="polite"`

It also emits CSS variables for the delay, minimum visible duration, and blueprint row/line counts.

## CSS integration

The existing Material One loading CSS remains the browser implementation.

Typed metadata now adds runtime safeguards:

- reduced or no-motion loading disables content-reveal animation even when the platform media query is unavailable
- non-skeleton presentation can suppress skeleton placeholders
- completed regions marked `aria-busy="false"` no longer retain progress cursor treatment
- stale-content presentation continues to preserve visible content

Media queries for reduced motion, compact viewports, and forced colors remain progressive environmental fallbacks.

## Compatibility

The existing APIs remain available:

- `createSkeletonRecipe()`
- `shouldShowSkeleton()`
- `minimumSkeletonHideAt()`
- `resolveLoadingPresentation()`
- `createSkeletonBlueprint()`
- `loadingRegionAria()`

The adaptive APIs build on these contracts instead of replacing them.

## Principle

Loading should preserve context, geometry, and accessibility while communicating only as much waiting state as the user needs. Resolve presentation from intent and latency, derive motion and density from their authoritative Material One systems, and keep decorative skeleton shapes out of the accessibility tree.
