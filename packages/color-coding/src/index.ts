export const colorCodeNames = [
  "blue",
  "cyan",
  "teal",
  "green",
  "amber",
  "orange",
  "rose",
  "violet"
] as const;

export type ColorCodeName = (typeof colorCodeNames)[number];
export type ColorCodeUsage =
  | "category"
  | "series"
  | "owner"
  | "priority"
  | "workflow";
export type ColorCodeCue = "dot" | "bar" | "surface" | "outline";

export interface ColorCodeAssignment {
  key: string;
  label: string;
  code: ColorCodeName;
  usage: ColorCodeUsage;
  cue: ColorCodeCue;
  requiresTextCue: true;
  requiresNonColorCue: true;
}

function hashKey(key: string): number {
  let hash = 2166136261;
  for (const char of key) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function colorCodeForKey(
  key: string,
  namespace = "material-one"
): ColorCodeName {
  const normalized = `${namespace}:${key.trim().toLowerCase()}`;
  return colorCodeNames[hashKey(normalized) % colorCodeNames.length];
}

export function createColorCodeAssignment(
  key: string,
  label: string,
  usage: ColorCodeUsage = "category",
  cue: ColorCodeCue = "dot"
): ColorCodeAssignment {
  return {
    key,
    label,
    code: colorCodeForKey(key, usage),
    usage,
    cue,
    requiresTextCue: true,
    requiresNonColorCue: true
  };
}

export function createColorCodeRegistry(
  entries: ReadonlyArray<{ key: string; label: string }>,
  usage: ColorCodeUsage = "category",
  cue: ColorCodeCue = "dot"
): ColorCodeAssignment[] {
  const sortedKeys = [...new Set(entries.map(({ key }) => key))]
    .sort((a, b) => a.localeCompare(b));
  const occupied = new Set<number>();
  const codeByKey = new Map<string, ColorCodeName>();

  for (const key of sortedKeys) {
    const preferred = colorCodeNames.indexOf(colorCodeForKey(key, usage));
    let selected = preferred;

    if (occupied.size < colorCodeNames.length) {
      for (let offset = 0; offset < colorCodeNames.length; offset += 1) {
        const candidate = (preferred + offset) % colorCodeNames.length;
        if (!occupied.has(candidate)) {
          selected = candidate;
          occupied.add(candidate);
          break;
        }
      }
    }

    codeByKey.set(key, colorCodeNames[selected]);
  }

  return entries.map(({ key, label }) => ({
    key,
    label,
    code: codeByKey.get(key) ?? colorCodeForKey(key, usage),
    usage,
    cue,
    requiresTextCue: true,
    requiresNonColorCue: true
  }));
}

export function priorityColorCode(
  priority: "low" | "normal" | "high" | "urgent"
): ColorCodeName {
  const map: Record<typeof priority, ColorCodeName> = {
    low: "teal",
    normal: "blue",
    high: "amber",
    urgent: "rose"
  };

  return map[priority];
}

export function colorCodeRequiresRedundancy(): true {
  return true;
}
