# Material One Color Intelligence System

Material One uses Color Intelligence to route a color decision to the correct authoritative subsystem instead of treating all color as interchangeable styling.

## Contract boundary

Color Intelligence coordinates four kinds of intent:

- semantic interface roles
- semantic status
- categorical identity
- GoreeWorks work priority

It does not replace the Semantic Color System, Color Coding System, or Theme Intelligence System. Those packages remain authoritative for their own values and generation logic.

## Semantic interface color

Interface meaning such as primary action, surface, outline, focus, selection, disabled state, and links belongs to the Semantic Color System.

A semantic request resolves to a typed semantic role, the active light or dark scheme value, and the corresponding `--mo-sem-*` CSS variable.

Ordinary structural semantic roles do not automatically require a redundant non-color cue because many of them describe visual structure rather than a state that must be communicated independently.

## Status color

Success, warning, error, and information remain semantic status meanings.

Status never routes through the categorical palette. A status resolution returns its background, foreground, container, and on-container pair and requires text or another non-color cue so the meaning does not depend on hue alone.

## Categorical color

Category, series, owner, and workflow identity route through the Color Coding System.

Categorical color is deterministic and stable for the same key and usage namespace. It always requires a text cue and another non-color cue such as a dot, bar, outline, position, icon, or pattern.

Categorical colors must not be used as substitutes for success, warning, error, or information.

## GoreeWorks priority color

GoreeWorks priority is categorical/ordinal communication rather than semantic status.

The Material One color-coding package uses the authoritative GoreeWorks six-level vocabulary:

- Horizon
- Current
- Pulse
- Beacon
- Surge
- Apex

Priority color does not mean success, warning, error, incident severity, or release status. Text labels remain required.

The current categorical mapping is:

- Horizon → teal
- Current → blue
- Pulse → cyan
- Beacon → violet
- Surge → amber
- Apex → rose

This mapping is a Material One presentation choice. The authoritative names, ordering, and definitions remain controlled by `GoreeWorks/Standards/GoreeWorks Priority Level Standard.docx`.

## Framework-portable presentation

`createColorIntelligencePresentation()` exposes portable metadata including:

- `data-mo-color-intent`
- `data-mo-color-source`
- `data-mo-color-role`
- `data-mo-status`
- `data-mo-color-code`
- `data-mo-color-cue`
- `data-mo-color-label`
- `data-mo-color-redundancy`

It also emits shared `--mo-intelligent-*` CSS aliases pointing at the authoritative semantic or categorical variables.

## Decision rule

Use this routing order:

1. If the color communicates success, warning, error, or information, use semantic status.
2. If the color communicates an interface role or state such as surface, focus, selection, or disabled, use semantic color.
3. If the color distinguishes peer identities, categories, owners, series, workflows, or GoreeWorks priority levels, use categorical color coding.
4. Use Theme Intelligence to generate or adapt the semantic scheme, not to redefine the meaning of the request.

## Principle

Choose color by meaning first. Route the meaning to one authoritative color subsystem, preserve semantic boundaries, and require redundant cues whenever hue carries user-relevant information.
