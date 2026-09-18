import { useSystem } from '../App'
import { Zap, Shield, Brain, Eye, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SectionCard } from '../components/SectionCard'

export default function Home() {
  const sys = useSystem()
  const { devices, powerStatus, events } = sys

  const locks = devices.filter(d => d.type === 'lock')
  const allLocked = locks.every(l => l.attributes.locked)

  const theaterLight = devices.find(d => d.id === 'light_theater')
  const projector = devices.find(d => d.id === 'projector_theater')
  const theaterHvac = devices.find(d => d.id === 'hvac_theater')

  const latestEvent = events[0]
  const dangerScore = latestEvent ? latestEvent.score : 0
  const dangerLabel = dangerScore >= 70 ? '危険' : dangerScore >= 40 ? '要注意' : '安全'

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">ホーム</h1>

      {/* ブロック1: 家の状態 */}
      <SectionCard title="家の状態" icon={Brain}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="flex items-center gap-3 p-2.5 rounded-md bg-primary/5 border border-primary/20">
            <span className="text-xl">🏠</span>
            <div>
              <div className="text-[10px] text-text-muted">モード</div>
              <div className="text-sm font-bold text-primary">通常</div>
            </div>
          </div>
          <div className={`flex items-center gap-3 p-2.5 rounded-md border ${allLocked ? 'bg-success/5 border-success/20' : 'bg-danger/5 border-danger/20'}`}>
            <span className="text-xl">{allLocked ? '🔒' : '🔓'}</span>
            <div>
              <div className="text-[10px] text-text-muted">玄関</div>
              <div className={`text-sm font-bold ${allLocked ? 'text-success' : 'text-danger'}`}>{allLocked ? '施錠' : '解錠'}</div>
            </div>
          </div>
          <div className={`flex items-center gap-3 p-2.5 rounded-md border ${dangerScore < 40 ? 'bg-success/5 border-success/20' : dangerScore < 70 ? 'bg-warning/5 border-warning/20' : 'bg-danger/5 border-danger/20'}`}>
            <span className="text-xl">{dangerScore < 40 ? '🛡️' : dangerScore < 70 ? '⚠️' : '🚨'}</span>
            <div>
              <div className="text-[10px] text-text-muted">危険度</div>
              <div className={`text-sm font-bold ${dangerScore < 40 ? 'text-success' : dangerScore < 70 ? 'text-warning' : 'text-danger'}`}>{dangerLabel} {dangerScore}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2.5 rounded-md bg-bg-card-hover/30 border border-border">
            <span className="text-xl">🤖</span>
            <div>
              <div className="text-[10px] text-text-muted">AI</div>
              <div className="text-sm font-bold text-success">5/5 稼働</div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ブロック2: 電力 */}
      <SectionCard title="電力" icon={Zap}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">{powerStatus.currentWatt}W</span>
            <span className="text-[10px] text-text-muted">消費</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-bold ${powerStatus.ups.percent > 50 ? 'text-success' : 'text-warning'}`}>{powerStatus.ups.percent.toFixed(0)}%</span>
            <span className="text-[10px] text-text-muted">UPS</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-secondary">{powerStatus.battery.percent.toFixed(0)}%</span>
            <span className="text-[10px] text-text-muted">蓄電池</span>
          </div>
          <Link to="/power" className="ml-auto flex items-center gap-1 text-[10px] text-primary hover:text-primary-dark transition">
            詳細 <ChevronRight size={10} />
          </Link>
        </div>
      </SectionCard>

      {/* ブロック3: 劇場モード */}
      <SectionCard title="劇場モード" icon={Eye}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm">{theaterLight?.attributes.on ? '💡' : '🌑'}</span>
            <span className="text-xs">{theaterLight?.attributes.on ? `${theaterLight.attributes.brightness}%` : 'OFF'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">{projector?.attributes.on ? '📽️' : '📺'}</span>
            <span className="text-xs">{projector?.attributes.on ? '稼働' : '待機'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">{theaterHvac?.attributes.on ? '❄️' : '🌡️'}</span>
            <span className="text-xs">{theaterHvac?.attributes.on ? `${theaterHvac.attributes.temperature}°C` : 'OFF'}</span>
          </div>
          <Link to="/theater" className="ml-auto flex items-center gap-1 text-[10px] text-primary hover:text-primary-dark transition">
            操作 <ChevronRight size={10} />
          </Link>
        </div>
      </SectionCard>

      {/* AI + 最新イベント */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="AIシステム" icon={Brain}>
          <div className="space-y-1.5">
            {[
              { name: '司令官', model: 'Llama', color: 'text-primary' },
              { name: '監視', model: 'YOLO', color: 'text-danger' },
              { name: '音声', model: 'Whisper', color: 'text-secondary' },
              { name: '電力', model: 'Python', color: 'text-warning' },
              { name: '設備', model: 'HA', color: 'text-success' },
            ].map((ai) => (
              <div key={ai.name} className="flex items-center justify-between p-1.5 rounded bg-bg-dark/30">
                <span className="text-xs text-text-primary">{ai.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-text-muted">{ai.model}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-success" />
                </div>
              </div>
            ))}
          </div>
          <Link to="/ai" className="flex items-center justify-center gap-1 text-[10px] text-primary hover:text-primary-dark transition mt-2">
            AI司令室 <ChevronRight size={10} />
          </Link>
        </SectionCard>

        {latestEvent && (
          <SectionCard title="最新イベント" icon={Shield}>
            <div className="flex items-center gap-3 p-2.5 rounded-md bg-bg-dark/30">
              <span className="text-xl">{latestEvent.type === 'person' ? '👤' : '🐾'}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-text-primary truncate">{latestEvent.label}</div>
                <div className="text-[10px] text-text-muted">{latestEvent.zone}</div>
              </div>
              <div className="text-right shrink-0">
                <div className={`text-xs font-bold ${latestEvent.score > 60 ? 'text-danger' : latestEvent.score > 30 ? 'text-warning' : 'text-success'}`}>
                  {latestEvent.score}
                </div>
                <div className="text-[10px] text-text-muted">{new Date(latestEvent.timestamp).toLocaleTimeString('ja-JP')}</div>
              </div>
            </div>
            <Link to="/security" className="flex items-center justify-center gap-1 text-[10px] text-primary hover:text-primary-dark transition mt-2">
              全イベント <ChevronRight size={10} />
            </Link>
          </SectionCard>
        )}
      </div>
    </div>
  )
}
