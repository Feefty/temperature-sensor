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

  it('moves the marker from left to right as the value rises', () => {
    const { container, rerender } = render(<Gauge value={-10} state="COLD" />);
    const coldX = Number(container.querySelector('circle')?.getAttribute('cx'));
    rerender(<Gauge value={50} state="HOT" />);
    const hotX = Number(container.querySelector('circle')?.getAttribute('cx'));
    expect(coldX).toBeLessThan(hotX);
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
