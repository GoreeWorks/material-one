import {
  createColorCodeAssignment,
  priorityColorCode,
  type ColorCodeCue,
  type ColorCodeName,
  type ColorCodeUsage,
  type GoreeWorksPriorityLevel
} from "@material-one/color-coding";
import {
  semanticColor,
  semanticCssVariable,
  semanticStatusPair,
  type SemanticColorPair,
  type SemanticColorRole,
  type SemanticColorSchemeName,
  type SemanticStatus
} from "@material-one/semantic-colors";

export type ColorIntelligenceSource =
  | "semantic-colors"
  | "color-coding";

export type ColorIntelligenceRequest =
  | {
      kind: "semantic";
      role: SemanticColorRole;
      scheme?: SemanticColorSchemeName;
    }
  | {
      kind: "status";
      status: SemanticStatus;
      scheme?: SemanticColorSchemeName;
    }
  | {
      kind: "category";
      key: string;
      label: string;
      usage?: Exclude<ColorCodeUsage, "priority">;
      cue?: ColorCodeCue;
    }
  | {
      kind: "priority";
      priority: GoreeWorksPriorityLevel;
      cue?: ColorCodeCue;
    };

export interface SemanticColorIntelligenceResolution {
  kind: "semantic";
  source: "semantic-colors";
  role: SemanticColorRole;
  scheme: SemanticColorSchemeName;
  value: string;
  cssVariable: string;
  requiresTextCue: false;
  requiresNonColorCue: false;
}

export interface StatusColorIntelligenceResolution {
  kind: "status";
  source: "semantic-colors";
  status: SemanticStatus;
  scheme: SemanticColorSchemeName;
  pair: SemanticColorPair;
  cssVariables: {
    background: string;
    foreground: string;
    container: string;
    onContainer: string;
  };
  requiresTextCue: true;
  requiresNonColorCue: true;
}

export interface CategoricalColorIntelligenceResolution {
  kind: "category";
  source: "color-coding";
  key: string;
  label: string;
  usage: Exclude<ColorCodeUsage, "priority">;
  cue: ColorCodeCue;
  code: ColorCodeName;
  cssVariables: {
    base: string;
    container: string;
    onContainer: string;
  };
  requiresTextCue: true;
  requiresNonColorCue: true;
}

export interface PriorityColorIntelligenceResolution {
  kind: "priority";
  source: "color-coding";
  priority: GoreeWorksPriorityLevel;
  cue: ColorCodeCue;
  code: ColorCodeName;
  cssVariables: {
    base: string;
    container: string;
    onContainer: string;
  };
  requiresTextCue: true;
  requiresNonColorCue: true;
}

export type ColorIntelligenceResolution =
  | SemanticColorIntelligenceResolution
  | StatusColorIntelligenceResolution
  | CategoricalColorIntelligenceResolution
  | PriorityColorIntelligenceResolution;

export interface ColorIntelligencePresentation {
  resolution: ColorIntelligenceResolution;
  attributes: Record<string, string>;
  style: Record<string, string>;
}

function colorCodeCssVariables(
  code: ColorCodeName
): {
  base: string;
  container: string;
  onContainer: string;
} {
  return {
    base: `--mo-code-${code}`,
    container: `--mo-code-${code}-container`,
    onContainer: `--mo-code-${code}-on-container`
  };
}

function titleCasePriority(
  priority: GoreeWorksPriorityLevel
): string {
  return priority[0].toUpperCase() + priority.slice(1);
}

export function resolveColorIntelligence(
  request: ColorIntelligenceRequest
): ColorIntelligenceResolution {
  if (request.kind === "semantic") {
    const scheme = request.scheme ?? "light";

    return {
      kind: "semantic",
      source: "semantic-colors",
      role: request.role,
      scheme,
      value: semanticColor(request.role, scheme),
      cssVariable: semanticCssVariable(request.role),
      requiresTextCue: false,
      requiresNonColorCue: false
    };
  }

  if (request.kind === "status") {
    const scheme = request.scheme ?? "light";
    const roleName =
      request.status[0].toUpperCase() +
      request.status.slice(1);

    return {
      kind: "status",
      source: "semantic-colors",
      status: request.status,
      scheme,
      pair: semanticStatusPair(request.status, scheme),
      cssVariables: {
        background: semanticCssVariable(
          request.status as SemanticColorRole
        ),
        foreground: semanticCssVariable(
          `on${roleName}` as SemanticColorRole
        ),
        container: semanticCssVariable(
          `${request.status}Container` as SemanticColorRole
        ),
        onContainer: semanticCssVariable(
          `on${roleName}Container` as SemanticColorRole
        )
      },
      requiresTextCue: true,
      requiresNonColorCue: true
    };
  }

  if (request.kind === "category") {
    const usage = request.usage ?? "category";
    const cue = request.cue ?? "dot";
    const assignment = createColorCodeAssignment(
      request.key,
      request.label,
      usage,
      cue
    );

    return {
      kind: "category",
      source: "color-coding",
      key: assignment.key,
      label: assignment.label,
      usage,
      cue,
      code: assignment.code,
      cssVariables: colorCodeCssVariables(
        assignment.code
      ),
      requiresTextCue: true,
      requiresNonColorCue: true
    };
  }

  const cue = request.cue ?? "bar";
  const code = priorityColorCode(request.priority);

  return {
    kind: "priority",
    source: "color-coding",
    priority: request.priority,
    cue,
    code,
    cssVariables: colorCodeCssVariables(code),
    requiresTextCue: true,
    requiresNonColorCue: true
  };
}

export function createColorIntelligencePresentation(
  request: ColorIntelligenceRequest
): ColorIntelligencePresentation {
  const resolution = resolveColorIntelligence(request);

  if (resolution.kind === "semantic") {
    return {
      resolution,
      attributes: {
        "data-mo-color-intent": "semantic",
        "data-mo-color-role": resolution.role,
        "data-mo-color-source": resolution.source
      },
      style: {
        "--mo-intelligent-color":
          `var(${resolution.cssVariable})`
      }
    };
  }

  if (resolution.kind === "status") {
    return {
      resolution,
      attributes: {
        "data-mo-color-intent": "status",
        "data-mo-status": resolution.status,
        "data-mo-color-source": resolution.source,
        "data-mo-color-redundancy": "required"
      },
      style: {
        "--mo-intelligent-color":
          `var(${resolution.cssVariables.background})`,
        "--mo-intelligent-on-color":
          `var(${resolution.cssVariables.foreground})`,
        "--mo-intelligent-container":
          `var(${resolution.cssVariables.container})`,
        "--mo-intelligent-on-container":
          `var(${resolution.cssVariables.onContainer})`
      }
    };
  }

  const label =
    resolution.kind === "priority"
      ? titleCasePriority(resolution.priority)
      : resolution.label;

  return {
    resolution,
    attributes: {
      "data-mo-color-intent": resolution.kind,
      "data-mo-color-source": resolution.source,
      "data-mo-color-code": resolution.code,
      "data-mo-color-cue": resolution.cue,
      "data-mo-color-label": label,
      "data-mo-color-redundancy": "required"
    },
    style: {
      "--mo-intelligent-color":
        `var(${resolution.cssVariables.base})`,
      "--mo-intelligent-container":
        `var(${resolution.cssVariables.container})`,
      "--mo-intelligent-on-container":
        `var(${resolution.cssVariables.onContainer})`
    }
  };
}
