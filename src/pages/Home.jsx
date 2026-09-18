import { useSystem } from '../App'
import { Zap, Shield, Brain, Eye, Activity, AlertTriangle, Wifi, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatusCard } from '../components/StatusCard'
import { SectionCard } from '../components/SectionCard'

export default function Home() {
  const sys = useSystem()
  const { devices, powerStatus, events } = sys

  const locks = devices.filter(d => d.type === 'lock')
  const allLocked = locks.every(l => l.attributes.locked)
  const onlineCount = devices.filter(d => d.online).length

  const theaterLight = devices.find(d => d.id === 'light_theater')
  const projector = devices.find(d => d.id === 'projector_theater')
  const theaterHvac = devices.find(d => d.id === 'hvac_theater')

  const latestEvent = events[0]
  const threatEvents = events.filter(e => e.score > 60)
  const dangerScore = threatEvents.length > 0 ? Math.max(...threatEvents.map(e => e.score)) : 0
  const dangerLabel = dangerScore >= 70 ? '危険' : dangerScore >= 40 ? '要注意' : '安全'
  const dangerColor = dangerScore >= 70 ? 'danger' : dangerScore >= 40 ? 'warning' : 'success'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">ホーム</h1>
        <p className="text-text-muted text-sm">唯希邸の要点を確認</p>
      </div>

      {/* ブロック1: 家の状態 */}
      <SectionCard title="家の状態" icon={Brain}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 text-center">
            <div className="text-2xl mb-1">🏠</div>
            <div className="text-xs text-text-muted">現在のモード</div>
            <div className="text-lg font-bold text-primary">通常</div>
          </div>
          <div className={`p-4 rounded-xl ${allLocked ? 'bg-success/10 border border-success/30' : 'bg-danger/10 border border-danger/30'} text-center`}>
            <div className="text-2xl mb-1">{allLocked ? '🔒' : '🔓'}</div>
            <div className="text-xs text-text-muted">玄関ロック</div>
            <div className={`text-lg font-bold ${allLocked ? 'text-success' : 'text-danger'}`}>{allLocked ? '全施錠' : '解錠あり'}</div>
          </div>
          <div className={`p-4 rounded-xl ${dangerScore < 40 ? 'bg-success/10 border border-success/30' : dangerScore < 70 ? 'bg-warning/10 border border-warning/30' : 'bg-danger/10 border border-danger/30'} text-center`}>
            <div className="text-2xl mb-1">{dangerScore < 40 ? '🛡️' : dangerScore < 70 ? '⚠️' : '🚨'}</div>
            <div className="text-xs text-text-muted">危険度</div>
            <div className={`text-lg font-bold text-${dangerColor}`}>{dangerLabel}</div>
            <div className="text-[10px] text-text-muted">スコア: {dangerScore}</div>
          </div>
          <div className="p-4 rounded-xl bg-bg-card border border-border text-center">
            <div className="text-2xl mb-1">🤖</div>
            <div className="text-xs text-text-muted">AI稼働</div>
            <div className="text-lg font-bold text-success">5/5</div>
          </div>
        </div>
      </SectionCard>

      {/* ブロック2: 電力 */}
      <SectionCard title="電力" icon={Zap}>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{powerStatus.currentWatt}W</div>
            <div className="text-xs text-text-muted">現在消費</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${powerStatus.ups.percent > 50 ? 'text-success' : powerStatus.ups.percent > 20 ? 'text-warning' : 'text-danger'}`}>
              {powerStatus.ups.percent.toFixed(0)}%
            </div>
            <div className="text-xs text-text-muted">UPS残量</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">{powerStatus.battery.percent.toFixed(0)}%</div>
            <div className="text-xs text-text-muted">蓄電池</div>
          </div>
        </div>
        <Link to="/power" className="flex items-center justify-center gap-1 text-xs text-primary hover:text-primary-dark transition">
          詳細を見る <ChevronRight size={12} />
        </Link>
      </SectionCard>

      {/* ブロック3: 劇場モード */}
      <SectionCard title="劇場モード" icon={Eye}>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg">{theaterLight?.attributes.on ? '💡' : '🌑'}</div>
            <div className="text-xs text-text-muted">照明</div>
            <div className={`text-sm font-bold ${theaterLight?.attributes.on ? 'text-primary' : 'text-text-muted'}`}>
              {theaterLight?.attributes.on ? `${theaterLight.attributes.brightness}%` : 'OFF'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg">{projector?.attributes.on ? '📽️' : '📺'}</div>
            <div className="text-xs text-text-muted">プロジェクター</div>
            <div className={`text-sm font-bold ${projector?.attributes.on ? 'text-accent' : 'text-text-muted'}`}>
              {projector?.attributes.on ? '稼働中' : '待機中'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg">{theaterHvac?.attributes.on ? '❄️' : '🌡️'}</div>
            <div className="text-xs text-text-muted">空調</div>
            <div className={`text-sm font-bold ${theaterHvac?.attributes.on ? 'text-success' : 'text-text-muted'}`}>
              {theaterHvac?.attributes.on ? `${theaterHvac.attributes.temperature}°C` : 'OFF'}
            </div>
          </div>
        </div>
        <Link to="/theater" className="flex items-center justify-center gap-1 text-xs text-primary hover:text-primary-dark transition mt-3">
          劇場を操作 <ChevronRight size={12} />
        </Link>
      </SectionCard>

      {/* AI稼働状況 */}
      <SectionCard title="AIシステム" icon={Brain}>
        <div className="grid grid-cols-5 gap-2">
          {[
            { name: '司令官', model: 'Llama', color: 'text-primary' },
            { name: '監視', model: 'YOLO', color: 'text-danger' },
            { name: '音声', model: 'Whisper', color: 'text-secondary' },
            { name: '電力', model: 'Python', color: 'text-warning' },
            { name: '設備', model: 'HA', color: 'text-success' },
          ].map((ai) => (
            <div key={ai.name} className="p-2 rounded-lg bg-bg-dark/50 text-center">
              <div className="w-2 h-2 rounded-full bg-success mx-auto mb-1 animate-pulse" />
              <div className="text-[10px] font-bold text-text-primary">{ai.name}</div>
              <div className="text-[9px] text-text-muted">{ai.model}</div>
            </div>
          ))}
        </div>
        <Link to="/ai" className="flex items-center justify-center gap-1 text-xs text-primary hover:text-primary-dark transition mt-3">
          AI司令室 <ChevronRight size={12} />
        </Link>
      </SectionCard>

      {/* 最新イベント */}
      {latestEvent && (
        <SectionCard title="最新イベント" icon={Shield}>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-dark/50">
            <div className="text-xl">{latestEvent.type === 'person' ? '👤' : '🐾'}</div>
            <div className="flex-1">
              <div className="text-sm font-medium text-text-primary">{latestEvent.label}</div>
              <div className="text-xs text-text-muted">{latestEvent.zone}</div>
            </div>
            <div className="text-right">
              <div className={`text-xs font-bold ${latestEvent.score > 60 ? 'text-danger' : latestEvent.score > 30 ? 'text-warning' : 'text-success'}`}>
                危険度 {latestEvent.score}
              </div>
              <div className="text-[10px] text-text-muted">{new Date(latestEvent.timestamp).toLocaleTimeString('ja-JP')}</div>
            </div>
          </div>
          <Link to="/security" className="flex items-center justify-center gap-1 text-xs text-primary hover:text-primary-dark transition mt-3">
            全イベントを見る <ChevronRight size={12} />
          </Link>
        </SectionCard>
      )}
    </div>
  )
}
