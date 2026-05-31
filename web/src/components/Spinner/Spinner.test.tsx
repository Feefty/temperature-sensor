import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Spinner } from '@/components/Spinner';

describe('Spinner', () => {
  it('exposes a status role with a default label', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading');
  });

  it('accepts a custom label', () => {
    render(<Spinner label="Fetching readings" />);
    expect(screen.getByText('Fetching readings')).toBeInTheDocument();
  });

  it('applies the requested size', () => {
    render(<Spinner size="lg" />);
    expect(screen.getByRole('status').className).toMatch(/lg/);
  });

  it('forwards className and arbitrary props', () => {
    render(<Spinner className="inline" data-testid="spin" />);
    const el = screen.getByTestId('spin');
    expect(el).toHaveClass('inline');
    expect(el).toHaveAttribute('role', 'status');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Spinner size="lg" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
