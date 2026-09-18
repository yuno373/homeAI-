export function AlertBadge({ type, message, time, onDismiss }) {
  const typeConfig = {
    火災: { bg: 'bg-danger/20', border: 'border-danger/50', text: 'text-danger', icon: '🔥' },
    ガス漏れ: { bg: 'bg-warning/20', border: 'border-warning/50', text: 'text-warning', icon: '⚠️' },
    侵入: { bg: 'bg-danger/20', border: 'border-danger/50', text: 'text-danger', icon: '🚨' },
    停電: { bg: 'bg-secondary/20', border: 'border-secondary/50', text: 'text-secondary', icon: '⚡' },
    温度異常: { bg: 'bg-warning/20', border: 'border-warning/50', text: 'text-warning', icon: '🌡️' },
    動体: { bg: 'bg-accent/20', border: 'border-accent/50', text: 'text-accent', icon: '👁️' },
    正常: { bg: 'bg-success/20', border: 'border-success/50', text: 'text-success', icon: '✅' },
  }
  const config = typeConfig[type] || typeConfig['動体']

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${config.bg} ${config.border} animate-pulse-glow ${config.text}`}>
      <span className="text-lg">{config.icon}</span>
      <div className="flex-1">
        <div className="text-sm font-medium">{message}</div>
        {time && <div className="text-xs opacity-70">{time}</div>}
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="text-xs opacity-50 hover:opacity-100">✕</button>
      )}
    </div>
  )
}
