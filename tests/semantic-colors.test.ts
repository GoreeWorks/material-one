import test from "node:test";
import assert from "node:assert/strict";
import {
  materialOneDarkSemanticScheme,
  materialOneLightSemanticScheme,
  semanticColor,
  semanticColorRoles,
  semanticCssVariable,
  semanticSchemeToCssVariables,
  semanticStatusPair
} from "../packages/semantic-colors/src/index.ts";

test("semantic color system exposes the complete role contract", () => {
  assert.ok(semanticColorRoles.length >= 50);
  assert.equal(
    Object.keys(materialOneLightSemanticScheme).length,
    semanticColorRoles.length
  );
  assert.equal(
    Object.keys(materialOneDarkSemanticScheme).length,
    semanticColorRoles.length
  );
});

test("semantic colors resolve by role and scheme", () => {
  assert.equal(semanticColor("primary", "light"), "#4F5FD7");
  assert.equal(semanticColor("primary", "dark"), "#BEC2FF");
  assert.equal(semanticColor("surface", "light"), "#FFFFFF");
  assert.equal(semanticColor("surface", "dark"), "#18181F");
});

test("status roles include foreground and container semantics", () => {
  assert.deepEqual(semanticStatusPair("success", "light"), {
    background: "#176B43",
    foreground: "#FFFFFF",
    container: "#C7F1D9",
    onContainer: "#0C3825"
  });

  assert.deepEqual(semanticStatusPair("error", "dark"), {
    background: "#FFB4AB",
    foreground: "#690005",
    container: "#681414",
    onContainer: "#FFDAD6"
  });
});

test("semantic variables are generated from role names", () => {
  assert.equal(semanticCssVariable("primary"), "--mo-sem-primary");
  assert.equal(
    semanticCssVariable("surfaceContainerHighest"),
    "--mo-sem-surface-container-highest"
  );
});

test("semantic schemes serialize to CSS variable maps", () => {
  const variables = semanticSchemeToCssVariables(
    materialOneLightSemanticScheme
  );

  assert.equal(variables["--mo-sem-primary"], "#4F5FD7");
  assert.equal(variables["--mo-sem-on-surface-muted"], "#61616B");
  assert.equal(variables["--mo-sem-error-container"], "#FFDAD6");
});
