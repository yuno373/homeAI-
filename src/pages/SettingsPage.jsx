import { useState } from 'react'
import { useSystem } from '../App'
import { Settings as SettingsIcon, Monitor, Bell, Palette, Gauge, Lightbulb, Thermometer, Shield, Camera, Zap, Blinds } from 'lucide-react'
import { SectionCard } from '../components/SectionCard'
import { Toggle } from '../components/Toggle'
import { TabSwitcher } from '../components/TabSwitcher'

const CATEGORIES = [
  { key: 'light', label: '照明', icon: Lightbulb },
  { key: 'blind', label: 'カーテン', icon: Blinds },
  { key: 'hvac', label: '空調', icon: Thermometer },
  { key: 'lock', label: 'セキュリティ', icon: Shield },
  { key: 'sensor', label: 'センサー', icon: Gauge },
  { key: 'camera', label: 'カメラ', icon: Camera },
  { key: 'ups', label: '電力', icon: Zap },
]

const DEVICE_ICONS = {
  light: '💡', blind: '🪟', hvac: '❄️', lock: '🔒', sensor: '📡', camera: '📷', ups: '🔋',
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('devices')
  const [expandedCategory, setExpandedCategory] = useState('light')
  const sys = useSystem()
  const { devices, updateDevice } = sys

  return (
    <div className="space-y-3">
      <h1 className="text-lg font-bold">設定</h1>
      <SectionCard title="" icon={SettingsIcon}>
        <TabSwitcher tabs={[
          { value: 'devices', label: 'デバイス' },
          { value: 'sensors', label: 'センサー' },
          { value: 'ups', label: 'UPS' },
          { value: 'notifications', label: '通知' },
          { value: 'theme', label: 'テーマ' },
        ]} active={activeTab} onChange={setActiveTab} />
      </SectionCard>

      {activeTab === 'devices' && (
        <SectionCard title="デバイス管理" icon={Monitor}>
          <div className="space-y-1">
            {CATEGORIES.map((cat) => {
              const catDevices = devices.filter(d => d.type === cat.key)
              if (catDevices.length === 0) return null
              const isExpanded = expandedCategory === cat.key
              const Icon = cat.icon
              return (
                <div key={cat.key} className="rounded-md border border-border overflow-hidden">
                  <button
                    onClick={() => setExpandedCategory(isExpanded ? null : cat.key)}
                    className="w-full flex items-center justify-between p-2 bg-bg-dark/30 hover:bg-bg-card-hover/30 transition text-[11px]"
                  >
                    <div className="flex items-center gap-1.5">
                      <Icon size={12} className="text-primary" />
                      <span className="font-medium text-text-primary">{cat.label}</span>
                      <span className="px-1 py-0.5 rounded text-[8px] bg-primary/20 text-primary">{catDevices.length}</span>
                    </div>
                    <span className="text-text-muted text-[9px]">{isExpanded ? '▲' : '▼'}</span>
                  </button>
                  {isExpanded && (
                    <div className="p-1 space-y-0.5 bg-bg-dark/20">
                      {catDevices.map((device) => (
                        <div key={device.id} className="flex items-center justify-between p-1.5 rounded bg-bg-card/30 hover:bg-bg-card-hover/20 transition">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-sm">{DEVICE_ICONS[device.type]}</span>
                            <div className="min-w-0">
                              <div className="text-[10px] font-medium text-text-primary truncate">{device.name}</div>
                              <div className="text-[8px] text-text-muted">{device.room}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <div className={`w-1.5 h-1.5 rounded-full ${device.online ? 'bg-success' : 'bg-text-muted'}`} />
                            {device.attributes.on !== undefined && (
                              <Toggle checked={device.attributes.on} onChange={(v) => updateDevice(device.id, { on: v })} size="sm" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </SectionCard>
      )}

      {activeTab === 'sensors' && (
        <SectionCard title="センサー" icon={Gauge}>
          <div className="space-y-1">
            {devices.filter(d => d.type === 'sensor').map((device) => (
              <div key={device.id} className="flex items-center justify-between p-2 rounded bg-bg-dark/30">
                <span className="text-[11px] text-text-primary">{device.name}</span>
                <div className="flex gap-0.5">
                  {['低', '中', '高'].map((l) => (
                    <button key={l} className={`px-1.5 py-0.5 rounded text-[9px] ${l === '高' ? 'bg-primary text-white' : 'bg-bg-card text-text-secondary'}`}>{l}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {activeTab === 'ups' && (
        <SectionCard title="UPS" icon={Gauge}>
          <div className="space-y-2">
            <Toggle checked={true} onChange={() => {}} label="自動節電有効" />
            <div className="flex justify-between text-[11px]"><span className="text-text-muted">節電開始</span><span className="text-warning">30%</span></div>
            <div className="flex justify-between text-[11px]"><span className="text-text-muted">劇場OFF</span><span className="text-danger">20%</span></div>
          </div>
        </SectionCard>
      )}

      {activeTab === 'notifications' && (
        <SectionCard title="通知" icon={Bell}>
          <div className="space-y-2">
            <div className="flex items-center justify-between"><span className="text-[11px] text-text-primary">プッシュ通知</span><Toggle checked={true} onChange={() => {}} size="sm" /></div>
            <div className="flex items-center justify-between"><span className="text-[11px] text-text-primary">メール通知</span><Toggle checked={true} onChange={() => {}} size="sm" /></div>
            <div className="flex items-center justify-between"><span className="text-[11px] text-text-primary">緊急通知</span><Toggle checked={true} onChange={() => {}} size="sm" /></div>
          </div>
        </SectionCard>
      )}

      {activeTab === 'theme' && (
        <SectionCard title="テーマ" icon={Palette}>
          <div className="grid grid-cols-3 gap-2">
            {[{ name: 'ダーク', preview: '#0f172a' }, { name: 'ライト', preview: '#ffffff' }, { name: 'カスタム', preview: '#8b5cf6' }].map((t) => (
              <button key={t.name} className="p-2.5 rounded-md border-2 border-primary bg-primary/10">
                <div className="w-full h-8 rounded mb-1.5 border border-border" style={{ backgroundColor: t.preview }} />
                <div className="text-[10px] font-medium text-text-primary">{t.name}</div>
              </button>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  )
}
