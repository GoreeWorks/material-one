# Material One Adaptive Motion Framework

Motion communicates state change, hierarchy, navigation, feedback, and continuity through semantic intent rather than component-specific animation constants.

Core owns the requested motion preference vocabulary. Accessibility owns the effective motion preference after user and platform safeguards are combined. Motion owns the semantic recipes and their runtime presentation.

## Contract boundary

Motion owns:

- semantic motion intents
- full-motion recipes
- reduced-motion recipe transformation
- no-motion recipe transformation
- adaptive recipe resolution
- portable motion presentation metadata
- motion CSS variables

Core remains authoritative for the requested motion preference.

Accessibility remains authoritative for the effective motion preference.

## Semantic intents

Material One defines:

- instant
- feedback
- enter
- exit
- navigation
- transform
- emphasis
- loading

Each intent carries duration, easing, translation, scale, opacity, and essential/non-essential classification.

## Effective motion

`createMotionPolicy()` compares Core's requested motion with Accessibility's effective motion.

The policy exposes both values plus whether Accessibility constrained the request.

`resolveAdaptiveMotionRecipe()` always uses the effective value.

This prevents operating-system reduced-motion signals or accessibility safeguards from being bypassed by product code that only knows the original preference.

## Reduced motion

Reduced motion keeps short essential feedback but removes decorative spatial motion.

Essential `instant` and `feedback` recipes are capped at 100ms with translation and scale removed.

Non-essential enter, exit, navigation, transform, emphasis, and loading recipes resolve to zero duration.

## No motion

No-motion preference resolves every recipe to zero duration and neutral spatial/scale/opacity transformation while retaining semantic state through non-motion cues.

## Presentation

`createMotionPresentation()` creates a portable presentation for an explicit preference.

`createAdaptiveMotionPresentation()` creates the presentation from the effective Accessibility policy.

Attributes include:

- `data-mo-motion-intent`
- `data-mo-motion`
- `data-mo-motion-requested`
- `data-mo-motion-constrained`
- `data-mo-motion-essential`
- `data-mo-motion-active`

CSS variables include duration, easing, translation, scale, and opacity.

## CSS integration

The Motion stylesheet continues to provide semantic intent defaults and media-query fallbacks.

Runtime `data-mo-motion="reduced"` and `data-mo-motion="none"` behavior additionally suppresses decorative animations and transformations on either an ancestor or the motion element itself.

Inline presentation variables carry the exact recipe resolved by TypeScript, so framework adapters do not need to recreate reduced-motion policy.

## Compatibility

Existing low-level APIs remain available:

- `resolveMotionRecipe()`
- `motionDuration()`
- `shouldAnimateMotion()`
- `motionCssVariables()`

They now use Core's canonical `MotionPreference` type rather than a duplicate package-local union.

## Principle

Define motion meaning once, resolve accessibility once, and animate only when the effective Material One policy permits it.
