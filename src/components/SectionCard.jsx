export function SectionCard({ title, icon: Icon, children, className = '' }) {
  return (
    <div className={`rounded-md border border-border bg-bg-card p-3 ${className}`}>
      {title && (
        <div className="flex items-center gap-1.5 mb-2">
          {Icon && <Icon size={13} className="text-primary" />}
          <h3 className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">{title}</h3>
        </div>
      )}
      {children}
    </div>
  )
}
