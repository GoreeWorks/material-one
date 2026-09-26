# Material One Typography

## Purpose

Material One typography is semantic, adaptive, readable, and accessibility-aware.

Typography roles describe purpose rather than a fixed visual size. The system adapts hierarchy to the device and user while preserving readable body text and predictable relationships between roles.

## Semantic Roles

Material One defines:

- Display
- Large Title
- Section Heading
- Title
- Body
- Label
- Supporting

Components and patterns should request a semantic role instead of selecting arbitrary font sizes.

## Adaptation

Large hierarchy roles may scale with layout context:

- Compact reduces oversized headings so content remains focused.
- Expanded uses the standard scale.
- Workspace may increase high-level hierarchy when additional space is available.

Body, label, and supporting text do not shrink merely because a layout is compact.

## User Text Scale

Material One supports user text scaling independently from layout adaptation.

The runtime accepts text scaling from 0.9 to 2.0. Products should not prevent platform-level text enlargement.

Layout must remain usable as text grows.

## Readable Line Length

Material One places maximum readable line lengths on semantic roles.

Body content targets a maximum of 72 characters per line. Display and title roles use shorter measures to preserve hierarchy and scanning.

These are maximums, not requirements to stretch short text.

## Weight and Tracking

Weight communicates hierarchy without relying exclusively on size.

Tracking is role-specific:

- Display and titles use tighter spacing.
- Body text uses neutral tracking.
- Labels and supporting text use slightly increased tracking for clarity.

## Font Families

Material One defaults to a system-first sans-serif stack so interfaces remain fast and native across platforms.

Products may introduce brand typography, but semantic roles, line height, scaling, and accessibility behavior should remain compatible.

A system monospace stack is provided for technical identifiers, code, and tabular technical content.

## Accessibility

Typography must preserve:

- readable contrast through semantic colors
- user text scaling
- sufficient line height
- keyboard and zoom usability
- no clipped critical content
- high-contrast supporting text
- semantic HTML hierarchy

Visual type roles do not replace correct HTML heading structure.

## Implementation

The `@material-one/typography` package provides:

- typed semantic roles
- layout-aware role resolution
- bounded user text scaling
- readable line-length contracts
- CSS variable mapping
- style serialization

The CSS package provides semantic type classes, responsive heading behavior, text-scale presets, balanced headings, pretty wrapping, and high-contrast adaptation.
