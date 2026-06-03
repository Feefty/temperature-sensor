import { type KeyboardEvent, useRef } from 'react';
import styles from './Segmented.module.css';

export interface SegmentedItem {
  id: string;
  label: string;
}

export interface SegmentedProps {
  items: SegmentedItem[];
  active: string;
  onChange: (id: string) => void;
  /** Accessible name for the tablist. */
  label: string;
  /** Shared id prefix. Each tab is `${baseId}-tab-${id}` and controls panel `${baseId}-panel-${id}`. */
  baseId: string;
}

// The tablist half of an ARIA tabs pattern: roving tabindex, arrow/Home/End, activate on focus.
// It is controlled and renders no panels, so the parent can keep the panels mounted across a
// layout change instead of remounting them.
export function Segmented({ items, active, onChange, label, baseId }: SegmentedProps) {
  const tabs = useRef(new Map<string, HTMLButtonElement>());

  const activate = (id: string) => {
    onChange(id);
    tabs.current.get(id)?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = items.length - 1;
    const target =
      event.key === 'ArrowRight'
        ? items[index === last ? 0 : index + 1]
        : event.key === 'ArrowLeft'
          ? items[index === 0 ? last : index - 1]
          : event.key === 'Home'
            ? items[0]
            : event.key === 'End'
              ? items[last]
              : undefined;
    if (!target) return;
    event.preventDefault();
    activate(target.id);
  };

  // If `active` matches nothing, keep the first tab in the tab order so the list stays reachable.
  const hasActive = items.some((item) => item.id === active);

  return (
    <div role="tablist" aria-label={label} className={styles.tablist}>
      {items.map((item, index) => {
        const selected = item.id === active;
        return (
          <button
            key={item.id}
            ref={(node) => {
              if (node) tabs.current.set(item.id, node);
              else tabs.current.delete(item.id);
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${item.id}`}
            aria-selected={selected}
            aria-controls={`${baseId}-panel-${item.id}`}
            tabIndex={selected || (!hasActive && index === 0) ? 0 : -1}
            className={[styles.tab, selected ? styles.active : ''].filter(Boolean).join(' ')}
            onClick={() => onChange(item.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
