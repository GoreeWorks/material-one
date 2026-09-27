import test from "node:test";
import assert from "node:assert/strict";
import {
  createAdaptiveTheme,
  createMaterialOneThemeRegistry,
  createSemanticTheme,
  createThemePresentation,
  getMaterialOneTheme,
  resolveThemeSemanticScheme,
  serializeTheme,
  themeToCssVariables,
  validateMaterialOneTheme
} from "../packages/themes/src/index.ts";
import {
  materialOneLightSemanticScheme
} from "../packages/semantic-colors/src/index.ts";

const legacyTheme = {
  name: "legacy-sample",
  scheme: "light" as const,
  colors: {
    primary: "#123456",
    onPrimary: "#FFFFFF",
    primaryContainer: "#DCE6F2",
    onPrimaryContainer: "#102030",
    secondary: "#345678",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#D8E2EC",
    onSecondaryContainer: "#172635",
    tertiary: "#654321",
    onTertiary: "#FFFFFF",
    tertiaryContainer: "#EFE1D2",
    onTertiaryContainer: "#2A1A0C",
    background: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceContainer: "#F4F4F4",
    surfaceContainerHigh: "#E8E8E8",
    floating: "#FFFFFF",
    text: "#111111",
    textMuted: "#555555",
    border: "#777777",
    success: "#176B43",
    warning: "#8A5200",
    error: "#B3261E",
    information: "#365E9D"
  },
  semantic: {
    focus: "#123456",
    selection: "#123456"
  }
};

test("legacy theme input resolves into the canonical semantic scheme", () => {
  const semantic =
    resolveThemeSemanticScheme(
      legacyTheme
    );

  assert.equal(
    semantic.primary,
    "#123456"
  );
  assert.equal(
    semantic.onSurface,
    "#111111"
  );
  assert.equal(
    semantic.surfaceFloating,
    "#FFFFFF"
  );
  assert.equal(
    semantic.focus,
    "#123456"
  );
  assert.equal(
    semantic.onBackground,
    materialOneLightSemanticScheme.onBackground
  );
});

test("legacy CSS aliases and semantic variables are generated from one resolved scheme", () => {
  const variables =
    themeToCssVariables(
      legacyTheme
    );

  assert.equal(
    variables[
      "--mo-color-primary"
    ],
    "#123456"
  );
  assert.equal(
    variables[
      "--mo-sem-primary"
    ],
    "#123456"
  );
  assert.equal(
    variables[
      "--mo-text-primary"
    ],
    "#111111"
  );
  assert.equal(
    variables[
      "--mo-sem-on-surface"
    ],
    "#111111"
  );
});

test("semantic overrides remain authoritative when legacy aliases disagree", () => {
  const theme = {
    ...legacyTheme,
    semantic: {
      ...legacyTheme.semantic,
      primary: "#223344"
    }
  };

  const variables =
    themeToCssVariables(theme);

  assert.equal(
    variables[
      "--mo-sem-primary"
    ],
    "#223344"
  );
  assert.equal(
    variables[
      "--mo-color-primary"
    ],
    "#223344"
  );
});

test("adaptive themes are generated through Theme Intelligence and validate", () => {
  const theme =
    createAdaptiveTheme({
      name: "ocean",
      seed: "#0A7C86",
      scheme: "dark",
      contrast: "high"
    });

  assert.equal(
    theme.scheme,
    "dark"
  );
  assert.equal(
    validateMaterialOneTheme(
      theme
    ).valid,
    true
  );
  assert.equal(
    theme.semantic.error,
    "#FFB4AB"
  );
});

test("semantic themes expose portable presentation metadata", () => {
  const theme =
    createSemanticTheme(
      "default-light",
      "light"
    );
  const presentation =
    createThemePresentation(theme);

  assert.equal(
    presentation.attributes[
      "data-mo-theme"
    ],
    "default-light"
  );
  assert.equal(
    presentation.attributes[
      "data-mo-theme-scheme"
    ],
    "light"
  );
  assert.equal(
    presentation.style[
      "--mo-sem-primary"
    ],
    materialOneLightSemanticScheme.primary
  );
  assert.equal(
    presentation.validation.valid,
    true
  );
});

test("theme registries reject duplicate names and retrieve themes deterministically", () => {
  const light =
    createSemanticTheme(
      "light",
      "light"
    );
  const dark =
    createAdaptiveTheme({
      name: "dark",
      seed: "#4F5FD7",
      scheme: "dark"
    });

  const registry =
    createMaterialOneThemeRegistry([
      light,
      dark
    ]);

  assert.equal(
    getMaterialOneTheme(
      registry,
      "dark"
    ).scheme,
    "dark"
  );

  assert.throws(
    () =>
      createMaterialOneThemeRegistry([
        light,
        light
      ]),
    /Duplicate Material One theme/
  );
});

test("serialized themes expose semantic and compatibility variables", () => {
  const css =
    serializeTheme(
      createSemanticTheme(
        "sample",
        "light"
      )
    );

  assert.match(
    css,
    /data-mo-theme="sample"/
  );
  assert.match(
    css,
    /--mo-sem-primary:/
  );
  assert.match(
    css,
    /--mo-color-primary:/
  );
});
