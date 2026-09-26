export const colorCodeNames = ["blue","cyan","teal","green","amber","orange","rose","violet"] as const;

export type ColorCodeName = (typeof colorCodeNames)[number];

export function colorCodeForKey(key: string): ColorCodeName {
  let hash = 0;
  for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return colorCodeNames[hash % colorCodeNames.length];
}

export function colorCodeRequiresRedundancy(): true {
  return true;
}
