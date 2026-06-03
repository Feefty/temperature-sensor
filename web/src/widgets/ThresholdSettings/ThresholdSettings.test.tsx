import { fireEvent, render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { axe } from 'jest-axe';
import { ThresholdSettings } from '@/widgets/ThresholdSettings';
import { server } from '@/test/server';

const BASE = 'http://localhost/api/v1';

describe('ThresholdSettings', () => {
  it('saves valid thresholds, confirms and reports them to the parent', async () => {
    server.use(
      http.put(`${BASE}/thresholds`, async ({ request }) =>
        HttpResponse.json(await request.json()),
      ),
    );
    const onSaved = vi.fn();

    render(<ThresholdSettings onSaved={onSaved} />);
    fireEvent.change(screen.getByLabelText(/cold below/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/hot from/i), { target: { value: '40' } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply thresholds' }));

    expect(await screen.findByText('Thresholds updated.')).toBeInTheDocument();
    expect(onSaved).toHaveBeenCalledWith({ coldMax: 10, hotMin: 40 });
  });

  it('blocks cold >= hot, ties the error to the inputs and disables the submit', () => {
    render(<ThresholdSettings />);
    fireEvent.change(screen.getByLabelText(/cold below/i), { target: { value: '40' } });

    expect(screen.getByText(/cold below hot/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply thresholds' })).toBeDisabled();
    expect(screen.getByLabelText(/cold below/i)).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining('thresholds-error'),
    );
  });

  it('blocks values outside the sensor range and an empty field', () => {
    render(<ThresholdSettings />);

    fireEvent.change(screen.getByLabelText(/cold below/i), { target: { value: '999' } });
    expect(screen.getByRole('button', { name: 'Apply thresholds' })).toBeDisabled();
    expect(screen.getByText(/-10 to 50/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/cold below/i), { target: { value: '' } });
    expect(screen.getByRole('button', { name: 'Apply thresholds' })).toBeDisabled();
  });

  it('clears the saved confirmation once an input changes', async () => {
    server.use(
      http.put(`${BASE}/thresholds`, async ({ request }) =>
        HttpResponse.json(await request.json()),
      ),
    );

    render(<ThresholdSettings />);
    fireEvent.click(screen.getByRole('button', { name: 'Apply thresholds' }));
    expect(await screen.findByText('Thresholds updated.')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/cold below/i), { target: { value: '15' } });
    expect(screen.queryByText('Thresholds updated.')).not.toBeInTheDocument();
  });

  it('surfaces the server error message when the save is rejected', async () => {
    server.use(
      http.put(`${BASE}/thresholds`, () =>
        HttpResponse.json({ error: 'coldMax must be strictly less than hotMin' }, { status: 422 }),
      ),
    );

    render(<ThresholdSettings />);
    fireEvent.click(screen.getByRole('button', { name: 'Apply thresholds' }));

    expect(
      await screen.findByText(/coldmax must be strictly less than hotmin/i),
    ).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ThresholdSettings />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
