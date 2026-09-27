# Material One Effective Component System

The Component System is the shared presentation bridge between Material One's semantic subsystems and product-facing interface components.

Core owns requested context. Accessibility resolves effective safeguards. Semantic Colors, Typography, Motion, and Shape own their specialized presentation contracts. Components compose those systems into one portable component contract.

## Component states

Every component uses the canonical state vocabulary:

- default
- hovered
- focused
- pressed
- selected
- disabled
- loading
- success
- warning
- error

Legacy runtime aliases are normalized before presentation metadata is emitted.

## Contract boundary

The Component System owns:

- canonical component state
- component semantic role selection
- component typography role selection
- component motion intent
- component shape role
- component presentation metadata
- composition of effective Accessibility policy into component presentation

The Component System does not redefine color, typography, motion, shape, or accessibility policy.

## Requested and effective context

`createAdaptiveComponentContext()` accepts Core context and, optionally, the effective Accessibility policy.

The resulting context preserves both requested and effective values for:

- motion
- contrast
- text scale
- reduced transparency
- interaction target

It also exposes forced-colors state and whether Accessibility constrained any requested value.

Without an Accessibility policy, the function remains compatible with the earlier Core-only behavior.

## Effective component contract

`createEffectiveComponentContract()` builds the existing typed component contract using the effective Accessibility-aware context.

Semantic color, typography, motion intent, and shape roles remain typed against their authoritative packages.

## Effective presentation

`createAdaptiveComponentPresentation()` composes:

- Core component runtime state
- effective Accessibility context
- adaptive Typography presentation
- adaptive Motion presentation
- Semantic Color CSS variables
- Shape role/token resolution

The presentation emits portable requested/effective metadata including:

- `data-mo-motion`
- `data-mo-motion-requested`
- `data-mo-contrast`
- `data-mo-text-scale`
- `data-mo-text-scale-requested`
- `data-mo-transparency`
- `data-mo-forced-colors`
- `data-mo-accessibility-constrained`

It also emits effective typography and motion implementation variables plus the effective minimum interaction target.

## Motion safeguards

Components using effective presentation cannot restore decorative motion after Accessibility reduces or disables it.

Runtime `data-mo-motion` selectors disable component transitions, pressed transforms, and loading-spinner animation where needed.

Browser `prefers-reduced-motion` rules remain progressive fallbacks.

## Typography safeguards

Effective component presentation delegates type geometry to `createTypographyPresentation()`.

The component type-size alias points to `--mo-type-effective-size`, so Accessibility text-scale clamping remains authoritative.

## Interaction target

The effective component context uses the larger of Core's interaction target and Accessibility's minimum target size.

The resolved value is exposed as `--mo-component-min-target` for framework adapters and specialized controls.

## Color and forced colors

Semantic component color remains a role reference rather than a literal hue.

Effective presentation exposes forced-colors state so framework adapters and Material One CSS can preserve focus and state communication under system-color rendering.

Categorical color coding remains separate from semantic component status.

## Loading components

Predictable loading geometry should use the Adaptive Loading Framework rather than component-local placeholder policy.

Skeleton geometry remains decorative; surrounding regions own busy/live semantics.

## Controls integration

Controls are specialized components.

`createAdaptiveControlPresentation()` extends the effective component bridge with control-specific metadata and uses effective Accessibility motion and minimum-target policy.

The older `createControlPresentation()` remains available for compatibility when only Core context is available.

## Compatibility

Existing APIs remain supported:

- `createAdaptiveComponentContext(context)`
- `createComponentContract()`
- `createComponentPresentation()`
- component recipe helpers
- `createControlPresentation()`

New product code that has an Accessibility policy should prefer:

- `createEffectiveComponentContract()`
- `createAdaptiveComponentPresentation()`
- `createAdaptiveControlPresentation()`

## Principle

Resolve accessibility once, then carry the effective policy through every component presentation layer. Higher-level controls may specialize behavior, but they must not reconstruct or weaken motion, contrast, text-scale, forced-colors, or target-size safeguards.
