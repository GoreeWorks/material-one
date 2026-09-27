# Material One Device Adaptation System

Material One treats device adaptation as a typed capability layer around the authoritative core context. It describes the current device and viewport without creating a second layout system or weakening accessibility and personalization policy.

## Contract boundary

Material One core remains authoritative for requested preferences, the current device context, layout resolution, and the minimum interaction target.

The device-adaptation package consumes that resolved context and adds framework-portable capability metadata for:

- physical viewport class
- orientation
- current input mode
- pointer precision
- hover availability
- keyboard availability
- touch availability
- browser, standalone, or fullscreen display mode
- safe-area insets
- segmented or foldable viewports
- pixel ratio

Device adaptation does not redefine semantic colors, typography, motion, accessibility, personalization, application-shell navigation, or component state.

## Device class versus layout

Device class describes the physical viewport. Layout describes the Material One interface mode.

The default device classes are:

- Handheld: viewport width below 600px
- Tablet: viewport width from 600px through 1199px
- Desktop: viewport width from 1200px through 1799px
- Large screen: viewport width of 1800px or wider

A product may explicitly request a compact Material One layout on a desktop-class viewport. The device profile preserves both facts instead of collapsing them into one value.

## Capability uncertainty

Primary input is not a complete inventory of hardware. Material One therefore distinguishes known capability state from unknown capability state.

For example, a mouse input implies a fine pointer and hover availability, but it does not prove that a keyboard or touchscreen is unavailable. Those capabilities remain unknown unless the host environment supplies an explicit value.

Mixed input remains a first-class state rather than being silently reduced to touch or mouse.

## Safe areas and segmented viewports

The adaptation profile normalizes non-negative safe-area insets and bounds them to the current viewport.

Hosts may provide multiple viewport segments for foldable, hinged, or otherwise segmented displays. When no explicit segments are supplied, Material One treats the current viewport as one segment.

The package exposes segment count and safe-area values through presentation metadata without prescribing product-specific pane placement. Higher-level layout and shell systems decide how to use those capabilities.

## Framework-portable presentation

`createDeviceAdaptationPresentation()` emits plain data attributes and CSS custom properties.

Attributes include:

- `data-mo-device-class`
- `data-mo-layout`
- `data-mo-orientation`
- `data-mo-input`
- `data-mo-pointer`
- `data-mo-hover`
- `data-mo-keyboard`
- `data-mo-touch`
- `data-mo-display-mode`
- `data-mo-segmented-viewport`

CSS variables include:

- viewport width and height
- pixel ratio
- safe-area insets
- viewport segment count
- minimum interaction target

## Change detection

`createDeviceAdaptationSignature()` produces a deterministic signature for a resolved profile. Framework adapters can compare signatures with `hasDeviceAdaptationChanged()` to avoid treating an unchanged capability profile as a meaningful adaptation event.

The signature includes viewport geometry because Material One layout and downstream product behavior may legitimately respond to precise available space.

## Integration order

1. Core resolves requested preferences, device context, layout, and interaction target.
2. Accessibility strengthens effective safeguards when needed.
3. Personalization combines requested and effective presentation state.
4. Device adaptation describes the current physical and capability environment.
5. Components, layouts, shells, and product adapters consume the relevant authoritative contracts.

## Principle

Adapt to capabilities that are known, preserve uncertainty where hardware is not known, and keep physical device facts separate from interface layout policy.
