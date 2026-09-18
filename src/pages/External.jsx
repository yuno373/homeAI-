import { Shield, Wifi, Smartphone, Monitor, Clock } from 'lucide-react'
import { SectionCard } from '../components/SectionCard'
import { Toggle } from '../components/Toggle'

export default function External() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">外部アクセス</h1><p className="text-text-muted text-sm">VPN・デバイス認証・操作ログ</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border bg-success/10 border-success/30 text-center"><Wifi size={24} className="mx-auto mb-2 text-success" /><div className="text-sm font-bold text-text-primary">VPN接続</div><div className="text-xs text-success mt-1">接続中</div></div>
        <div className="p-4 rounded-lg border bg-bg-card border-border text-center"><Shield size={24} className="mx-auto mb-2 text-primary" /><div className="text-sm font-bold text-text-primary">登録端末</div><div className="text-xs text-text-muted mt-1">4台</div></div>
        <div className="p-4 rounded-lg border bg-bg-card border-border text-center"><Clock size={24} className="mx-auto mb-2 text-secondary" /><div className="text-sm font-bold text-text-primary">操作ログ</div><div className="text-xs text-text-muted mt-1">3件</div></div>
      </div>
      <SectionCard title="登録端末一覧" icon={Smartphone}>
        <div className="space-y-2">
          {[{ name: 'iPhone 16 Pro', type: 'スマホ', trusted: true, last: '18:45' }, { name: 'iPad Pro', type: 'タブレット', trusted: true, last: '16:30' }, { name: 'PC (自宅)', type: 'PC', trusted: true, last: '19:00' }, { name: 'MacBook Air', type: 'PC', trusted: false, last: '14:20' }].map((d, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-bg-dark/50">
              <div className="w-10 h-10 rounded-lg bg-bg-card flex items-center justify-center"><Monitor size={18} className="text-primary" /></div>
              <div className="flex-1"><div className="text-sm font-medium text-text-primary">{d.name}</div><div className="text-xs text-text-muted">{d.type} - 最終: {d.last}</div></div>
              <span className={`px-2 py-0.5 rounded text-xs ${d.trusted ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>{d.trusted ? '信頼済み' : '未信頼'}</span>
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="外部アクセス制限">
        <div className="space-y-4">
          <Toggle checked={false} onChange={() => {}} label="外出時は一部機能制限" />
          <Toggle checked={true} onChange={() => {}} label="防犯機能強化モード" />
        </div>
      </SectionCard>
    </div>
  )
}
