export const motionIntents = [
  "instant",
  "feedback",
  "enter",
  "exit",
  "navigation",
  "transform",
  "emphasis",
  "loading"
] as const;

export type MotionIntent = (typeof motionIntents)[number];
export type MotionPreference = "full" | "reduced" | "none";

export interface MotionRecipe {
  intent: MotionIntent;
  durationMs: number;
  easing: string;
  translatePx: number;
  scaleFrom: number;
  opacityFrom: number;
  essential: boolean;
}

const fullMotionRecipes: Record<MotionIntent, Omit<MotionRecipe, "intent">> = {
  instant: {
    durationMs: 90,
    easing: "cubic-bezier(0.2, 0, 0, 1)",
    translatePx: 0,
    scaleFrom: 1,
    opacityFrom: 1,
    essential: true
  },
  feedback: {
    durationMs: 160,
    easing: "cubic-bezier(0.2, 0, 0, 1)",
    translatePx: 0,
    scaleFrom: 0.98,
    opacityFrom: 1,
    essential: true
  },
  enter: {
    durationMs: 220,
    easing: "cubic-bezier(0.2, 0, 0, 1)",
    translatePx: 8,
    scaleFrom: 0.99,
    opacityFrom: 0,
    essential: false
  },
  exit: {
    durationMs: 160,
    easing: "cubic-bezier(0.4, 0, 1, 1)",
    translatePx: 4,
    scaleFrom: 1,
    opacityFrom: 1,
    essential: false
  },
  navigation: {
    durationMs: 280,
    easing: "cubic-bezier(0.2, 0, 0, 1)",
    translatePx: 12,
    scaleFrom: 0.995,
    opacityFrom: 0,
    essential: false
  },
  transform: {
    durationMs: 460,
    easing: "cubic-bezier(0.2, 0, 0, 1)",
    translatePx: 16,
    scaleFrom: 0.96,
    opacityFrom: 1,
    essential: false
  },
  emphasis: {
    durationMs: 360,
    easing: "cubic-bezier(0.2, 0, 0, 1.2)",
    translatePx: 0,
    scaleFrom: 0.94,
    opacityFrom: 1,
    essential: false
  },
  loading: {
    durationMs: 1400,
    easing: "cubic-bezier(0.2, 0, 0, 1)",
    translatePx: 0,
    scaleFrom: 1,
    opacityFrom: 1,
    essential: false
  }
};

function reducedRecipe(intent: MotionIntent): MotionRecipe {
  const full = fullMotionRecipes[intent];

  if (full.essential) {
    return {
      intent,
      ...full,
      durationMs: Math.min(full.durationMs, 100),
      translatePx: 0,
      scaleFrom: 1,
      opacityFrom: 1
    };
  }

  return {
    intent,
    ...full,
    durationMs: 0,
    translatePx: 0,
    scaleFrom: 1,
    opacityFrom: 1
  };
}

export function resolveMotionRecipe(
  intent: MotionIntent,
  preference: MotionPreference = "full"
): MotionRecipe {
  if (preference === "none") {
    return {
      intent,
      ...fullMotionRecipes[intent],
      durationMs: 0,
      translatePx: 0,
      scaleFrom: 1,
      opacityFrom: 1
    };
  }

  if (preference === "reduced") return reducedRecipe(intent);

  return {
    intent,
    ...fullMotionRecipes[intent]
  };
}

export function motionDuration(
  intent: MotionIntent,
  preference: MotionPreference = "full"
): number {
  return resolveMotionRecipe(intent, preference).durationMs;
}

export function shouldAnimateMotion(
  intent: MotionIntent,
  preference: MotionPreference = "full"
): boolean {
  return motionDuration(intent, preference) > 0;
}

export function motionCssVariables(
  intent: MotionIntent,
  preference: MotionPreference = "full"
): Record<string, string> {
  const recipe = resolveMotionRecipe(intent, preference);

  return {
    "--mo-motion-duration": `${recipe.durationMs}ms`,
    "--mo-motion-easing": recipe.easing,
    "--mo-motion-translate": `${recipe.translatePx}px`,
    "--mo-motion-scale-from": String(recipe.scaleFrom),
    "--mo-motion-opacity-from": String(recipe.opacityFrom)
  };
}
