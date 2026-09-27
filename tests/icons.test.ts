import test from "node:test";
import assert from "node:assert/strict";
import {
  createIconPresentation,
  createMaterialOneIconRegistry,
  defineMaterialOneIcon,
  getIconState,
  getMaterialOneIcon,
  materialOneIconGrid,
  resolveIconSize,
  resolveIconStrokeWidth
} from "../packages/icons/src/index.ts";

const arrow = defineMaterialOneIcon({
  name: "arrow-forward",
  style: "outline",
  weight: "regular",
  paths: [
    "M5 12h14",
    "M13 6l6 6-6 6"
  ],
  states: [
    {
      name: "active",
      paths: [
        "M4 12h15",
        "M12 5l7 7-7 7"
      ]
    }
  ],
  label: "Forward",
  mirrorInRtl: true
});

test("icon definitions enforce the canonical Material One geometry contract", () => {
  assert.equal(arrow.viewBox, "0 0 24 24");
  assert.equal(materialOneIconGrid.canvas, 24);
  assert.equal(materialOneIconGrid.liveArea, 20);
  assert.equal(
    materialOneIconGrid.defaultStroke,
    1.75
  );
});

test("icon state geometry resolves named states and falls back safely", () => {
  assert.deepEqual(
    getIconState(arrow, "active"),
    [
      "M4 12h15",
      "M12 5l7 7-7 7"
    ]
  );

  assert.deepEqual(
    getIconState(arrow, "unknown"),
    arrow.paths
  );
});

test("icon size and weight resolve semantic presentation values", () => {
  assert.equal(resolveIconSize("compact"), 18);
  assert.equal(resolveIconSize("standard"), 24);
  assert.equal(resolveIconSize("large"), 32);
  assert.equal(resolveIconSize("display"), 48);

  assert.equal(
    resolveIconStrokeWidth("light"),
    1.5
  );
  assert.equal(
    resolveIconStrokeWidth("regular"),
    1.75
  );
  assert.equal(
    resolveIconStrokeWidth("bold"),
    2.25
  );
});

test("icon presentation handles accessibility and RTL mirroring", () => {
  const presentation = createIconPresentation(
    arrow,
    {
      purpose: "navigation",
      state: "active",
      size: "large",
      direction: "rtl"
    }
  );

  assert.equal(
    presentation.attributes["data-mo-icon"],
    "arrow-forward"
  );
  assert.equal(
    presentation.attributes[
      "data-mo-icon-purpose"
    ],
    "navigation"
  );
  assert.equal(
    presentation.attributes[
      "data-mo-icon-mirrored"
    ],
    "true"
  );
  assert.equal(
    presentation.attributes["aria-label"],
    "Forward"
  );
  assert.equal(
    presentation.attributes.role,
    "img"
  );
  assert.equal(
    presentation.style["--mo-icon-size"],
    "32px"
  );
  assert.equal(
    presentation.style[
      "--mo-icon-stroke-width"
    ],
    "1.75"
  );
});

test("decorative icons are hidden from the accessibility tree", () => {
  const presentation = createIconPresentation(
    arrow,
    {
      purpose: "decorative"
    }
  );

  assert.equal(
    presentation.attributes["aria-hidden"],
    "true"
  );
  assert.equal(
    "aria-label" in presentation.attributes,
    false
  );
});

test("meaningful icons require an accessible label", () => {
  const unlabeled = defineMaterialOneIcon({
    name: "signal",
    style: "filled",
    weight: "regular",
    paths: ["M4 18h3V9H4z"]
  });

  assert.throws(
    () =>
      createIconPresentation(unlabeled, {
        purpose: "status"
      }),
    /accessible label/
  );
});

test("icon registries reject duplicate names and retrieve canonical definitions", () => {
  const menu = defineMaterialOneIcon({
    name: "menu",
    style: "outline",
    weight: "regular",
    paths: [
      "M4 7h16",
      "M4 12h16",
      "M4 17h16"
    ]
  });

  const registry =
    createMaterialOneIconRegistry([
      arrow,
      menu
    ]);

  assert.equal(
    getMaterialOneIcon(
      registry,
      "menu"
    ).name,
    "menu"
  );

  assert.throws(
    () =>
      createMaterialOneIconRegistry([
        menu,
        menu
      ]),
    /Duplicate Material One icon/
  );
});

test("definition validation rejects duplicate state names and blank geometry", () => {
  assert.throws(
    () =>
      defineMaterialOneIcon({
        name: "bad-state",
        style: "outline",
        weight: "regular",
        paths: ["M1 1h2"],
        states: [
          {
            name: "active",
            paths: ["M1 1h3"]
          },
          {
            name: "active",
            paths: ["M1 1h4"]
          }
        ]
      }),
    /duplicate state/
  );

  assert.throws(
    () =>
      defineMaterialOneIcon({
        name: "bad-path",
        style: "outline",
        weight: "regular",
        paths: [" "]
      }),
    /non-empty path/
  );
});
