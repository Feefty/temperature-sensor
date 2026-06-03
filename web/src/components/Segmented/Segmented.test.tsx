import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { Segmented, type SegmentedItem } from '@/components/Segmented';

const items: SegmentedItem[] = [
  { id: 'a', label: 'First' },
  { id: 'b', label: 'Second' },
  { id: 'c', label: 'Third' },
];

function Harness() {
  const [active, setActive] = useState('a');
  return <Segmented baseId="t" label="Views" active={active} onChange={setActive} items={items} />;
}

describe('Segmented', () => {
  it('marks the active tab and wires it to its panel id', () => {
    render(<Harness />);
    const first = screen.getByRole('tab', { name: 'First' });

    expect(first).toHaveAttribute('aria-selected', 'true');
    expect(first).toHaveAttribute('id', 't-tab-a');
    expect(first).toHaveAttribute('aria-controls', 't-panel-a');
  });

  it('keeps a roving tabindex', () => {
    render(<Harness />);
    expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute('tabindex', '-1');
  });

  it('selects on click', () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole('tab', { name: 'Second' }));
    expect(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute('aria-selected', 'true');
  });

  it('moves with arrows (wrapping) and Home/End', () => {
    render(<Harness />);

    fireEvent.keyDown(screen.getByRole('tab', { name: 'First' }), { key: 'ArrowLeft' });
    expect(screen.getByRole('tab', { name: 'Third' })).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(screen.getByRole('tab', { name: 'Third' }), { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(screen.getByRole('tab', { name: 'First' }), { key: 'End' });
    expect(screen.getByRole('tab', { name: 'Third' })).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(screen.getByRole('tab', { name: 'Third' }), { key: 'Home' });
    expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute('aria-selected', 'true');
  });

  it('keeps the first tab reachable when active matches no item', () => {
    render(<Segmented baseId="t" label="Views" active="none" onChange={() => {}} items={items} />);

    expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute('tabindex', '-1');
  });

  it('ignores keys that are not navigation keys', () => {
    const onChange = vi.fn();
    render(<Segmented baseId="t" label="Views" active="a" onChange={onChange} items={items} />);

    fireEvent.keyDown(screen.getByRole('tab', { name: 'First' }), { key: 'Enter' });

    expect(onChange).not.toHaveBeenCalled();
  });
});
