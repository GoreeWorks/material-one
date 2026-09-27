import type {
  LayoutMode,
  MaterialOneContext,
  MotionPreference
} from "@material-one/core";
import type {
  AccessibilityContrast,
  MaterialOneAccessibilityPolicy
} from "@material-one/accessibility";
import {
  resolveMotionRecipe
} from "@material-one/motion";
import {
  createColorCodeRegistry,
  type ColorCodeName
} from "@material-one/color-coding";
import {
  semanticCssVariable,
  semanticStatusPair,
  type SemanticColorSchemeName,
  type SemanticStatus
} from "@material-one/semantic-colors";

export const visualizationPatterns = [
  "solid",
  "stripe",
  "dot",
  "crosshatch"
] as const;

export type VisualizationPattern =
  (typeof visualizationPatterns)[number];

export interface DataSeriesInput {
  key: string;
  label: string;
  value: number;
  unit?: string;
}

export interface DataSeriesEncoding
  extends DataSeriesInput {
  colorCode: ColorCodeName;
  colorVariable: string;
  pattern: VisualizationPattern;
  ariaLabel: string;
}

export interface DistributionSummary {
  total: number;
  minimum: DataSeriesInput | null;
  maximum: DataSeriesInput | null;
  count: number;
}

export interface StatusVisualizationEncoding {
  status: SemanticStatus;
  colorRole: string;
  onColorRole: string;
  containerRole: string;
  onContainerRole: string;
  color: string;
  onColor: string;
  container: string;
  onContainer: string;
}

export interface MaterialOneVisualizationPolicy {
  layout: LayoutMode;
  motion: MotionPreference;
  contrast: AccessibilityContrast;
  forcedColors: boolean;
  requireRedundantCues: true;
  transitionMs: number;
  transitionEasing: string;
}

export interface VisualizationPresentationOptions {
  label?: string;
}

export interface VisualizationPresentation {
  policy: MaterialOneVisualizationPolicy;
  attributes: Record<string, string>;
  style: Record<string, string>;
}

export interface SeriesPresentation {
  encoding: DataSeriesEncoding;
  attributes: Record<string, string>;
  style: Record<string, string>;
}

export interface StatusVisualizationPresentation {
  encoding: StatusVisualizationEncoding;
  attributes: Record<string, string>;
  style: Record<string, string>;
}

export function visualizationColorVariable(
  code: ColorCodeName
): string {
  return `--mo-code-${code}`;
}

export function formatSeriesValue(
  series: DataSeriesInput
): string {
  return `${series.value}${series.unit ? ` ${series.unit}` : ""}`;
}

export function createSeriesEncodings(
  series: readonly DataSeriesInput[]
): DataSeriesEncoding[] {
  const registry =
    createColorCodeRegistry(
      series.map(
        ({ key, label }) => ({
          key,
          label
        })
      ),
      "series",
      "bar"
    );

  const colorByKey = new Map(
    registry.map(
      ({ key, code }) =>
        [key, code] as const
    )
  );

  return series.map(
    (item, index) => {
      const colorCode =
        colorByKey.get(
          item.key
        ) ?? "blue";
      const pattern =
        visualizationPatterns[
          index %
            visualizationPatterns.length
        ];

      return {
        ...item,
        colorCode,
        colorVariable:
          visualizationColorVariable(
            colorCode
          ),
        pattern,
        ariaLabel:
          `${item.label}: ${formatSeriesValue(item)}`
      };
    }
  );
}

export function statusVisualizationEncoding(
  status: SemanticStatus,
  scheme:
    SemanticColorSchemeName = "light"
): StatusVisualizationEncoding {
  const pair =
    semanticStatusPair(
      status,
      scheme
    );
  const capitalized =
    status[0].toUpperCase() +
    status.slice(1);

  return {
    status,
    colorRole:
      semanticCssVariable(
        status
      ),
    onColorRole:
      semanticCssVariable(
        `on${capitalized}` as Parameters<
          typeof semanticCssVariable
        >[0]
      ),
    containerRole:
      semanticCssVariable(
        `${status}Container` as Parameters<
          typeof semanticCssVariable
        >[0]
      ),
    onContainerRole:
      semanticCssVariable(
        `on${capitalized}Container` as Parameters<
          typeof semanticCssVariable
        >[0]
      ),
    color: pair.background,
    onColor: pair.foreground,
    container: pair.container,
    onContainer:
      pair.onContainer
  };
}

