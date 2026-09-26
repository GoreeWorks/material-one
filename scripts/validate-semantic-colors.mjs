import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const tokens = JSON.parse(
  await readFile(path.join(root, "tokens/material-one.tokens.json"), "utf8")
);

function rgb(hex) {
  const value = hex.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(value)) {
    throw new Error(`Invalid semantic color: ${hex}`);
  }
  return [0, 2, 4].map(
    (offset) => parseInt(value.slice(offset, offset + 2), 16) / 255
  );
}

function luminance(hex) {
  const channels = rgb(hex).map((channel) =>
    channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(a, b) {
  const left = luminance(a);
  const right = luminance(b);
  return (Math.max(left, right) + 0.05) / (Math.min(left, right) + 0.05);
}

const requiredRoles = [
  "primary",
  "onPrimary",
  "primaryContainer",
  "onPrimaryContainer",
  "secondary",
  "onSecondary",
  "secondaryContainer",
  "onSecondaryContainer",
  "tertiary",
  "onTertiary",
  "tertiaryContainer",
  "onTertiaryContainer",
  "background",
  "onBackground",
  "surface",
  "onSurface",
  "onSurfaceMuted",
  "surfaceSubtle",
  "surfaceContainer",
  "surfaceContainerHigh",
  "surfaceContainerHighest",
  "surfaceFloating",
  "surfaceInverse",
  "onSurfaceInverse",
  "outline",
  "outlineStrong",
  "success",
  "onSuccess",
  "successContainer",
  "onSuccessContainer",
  "warning",
  "onWarning",
  "warningContainer",
  "onWarningContainer",
  "error",
  "onError",
  "errorContainer",
  "onErrorContainer",
  "information",
  "onInformation",
  "informationContainer",
  "onInformationContainer",
  "focus",
  "selection",
  "selectionContainer",
  "hoverOverlay",
  "pressedOverlay",
  "disabled",
  "onDisabled",
  "link",
  "visitedLink"
];

const contrastPairs = [
  ["primary", "onPrimary"],
  ["primaryContainer", "onPrimaryContainer"],
  ["secondary", "onSecondary"],
  ["secondaryContainer", "onSecondaryContainer"],
  ["tertiary", "onTertiary"],
  ["tertiaryContainer", "onTertiaryContainer"],
  ["background", "onBackground"],
  ["surface", "onSurface"],
  ["surface", "onSurfaceMuted"],
  ["surfaceInverse", "onSurfaceInverse"],
  ["success", "onSuccess"],
  ["successContainer", "onSuccessContainer"],
  ["warning", "onWarning"],
  ["warningContainer", "onWarningContainer"],
  ["error", "onError"],
  ["errorContainer", "onErrorContainer"],
  ["information", "onInformation"],
  ["informationContainer", "onInformationContainer"],
  ["disabled", "onDisabled"],
  ["surface", "link"]
];

const semantic = tokens.color.semantic;
if (!semantic?.light || !semantic?.dark) {
  throw new Error("Material One requires light and dark semantic color schemes.");
}

const report = {
  tokenVersion: tokens.version,
  schemes: {}
};

for (const schemeName of ["light", "dark"]) {
  const scheme = semantic[schemeName];

  for (const role of requiredRoles) {
    if (!(role in scheme)) {
      throw new Error(`${schemeName} semantic scheme is missing ${role}`);
    }
  }

  const ratios = [];
  for (const [backgroundRole, foregroundRole] of contrastPairs) {
    const ratio = contrast(scheme[backgroundRole], scheme[foregroundRole]);
    if (ratio < 4.5) {
      throw new Error(
        `${schemeName} ${backgroundRole}/${foregroundRole} contrast is ${ratio.toFixed(2)}:1`
      );
    }
    ratios.push({
      backgroundRole,
      foregroundRole,
      ratio: Number(ratio.toFixed(2))
    });
  }

  report.schemes[schemeName] = {
    roles: requiredRoles.length,
    contrastPairs: ratios
  };
}

const tokenCss = await readFile(
  path.join(root, "tokens/css/material-one.css"),
  "utf8"
);
const semanticCss = await readFile(
  path.join(
    root,
    "packages/semantic-colors/css/material-one-semantic-colors.css"
  ),
  "utf8"
);

for (const role of requiredRoles) {
  const variable = `--mo-sem-${role.replace(
    /[A-Z]/g,
    (letter) => `-${letter.toLowerCase()}`
  )}`;

  if (!tokenCss.includes(variable)) {
    throw new Error(`Token CSS is missing semantic role ${variable}`);
  }
}

for (const marker of [
  "mo-semantic-tone",
  "mo-semantic-banner",
  "mo-semantic-surface",
  "mo-semantic-interactive",
  "forced-colors: active"
]) {
  if (!semanticCss.includes(marker)) {
    throw new Error(`Semantic color CSS is missing ${marker}`);
  }
}

await mkdir(path.join(root, "build"), { recursive: true });
await writeFile(
  path.join(root, "build/semantic-color-report.json"),
  JSON.stringify(report, null, 2) + "\n"
);

console.log(
  `Validated ${requiredRoles.length} semantic color roles across light and dark schemes.`
);
