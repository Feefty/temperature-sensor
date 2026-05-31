import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Styleguide } from '@/styleguide';

describe('Styleguide', () => {
  it('renders a section for each primitive and the primitives themselves', () => {
    render(<Styleguide />);
    for (const heading of ['Buttons', 'Status', 'Card', 'Spinner', 'Fields']) {
      expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
    }
    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
    expect(screen.getByText('Cold')).toBeInTheDocument();
    expect(screen.getByText('Glass surface over a blurred backdrop.')).toBeInTheDocument();
    expect(screen.getAllByRole('status').length).toBeGreaterThan(0);
    expect(screen.getByLabelText('Threshold')).toHaveAttribute('type', 'range');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Styleguide />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
