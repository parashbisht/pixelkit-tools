export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 B";
  if (bytes < 0) return "0 B";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const safeIndex = Math.min(i, sizes.length - 1);

  return `${parseFloat((bytes / Math.pow(k, safeIndex)).toFixed(dm))} ${sizes[safeIndex]}`;
}

export function formatDimensions(width: number, height: number): string {
  return `${width.toLocaleString()} × ${height.toLocaleString()} px`;
}

export function calculateSavings(
  originalBytes: number,
  newBytes: number,
): { percentage: number; text: string; isSaved: boolean } {
  if (originalBytes <= 0) {
    return { percentage: 0, text: "0%", isSaved: false };
  }

  const diff = originalBytes - newBytes;
  const percentage = Math.round((diff / originalBytes) * 100);

  if (diff > 0) {
    return {
      percentage,
      text: `${percentage}% smaller`,
      isSaved: true,
    };
  } else if (diff < 0) {
    const increase = Math.round((Math.abs(diff) / originalBytes) * 100);
    return {
      percentage: -increase,
      text: `${increase}% larger`,
      isSaved: false,
    };
  }

  return { percentage: 0, text: "No change", isSaved: false };
}
