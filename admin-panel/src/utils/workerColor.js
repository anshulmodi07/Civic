// 🎨 Centralized worker color utility

const PALETTE = [
  "#2563EB", // blue
  "#7C3AED", // violet
  "#059669", // emerald
  "#D97706", // amber
  "#DC2626", // red
  "#0EA5E9", // sky
  "#6366F1", // indigo
  "#EC4899", // pink
  "#14B8A6", // teal
  "#16A34A", // green
  "#F97316", // orange
  "#8B5CF6", // purple
  "#0891B2", // cyan
  "#BE185D", // rose
  "#65A30D", // lime
  "#9333EA", // fuchsia
];

/**
 * Deterministic color generator
 * Same ID → same color always
 */
export function workerColor(id = "") {
  let hash = 0;

  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }

  return PALETTE[Math.abs(hash) % PALETTE.length];
}

/**
 * For badges / chips
 */
export function getWorkerColorChip(id = "") {
  const base = getWorkerColor(id);
  return {
    bg: `${base}18`,
    text: base,
  };
}