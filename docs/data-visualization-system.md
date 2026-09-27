# Material One Adaptive Data Visualization System

Data Visualization communicates quantitative information through the same authoritative color, motion, and accessibility systems used throughout Material One.

The visualization package preserves its existing encoding and summary APIs while adding a portable adaptive policy derived from Core and Accessibility.

## Contract boundary

Data Visualization owns:

- data-series encoding
- categorical color and pattern pairing
- semantic status visualization
- numerical normalization
- distribution summaries
- visualization presentation metadata
- visualization-specific transition presentation

Color Coding owns categorical identity colors.

Semantic Colors owns meaningful status roles.

Core owns effective layout.

Accessibility owns effective motion, contrast, forced-colors state, and the requirement for redundant non-color cues.

Motion owns semantic transition recipes.

## Color semantics

Peer series use Color Coding.

Meaningful success, warning, error, and information states use Semantic Colors.

A chart must not use categorical colors to stand in for semantic system status.

## Redundant encoding

Series use both stable categorical color and a pattern.

The canonical pattern vocabulary is:

- solid
- stripe
- dot
- crosshatch

`createSeriesEncodings()` supplies both channels and creates an accessible text label for each series.

Material One treats redundancy as required rather than optional.

## Effective motion

`createVisualizationPolicy()` consumes the effective Accessibility motion preference and resolves the Material One `transform` motion intent.

Reduced or no-motion policy resolves visualization transition duration to zero.

The visualization layer does not independently interpret the original requested motion preference.

## Contrast and forced colors

The visualization policy consumes Accessibility's effective contrast and forced-colors state.

High contrast strengthens supporting chart content and grid treatment.

Forced-colors presentation maps visualization surfaces, series marks, focus outlines, and table content to system colors.

Browser media queries remain environmental fallbacks; runtime metadata makes the effective Material One policy portable to hosts and frameworks.

## Visualization presentation

`createVisualizationPresentation()` emits:

- `data-mo-visualization`
- `data-mo-layout`
- `data-mo-viz-motion`
- `data-mo-viz-contrast`
- `data-mo-viz-forced-colors`
- `data-mo-viz-redundancy`
- optional grouped accessible label

It also emits the effective visualization transition duration and easing.

## Series presentation

`createSeriesPresentation()` emits:

- canonical series key
- categorical color-code name
- redundant pattern
- accessible value label
- categorical CSS variable
- optional normalized visual size

The numeric visual size is clamped to the valid zero-through-one range before conversion to a percentage.

## Status presentation

`createStatusVisualizationPresentation()` keeps meaningful status visualization tied to semantic status roles.

It emits semantic status variables for the primary status color, container, and readable on-container content.

## Accessible summaries

Existing distribution utilities remain available outside visual rendering.

`describeDistribution()` supplies a textual summary including series count, highest value, lowest value, and total.

This supports an equivalent information path when a visual chart is not sufficient.

## CSS integration

The existing visualization stylesheet remains the browser implementation.

Runtime attributes can:

- disable transitions for effective reduced/no motion
- strengthen supporting content in high contrast
- use system colors for effective forced-colors mode

The existing `prefers-reduced-motion` and `forced-colors` media queries remain progressive fallbacks.

## Compatibility

Existing low-level APIs remain supported:

- `createSeriesEncodings()`
- `statusVisualizationEncoding()`
- `normalizeVisualizationValue()`
- `summarizeDistribution()`
- `describeDistribution()`
- `trendSemanticStatus()`

The adaptive APIs build on these contracts rather than replacing them.

## Principle

Encode meaning with the correct authoritative color system, reinforce color with another cue, derive animation and contrast from effective Accessibility policy, and keep the underlying data understandable outside the visual presentation.
