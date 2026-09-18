import { useState } from 'react'
import { useSystem } from '../App'
import { Settings as SettingsIcon, Monitor, Bell, Palette, Cpu, Gauge, Lightbulb, Thermometer, Shield, Camera, Zap, Blinds } from 'lucide-react'
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
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">設定</h1><p className="text-text-muted text-sm">システム設定を管理</p></div>
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
        <SectionCard title="デバイス管理（DAL）" icon={Monitor}>
          <div className="space-y-2">
            {CATEGORIES.map((cat) => {
              const catDevices = devices.filter(d => d.type === cat.key)
              if (catDevices.length === 0) return null
              const isExpanded = expandedCategory === cat.key
              const Icon = cat.icon
              return (
                <div key={cat.key} className="rounded-xl border border-border overflow-hidden">
                  <button
                    onClick={() => setExpandedCategory(isExpanded ? null : cat.key)}
                    className="w-full flex items-center justify-between p-3 bg-bg-dark/50 hover:bg-bg-card-hover transition"
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={16} className="text-primary" />
                      <span className="text-sm font-medium text-text-primary">{cat.label}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">{catDevices.length}</span>
                    </div>
                    <span className="text-text-muted text-xs">{isExpanded ? '▲' : '▼'}</span>
                  </button>
                  {isExpanded && (
                    <div className="p-2 space-y-1 bg-bg-dark/30">
                      {catDevices.map((device) => (
                        <div key={device.id} className="flex items-center justify-between p-2 rounded-lg bg-bg-card/50 hover:bg-bg-card transition">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{DEVICE_ICONS[device.type]}</span>
                            <div>
                              <div className="text-xs font-medium text-text-primary">{device.name}</div>
                              <div className="text-[10px] text-text-muted">{device.room}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {device.online ? (
                              <span className="w-2 h-2 rounded-full bg-success" />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-text-muted" />
                            )}
                            {device.attributes.on !== undefined && (
                              <Toggle
                                checked={device.attributes.on}
                                onChange={(v) => updateDevice(device.id, { on: v })}
                                size="sm"
                              />
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
        <SectionCard title="センサー設定" icon={Gauge}>
          <div className="space-y-3">
            {devices.filter(d => d.type === 'sensor').map((device) => (
              <div key={device.id} className="p-3 rounded-lg bg-bg-dark/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-primary">{device.name}</span>
                  <span className="px-2 py-0.5 rounded text-xs bg-primary/20 text-primary">{device.room}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">感度</span>
                  <div className="flex gap-1">
                    {['低', '中', '高'].map((l) => (
                      <button key={l} className={`px-2 py-0.5 rounded text-xs ${l === '高' ? 'bg-primary text-white' : 'bg-bg-card text-text-secondary'}`}>{l}</button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {activeTab === 'ups' && (
        <SectionCard title="UPS設定" icon={Gauge}>
          <div className="space-y-4">
            <Toggle checked={true} onChange={() => {}} label="自動節電有効" />
            <div className="flex justify-between text-sm"><span className="text-text-muted">節電開始残量</span><span className="text-warning">30%</span></div>
            <div className="flex justify-between text-sm"><span className="text-text-muted">劇場OFF残量</span><span className="text-danger">20%</span></div>
          </div>
        </SectionCard>
      )}

      {activeTab === 'notifications' && (
        <SectionCard title="通知設定" icon={Bell}>
          <div className="space-y-4">
            <div className="flex items-center justify-between"><span className="text-sm text-text-primary">プッシュ通知</span><Toggle checked={true} onChange={() => {}} size="sm" /></div>
            <div className="flex items-center justify-between"><span className="text-sm text-text-primary">メール通知</span><Toggle checked={true} onChange={() => {}} size="sm" /></div>
            <div className="flex items-center justify-between"><span className="text-sm text-text-primary">緊急通知</span><Toggle checked={true} onChange={() => {}} size="sm" /></div>
          </div>
        </SectionCard>
      )}

      {activeTab === 'theme' && (
        <SectionCard title="アプリテーマ" icon={Palette}>
          <div className="grid grid-cols-3 gap-3">
            {[{ name: 'ダーク', preview: '#0f172a' }, { name: 'ライト', preview: '#ffffff' }, { name: 'カスタム', preview: '#8b5cf6' }].map((t) => (
              <button key={t.name} className="p-4 rounded-xl border-2 border-primary bg-primary/10">
                <div className="w-full h-12 rounded-lg mb-3 border border-border" style={{ backgroundColor: t.preview }} />
                <div className="text-sm font-medium text-text-primary">{t.name}</div>
              </button>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  )
}
