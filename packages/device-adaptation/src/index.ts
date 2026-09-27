import type {
  DeviceContext,
  LayoutMode,
  MaterialOneContext
} from "@material-one/core";

export type DeviceClass =
  | "handheld"
  | "tablet"
  | "desktop"
  | "large-screen";

export type PointerCapability =
  | "coarse"
  | "fine"
  | "mixed"
  | "none";

export type DeviceCapabilityState =
  | "available"
  | "unavailable"
  | "unknown";

export type DeviceDisplayMode =
  | "browser"
  | "standalone"
  | "fullscreen";

export interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ViewportSegment {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DeviceAdaptationEnvironment {
  pointer?: PointerCapability;
  hover?: DeviceCapabilityState;
  keyboard?: DeviceCapabilityState;
  touch?: DeviceCapabilityState;
  displayMode?: DeviceDisplayMode;
  safeArea?: Partial<SafeAreaInsets>;
  viewportSegments?: readonly ViewportSegment[];
}

export interface MaterialOneDeviceAdaptationProfile {
  deviceClass: DeviceClass;
  layout: LayoutMode;
  orientation: DeviceContext["orientation"];
  input: DeviceContext["input"];
  pointer: PointerCapability;
  hover: DeviceCapabilityState;
  keyboard: DeviceCapabilityState;
  touch: DeviceCapabilityState;
  displayMode: DeviceDisplayMode;
  viewport: {
    width: number;
    height: number;
    pixelRatio: number;
  };
  safeArea: SafeAreaInsets;
  viewportSegments: readonly ViewportSegment[];
  segmentedViewport: boolean;
  interactionTarget: number;
}

export interface DeviceAdaptationPresentation {
  profile: MaterialOneDeviceAdaptationProfile;
  attributes: Record<string, string>;
  style: Record<string, string>;
}

function finiteNonNegative(value: number | undefined): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, value ?? 0);
}

function normalizePixelRatio(value: number | undefined): number {
  if (!Number.isFinite(value) || (value ?? 0) <= 0) return 1;
  return Math.round((value ?? 1) * 100) / 100;
}

function normalizeInset(value: number | undefined, maximum: number): number {
  return Math.min(finiteNonNegative(value), Math.max(0, maximum));
}

export function normalizeSafeArea(
  safeArea: Partial<SafeAreaInsets> = {},
  viewport: Pick<DeviceContext, "width" | "height">
): SafeAreaInsets {
  const width = finiteNonNegative(viewport.width);
  const height = finiteNonNegative(viewport.height);

  return {
    top: normalizeInset(safeArea.top, height / 2),
    right: normalizeInset(safeArea.right, width / 2),
    bottom: normalizeInset(safeArea.bottom, height / 2),
    left: normalizeInset(safeArea.left, width / 2)
  };
}

function normalizeViewportSegments(
  segments: readonly ViewportSegment[] | undefined,
  width: number,
  height: number
): ViewportSegment[] {
  const valid = (segments ?? [])
    .filter(
      (segment) =>
        Number.isFinite(segment.x) &&
        Number.isFinite(segment.y) &&
        Number.isFinite(segment.width) &&
        Number.isFinite(segment.height) &&
        segment.width > 0 &&
        segment.height > 0
    )
    .map((segment) => ({
      x: Math.max(0, segment.x),
      y: Math.max(0, segment.y),
      width: Math.min(segment.width, width),
      height: Math.min(segment.height, height)
    }));

  if (valid.length > 0) return valid;

  return [
    {
      x: 0,
      y: 0,
      width,
      height
    }
  ];
}

export function resolveDeviceClass(
  device: Pick<DeviceContext, "width">
): DeviceClass {
  const width = finiteNonNegative(device.width);

  if (width < 600) return "handheld";
  if (width < 1200) return "tablet";
  if (width < 1800) return "desktop";
  return "large-screen";
}

export function resolvePointerCapability(
  input: DeviceContext["input"]
): PointerCapability {
  switch (input) {
    case "touch":
      return "coarse";
    case "mouse":
      return "fine";
    case "mixed":
      return "mixed";
    case "keyboard":
      return "none";
  }
}

export function resolveHoverCapability(
  input: DeviceContext["input"]
): DeviceCapabilityState {
  switch (input) {
    case "mouse":
    case "mixed":
      return "available";
    case "touch":
      return "unavailable";
    case "keyboard":
      return "unknown";
  }
}

