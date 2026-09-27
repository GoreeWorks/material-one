# Material One Theme Runtime Bridge

The Theme Runtime Bridge converts Material One semantic color schemes into framework-portable runtime theme metadata and CSS variables.

Theme Intelligence generates or adapts semantic schemes. Semantic Colors owns the canonical role vocabulary. The Themes package serializes those authoritative schemes for products and preserves older Material One CSS aliases only as compatibility output.

The bridge is an implementation boundary, not a separate design-system layer.

## Source-of-truth boundary

Semantic Colors owns:

- semantic color role names
- default light and dark schemes
- semantic CSS variable names

Theme Intelligence owns:

- accent generation
- adaptive light/dark scheme generation
- contrast strengthening
- semantic theme validation

Themes owns:

- named theme identity
- legacy-theme input migration
- semantic scheme resolution
- legacy CSS alias projection
- theme registries
- portable theme presentation
- CSS serialization

The Themes package must not maintain an independent authoritative color vocabulary.

## Semantic-first resolution

`resolveThemeSemanticScheme()` always starts from the canonical Material One semantic scheme for the requested light or dark mode.

Legacy `MaterialOneThemeColors` input is then projected into matching semantic roles.

Explicit semantic overrides are applied last and remain authoritative.

This order guarantees that a theme has one resolved semantic scheme even when a product still uses the older theme input shape.

## Compatibility aliases

Material One historically exposed variables such as:

- `--mo-color-primary`
- `--mo-surface-base`
- `--mo-text-primary`
- `--mo-status-error`

These remain supported for downstream compatibility.

`semanticSchemeToLegacyVariables()` derives those aliases from the already-resolved semantic scheme. It does not read a second color source.

As a result, legacy aliases and `--mo-sem-*` variables cannot disagree within one serialized theme.

## Semantic theme creation

`createSemanticTheme()` creates a named Material One theme from a complete semantic scheme.

When no custom scheme is provided, the canonical Material One light or dark semantic scheme is used.

## Adaptive theme creation

`createAdaptiveTheme()` delegates color generation and validation to `@material-one/theme-intelligence`.

Products provide a theme name and Theme Intelligence seed options.

The resulting runtime theme stores the generated semantic scheme directly rather than translating it into a parallel legacy color model.

## Validation

`validateMaterialOneTheme()` validates the resolved semantic scheme through Theme Intelligence contrast validation.

`createThemePresentation()` rejects invalid themes before emitting presentation metadata.

This ensures runtime presentation cannot silently bypass semantic contrast requirements.

## Theme presentation

`createThemePresentation()` emits:

- `data-mo-theme`
- `data-mo-theme-scheme`
- complete semantic CSS variables
- compatibility CSS aliases
- the resolved semantic scheme
- the validation result

Framework adapters can apply the returned attributes and style map without reconstructing theme semantics.

## Theme registry

`createMaterialOneThemeRegistry()` creates a deterministic named theme registry and rejects duplicate names.

`getMaterialOneTheme()` retrieves a theme by its canonical registry name and rejects unknown names.

## CSS serialization

`serializeTheme()` serializes the same resolved variable map used by runtime presentation.

Serialized styles therefore expose both semantic variables and compatibility aliases from one scheme.

The default selector is the theme's `data-mo-theme` attribute.

## Migration

Existing theme objects that provide `colors` plus optional semantic overrides remain valid.

New work should prefer semantic themes or adaptive themes.

The legacy input shape exists only as a compatibility boundary and should not be treated as a second source of truth.

## Principle

Generate meaning once, validate it once, and project it into every required runtime surface. Theme compatibility may preserve old names, but it must never create competing color authority.
