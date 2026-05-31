import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { AppShell } from '@/components/AppShell';

describe('AppShell', () => {
  it('exposes a single h1, the banner and main landmarks, and a skip link', () => {
    render(
      <AppShell title="Temperature Monitor">
        <p>Dashboard</p>
      </AppShell>,
    );
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Temperature Monitor' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    const main = screen.getByRole('main');
    expect(main).toContainElement(screen.getByText('Dashboard'));
    // The skip link can only move focus into main if main is a programmatic focus target.
    expect(main).toHaveAttribute('id', 'main');
    expect(main).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <AppShell title="Temperature Monitor">
        <h2>Section</h2>
      </AppShell>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
