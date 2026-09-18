import { useState, useEffect, createContext, useContext } from 'react'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import {
  Home, Film, Zap, Shield, Brain, Globe, Settings, Menu, ChevronRight
} from 'lucide-react'
import HomeScreen from './pages/Home'
import Theater from './pages/Theater'
import Power from './pages/Power'
import Security from './pages/Security'
import AiCenter from './pages/AiCenter'
import External from './pages/External'
import SettingsPage from './pages/SettingsPage'

const navItems = [
  { path: '/', label: 'ホーム', icon: Home },
  { path: '/theater', label: '地下劇場', icon: Film },
  { path: '/power', label: '電力管理', icon: Zap },
  { path: '/security', label: '防犯・監視', icon: Shield },
  { path: '/ai', label: 'AI司令室', icon: Brain },
  { path: '/external', label: '外部アクセス', icon: Globe },
  { path: '/settings', label: '設定', icon: Settings },
]

const SystemContext = createContext(null)
export function useSystem() { return useContext(SystemContext) }

function Sidebar({ open, onClose }) {
  const location = useLocation()
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full w-56 bg-bg-card border-r border-border z-50 transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-0`}>
        <div className="p-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Brain size={16} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-text-primary">唯希邸 AI</div>
              <div className="text-[9px] text-text-muted">v5.0</div>
            </div>
          </div>
        </div>
        <nav className="p-2 space-y-0.5">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === '/'} onClick={onClose}
              className={({ isActive }) => `flex items-center gap-2 px-2.5 py-1.5 rounded text-xs font-medium transition-all ${isActive ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-bg-card-hover hover:text-text-primary'}`}>
              <item.icon size={14} className="shrink-0" />
              <span className="flex-1">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border">
          <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
            <div className="w-1.5 h-1.5 rounded-full bg-success" />
            <span>全5AI稼働中</span>
          </div>
        </div>
      </aside>
    </>
  )
}

function Header({ onMenuClick }) {
  const location = useLocation()
  const currentNav = navItems.find(item => item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path))
  return (
    <header className="h-10 border-b border-border bg-bg-card/80 backdrop-blur-sm flex items-center px-3 gap-3 sticky top-0 z-30">
      <button onClick={onMenuClick} className="lg:hidden p-1.5 rounded hover:bg-bg-card-hover text-text-secondary"><Menu size={16} /></button>
      <div className="flex items-center gap-1.5">
        {currentNav && <currentNav.icon size={14} className="text-primary" />}
        <span className="text-xs font-semibold text-text-primary">{currentNav?.label || 'ホーム'}</span>
      </div>
      <div className="flex-1" />
      <div className="text-[10px] text-text-muted hidden md:block">
        {new Date().toLocaleDateString('ja-JP')} {new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
      </div>
    </header>
  )
}

