import type { MaterialOneContext } from "@material-one/core";

export type ShellNavigation = "bottom" | "rail" | "sidebar";
export type ShellContextPane = "none" | "contextual" | "persistent";
export type OverlayKind =
  | "menu"
  | "dialog"
  | "sheet"
  | "command"
  | "notification";

export interface ApplicationShellRecipe {
  navigation: ShellNavigation;
  topBarHeight: number;
  navigationSize: number;
  contentMaxWidth: number | "fluid";
  contextPane: ShellContextPane;
  contextPaneWidth: number;
  commandSurface: "overlay" | "inline" | "anchored";
  contentPadding: number;
}

export interface ApplicationShellOptions {
  contextPane?: ShellContextPane;
  preferFluidContent?: boolean;
  commandSurface?: "automatic" | "overlay" | "inline" | "anchored";
}

export interface OverlayRecipe {
  presentation: "popover" | "dialog" | "sheet" | "fullscreen" | "toast";
  modal: boolean;
  dismissOnBackdrop: boolean;
  maxWidth?: number;
}

export function resolveShellNavigation(
  context: MaterialOneContext
): ShellNavigation {
  if (context.layout === "compact") return "bottom";
  if (context.layout === "expanded") return "rail";
  return "sidebar";
}

export function resolveApplicationShell(
  context: MaterialOneContext,
  options: ApplicationShellOptions = {}
): ApplicationShellRecipe {
  const navigation = resolveShellNavigation(context);
  const requestedCommand = options.commandSurface ?? "automatic";

  const commandSurface =
    requestedCommand !== "automatic"
      ? requestedCommand
      : context.layout === "compact"
        ? "overlay"
        : context.layout === "expanded"
          ? "inline"
          : "anchored";

  const contextPane =
    context.layout === "workspace"
      ? options.contextPane ?? "contextual"
      : "none";

  return {
    navigation,
    topBarHeight:
      context.layout === "compact"
        ? 56
        : context.layout === "expanded"
          ? 64
          : 68,
    navigationSize:
      navigation === "bottom" ? 72 : navigation === "rail" ? 88 : 280,
    contentMaxWidth:
      options.preferFluidContent || context.layout === "workspace"
        ? "fluid"
        : context.layout === "compact"
          ? 720
          : 1120,
    contextPane,
    contextPaneWidth: contextPane === "none" ? 0 : 320,
    commandSurface,
    contentPadding:
      context.layout === "compact"
        ? 16
        : context.layout === "expanded"
          ? 24
          : 32
  };
}

export function resolveOverlay(
  context: MaterialOneContext,
  kind: OverlayKind
): OverlayRecipe {
  if (kind === "notification") {
    return {
      presentation: "toast",
      modal: false,
      dismissOnBackdrop: false,
      maxWidth: 420
    };
  }

  if (kind === "menu") {
    return context.layout === "compact"
      ? {
          presentation: "sheet",
          modal: true,
          dismissOnBackdrop: true
        }
      : {
          presentation: "popover",
          modal: false,
          dismissOnBackdrop: true,
          maxWidth: 360
        };
  }

  if (kind === "command") {
    return context.layout === "compact"
      ? {
          presentation: "fullscreen",
          modal: true,
          dismissOnBackdrop: false
        }
      : {
          presentation: "dialog",
          modal: true,
          dismissOnBackdrop: true,
          maxWidth: 720
        };
  }

  if (kind === "sheet") {
    return {
      presentation: context.layout === "workspace" ? "dialog" : "sheet",
      modal: true,
      dismissOnBackdrop: true,
      maxWidth: context.layout === "workspace" ? 760 : undefined
    };
  }

  return {
    presentation: context.layout === "compact" ? "sheet" : "dialog",
    modal: true,
    dismissOnBackdrop: true,
    maxWidth: context.layout === "compact" ? undefined : 640
  };
}
