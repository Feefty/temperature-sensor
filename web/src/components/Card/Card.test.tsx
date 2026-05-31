import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Card } from '@/components/Card';

describe('Card', () => {
  it('renders its children', () => {
    render(
      <Card>
        <p>Latest reading</p>
      </Card>,
    );
    expect(screen.getByText('Latest reading')).toBeInTheDocument();
  });

  it('merges a custom className and forwards props', () => {
    render(<Card data-testid="card" className="extra" />);
    expect(screen.getByTestId('card').className).toContain('extra');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Card>
        <h2>Sensor</h2>
      </Card>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
