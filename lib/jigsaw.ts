export const CELL_W = 1.5;
export const CELL_H = 1;
export const TAB = 0.2;

export type Edge = -1 | 0 | 1;

export type Piece = {
  id: number;
  row: number;
  col: number;
  top: Edge;
  right: Edge;
  bottom: Edge;
  left: Edge;
};

function tabSign(row: number, col: number, kind: "h" | "v"): 1 | -1 {
  const n = row * 13 + col * 29 + (kind === "h" ? 3 : 11);
  return (n * 7) % 2 === 0 ? 1 : -1;
}

export function makePieces(rows: number, cols: number): Piece[] {
  const pieces: Piece[] = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const right = col === cols - 1 ? 0 : tabSign(row, col, "v");
      const bottom = row === rows - 1 ? 0 : tabSign(row, col, "h");
      const left = col === 0 ? 0 : ((-tabSign(row, col - 1, "v")) as Edge);
      const top = row === 0 ? 0 : ((-tabSign(row - 1, col, "h")) as Edge);

      pieces.push({
        id: row * cols + col,
        row,
        col,
        top,
        right,
        bottom,
        left,
      });
    }
  }

  return pieces;
}

function edge(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  tab: Edge,
): string {
  if (tab === 0) {
    return `L ${x2} ${y2}`;
  }

  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const px = uy * tab * TAB;
  const py = -ux * tab * TAB;
  const at = (t: number, depth: number) =>
    `${x1 + dx * t + px * depth} ${y1 + dy * t + py * depth}`;

  return [
    `L ${at(0.34, 0)}`,
    `C ${at(0.4, 0.05)} ${at(0.28, 0.42)} ${at(0.38, 0.68)}`,
    `C ${at(0.22, 0.95)} ${at(0.5, 1.18)} ${at(0.5, 1)}`,
    `C ${at(0.5, 1.18)} ${at(0.78, 0.95)} ${at(0.62, 0.68)}`,
    `C ${at(0.72, 0.42)} ${at(0.6, 0.05)} ${at(0.66, 0)}`,
    `L ${x2} ${y2}`,
  ].join(" ");
}

export function piecePath(piece: Piece): string {
  return [
    `M 0 0`,
    edge(0, 0, CELL_W, 0, piece.top),
    edge(CELL_W, 0, CELL_W, CELL_H, piece.right),
    edge(CELL_W, CELL_H, 0, CELL_H, piece.bottom),
    edge(0, CELL_H, 0, 0, piece.left),
    "Z",
  ].join(" ");
}

export function shuffleIds(ids: number[]): number[] {
  const next = [...ids];

  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = next[i];
    const swap = next[j];
    if (current === undefined || swap === undefined) {
      continue;
    }
    next[i] = swap;
    next[j] = current;
  }

  return next;
}

export const VIEW = {
  minX: -TAB,
  minY: -TAB,
  width: CELL_W + TAB * 2,
  height: CELL_H + TAB * 2,
} as const;
