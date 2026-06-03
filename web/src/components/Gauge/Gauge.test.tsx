import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Gauge } from '@/components/Gauge';

describe('Gauge', () => {
  it('is decorative, leaving the value to the textual readout', () => {
    const { container } = render(<Gauge value={24.3} state="WARM" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('draws the track, three zone arcs and a state-coloured marker', () => {
    const { container } = render(<Gauge value={40} state="HOT" />);
    expect(container.querySelectorAll('path')).toHaveLength(4);
    expect(container.querySelector('circle')?.getAttribute('class')).toMatch(/hot/);
  });

  it('rotates the marker along the arc as the value rises', () => {
    const { container, rerender } = render(<Gauge value={-10} state="COLD" />);
    expect(container.querySelector('circle')?.getAttribute('style')).toContain('rotate(0deg)');
    // Mid-scale must land at 90deg (top of the arc); the endpoints alone would hide a wrong
    // pivot, since 0deg and 180deg look right even when rotated about the wrong origin.
    rerender(<Gauge value={20} state="WARM" />);
    expect(container.querySelector('circle')?.getAttribute('style')).toContain('rotate(90deg)');
    rerender(<Gauge value={50} state="HOT" />);
    expect(container.querySelector('circle')?.getAttribute('style')).toContain('rotate(180deg)');
  });

  it('still draws three ordered zone arcs when the thresholds are crossed', () => {
    const { container } = render(<Gauge value={20} state="WARM" coldMax={40} hotMin={30} />);
    expect(container.querySelectorAll('path')).toHaveLength(4);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Gauge value={24.3} state="WARM" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
