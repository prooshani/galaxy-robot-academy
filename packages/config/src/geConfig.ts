export const GE_THRESHOLDS: Record<string, number> = {
  cadet: 0,
  explorer: 100,
  navigator: 300,
  commander: 600,
  admiral: 1000,
};

export const RANK_NAMES: Record<string, string> = {
  cadet: "Cadet",
  explorer: "Explorer",
  navigator: "Navigator",
  commander: "Commander",
  admiral: "Admiral",
};

export function getRankName(rankId: string): string {
  return RANK_NAMES[rankId] ?? "Unknown";
}

export function getRankByGE(totalGE: number): string {
  const entries = Object.entries(GE_THRESHOLDS).sort((a, b) => b[1] - a[1]);
  for (const [rankId, threshold] of entries) {
    if (totalGE >= threshold) {
      return rankId;
    }
  }
  return "cadet";
}
