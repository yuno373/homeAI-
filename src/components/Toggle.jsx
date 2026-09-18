export function Toggle({ checked, onChange, label, size = 'md' }) {
  const sizeMap = {
    sm: 'w-9 h-5',
    md: 'w-11 h-6',
    lg: 'w-14 h-7',
  }
  const dotMap = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        className={`relative rounded-full transition-colors duration-300 ${sizeMap[size]} ${
          checked ? 'bg-primary' : 'bg-border'
        }`}
        onClick={onChange}
      >
        <div
          className={`absolute top-0.5 left-0.5 bg-white rounded-full transition-transform duration-300 ${dotMap[size]} ${
            checked ? 'translate-x-full' : ''
          }`}
        />
      </div>
      {label && <span className="text-sm text-text-secondary">{label}</span>}
    </label>
  )
}
