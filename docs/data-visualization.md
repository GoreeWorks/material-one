# Material One Data Visualization

## Purpose

Material One data visualization applies the design language to charts, metrics, timelines, heatmaps, progress displays, and analytical interfaces.

Visualization must remain understandable independently of literal color.

## Color Model

Material One uses two different color systems in visualization.

### Categorical color

Categorical color distinguishes peer data series such as:

- products
- owners
- departments
- categories
- cohorts
- channels

These colors come from the Material One categorical color-coding palette.

### Semantic color

Semantic color communicates meaning such as:

- success
- warning
- error
- information
- focus
- selection

Semantic colors must not be reassigned merely to create variety between peer series.

## Redundant Encoding

Important visualization meaning should use more than color.

Material One supports:

- visible labels
- numerical values
- solid fills
- stripes
- dots
- crosshatch patterns
- outlines
- position
- readable textual summaries

This improves interpretation for color-vision differences, monochrome environments, forced-colors mode, and degraded displays.

## Accessible Summary

A visualization should expose the important information in text.

Useful summaries include:

- number of series
- highest value
- lowest value
- total
- trend direction
- relevant status

A visual chart is not the only source of the information.

## Interaction

Interactive data marks should support:

- keyboard focus
- semantic selection indication
- readable tooltips
- visible focus rings
- non-color selected state
- reduced-motion behavior

## Responsive Behavior

Compact layouts should prioritize labels, values, and major comparisons.

Expanded and workspace layouts may expose additional axes, legends, annotations, and contextual information.

## Forced Colors

In forced-colors environments, Material One prioritizes system colors, borders, text, patterns, and focus state over preserving the original palette.

## Motion

Animation may explain change, but it must not be required to understand the chart.

Reduced-motion contexts disable visualization transitions.

## Implementation

The `@material-one/data-visualization` package provides:

- categorical series encodings
- redundant pattern assignment
- semantic status visualization roles
- value normalization
- distribution summaries
- accessible text descriptions
- trend semantics
- reusable CSS primitives for bars, legends, heatmaps, tooltips, status surfaces, and data tables
