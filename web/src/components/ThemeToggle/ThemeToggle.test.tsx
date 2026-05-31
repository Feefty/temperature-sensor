import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ThemeToggle } from '@/components/ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it('reflects the dark theme already applied to the document', () => {
    document.documentElement.dataset.theme = 'dark';
    render(<ThemeToggle />);
    expect(screen.getByRole('button', { name: 'Switch to light' })).toBeInTheDocument();
  });

  it('reflects the light theme already applied to the document', () => {
    document.documentElement.dataset.theme = 'light';
    render(<ThemeToggle />);
    expect(screen.getByRole('button', { name: 'Switch to dark' })).toBeInTheDocument();
  });

  it('toggles the theme on the document and persists the choice both ways', () => {
    document.documentElement.dataset.theme = 'dark';
    render(<ThemeToggle />);

    fireEvent.click(screen.getByRole('button', { name: 'Switch to light' }));
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');

    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark' }));
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('still applies the theme when storage writes are blocked', () => {
    document.documentElement.dataset.theme = 'dark';
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage blocked');
    });
    render(<ThemeToggle />);

    expect(() =>
      fireEvent.click(screen.getByRole('button', { name: 'Switch to light' })),
    ).not.toThrow();
    expect(document.documentElement.dataset.theme).toBe('light');

    setItem.mockRestore();
  });

  it('has no accessibility violations', async () => {
    document.documentElement.dataset.theme = 'dark';
    const { container } = render(<ThemeToggle />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
