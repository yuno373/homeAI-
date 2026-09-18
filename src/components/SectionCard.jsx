export function SectionCard({ title, icon: Icon, children, className = '' }) {
  return (
    <div className={`rounded-lg border border-border bg-bg-card p-4 ${className}`}>
      {title && (
        <div className="flex items-center gap-2 mb-3">
          {Icon && <Icon size={16} className="text-primary" />}
          <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">{title}</h3>
        </div>
      )}
      {children}
    </div>
  )
}
