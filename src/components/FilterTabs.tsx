import './FilterTabs.css'

type FilterTabsProps<T extends string> = {
  label: string
  options: { value: T; label: string; count: number }[]
  value: T
  onChange: (value: T) => void
}

/** Toggle group used to filter lists (notes by type, projects by type). */
export function FilterTabs<T extends string>({ label, options, value, onChange }: FilterTabsProps<T>) {
  return (
    <div className="filter-tabs" role="group" aria-label={label}>
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label} <span className="filter-tabs__count">{option.count}</span>
        </button>
      ))}
    </div>
  )
}
