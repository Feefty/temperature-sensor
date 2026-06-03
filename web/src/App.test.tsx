import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { axe } from 'jest-axe';
import { App } from './App';
import { server } from '@/test/server';

const BASE = 'http://localhost/api/v1';

describe('App', () => {
  beforeEach(() => {
    server.use(
      http.get(`${BASE}/temperature`, () =>
        HttpResponse.json({
          temperature: 24.3,
          state: 'WARM',
          capturedAt: '2026-05-31T10:00:00.000Z',
        }),
      ),
      http.get(`${BASE}/temperature/history`, () => HttpResponse.json([])),
    );
  });

  it('renders the dashboard shell with the live reading', async () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Temperature Monitor' }),
    ).toBeInTheDocument();
    expect(await screen.findByText('24.3')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<App />);
    await screen.findByText('24.3');
    expect(await axe(container)).toHaveNoViolations();
  });
});
