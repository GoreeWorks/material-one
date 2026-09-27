# Material One Shape Framework

Material One treats shape as a semantic system rather than a collection of component-specific border-radius values. Raw shape tokens remain stable primitives; semantic shape roles decide which primitive a surface or control should use in the current experience context.

## Contract boundary

The design-token layer owns the raw Material One shape scale:

- extra-small
- small
- medium
- large
- extra-large
- pill

The shape package owns semantic roles and adaptive role-to-token mapping. Components and controls should request shape by role when the shape expresses interface purpose, while specialized geometry may still use a raw token directly.

Shape does not redefine layout, component state, accessibility, motion, typography, or semantic color.

## Semantic shape roles

The current shape vocabulary includes:

- control
- field
- surface
- card
- navigation
- floating
- icon button
- chip

These names describe purpose rather than a literal radius.

## Experience style

Material One maps experience modes into three shape styles:

- Minimal uses tighter geometry and less visual enclosure.
- Balanced is the default for professional, focused, and accessibility experiences.
- Expressive is used by expressive and creative experiences and gives larger containers more generous geometry.

Pill geometry remains stable for icon buttons and chips because those roles depend on a consistently rounded enclosure.

## Layout adaptation

Shape style and layout remain separate inputs. Compact layouts strengthen the navigation enclosure so bottom-navigation surfaces read as a contained touch target even when the overall experience style is minimal.

The layout engine remains authoritative for spatial arrangement. Shape only resolves geometry.

## Framework-portable presentation

`createShapePresentation()` emits:

- `data-mo-shape-style`
- semantic CSS aliases such as `--mo-shape-control`, `--mo-shape-card`, and `--mo-shape-floating`

Those aliases point to the existing raw token variables. Framework adapters can apply the presentation metadata at a product root and let component CSS consume semantic shape roles.

## Component integration

Typed Material One component contracts carry both a semantic `ShapeRole` and its resolved `ShapeToken`. Component presentation metadata exposes those values and emits a resolved radius variable.

This preserves a clean dependency direction:

```
Raw Shape Tokens
       |
       v
Semantic Shape Policy
       |
       v
Component Shape Role
       |
       v
Framework / CSS Presentation
```

## Principle

Use shape to reinforce hierarchy and interaction purpose, not as arbitrary decoration. Keep raw tokens stable and adapt semantic roles deliberately.
