import type {
  MaterialOneContext
} from "@material-one/core";
import {
  createLayoutProfile
} from "@material-one/layout";

export type ShellNavigation =
  | "bottom"
  | "rail"
  | "sidebar";

export type ShellContextPane =
  | "none"
  | "contextual"
  | "persistent";

export type ShellCommandSurface =
  | "overlay"
  | "inline"
  | "anchored";

export type OverlayKind =
  | "menu"
  | "dialog"
  | "sheet"
  | "command"
  | "notification";

export type OverlaySurface =
  | "popover"
  | "dialog"
  | "sheet"
  | "fullscreen"
  | "toast";

export interface ApplicationShellRecipe {
  navigation: ShellNavigation;
  topBarHeight: number;
  navigationSize: number;
  contentMaxWidth: number | "fluid";
  contextPane: ShellContextPane;
  contextPaneWidth: number;
  commandSurface: ShellCommandSurface;
  contentPadding: number;
}

export interface ApplicationShellOptions {
  contextPane?: ShellContextPane;
  preferFluidContent?: boolean;
  commandSurface?:
    | "automatic"
    | ShellCommandSurface;
}

export interface ApplicationShellPresentation {
  recipe: ApplicationShellRecipe;
  attributes: Record<string, string>;
  style: Record<string, string>;
}

export interface OverlayRecipe {
  presentation: OverlaySurface;
  modal: boolean;
  dismissOnBackdrop: boolean;
  maxWidth?: number;
}

export interface OverlayPresentation {
  kind: OverlayKind;
  recipe: OverlayRecipe;
  attributes: Record<string, string>;
  style: Record<string, string>;
}

export function resolveShellNavigation(
  context: MaterialOneContext
): ShellNavigation {
  if (context.layout === "compact") {
    return "bottom";
  }

  if (context.layout === "expanded") {
    return "rail";
  }

  return "sidebar";
}

export function resolveApplicationShell(
  context: MaterialOneContext,
  options: ApplicationShellOptions = {}
): ApplicationShellRecipe {
  const navigation =
    resolveShellNavigation(context);
  const layout =
    createLayoutProfile(context, {
      preferFluidContent:
        options.preferFluidContent
    });
  const requestedCommand =
    options.commandSurface ??
    "automatic";

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
      ? options.contextPane ??
        "contextual"
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
      navigation === "bottom"
        ? 72
        : navigation === "rail"
          ? 88
          : 280,
    contentMaxWidth:
      layout.contentMaxWidth,
    contextPane,
    contextPaneWidth:
      contextPane === "none"
        ? 0
        : 320,
    commandSurface,
    contentPadding:
      layout.contentPadding
  };
}

export function createApplicationShellPresentation(
  context: MaterialOneContext,
  options: ApplicationShellOptions = {}
): ApplicationShellPresentation {
  const recipe =
    resolveApplicationShell(
      context,
      options
    );

  const navWidth =
    recipe.navigation === "bottom"
      ? 0
      : recipe.navigationSize;
  const bottomNavHeight =
    recipe.navigation === "bottom"
      ? recipe.navigationSize
      : 0;

  return {
    recipe,
    attributes: {
      "data-mo-shell":
        "application",
      "data-mo-layout":
        context.layout,
      "data-mo-shell-navigation":
        recipe.navigation,
      "data-mo-shell-context":
        recipe.contextPane,
      "data-mo-shell-command-surface":
        recipe.commandSurface
    },
    style: {
      "--mo-shell-topbar-height":
        `${recipe.topBarHeight}px`,
      "--mo-shell-nav-width":
        `${navWidth}px`,
      "--mo-shell-bottom-nav-height":
        `${bottomNavHeight}px`,
      "--mo-shell-context-width":
        `${recipe.contextPaneWidth}px`,
      "--mo-shell-content-padding":
        `${recipe.contentPadding}px`,
      "--mo-shell-content-max":
        recipe.contentMaxWidth ===
        "fluid"
          ? "none"
          : `${recipe.contentMaxWidth}px`
    }
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
      presentation:
        context.layout ===
        "workspace"
          ? "dialog"
          : "sheet",
      modal: true,
      dismissOnBackdrop: true,
      maxWidth:
        context.layout ===
        "workspace"
          ? 760
          : undefined
    };
  }

  return {
    presentation:
      context.layout === "compact"
        ? "sheet"
        : "dialog",
    modal: true,
    dismissOnBackdrop: true,
    maxWidth:
      context.layout === "compact"
        ? undefined
        : 640
  };
}

export function createOverlayPresentation(
  context: MaterialOneContext,
  kind: OverlayKind
): OverlayPresentation {
  const recipe =
    resolveOverlay(context, kind);

  const attributes: Record<
    string,
    string
  > = {
    "data-mo-overlay-kind":
      kind,
    "data-mo-overlay-presentation":
      recipe.presentation,
    "data-mo-overlay-modal":
      String(recipe.modal),
    "data-mo-overlay-dismiss-backdrop":
      String(
        recipe.dismissOnBackdrop
      )
  };

  if (kind === "notification") {
    attributes.role = "status";
    attributes["aria-live"] =
      "polite";
  } else if (kind === "menu") {
    attributes.role = "menu";
  } else {
    attributes.role = "dialog";

    if (recipe.modal) {
      attributes["aria-modal"] =
        "true";
    }
  }

  const style: Record<
    string,
    string
  > = {};

  if (
    recipe.maxWidth !== undefined
  ) {
    style["--mo-overlay-max-width"] =
      `${recipe.maxWidth}px`;
  }

  return {
    kind,
    recipe,
    attributes,
    style
  };
}
