# Material One Personalization Engine

Material One treats personalization as a system capability rather than a visual preference layer. The personalization package orchestrates already-authoritative Material One preferences and accessibility outcomes; it does not create a second theme, typography, motion, layout, or accessibility vocabulary.

## Contract boundary

Material One core owns the user's requested theme, density, motion, experience mode, layout preference, and accessibility preferences. The accessibility package may strengthen the effective runtime presentation in response to user or platform accessibility needs.

The personalization layer combines those sources into one portable profile for product settings, adapters, application shells, and framework integrations.

Color intelligence, semantic themes, typography, shape, and interaction systems remain authoritative for their own typed contracts. As those systems expose additional personalization controls, this layer should reference their types rather than accept arbitrary strings.

## User controls

The current typed orchestration contract exposes:

- theme preference
- density
- motion preference
- experience mode
- layout preference
- text scale
- contrast
- reduced transparency

Experience modes remain:

- Minimal
- Expressive
- Professional
- Creative
- Focused
- Accessibility

## Accessibility-first resolution

Accessibility requirements are resolved before personalization presentation metadata is emitted. Personalization may describe user choices and product capabilities, but it must not weaken an effective reduced-motion, higher-contrast, larger-target, reduced-transparency, or forced-colors requirement.

The personalization profile therefore consumes both `MaterialOneContext` and `MaterialOneAccessibilityPolicy`.

## Requested versus effective values

The profile preserves requested values where it matters for settings interfaces and also exposes effective runtime values after accessibility resolution.

For example, a user may request full motion while the platform requests reduced motion. The profile keeps `requestedMotion: "full"` and emits effective `motion: "reduced"`. Products can show the user's chosen preference without accidentally animating beyond the accessibility policy.

The same distinction is available for text scale, contrast, and reduced transparency.

## Product capability policy

`createPersonalizationControlStates()` accepts a typed product capability map. Products can disable controls they do not expose while still using the same Material One profile and semantics.

A disabled product control does not change the effective accessibility policy. Control state also reports when accessibility has strengthened a requested value so settings surfaces can explain effective behavior without treating it as an error.

## Framework-portable presentation

`createPersonalizationPresentation()` emits plain data attributes and CSS custom properties for framework-independent consumption.

Attributes include:

- `data-mo-experience`
- `data-mo-theme-preference`
- `data-mo-density`
- `data-mo-layout`
- `data-mo-layout-preference`
- `data-mo-motion-preference`
- `data-mo-motion`
- `data-mo-contrast`
- `data-mo-transparency`
- `data-mo-accessibility`
- `data-mo-forced-colors`

CSS variables include the effective text scale and minimum interaction target.

## Personalization flow

```
User Preferences
        +
Device Context
        |
        v
Material One Core Context
        +
Accessibility Environment
        |
        v
Accessibility Policy
        |
        v
Personalization Profile
        |
        v
Framework / Product Presentation
```

## Integration order

1. Material One core resolves device context and requested preferences.
2. Accessibility resolves effective safeguards and platform requirements.
3. Personalization combines requested and effective state into one profile.
4. Components, patterns, shells, and product adapters consume that profile and their authoritative subsystem contracts.

## Principle

Customization should create meaningful improvements while preserving consistency, usability, and accessibility.
