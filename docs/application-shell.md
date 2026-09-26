# Material One Application Shell

## Purpose

The Material One application shell defines the shared structural language for GoreeWorks websites, applications, dashboards, ecommerce tools, services, and professional workspaces.

The shell is adaptive rather than merely responsive. Navigation, command surfaces, context tools, overlays, and content framing change presentation according to the current Material One context.

## Signature Behaviors

Material One products should be recognizable through a small set of recurring structural behaviors:

- **Adaptive chrome** — navigation changes form instead of simply shrinking.
- **Command surface** — search, navigation, and high-frequency actions may share a prominent pill-shaped command surface.
- **Context surface** — large workspaces may expose a contextual right-hand pane without forcing it onto smaller devices.
- **Layered surfaces** — hierarchy is created through semantic surfaces, borders, elevation, and spatial grouping instead of excessive card containers.
- **Soft geometry** — structural containers use deliberate rounded geometry without making every element pill-shaped.
- **Human reach** — compact layouts move frequent navigation and actions toward comfortable touch zones.

## Navigation Transformation

| Layout | Primary navigation | Typical use |
| --- | --- | --- |
| Compact | Bottom navigation | Phones, focused tasks, touch-first experiences |
| Expanded | Navigation rail | Tablets, compact desktop windows, mixed input |
| Workspace | Sidebar | Desktop productivity and complex workflows |

The application should preserve information architecture while changing presentation.

## Shell Regions

A full workspace shell may contain:

1. Top bar
2. Primary navigation
3. Main content
4. Context pane
5. Command/search surface
6. Toolbar
7. Bottom navigation on compact screens
8. Overlay layer
9. Notification region

Not every product needs every region.

## Overlay Adaptation

Material One overlays change form according to space and task:

- Menus become bottom sheets when compact space makes pointer-style popovers uncomfortable.
- Standard dialogs become sheets on compact screens.
- Command surfaces may become full-screen on phones.
- Notifications remain non-modal and move above compact bottom navigation.
- Workspace dialogs remain centered and bounded.

## Accessibility

Application shells must preserve:

- keyboard traversal
- visible focus
- logical DOM order
- semantic landmarks
- touch targets appropriate to input method
- reduced motion
- reduced transparency where supported
- screen-reader labels for icon-only actions

Visual reordering must never make keyboard or assistive-technology order confusing.

## Implementation

The implementation is provided by:

- `@material-one/core` for context and adaptation
- `@material-one/components` for component recipes
- `@material-one/shell` for application structure and overlay behavior
- `tokens/css/material-one.css` for semantic tokens

The shell is a foundation, not a fixed template. Individual GoreeWorks products may express different brands and workflows while preserving the Material One behavior model.
