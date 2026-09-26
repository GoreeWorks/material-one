import test from "node:test";
import assert from "node:assert/strict";
import {
  contrastRatio,
  createAdaptiveSemanticScheme,
  createValidatedSemanticScheme,
  ensureContrast,
  validateSemanticTheme
} from "../packages/theme-intelligence/src/index.ts";
import {
  createSeriesEncodings,
  describeDistribution,
  normalizeVisualizationValue,
  statusVisualizationEncoding,
  summarizeDistribution,
  trendSemanticStatus
} from "../packages/data-visualization/src/index.ts";
import {
  materialOneLightSemanticScheme
} from "../packages/semantic-colors/src/index.ts";

test("theme intelligence computes standard contrast", () => {
  assert.equal(contrastRatio("#000000", "#FFFFFF"), 21);
  assert.ok(contrastRatio("#FFFFFF", "#4F5FD7") >= 4.5);
});

test("theme intelligence can repair an accent against a surface", () => {
  const repaired = ensureContrast("#F1D85B", "#FFFFFF", 4.5);
  assert.ok(contrastRatio(repaired, "#FFFFFF") >= 4.5);
});

test("adaptive themes preserve semantic status meaning", () => {
  const scheme = createValidatedSemanticScheme({
    seed: "#0A7C86",
    scheme: "light"
  });

  assert.equal(scheme.error, materialOneLightSemanticScheme.error);
  assert.equal(scheme.warning, materialOneLightSemanticScheme.warning);
  assert.equal(scheme.success, materialOneLightSemanticScheme.success);
  assert.notEqual(scheme.primary, materialOneLightSemanticScheme.primary);
  assert.equal(validateSemanticTheme(scheme).valid, true);
});

test("adaptive themes validate across light and dark schemes", () => {
  for (const seed of ["#0A7C86", "#7A42D8", "#B54823"]) {
    for (const schemeName of ["light", "dark"] as const) {
      const scheme = createValidatedSemanticScheme({
        seed,
        scheme: schemeName
      });
      assert.equal(validateSemanticTheme(scheme).valid, true);
    }
  }
});

test("high contrast themes strengthen muted content and outlines", () => {
  const scheme = createAdaptiveSemanticScheme({
    seed: "#4F5FD7",
    scheme: "dark",
    contrast: "high"
  });

  assert.equal(scheme.onSurfaceMuted, scheme.onSurface);
  assert.equal(scheme.outline, scheme.outlineStrong);
});

test("categorical visualization spreads series and adds redundant patterns", () => {
  const series = createSeriesEncodings([
    { key: "design", label: "Design", value: 42, unit: "%" },
    { key: "commerce", label: "Commerce", value: 31, unit: "%" },
    { key: "review", label: "Review", value: 17, unit: "%" },
    { key: "creative", label: "Creative", value: 10, unit: "%" }
  ]);

  assert.equal(new Set(series.map(({ colorCode }) => colorCode)).size, 4);
  assert.deepEqual(
    series.map(({ pattern }) => pattern),
    ["solid", "stripe", "dot", "crosshatch"]
  );
  assert.equal(series[0].ariaLabel, "Design: 42 %");
});

test("distribution summaries remain available outside visual presentation", () => {
  const data = [
    { key: "a", label: "Alpha", value: 3 },
    { key: "b", label: "Beta", value: 9 },
    { key: "c", label: "Gamma", value: 5 }
  ];

  const summary = summarizeDistribution(data);
  assert.equal(summary.total, 17);
  assert.equal(summary.minimum?.label, "Alpha");
  assert.equal(summary.maximum?.label, "Beta");
  assert.match(describeDistribution(data), /Highest: Beta, 9/);
});

test("visualization normalization clamps values", () => {
  assert.equal(normalizeVisualizationValue(5, 0, 10), 0.5);
  assert.equal(normalizeVisualizationValue(-5, 0, 10), 0);
  assert.equal(normalizeVisualizationValue(15, 0, 10), 1);
});

test("status visualization uses semantic roles rather than categorical colors", () => {
  const encoding = statusVisualizationEncoding("error", "dark");
  assert.equal(encoding.colorRole, "--mo-sem-error");
  assert.equal(encoding.containerRole, "--mo-sem-error-container");
  assert.equal(encoding.color, "#FFB4AB");
});

test("trend semantics distinguish positive, negative, and neutral values", () => {
  assert.equal(trendSemanticStatus(0.2), "success");
  assert.equal(trendSemanticStatus(-0.2), "error");
  assert.equal(trendSemanticStatus(-0.0005), "warning");
  assert.equal(trendSemanticStatus(0), "neutral");
});
