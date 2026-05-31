import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Field } from '@/components/Field';

describe('Field', () => {
  it('associates the label with the input', () => {
    render(<Field label="Cold below" type="number" defaultValue={22} />);
    expect(screen.getByLabelText('Cold below')).toHaveValue(22);
  });

  it('respects a caller-supplied id', () => {
    render(<Field label="Cold below" id="cold-max" />);
    expect(screen.getByLabelText('Cold below')).toHaveAttribute('id', 'cold-max');
  });

  it('omits aria-describedby when there is no hint', () => {
    render(<Field label="Hot from" />);
    expect(screen.getByLabelText('Hot from')).not.toHaveAttribute('aria-describedby');
  });

  it('links a hint via aria-describedby', () => {
    render(<Field label="Hot from" hint="Inclusive, in Celsius" />);
    const input = screen.getByLabelText('Hot from');
    const hint = screen.getByText('Inclusive, in Celsius');
    expect(input).toHaveAttribute('aria-describedby', hint.id);
  });

  it('keeps the hint association when the caller also describes the field', () => {
    render(<Field label="Hot from" hint="Inclusive" aria-describedby="error-1" />);
    const describedBy = screen.getByLabelText('Hot from').getAttribute('aria-describedby');
    expect(describedBy).toContain('error-1');
    expect(describedBy).toMatch(/-hint\b/);
  });

  it('supports the range type with min, max and value', () => {
    render(<Field label="Threshold" type="range" min={0} max={50} defaultValue={25} />);
    const input = screen.getByLabelText<HTMLInputElement>('Threshold');
    expect(input).toHaveAttribute('type', 'range');
    expect(input).toHaveAttribute('max', '50');
    expect(input.value).toBe('25');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Field label="Cold below" hint="Exclusive" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