export function resolveKeyboardCapability(
  input: DeviceContext["input"]
): DeviceCapabilityState {
  return input === "keyboard" || input === "mixed"
    ? "available"
    : "unknown";
}

export function resolveTouchCapability(
  input: DeviceContext["input"]
): DeviceCapabilityState {
  return input === "touch" || input === "mixed"
    ? "available"
    : "unknown";
}

export function createDeviceAdaptationProfile(
  context: MaterialOneContext,
  environment: DeviceAdaptationEnvironment = {}
): MaterialOneDeviceAdaptationProfile {
  const width = finiteNonNegative(context.device.width);
  const height = finiteNonNegative(context.device.height);
  const viewportSegments = normalizeViewportSegments(
    environment.viewportSegments,
    width,
    height
  );

  return {
    deviceClass: resolveDeviceClass(context.device),
    layout: context.layout,
    orientation: context.device.orientation,
    input: context.device.input,
    pointer:
      environment.pointer ??
      resolvePointerCapability(context.device.input),
    hover:
      environment.hover ??
      resolveHoverCapability(context.device.input),
    keyboard:
      environment.keyboard ??
      resolveKeyboardCapability(context.device.input),
    touch:
      environment.touch ??
      resolveTouchCapability(context.device.input),
    displayMode: environment.displayMode ?? "browser",
    viewport: {
      width,
      height,
      pixelRatio: normalizePixelRatio(context.device.pixelRatio)
    },
    safeArea: normalizeSafeArea(environment.safeArea, {
      width,
      height
    }),
    viewportSegments,
    segmentedViewport: viewportSegments.length > 1,
    interactionTarget: context.interactionTarget
  };
}

export function createDeviceAdaptationPresentation(
  context: MaterialOneContext,
  environment: DeviceAdaptationEnvironment = {}
): DeviceAdaptationPresentation {
  const profile = createDeviceAdaptationProfile(
    context,
    environment
  );

  return {
    profile,
    attributes: {
      "data-mo-device-class": profile.deviceClass,
      "data-mo-layout": profile.layout,
      "data-mo-orientation": profile.orientation,
      "data-mo-input": profile.input,
      "data-mo-pointer": profile.pointer,
      "data-mo-hover": profile.hover,
      "data-mo-keyboard": profile.keyboard,
      "data-mo-touch": profile.touch,
      "data-mo-display-mode": profile.displayMode,
      "data-mo-segmented-viewport": profile.segmentedViewport
        ? "true"
        : "false"
    },
    style: {
      "--mo-viewport-width": `${profile.viewport.width}px`,
      "--mo-viewport-height": `${profile.viewport.height}px`,
      "--mo-pixel-ratio": String(profile.viewport.pixelRatio),
      "--mo-safe-area-top": `${profile.safeArea.top}px`,
      "--mo-safe-area-right": `${profile.safeArea.right}px`,
      "--mo-safe-area-bottom": `${profile.safeArea.bottom}px`,
      "--mo-safe-area-left": `${profile.safeArea.left}px`,
      "--mo-viewport-segment-count": String(
        profile.viewportSegments.length
      ),
      "--mo-device-min-target": `${profile.interactionTarget}px`
    }
  };
}

export function createDeviceAdaptationSignature(
  profile: MaterialOneDeviceAdaptationProfile
): string {
  const segments = profile.viewportSegments
    .map(
      (segment) =>
        `${segment.x},${segment.y},${segment.width},${segment.height}`
    )
    .join("|");

  return [
    profile.deviceClass,
    profile.layout,
    profile.orientation,
    profile.input,
    profile.pointer,
    profile.hover,
    profile.keyboard,
    profile.touch,
    profile.displayMode,
    profile.viewport.width,
    profile.viewport.height,
    profile.viewport.pixelRatio,
    profile.safeArea.top,
    profile.safeArea.right,
    profile.safeArea.bottom,
    profile.safeArea.left,
    segments,
    profile.interactionTarget
  ].join(":");
}

export function hasDeviceAdaptationChanged(
  current: MaterialOneDeviceAdaptationProfile,
  next: MaterialOneDeviceAdaptationProfile
): boolean {
  return (
    createDeviceAdaptationSignature(current) !==
    createDeviceAdaptationSignature(next)
  );
}
