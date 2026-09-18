export function StatusCard({ title, value, subtitle, icon: Icon, color = 'primary', className = '' }) {
  const colorMap = {
    primary: 'border-primary/30 bg-primary/5',
    success: 'border-success/30 bg-success/5',
    warning: 'border-warning/30 bg-warning/5',
    danger: 'border-danger/30 bg-danger/5',
    accent: 'border-accent/30 bg-accent/5',
    secondary: 'border-secondary/30 bg-secondary/5',
  }
  const iconColorMap = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
    accent: 'text-accent',
    secondary: 'text-secondary',
  }

  return (
    <div className={`rounded-xl border p-4 transition-all duration-300 hover:scale-[1.02] card-glow ${colorMap[color]} ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-text-secondary">{title}</span>
        {Icon && <Icon size={20} className={iconColorMap[color]} />}
      </div>
      <div className={`text-2xl font-bold ${iconColorMap[color]}`}>{value}</div>
      {subtitle && <div className="text-xs text-text-muted mt-1">{subtitle}</div>}
    </div>
  )
}
