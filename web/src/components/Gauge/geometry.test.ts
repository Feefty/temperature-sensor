import { arcPath, pointOnArc, valueToAngle } from './geometry';

describe('gauge geometry', () => {
  it('places 0/90/180 degrees at the left, top and right of the arc', () => {
    expect(pointOnArc(100, 100, 80, 0)).toEqual({ x: 20, y: 100 });
    expect(pointOnArc(100, 100, 80, 90)).toMatchObject({ x: 100 });
    expect(pointOnArc(100, 100, 80, 90).y).toBeCloseTo(20);
    expect(pointOnArc(100, 100, 80, 180)).toMatchObject({ x: 180 });
  });

  it('maps a value across [min, max] to 0..180 and clamps out-of-range values', () => {
    expect(valueToAngle(-10, -10, 50)).toBe(0);
    expect(valueToAngle(20, -10, 50)).toBeCloseTo(90);
    expect(valueToAngle(50, -10, 50)).toBe(180);
    expect(valueToAngle(99, -10, 50)).toBe(180);
    expect(valueToAngle(-99, -10, 50)).toBe(0);
  });

  it('builds a sweeping arc path between two angles', () => {
    expect(arcPath(100, 100, 80, 0, 180)).toBe('M 20 100 A 80 80 0 0 1 180 100');
  });
});
