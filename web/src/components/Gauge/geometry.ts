export interface Point {
  x: number;
  y: number;
}

const round = (n: number) => Math.round(n * 100) / 100;

// A point on the gauge arc. Angles run 0 (left) to 180 (right) across the top semicircle.
// Coordinates are rounded to keep the path free of floating-point noise.
export function pointOnArc(cx: number, cy: number, r: number, angleDeg: number): Point {
  const radians = (angleDeg * Math.PI) / 180;
  return { x: round(cx - r * Math.cos(radians)), y: round(cy - r * Math.sin(radians)) };
}

// Maps a value in [min, max] to a 0..180 angle, clamped at the ends.
export function valueToAngle(value: number, min: number, max: number): number {
  const ratio = (value - min) / (max - min);
  return Math.min(1, Math.max(0, ratio)) * 180;
}

// SVG path for an arc of the top semicircle (segments never exceed 180 degrees, so the
// large-arc flag is always 0 and the sweep is clockwise).
export function arcPath(cx: number, cy: number, r: number, fromDeg: number, toDeg: number): string {
  const start = pointOnArc(cx, cy, r, fromDeg);
  const end = pointOnArc(cx, cy, r, toDeg);
  return `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`;
}