function makeVirtualDevices() {
  return [
    { id: 'light_entrance', type: 'light', name: '玄関照明', mode: 'virtual', online: true, attributes: { on: true, brightness: 80, color: '#ffffff' } },
    { id: 'light_living', type: 'light', name: 'リビング照明', mode: 'virtual', online: true, attributes: { on: true, brightness: 70, color: '#fff5e6' } },
    { id: 'light_theater', type: 'light', name: '劇場照明', mode: 'virtual', online: true, attributes: { on: true, brightness: 20, color: '#ffffff', scene: '上映モード' } },
    { id: 'light_hallway', type: 'light', name: '廊下照明', mode: 'virtual', online: true, attributes: { on: false, brightness: 0, color: '#ffffff' } },
    { id: 'light_emergency', type: 'light', name: '非常灯', mode: 'virtual', online: true, attributes: { on: false, brightness: 100, color: '#ff0000' } },
    { id: 'light_outer_1', type: 'light', name: '外周照明1', mode: 'virtual', online: true, attributes: { on: true, brightness: 60, color: '#ffffff' } },
    { id: 'light_outer_2', type: 'light', name: '外周照明2', mode: 'virtual', online: true, attributes: { on: true, brightness: 60, color: '#ffffff' } },
    { id: 'curtain_living', type: 'curtain', name: 'リビングカーテン', mode: 'virtual', online: true, attributes: { position: 80, moving: false } },
    { id: 'curtain_theater', type: 'curtain', name: '劇場カーテン', mode: 'virtual', online: true, attributes: { position: 0, moving: false } },
    { id: 'hvac_living', type: 'hvac', name: 'リビング空調', mode: 'virtual', online: true, attributes: { on: true, mode: 'auto', temperature: 23, currentTemp: 24.5, fanSpeed: 2, autoMode: true } },
    { id: 'hvac_theater', type: 'hvac', name: '劇場空調', mode: 'virtual', online: true, attributes: { on: true, mode: 'cool', temperature: 22, currentTemp: 23.5, fanSpeed: 2, autoMode: true } },
    { id: 'projector_theater', type: 'projector', name: '劇場プロジェクター', mode: 'virtual', online: true, attributes: { on: true, input: 'HDMI-1', brightness: 90, resolution: '4K' } },
    { id: 'shutter_1', type: 'shutter', name: 'シャッター1', mode: 'virtual', online: true, attributes: { position: 100, moving: false } },
    { id: 'shutter_2', type: 'shutter', name: 'シャッター2', mode: 'virtual', online: true, attributes: { position: 100, moving: false } },
    { id: 'lock_entrance', type: 'lock', name: '玄関ロック', mode: 'virtual', online: true, attributes: { locked: true } },
    { id: 'lock_underground', type: 'lock', name: '地下入口ロック', mode: 'virtual', online: true, attributes: { locked: true } },
    { id: 'lock_theater', type: 'lock', name: '劇場ドアロック', mode: 'virtual', online: true, attributes: { locked: true } },
    { id: 'camera_entrance', type: 'camera', name: '玄関カメラ', mode: 'virtual', online: true, attributes: { recording: true, streamUrl: '/virtual/camera/entrance', resolution: '1080p' } },
    { id: 'camera_hallway', type: 'camera', name: '廊下カメラ', mode: 'virtual', online: true, attributes: { recording: true, streamUrl: '/virtual/camera/hallway', resolution: '1080p' } },
    { id: 'camera_underground', type: 'camera', name: '地下入口カメラ', mode: 'virtual', online: true, attributes: { recording: true, streamUrl: '/virtual/camera/underground', resolution: '1080p' } },
    { id: 'camera_theater', type: 'camera', name: '劇場内部カメラ', mode: 'virtual', online: true, attributes: { recording: true, streamUrl: '/virtual/camera/theater', resolution: '1080p' } },
    { id: 'sensor_temp', type: 'sensor', name: '温度センサー', mode: 'virtual', online: true, attributes: { value: 23.5, unit: '°C', type: 'temperature' } },
    { id: 'sensor_humidity', type: 'sensor', name: '湿度センサー', mode: 'virtual', online: true, attributes: { value: 55, unit: '%', type: 'humidity' } },
    { id: 'sensor_co2', type: 'sensor', name: 'CO2センサー', mode: 'virtual', online: true, attributes: { value: 420, unit: 'ppm', type: 'co2' } },
    { id: 'sensor_smoke', type: 'sensor', name: '煙センサー', mode: 'virtual', online: true, attributes: { value: 0, unit: '', type: 'smoke' } },
    { id: 'sensor_gas', type: 'sensor', name: 'ガスセンサー', mode: 'virtual', online: true, attributes: { value: 0, unit: '', type: 'gas' } },
    { id: 'sensor_motion', type: 'sensor', name: '人感センサー', mode: 'virtual', online: true, attributes: { value: 0, unit: '', type: 'motion' } },
    { id: 'ups_main', type: 'ups', name: 'メインUPS', mode: 'virtual', online: true, attributes: { percent: 87, load: 340, estimatedTime: '4h 30m', charging: false, inputVoltage: 100 } },
    { id: 'speaker_theater', type: 'speaker', name: '劇場スピーカー', mode: 'virtual', online: true, attributes: { on: true, volume: 65, playing: false, source: 'HDMI' } },
  ]
}

function makeVirtualEvents() {
  const zones = ['front_1_5m', 'post_zone', 'front_door', 'underground_entry', 'hallway', 'garden', 'parking']
  const people = ['不明の男性', '郵便配達員', '宅配便', '近隣住人', '通行人']
  const animals = ['猫', '犬', '小鳥']
  const results = []
  for (let i = 0; i < 12; i++) {
    const isPerson = Math.random() > 0.3
    const type = isPerson ? 'person' : 'animal'
    const label = isPerson ? people[Math.floor(Math.random() * people.length)] : animals[Math.floor(Math.random() * animals.length)]
    results.push({
      id: `ev_${i}_${Date.now()}`,
      type,
      zone: zones[Math.floor(Math.random() * zones.length)],
      timestamp: new Date(Date.now() - i * 600000).toISOString(),
      confidence: 60 + Math.floor(Math.random() * 40),
      label,
      score: Math.floor(Math.random() * 80 + 10),
    })
  }
  return results
}

