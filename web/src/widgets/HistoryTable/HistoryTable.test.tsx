import { fireEvent, render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { axe } from 'jest-axe';
import { HistoryTable } from '@/widgets/HistoryTable';
import { server } from '@/test/server';

const BASE = 'http://localhost/api/v1';
const rows = [
  { temperature: 24.3, state: 'WARM', capturedAt: '2026-05-31T10:00:02.000Z' },
  { temperature: 18, state: 'COLD', capturedAt: '2026-05-31T10:00:01.000Z' },
];

describe('HistoryTable', () => {
  it('lists the readings with their temperature and state', async () => {
    server.use(http.get(`${BASE}/temperature/history`, () => HttpResponse.json(rows)));

    render(<HistoryTable />);
    expect(await screen.findByText('24.3°C')).toBeInTheDocument();
    expect(screen.getByText('18.0°C')).toBeInTheDocument();
    expect(screen.getByText('Warm')).toBeInTheDocument();
    expect(screen.getByText('Cold')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(3); // header + two readings
  });

  it('shows an empty state when there are no readings', async () => {
    server.use(http.get(`${BASE}/temperature/history`, () => HttpResponse.json([])));

    render(<HistoryTable />);
    expect(await screen.findByText(/no readings captured/i)).toBeInTheDocument();
  });

  it('shows an error and recovers when refreshed', async () => {
    server.use(
      http.get(`${BASE}/temperature/history`, () => new HttpResponse(null, { status: 500 })),
    );

    render(<HistoryTable />);
    expect(await screen.findByText(/history is unavailable/i)).toBeInTheDocument();

    server.use(http.get(`${BASE}/temperature/history`, () => HttpResponse.json(rows)));
    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }));
    expect(await screen.findByText('24.3°C')).toBeInTheDocument();
  });

  it('keeps the last table and notes when a refresh fails', async () => {
    server.use(http.get(`${BASE}/temperature/history`, () => HttpResponse.json(rows)));
    render(<HistoryTable />);
    expect(await screen.findByText('24.3°C')).toBeInTheDocument();

    server.use(
      http.get(`${BASE}/temperature/history`, () => new HttpResponse(null, { status: 500 })),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }));
    expect(await screen.findByText(/couldn't refresh/i)).toBeInTheDocument();
    expect(screen.getByText('24.3°C')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    server.use(http.get(`${BASE}/temperature/history`, () => HttpResponse.json(rows)));

    const { container } = render(<HistoryTable />);
    await screen.findByText('24.3°C');
    expect(await axe(container)).toHaveNoViolations();
  });
});
