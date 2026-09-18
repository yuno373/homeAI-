import { useState } from 'react'
import { useSystem } from '../App'
import { Shield, Camera, DoorOpen, AlertTriangle, Brain, Eye } from 'lucide-react'
import { SectionCard } from '../components/SectionCard'
import { TabSwitcher } from '../components/TabSwitcher'

export default function Security() {
  const sys = useSystem()
  const { devices, events, lockAll } = sys
  const cameras = devices.filter(d => d.type === 'camera')
  const locks = devices.filter(d => d.type === 'lock')
  const [activeTab, setActiveTab] = useState('cameras')

  return (
    <div className="space-y-3">
      <h1 className="text-lg font-bold">防犯・監視</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="flex items-center gap-2 p-2.5 rounded-md bg-bg-card border border-border min-h-[48px]">
          <Camera size={14} className="text-primary" />
          <div><div className="text-[9px] text-text-muted">カメラ</div><div className="text-xs font-bold text-success">{cameras.length}台稼働</div></div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-md bg-bg-card border border-border min-h-[48px]">
          <DoorOpen size={14} className="text-success" />
          <div><div className="text-[9px] text-text-muted">ドアロック</div><div className="text-xs font-bold text-success">全{locks.length}施錠</div></div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-md bg-bg-card border border-border min-h-[48px]">
          <AlertTriangle size={14} className="text-warning" />
          <div><div className="text-[9px] text-text-muted">イベント</div><div className="text-xs font-bold">{events.length}件</div></div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-md bg-bg-card border border-border min-h-[48px]">
          <Brain size={14} className="text-secondary" />
          <div><div className="text-[9px] text-text-muted">危険度</div><div className="text-xs font-bold text-success">正常</div></div>
        </div>
      </div>

      <SectionCard title="" icon={Shield}>
        <TabSwitcher tabs={[{ value: 'cameras', label: 'カメラ' }, { value: 'events', label: 'イベント' }, { value: 'doors', label: 'ドア' }]} active={activeTab} onChange={setActiveTab} />
      </SectionCard>

      {activeTab === 'cameras' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {cameras.map((cam) => (
            <div key={cam.id} className="rounded-md border border-border bg-bg-card overflow-hidden">
              <div className="aspect-video bg-bg-dark flex items-center justify-center relative">
                <Camera size={32} className="text-text-muted/30" />
                <div className="absolute top-1.5 left-1.5 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" /><span className="text-[9px] text-danger font-medium">REC</span></div>
                <div className="absolute top-1.5 right-1.5"><span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-success/20 text-success">ONLINE</span></div>
              </div>
              <div className="p-2 flex items-center justify-between">
                <span className="text-[11px] font-medium text-text-primary">{cam.name}</span>
                <span className="text-[9px] text-success">録画中</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'events' && (
        <SectionCard title="イベント" icon={Eye}>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {events.map((event) => (
              <div key={event.id} className="flex items-center gap-2 p-2 rounded bg-bg-dark/30">
                <span className="text-sm">{event.type === 'person' ? '👤' : '🐾'}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium text-text-primary truncate">{event.label}</div>
                  <div className="text-[9px] text-text-muted">{event.zone} / 信頼度 {event.confidence}%</div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-[10px] font-bold ${event.score > 70 ? 'text-danger' : event.score > 40 ? 'text-warning' : 'text-success'}`}>{event.score}</div>
                  <div className="text-[9px] text-text-muted">{new Date(event.timestamp).toLocaleTimeString('ja-JP')}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {activeTab === 'doors' && (
        <SectionCard title="ドアロック" icon={DoorOpen}>
          <div className="grid grid-cols-3 gap-2">
            {locks.map((lock) => (
              <div key={lock.id} className={`p-2 rounded-md border text-center ${lock.attributes.locked ? 'bg-success/5 border-success/20' : 'bg-danger/5 border-danger/20'}`}>
                <DoorOpen size={14} className={`mx-auto mb-0.5 ${lock.attributes.locked ? 'text-success' : 'text-danger'}`} />
                <div className="text-[10px] font-medium text-text-primary">{lock.name}</div>
                <div className={`text-[9px] font-bold ${lock.attributes.locked ? 'text-success' : 'text-danger'}`}>{lock.attributes.locked ? '施錠' : '解錠'}</div>
              </div>
            ))}
          </div>
          <button onClick={lockAll} className="mt-2 px-3 py-1.5 rounded-md bg-success/20 text-success border border-success/30 text-[11px] hover:bg-success/30 transition">全施錠</button>
        </SectionCard>
      )}
    </div>
  )
}
