import { useState } from 'react'
import { Settings as SettingsIcon, Monitor, Bell, Palette, Cpu, Gauge } from 'lucide-react'
import { SectionCard } from '../components/SectionCard'
import { Toggle } from '../components/Toggle'
import { TabSwitcher } from '../components/TabSwitcher'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('devices')
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">設定</h1><p className="text-text-muted text-sm">システム設定を管理</p></div>
      <SectionCard title="" icon={SettingsIcon}>
        <TabSwitcher tabs={[{ value: 'devices', label: 'デバイス' }, { value: 'sensors', label: 'センサー' }, { value: 'ups', label: 'UPS' }, { value: 'notifications', label: '通知' }, { value: 'theme', label: 'テーマ' }]} active={activeTab} onChange={setActiveTab} />
      </SectionCard>
      {activeTab === 'devices' && (
        <SectionCard title="デバイス管理（DAL）" icon={Monitor}>
          <div className="space-y-2">
            {['劇場照明', 'リビング空調', '防犯カメラ x4', 'UPS', '煙センサー', 'ガスセンサー', '侵入センサー', '温度センサー'].map((name, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-bg-dark/50">
                <div className="flex items-center gap-2"><Cpu size={16} className="text-primary" /><span className="text-sm text-text-primary">{name}</span></div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 rounded text-xs bg-bg-card text-text-secondary hover:bg-bg-card-hover">変更</button>
                  <button className="px-3 py-1 rounded text-xs bg-danger/10 text-danger hover:bg-danger/20">削除</button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
      {activeTab === 'sensors' && (
        <SectionCard title="センサー設定" icon={Gauge}>
          <div className="space-y-3">
            {['人感センサー', '温度センサー', '煙センサー', 'CO2センサー', 'ガスセンサー'].map((name, i) => (
              <div key={i} className="p-3 rounded-lg bg-bg-dark/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-primary">{name}</span>
                  <span className="px-2 py-0.5 rounded text-xs bg-primary/20 text-primary">{['通知', '警告', '緊急', '通知', '緊急'][i]}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">感度</span>
                  <div className="flex gap-1">{['低', '中', '高'].map((l) => <button key={l} className={`px-2 py-0.5 rounded text-xs ${l === '高' ? 'bg-primary text-white' : 'bg-bg-card text-text-secondary'}`}>{l}</button>)}</div>
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