const VIRTUAL_POWER = {
  grid: { online: true, voltage: 100 },
  ups: { percent: 87, load: 340, estimatedTime: '4h 30m', charging: false },
  battery: { percent: 92, status: 'charging', chargeRate: 120 },
  solar: { generating: true, todayKwh: 12.4, forecast: '晴れ - 発電効率高' },
  currentWatt: 340,
  mode: 'normal',
  priorityLoads: [
    { name: '防犯システム', priority: 1, active: true },
    { name: '冷蔵庫', priority: 2, active: true },
    { name: '地下劇場', priority: 3, active: true },
    { name: '一般照明', priority: 4, active: false },
  ],
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [devices, setDevices] = useState(makeVirtualDevices())
  const [events] = useState(makeVirtualEvents())
  const [powerStatus, setPowerStatus] = useState(VIRTUAL_POWER)
  const [voiceHistory, setVoiceHistory] = useState([])
  const [aiDecisions, setAiDecisions] = useState([
    { id: '1', timestamp: new Date(Date.now() - 1800000).toISOString(), input: '劇場照明を20%に自動調整', reasoning: '上映開始を検知', result: '劇場照明ON', confidence: 0.95 },
    { id: '2', timestamp: new Date(Date.now() - 900000).toISOString(), input: '空調を省エネモードに切替', reasoning: '外出モード自動有効化', result: '空調省エネ切替', confidence: 0.88 },
    { id: '3', timestamp: new Date(Date.now() - 3600000).toISOString(), input: 'セキュリティチェック完了', reasoning: '定期チェック', result: '全システム正常', confidence: 1.0 },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(prev => prev.map(d => {
        if (d.type === 'sensor' && d.attributes.type === 'temperature') {
          return { ...d, attributes: { ...d.attributes, value: Math.round((d.attributes.value + (Math.random() - 0.5) * 0.3) * 10) / 10 } }
        }
        if (d.type === 'ups') {
          const attrs = d.attributes
          const newPercent = attrs.charging ? Math.min(100, attrs.percent + 0.1) : Math.max(0, attrs.percent - 0.02)
          return { ...d, attributes: { ...attrs, percent: Math.round(newPercent * 10) / 10, load: 280 + Math.floor(Math.random() * 120) } }
        }
        return d
      }))
      setPowerStatus(prev => ({
        ...prev,
        currentWatt: 280 + Math.floor(Math.random() * 120),
        ups: { ...prev.ups, percent: Math.max(0, prev.ups.percent - 0.02) },
        battery: { ...prev.battery, percent: Math.min(100, prev.battery.percent + 0.05) },
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const updateDevice = (id, newAttrs) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, attributes: { ...d.attributes, ...newAttrs } } : d))
  }

  const handleVoice = (text) => {
    const lower = text.toLowerCase()
    let response = '申し訳ありません。もう一度お試しください。'
    if (lower.includes('劇場') && (lower.includes('つけて') || lower.includes('ON'))) {
      updateDevice('light_theater', { on: true, brightness: 80 })
      updateDevice('hvac_theater', { on: true })
      updateDevice('projector_theater', { on: true })
      response = '地下劇場を起動しました。照明・空調・プロジェクターON'
    } else if (lower.includes('劇場') && (lower.includes('けして') || lower.includes('OFF'))) {
      updateDevice('light_theater', { on: false })
      updateDevice('hvac_theater', { on: false })
      updateDevice('projector_theater', { on: false })
      response = '地下劇場を終了しました'
    } else if (lower.includes('ups') || lower.includes('バッテリー')) {
      response = `UPS残量は${powerStatus.ups.percent}%です。推定稼働時間: ${powerStatus.ups.estimatedTime}`
    } else if (lower.includes('停電')) {
      setPowerStatus(prev => ({ ...prev, mode: 'blackout' }))
      response = '停電モードに切り替えました'
    } else if (lower.includes('施錠') || lower.includes('ロック')) {
      updateDevice('lock_entrance', { locked: true })
      updateDevice('lock_underground', { locked: true })
      updateDevice('lock_theater', { locked: true })
      response = '全ドアを施錠しました'
    } else if (lower.includes('温度') || lower.includes('度')) {
      const match = lower.match(/(\d+)/)
      if (match) {
        updateDevice('hvac_theater', { temperature: parseInt(match[1]) })
        response = `温度を${match[1]}度に設定しました`
      }
    }
    setVoiceHistory(prev => [{ text, response, time: new Date().toLocaleTimeString('ja-JP') }, ...prev].slice(0, 10))
    setAiDecisions(prev => [{
      id: `dec_${Date.now()}`,
      timestamp: new Date().toISOString(),
      input: text,
      reasoning: 'Llama 3.1 70B による統合判断',
      result: response,
      confidence: 0.9,
    }, ...prev].slice(0, 20))
  }

  const lockAll = () => {
    updateDevice('lock_entrance', { locked: true })
    updateDevice('lock_underground', { locked: true })
    updateDevice('lock_theater', { locked: true })
  }

  const emergencyStop = () => {
    updateDevice('lock_entrance', { locked: true })
    updateDevice('lock_underground', { locked: true })
    updateDevice('lock_theater', { locked: true })
    updateDevice('light_emergency', { on: true })
    updateDevice('shutter_1', { position: 0 })
    updateDevice('shutter_2', { position: 0 })
    updateDevice('light_outer_1', { brightness: 100 })
    updateDevice('light_outer_2', { brightness: 100 })
  }

  const systemValue = { devices, events, powerStatus, voiceHistory, aiDecisions, updateDevice, handleVoice, lockAll, emergencyStop }

  return (
    <SystemContext.Provider value={systemValue}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/theater" element={<Theater />} />
              <Route path="/power" element={<Power />} />
              <Route path="/security" element={<Security />} />
              <Route path="/ai" element={<AiCenter />} />
              <Route path="/external" element={<External />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </SystemContext.Provider>
  )
}
