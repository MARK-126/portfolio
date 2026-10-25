import { useId } from 'react'
import { m } from 'motion/react'
import './FilterTabs.css'

type FilterTabsProps<T extends string> = {
  label: string
  options: { value: T; label: string; count: number }[]
  value: T
  onChange: (value: T) => void
}

/** Toggle group used to filter lists (notes by type, projects by type). */
export function FilterTabs<T extends string>({ label, options, value, onChange }: FilterTabsProps<T>) {
  // The amber block slides between tabs; the id keeps two tab groups from sharing it
  const indicatorId = useId()

  return (
    <div className="filter-tabs" role="group" aria-label={label}>
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {value === option.value && (
            <m.span
              layoutId={indicatorId}
              className="filter-tabs__indicator"
              transition={{ type: 'spring', stiffness: 520, damping: 42 }}
            />
          )}
          <span className="filter-tabs__label">
            {option.label} <span className="filter-tabs__count">{option.count}</span>
          </span>
        </button>
      ))}
    </div>
  )
}
