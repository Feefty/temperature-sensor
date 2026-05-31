import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Button } from '@/components/Button';

describe('Button', () => {
  it('renders its label and defaults to type="button"', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'button');
  });

  it('calls onClick when pressed', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Apply</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is busy and disabled while loading, without polluting the accessible name', () => {
    render(<Button isLoading>Apply</Button>);
    const button = screen.getByRole('button', { name: 'Apply' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('stays disabled while loading even if disabled is explicitly false', () => {
    render(
      <Button isLoading disabled={false}>
        Apply
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
  });

  it('applies a distinct class for the secondary variant', () => {
    const { unmount } = render(<Button>Action</Button>);
    const primaryClass = screen.getByRole('button').className;
    unmount();

    render(<Button variant="secondary">Action</Button>);
    expect(screen.getByRole('button').className).not.toBe(primaryClass);
  });

  it('forwards its ref to the underlying button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Save</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('passes caller props through while controlled props still win', () => {
    render(
      <Button type="submit" aria-label="save changes" isLoading>
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'save changes' });
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Save</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
