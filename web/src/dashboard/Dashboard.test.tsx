import { fireEvent, render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { axe } from 'jest-axe';
import { Dashboard } from '@/dashboard';
import { server } from '@/test/server';

const BASE = 'http://localhost/api/v1';
const reading = { temperature: 24.3, state: 'WARM', capturedAt: '2026-05-31T10:00:00.000Z' };

function mockApi() {
  server.use(
    http.get(`${BASE}/temperature`, () => HttpResponse.json(reading)),
    http.get(`${BASE}/temperature/history`, () => HttpResponse.json([reading])),
    http.get(`${BASE}/thresholds`, () => HttpResponse.json({ coldMax: 22, hotMin: 35 })),
  );
}

describe('Dashboard', () => {
  it('renders the live reading, threshold form and history regions', async () => {
    mockApi();

    render(<Dashboard />);
    expect(await screen.findByRole('region', { name: 'Rack sensor' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Cooling thresholds' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Recent readings' })).toBeInTheDocument();
  });

  it('refreshes the history after thresholds are saved', async () => {
    let historyCalls = 0;
    server.use(
      http.get(`${BASE}/temperature`, () => HttpResponse.json(reading)),
      http.get(`${BASE}/thresholds`, () => HttpResponse.json({ coldMax: 22, hotMin: 35 })),
      http.put(`${BASE}/thresholds`, async ({ request }) =>
        HttpResponse.json(await request.json()),
      ),
      http.get(`${BASE}/temperature/history`, () => {
        historyCalls += 1;
        return HttpResponse.json(historyCalls === 1 ? [] : [reading]);
      }),
    );

    render(<Dashboard />);
    expect(await screen.findByText(/no readings captured/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Apply thresholds' }));
    expect(await screen.findByText('24.3°C')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    mockApi();

    const { container } = render(<Dashboard />);
    await screen.findByRole('region', { name: 'Rack sensor' });
    expect(await axe(container)).toHaveNoViolations();
  });

  it('switches to a tabbed layout on narrow screens', async () => {
    const original = window.matchMedia;
    window.matchMedia = ((query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList) as typeof window.matchMedia;

    try {
      mockApi();
      const { container } = render(<Dashboard />);

      expect(await screen.findByRole('region', { name: 'Rack sensor' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Monitor' })).toHaveAttribute('aria-selected', 'true');
      // Inactive panels are hidden, so their regions are off the accessibility tree.
      expect(screen.queryByRole('region', { name: 'Recent readings' })).not.toBeInTheDocument();
      // Exercise axe against the tabbed layout, which the default (wide) mock never renders.
      expect(await axe(container)).toHaveNoViolations();

      fireEvent.click(screen.getByRole('tab', { name: 'History' }));
      expect(await screen.findByRole('region', { name: 'Recent readings' })).toBeInTheDocument();
    } finally {
      window.matchMedia = original;
    }
  });
});