export function createVisualizationPolicy(
  context: MaterialOneContext,
  accessibility:
    MaterialOneAccessibilityPolicy
): MaterialOneVisualizationPolicy {
  const transition =
    resolveMotionRecipe(
      "transform",
      accessibility.motion
    );

  return {
    layout: context.layout,
    motion:
      accessibility.motion,
    contrast:
      accessibility.contrast,
    forcedColors:
      accessibility.forcedColors,
    requireRedundantCues: true,
    transitionMs:
      transition.durationMs,
    transitionEasing:
      transition.easing
  };
}

export function createVisualizationPresentation(
  context: MaterialOneContext,
  accessibility:
    MaterialOneAccessibilityPolicy,
  options:
    VisualizationPresentationOptions = {}
): VisualizationPresentation {
  const policy =
    createVisualizationPolicy(
      context,
      accessibility
    );
  const label =
    options.label?.trim();

  return {
    policy,
    attributes: {
      "data-mo-visualization":
        "adaptive",
      "data-mo-layout":
        policy.layout,
      "data-mo-viz-motion":
        policy.motion,
      "data-mo-viz-contrast":
        policy.contrast,
      "data-mo-viz-forced-colors":
        policy.forcedColors
          ? "active"
          : "inactive",
      "data-mo-viz-redundancy":
        "required",
      ...(label
        ? {
            role: "group",
            "aria-label":
              label
          }
        : {})
    },
    style: {
      "--mo-viz-transition-duration":
        `${policy.transitionMs}ms`,
      "--mo-viz-transition-easing":
        policy.transitionEasing
    }
  };
}

export function createSeriesPresentation(
  encoding: DataSeriesEncoding,
  normalizedValue?: number
): SeriesPresentation {
  const style: Record<
    string,
    string
  > = {
    "--mo-code":
      `var(${encoding.colorVariable})`
  };

  if (
    normalizedValue !== undefined
  ) {
    const clamped =
      Math.max(
        0,
        Math.min(
          1,
          normalizedValue
        )
      );
    style["--mo-viz-value"] =
      `${Number(
        (clamped * 100)
          .toFixed(2)
      )}%`;
  }

  return {
    encoding,
    attributes: {
      "data-mo-viz-series-key":
        encoding.key,
      "data-mo-color-code":
        encoding.colorCode,
      "data-mo-viz-pattern":
        encoding.pattern,
      "aria-label":
        encoding.ariaLabel
    },
    style
  };
}

export function createStatusVisualizationPresentation(
  status: SemanticStatus,
  scheme:
    SemanticColorSchemeName = "light"
): StatusVisualizationPresentation {
  const encoding =
    statusVisualizationEncoding(
      status,
      scheme
    );

  return {
    encoding,
    attributes: {
      "data-mo-status":
        status
    },
    style: {
      "--mo-viz-status":
        `var(${encoding.colorRole})`,
      "--mo-viz-status-container":
        `var(${encoding.containerRole})`,
      "--mo-viz-on-status-container":
        `var(${encoding.onContainerRole})`
    }
  };
}

export function normalizeVisualizationValue(
  value: number,
  minimum: number,
  maximum: number
): number {
  if (
    !Number.isFinite(value) ||
    !Number.isFinite(minimum) ||
    !Number.isFinite(maximum)
  ) {
    throw new Error(
      "Visualization values must be finite numbers."
    );
  }

  if (maximum <= minimum) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      1,
      (value - minimum) /
        (maximum - minimum)
    )
  );
}

export function summarizeDistribution(
  series:
    readonly DataSeriesInput[]
): DistributionSummary {
  if (series.length === 0) {
    return {
      total: 0,
      minimum: null,
      maximum: null,
      count: 0
    };
  }

  let minimum = series[0];
  let maximum = series[0];
  let total = 0;

  for (const item of series) {
    total += item.value;

    if (
      item.value <
      minimum.value
    ) {
      minimum = item;
    }

    if (
      item.value >
      maximum.value
    ) {
      maximum = item;
    }
  }

  return {
    total,
    minimum,
    maximum,
    count: series.length
  };
}

export function describeDistribution(
  series:
    readonly DataSeriesInput[]
): string {
  const summary =
    summarizeDistribution(
      series
    );

  if (
    !summary.minimum ||
    !summary.maximum
  ) {
    return "No data is available.";
  }

  return [
    `${summary.count} series.`,
    `Highest: ${summary.maximum.label}, ${formatSeriesValue(summary.maximum)}.`,
    `Lowest: ${summary.minimum.label}, ${formatSeriesValue(summary.minimum)}.`,
    `Total: ${summary.total}.`
  ].join(" ");
}

export function trendSemanticStatus(
  value: number,
  warningThreshold = -0.001
): SemanticStatus | "neutral" {
  if (value > 0) {
    return "success";
  }

  if (
    value <
    warningThreshold
  ) {
    return "error";
  }

  if (value < 0) {
    return "warning";
  }

  return "neutral";
}
