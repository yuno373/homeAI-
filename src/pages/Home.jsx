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
    <div className="space-y-2 w-full">
      <h1 className="text-base font-bold">ホーム</h1>

      {/* トップ4カード */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
        <div className="flex items-center gap-2 p-2 rounded bg-primary/5 border border-primary/20 min-h-[44px]">
          <span className="text-sm">🏠</span>
          <div className="min-w-0"><div className="text-[8px] text-text-muted leading-tight">モード</div><div className="text-[11px] font-bold text-primary leading-tight">通常</div></div>
        </div>
        <div className={`flex items-center gap-2 p-2 rounded border min-h-[44px] ${allLocked ? 'bg-success/5 border-success/20' : 'bg-danger/5 border-danger/20'}`}>
          <span className="text-sm">{allLocked ? '🔒' : '🔓'}</span>
          <div className="min-w-0"><div className="text-[8px] text-text-muted leading-tight">玄関</div><div className={`text-[11px] font-bold leading-tight ${allLocked ? 'text-success' : 'text-danger'}`}>{allLocked ? '施錠' : '解錠'}</div></div>
        </div>
        <div className={`flex items-center gap-2 p-2 rounded border min-h-[44px] ${dangerScore < 40 ? 'bg-success/5 border-success/20' : dangerScore < 70 ? 'bg-warning/5 border-warning/20' : 'bg-danger/5 border-danger/20'}`}>
          <span className="text-sm">{dangerScore < 40 ? '🛡️' : dangerScore < 70 ? '⚠️' : '🚨'}</span>
          <div className="min-w-0"><div className="text-[8px] text-text-muted leading-tight">危険度</div><div className={`text-[11px] font-bold leading-tight ${dangerScore < 40 ? 'text-success' : dangerScore < 70 ? 'text-warning' : 'text-danger'}`}>{dangerLabel} {dangerScore}</div></div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded bg-bg-card-hover/30 border border-border min-h-[44px]">
          <span className="text-sm">🤖</span>
          <div className="min-w-0"><div className="text-[8px] text-text-muted leading-tight">AI</div><div className="text-[11px] font-bold text-success leading-tight">5/5 稼働</div></div>
        </div>
      </div>

      {/* 電力 + 劇場 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5">
        <SectionCard title="電力" icon={Zap}>
          <div className="flex items-center gap-3">
            <div className="flex items-baseline gap-0.5"><span className="text-sm font-bold text-primary">{powerStatus.currentWatt}W</span><span className="text-[8px] text-text-muted">消費</span></div>
            <div className="flex items-baseline gap-0.5"><span className={`text-sm font-bold ${powerStatus.ups.percent > 50 ? 'text-success' : 'text-warning'}`}>{powerStatus.ups.percent.toFixed(0)}%</span><span className="text-[8px] text-text-muted">UPS</span></div>
            <div className="flex items-baseline gap-0.5"><span className="text-sm font-bold text-secondary">{powerStatus.battery.percent.toFixed(0)}%</span><span className="text-[8px] text-text-muted">蓄電池</span></div>
            <Link to="/power" className="ml-auto text-[8px] text-primary flex items-center gap-0.5">詳細 <ChevronRight size={8} /></Link>
          </div>
        </SectionCard>

        <SectionCard title="劇場" icon={Eye}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1"><span className="text-xs">{theaterLight?.attributes.on ? '💡' : '🌑'}</span><span className="text-[10px]">{theaterLight?.attributes.on ? `${theaterLight.attributes.brightness}%` : 'OFF'}</span></div>
            <div className="flex items-center gap-1"><span className="text-xs">{projector?.attributes.on ? '📽️' : '📺'}</span><span className="text-[10px]">{projector?.attributes.on ? '稼働' : '待機'}</span></div>
            <div className="flex items-center gap-1"><span className="text-xs">{theaterHvac?.attributes.on ? '❄️' : '🌡️'}</span><span className="text-[10px]">{theaterHvac?.attributes.on ? `${theaterHvac.attributes.temperature}°C` : 'OFF'}</span></div>
            <Link to="/theater" className="ml-auto text-[8px] text-primary flex items-center gap-0.5">操作 <ChevronRight size={8} /></Link>
          </div>
        </SectionCard>
      </div>

      {/* AI + イベント */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5">
        <SectionCard title="AI" icon={Brain}>
          <div className="space-y-0.5">
            {[
              { name: '司令官', model: 'Llama' },
              { name: '監視', model: 'YOLO' },
              { name: '音声', model: 'Whisper' },
              { name: '電力', model: 'Python' },
              { name: '設備', model: 'HA' },
            ].map((ai) => (
              <div key={ai.name} className="flex items-center justify-between py-0.5 px-1.5 rounded bg-bg-dark/30 text-[10px]">
                <span className="text-text-primary">{ai.name}</span>
                <div className="flex items-center gap-1"><span className="text-text-muted text-[8px]">{ai.model}</span><div className="w-1 h-1 rounded-full bg-success" /></div>
              </div>
            ))}
          </div>
          <Link to="/ai" className="flex items-center justify-center gap-0.5 text-[8px] text-primary mt-1">AI司令室 <ChevronRight size={8} /></Link>
        </SectionCard>

        {latestEvent && (
          <SectionCard title="最新イベント" icon={Shield}>
            <div className="flex items-center gap-2 p-1.5 rounded bg-bg-dark/30">
              <span className="text-sm">{latestEvent.type === 'person' ? '👤' : '🐾'}</span>
              <div className="flex-1 min-w-0"><div className="text-[10px] font-medium text-text-primary truncate">{latestEvent.label}</div><div className="text-[8px] text-text-muted">{latestEvent.zone}</div></div>
              <div className="text-right shrink-0"><div className={`text-[10px] font-bold ${latestEvent.score > 60 ? 'text-danger' : latestEvent.score > 30 ? 'text-warning' : 'text-success'}`}>{latestEvent.score}</div><div className="text-[8px] text-text-muted">{new Date(latestEvent.timestamp).toLocaleTimeString('ja-JP')}</div></div>
            </div>
            <Link to="/security" className="flex items-center justify-center gap-0.5 text-[8px] text-primary mt-1">全イベント <ChevronRight size={8} /></Link>
          </SectionCard>
        )}
      </div>
    </div>
  )
}
