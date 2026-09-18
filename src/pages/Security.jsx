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
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">防犯・監視</h1><p className="text-text-muted text-sm">FAL（Frigate抽象化レイヤー）経由のセキュリティ</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-3 rounded-lg border bg-bg-card border-border text-center"><Camera size={20} className="mx-auto mb-1 text-primary" /><div className="text-xs text-text-secondary">カメラ</div><div className="text-sm font-bold text-success">{cameras.length}台稼働中</div></div>
        <div className="p-3 rounded-lg border bg-bg-card border-border text-center"><DoorOpen size={20} className="mx-auto mb-1 text-success" /><div className="text-xs text-text-secondary">ドアロック</div><div className="text-sm font-bold text-success">全{locks.length}ドア施錠</div></div>
        <div className="p-3 rounded-lg border bg-bg-card border-border text-center"><AlertTriangle size={20} className="mx-auto mb-1 text-warning" /><div className="text-xs text-text-secondary">イベント</div><div className="text-sm font-bold text-text-primary">{events.length}件</div></div>
        <div className="p-3 rounded-lg border bg-bg-card border-border text-center"><Brain size={20} className="mx-auto mb-1 text-secondary" /><div className="text-xs text-text-secondary">危険度</div><div className="text-sm font-bold text-success">正常</div></div>
      </div>
      <SectionCard title="" icon={Shield}>
        <TabSwitcher tabs={[{ value: 'cameras', label: 'カメラ' }, { value: 'events', label: 'イベント' }, { value: 'doors', label: 'ドア' }]} active={activeTab} onChange={setActiveTab} />
      </SectionCard>
      {activeTab === 'cameras' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cameras.map((cam) => (
            <div key={cam.id} className="rounded-xl border border-border bg-bg-card overflow-hidden">
              <div className="aspect-video bg-bg-dark flex items-center justify-center relative">
                <Camera size={48} className="text-text-muted/30" />
                <div className="absolute top-2 left-2 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-danger animate-pulse" /><span className="text-xs text-danger font-medium">REC</span></div>
                <div className="absolute top-2 right-2"><span className="px-2 py-0.5 rounded text-xs font-medium bg-success/20 text-success">ONLINE</span></div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-sm font-medium text-text-primary">{cam.name}</span>
                <span className="text-xs text-success">録画中</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {activeTab === 'events' && (
        <SectionCard title="Frigateイベント" icon={Eye}>
          <div className="space-y-2">
            {events.map((event) => (
              <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg bg-bg-dark/50">
                <div className="text-lg">{event.type === 'person' ? '👤' : '🐾'}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-text-primary">{event.label}</div>
                  <div className="text-xs text-text-muted">{event.zone} - 信頼度 {event.confidence}%</div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-bold ${event.score > 70 ? 'text-danger' : event.score > 40 ? 'text-warning' : 'text-success'}`}>危険度 {event.score}</div>
                  <div className="text-[10px] text-text-muted">{new Date(event.timestamp).toLocaleTimeString('ja-JP')}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
      {activeTab === 'doors' && (
        <SectionCard title="ドアロック状態（DAL経由）" icon={DoorOpen}>
          <div className="grid grid-cols-3 gap-4">
            {locks.map((lock) => (
              <div key={lock.id} className={`p-3 rounded-lg border text-center ${lock.attributes.locked ? 'bg-success/10 border-success/30' : 'bg-danger/10 border-danger/30'}`}>
                <DoorOpen size={20} className={`mx-auto mb-1 ${lock.attributes.locked ? 'text-success' : 'text-danger'}`} />
                <div className="text-sm font-medium text-text-primary">{lock.name}</div>
                <div className={`text-xs font-bold ${lock.attributes.locked ? 'text-success' : 'text-danger'}`}>{lock.attributes.locked ? '施錠' : '解錠'}</div>
              </div>
            ))}
          </div>
          <button onClick={lockAll} className="mt-4 px-4 py-2 rounded-lg bg-success/20 text-success border border-success/30 text-sm hover:bg-success/30 transition">全施錠</button>
        </SectionCard>
      )}
    </div>
  )
}
