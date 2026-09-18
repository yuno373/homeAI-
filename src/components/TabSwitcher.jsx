export function TabSwitcher({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 p-1 bg-bg-card rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
            active === tab.value
              ? 'bg-primary text-white shadow-lg shadow-primary/25'
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-card-hover'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
