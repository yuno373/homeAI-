export function CircularGauge({ percent, size = 100, strokeWidth = 8, color = '#0ea5e9', label, sublabel }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percent / 100) * circumference

  const colorMap = {
    '#0ea5e9': { track: 'stroke-border', fill: 'fill-primary/10' },
    '#22c55e': { track: 'stroke-border', fill: 'fill-success/10' },
    '#f59e0b': { track: 'stroke-border', fill: 'fill-warning/10' },
    '#ef4444': { track: 'stroke-border', fill: 'fill-danger/10' },
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke="currentColor"
            className="text-border"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={color}
            fill="none"
            strokeLinecap="round"
            className="gauge-circle"
            style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold" style={{ color }}>{percent}%</span>
        </div>
      </div>
      {label && <span className="text-sm mt-2 text-text-secondary">{label}</span>}
      {sublabel && <span className="text-xs text-text-muted">{sublabel}</span>}
    </div>
  )
}
