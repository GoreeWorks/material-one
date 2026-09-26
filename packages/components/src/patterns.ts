export type AdaptivePattern =
  | "application-shell"
  | "workspace"
  | "dashboard"
  | "empty-state"
  | "progressive-loading";

export interface PatternContract {
  name: AdaptivePattern;
  responsive: boolean;
  semanticColorUsage: boolean;
  accessibilityRequired: boolean;
  personalizationAware: boolean;
}

export const adaptivePatterns: Record<AdaptivePattern, PatternContract> = {
  "application-shell": {
    name: "application-shell",
    responsive: true,
    semanticColorUsage: true,
    accessibilityRequired: true,
    personalizationAware: true
  },
  workspace: {
    name: "workspace",
    responsive: true,
    semanticColorUsage: true,
    accessibilityRequired: true,
    personalizationAware: true
  },
  dashboard: {
    name: "dashboard",
    responsive: true,
    semanticColorUsage: true,
    accessibilityRequired: true,
    personalizationAware: true
  },
  "empty-state": {
    name: "empty-state",
    responsive: true,
    semanticColorUsage: true,
    accessibilityRequired: true,
    personalizationAware: true
  },
  "progressive-loading": {
    name: "progressive-loading",
    responsive: true,
    semanticColorUsage: true,
    accessibilityRequired: true,
    personalizationAware: true
  }
};
