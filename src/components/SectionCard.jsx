export function SectionCard({ title, icon: Icon, children, className = '' }) {
  return (
    <div className={`rounded-md border border-border bg-bg-card p-2.5 w-full ${className}`}>
      {title && (
        <div className="flex items-center gap-1.5 mb-2">
          {Icon && <Icon size={12} className="text-primary" />}
          <h3 className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">{title}</h3>
        </div>
      )}
      {children}
    </div>
  )
}
