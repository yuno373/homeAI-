import { Shield, Wifi, Smartphone, Monitor, Clock } from 'lucide-react'
import { SectionCard } from '../components/SectionCard'
import { Toggle } from '../components/Toggle'

export default function External() {
  return (
    <div className="space-y-3">
      <h1 className="text-lg font-bold">外部アクセス</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
        <div className="flex items-center gap-2 p-2.5 rounded-md bg-success/5 border border-success/20 min-h-[48px]">
          <Wifi size={14} className="text-success" />
          <div><div className="text-[9px] text-text-muted">VPN</div><div className="text-xs font-bold text-success">接続中</div></div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-md bg-bg-card border border-border min-h-[48px]">
          <Shield size={14} className="text-primary" />
          <div><div className="text-[9px] text-text-muted">登録端末</div><div className="text-xs font-bold">4台</div></div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-md bg-bg-card border border-border min-h-[48px]">
          <Clock size={14} className="text-secondary" />
          <div><div className="text-[9px] text-text-muted">操作ログ</div><div className="text-xs font-bold">3件</div></div>
        </div>
      </div>

      <SectionCard title="登録端末" icon={Smartphone}>
        <div className="space-y-1">
          {[{ name: 'iPhone 16 Pro', type: 'スマホ', trusted: true, last: '18:45' }, { name: 'iPad Pro', type: 'タブレット', trusted: true, last: '16:30' }, { name: 'PC (自宅)', type: 'PC', trusted: true, last: '19:00' }, { name: 'MacBook Air', type: 'PC', trusted: false, last: '14:20' }].map((d, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded bg-bg-dark/30">
              <Monitor size={14} className="text-primary" />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium text-text-primary truncate">{d.name}</div>
                <div className="text-[9px] text-text-muted">{d.type} / 最終: {d.last}</div>
              </div>
              <span className={`px-1.5 py-0.5 rounded text-[9px] ${d.trusted ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>{d.trusted ? '信頼済み' : '未信頼'}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="アクセス制限">
        <div className="space-y-2">
          <Toggle checked={false} onChange={() => {}} label="外出時は一部機能制限" />
          <Toggle checked={true} onChange={() => {}} label="防犯機能強化モード" />
        </div>
      </SectionCard>
    </div>
  )
}
