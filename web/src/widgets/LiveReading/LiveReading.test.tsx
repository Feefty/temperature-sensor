import { fireEvent, render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { axe } from 'jest-axe';
import { LiveReading } from '@/widgets/LiveReading';
import { server } from '@/test/server';

const BASE = 'http://localhost/api/v1';
const warm = { temperature: 24.3, state: 'WARM', capturedAt: '2026-05-31T10:00:00.000Z' };

describe('LiveReading', () => {
  it('shows the current reading and its state', async () => {
    server.use(http.get(`${BASE}/temperature`, () => HttpResponse.json(warm)));

    render(<LiveReading />);
    expect(await screen.findByText('24.3')).toBeInTheDocument();
    expect(screen.getByText('Warm')).toBeInTheDocument();
    expect(screen.queryByText(/overheating/i)).not.toBeInTheDocument();
  });

  it('raises an overheating alert when the reading is HOT', async () => {
    server.use(
      http.get(`${BASE}/temperature`, () =>
        HttpResponse.json({ ...warm, temperature: 41, state: 'HOT' }),
      ),
    );

    render(<LiveReading />);
    expect(await screen.findByRole('alert')).toHaveTextContent(/overheating/i);
  });

  it('shows an error state and recovers via the retry button', async () => {
    server.use(http.get(`${BASE}/temperature`, () => new HttpResponse(null, { status: 500 })));

    render(<LiveReading />);
    expect(await screen.findByText(/rack sensor is unavailable/i)).toBeInTheDocument();

    server.use(
      http.get(`${BASE}/temperature`, () =>
        HttpResponse.json({ ...warm, temperature: 18, state: 'COLD' }),
      ),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText('18.0')).toBeInTheDocument();
  });

  it('keeps the last reading and signals reconnecting after a failed poll', async () => {
    let call = 0;
    server.use(
      http.get(`${BASE}/temperature`, () => {
        call += 1;
        return call === 1 ? HttpResponse.json(warm) : new HttpResponse(null, { status: 500 });
      }),
    );

    render(<LiveReading pollMs={20} />);
    expect(await screen.findByText('24.3')).toBeInTheDocument();
    expect(await screen.findByText(/reconnecting/i)).toBeInTheDocument();
    expect(screen.getByText('24.3')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    server.use(http.get(`${BASE}/temperature`, () => HttpResponse.json(warm)));

    const { container } = render(<LiveReading />);
    await screen.findByText('24.3');
    expect(await axe(container)).toHaveNoViolations();
  });
});
