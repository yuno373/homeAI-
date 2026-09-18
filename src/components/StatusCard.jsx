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
    <div className={`rounded-md border p-2 transition-all hover:bg-bg-card-hover/30 ${colorMap[color]} ${className}`}>
      <div className="flex items-center gap-1.5">
        {Icon && <Icon size={12} className={iconColorMap[color]} />}
        <span className="text-[9px] text-text-secondary">{title}</span>
      </div>
      <div className="flex items-baseline justify-between mt-0.5">
        <div className={`text-base font-bold ${iconColorMap[color]}`}>{value}</div>
        {subtitle && <div className="text-[8px] text-text-muted">{subtitle}</div>}
      </div>
    </div>
  )
}
