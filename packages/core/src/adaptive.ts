export type AdaptiveSignal =
  | "small-screen"
  | "large-screen"
  | "touch-input"
  | "keyboard-input"
  | "reduced-motion"
  | "high-contrast"
  | "large-text";

export interface AdaptiveEnvironment {
  width: number;
  height: number;
  input: "touch" | "mouse" | "keyboard" | "mixed";
  reducedMotion?: boolean;
  contrast?: "standard" | "high";
  textScale?: number;
}

export interface AdaptiveDecision {
  signals: AdaptiveSignal[];
  density: "compact" | "comfortable" | "spacious";
  interactionTarget: number;
  motion: "full" | "reduced" | "none";
}

export function resolveAdaptiveSignals(
  environment: AdaptiveEnvironment
): AdaptiveSignal[] {
  const signals: AdaptiveSignal[] = [];

  if (environment.width < 600) signals.push("small-screen");
  if (environment.width >= 1200) signals.push("large-screen");
  if (environment.input === "touch" || environment.input === "mixed") {
    signals.push("touch-input");
  }
  if (environment.input === "keyboard") signals.push("keyboard-input");
  if (environment.reducedMotion) signals.push("reduced-motion");
  if (environment.contrast === "high") signals.push("high-contrast");
  if ((environment.textScale ?? 1) > 1) signals.push("large-text");

  return signals;
}

export function resolveAdaptiveDecision(
  environment: AdaptiveEnvironment
): AdaptiveDecision {
  const signals = resolveAdaptiveSignals(environment);
  const touch = signals.includes("touch-input");
  const largeText = signals.includes("large-text");

  return {
    signals,
    density: largeText || touch ? "spacious" : "comfortable",
    interactionTarget: touch || largeText ? 48 : 44,
    motion: environment.reducedMotion ? "reduced" : "full"
  };
}
