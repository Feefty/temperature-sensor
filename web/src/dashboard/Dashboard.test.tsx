import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { axe } from 'jest-axe';
import { Dashboard } from '@/dashboard';
import { server } from '@/test/server';

const BASE = 'http://localhost/api/v1';

function mockApi() {
  server.use(
    http.get(`${BASE}/temperature`, () =>
      HttpResponse.json({
        temperature: 24.3,
        state: 'WARM',
        capturedAt: '2026-05-31T10:00:00.000Z',
      }),
    ),
    http.get(`${BASE}/temperature/history`, () =>
      HttpResponse.json([
        { temperature: 24.3, state: 'WARM', capturedAt: '2026-05-31T10:00:00.000Z' },
      ]),
    ),
  );
}

describe('Dashboard', () => {
  it('renders the live reading and the history regions', async () => {
    mockApi();

    render(<Dashboard />);
    expect(await screen.findByRole('region', { name: 'Rack sensor' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Recent readings' })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    mockApi();

    const { container } = render(<Dashboard />);
    await screen.findByRole('region', { name: 'Rack sensor' });
    expect(await axe(container)).toHaveNoViolations();
  });
});
