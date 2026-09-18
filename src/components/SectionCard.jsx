export function SectionCard({ title, icon: Icon, children, className = '' }) {
  return (
    <div className={`rounded-xl border border-border bg-bg-card p-5 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon size={18} className="text-primary" />}
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      </div>
      {children}
    </div>
  )
}
