import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { StatusBadge } from '@/components/StatusBadge';
import type { SensorState } from '@/types';

describe('StatusBadge', () => {
  it.each<[SensorState, string]>([
    ['COLD', 'Cold'],
    ['WARM', 'Warm'],
    ['HOT', 'Hot'],
  ])('shows %s as an icon plus text, coloured by state', (state, label) => {
    const { container } = render(<StatusBadge state={state} />);
    expect(screen.getByText(label)).toBeInTheDocument();
    // Meaning is carried by text and an icon, never colour alone.
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('span')?.className).toMatch(state.toLowerCase());
  });

  it('forwards arbitrary props such as a title', () => {
    render(<StatusBadge state="HOT" title="Above the hot threshold" />);
    expect(screen.getByText('Hot')).toHaveAttribute('title', 'Above the hot threshold');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<StatusBadge state="WARM" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
