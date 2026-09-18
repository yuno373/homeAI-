import { useSystem } from '../App'
import { Zap, Shield, AlertTriangle, Wifi, WifiOff, Brain, Eye, Mic, Home as HomeIcon, Activity } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { StatusCard } from '../components/StatusCard'
import { SectionCard } from '../components/SectionCard'

export default function Home() {
  const sys = useSystem()
  const { devices, powerStatus, events } = sys
  const lights = devices.filter(d => d.type === 'light')
  const locks = devices.filter(d => d.type === 'lock')
  const onlineCount = devices.filter(d => d.online).length
  const historyData = Array.from({ length: 24 }, (_, i) => ({ hour: `${i}:00`, usage: Math.floor(Math.random() * 200 + 250) }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">ホーム</h1>
          <p className="text-text-muted text-sm">唯希邸の状態を確認</p>
        </div>
        <div className="px-4 py-2 rounded-full border text-sm font-semibold bg-primary/10 text-primary border-primary/30">通常モード</div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard title="デバイスオンライン" value={`${onlineCount}/${devices.length}`} icon={Wifi} color="success" />
        <StatusCard title="現在消費電力" value={`${powerStatus.currentWatt}W`} icon={Zap} color="accent" />
        <StatusCard title="UPS残量" value={`${powerStatus.ups.percent.toFixed(1)}%`} icon={AlertTriangle} color={powerStatus.ups.percent > 30 ? 'success' : 'danger'} />
        <StatusCard title="蓄電池" value={`${powerStatus.battery.percent.toFixed(1)}%`} icon={Activity} color="secondary" subtitle={powerStatus.battery.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="照明状態" icon={Brain}>
          <div className="space-y-2">
            {lights.map((l) => (
              <div key={l.id} className="flex items-center justify-between p-2 rounded bg-bg-dark/50">
                <span className="text-sm text-text-primary">{l.name}</span>
                <span className={`text-xs ${l.attributes.on ? 'text-success' : 'text-text-muted'}`}>
                  {l.attributes.on ? `${l.attributes.brightness}%` : 'OFF'}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="防犯ステータス" icon={Shield}>
          <div className="space-y-2">
            {locks.map((l) => (
              <div key={l.id} className="flex items-center justify-between p-2 rounded bg-bg-dark/50">
                <span className="text-sm text-text-primary">{l.name}</span>
                <span className={`px-2 py-0.5 rounded text-xs ${l.attributes.locked ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                  {l.attributes.locked ? '施錠' : '解錠'}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="過去24時間の消費電力" icon={Zap}>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData}>
              <defs><linearGradient id="cu" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} /><stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="hour" stroke="#64748b" fontSize={11} /><YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="usage" stroke="#0ea5e9" fillOpacity={1} fill="url(#cu)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard title="AIシステム状態" icon={Brain}>
        <div className="grid grid-cols-5 gap-3">
          {[
            { name: '司令官', model: 'Llama 3.1 70B', icon: Brain, color: 'text-primary' },
            { name: '監視AI', model: 'YOLOv8', icon: Eye, color: 'text-danger' },
            { name: '音声AI', model: 'Whisper', icon: Mic, color: 'text-secondary' },
            { name: '電力AI', model: 'Python ML', icon: Zap, color: 'text-warning' },
            { name: '設備AI', model: 'Home Assistant', icon: HomeIcon, color: 'text-success' },
          ].map((ai) => (
            <div key={ai.name} className="p-3 rounded-lg border border-border bg-bg-dark/50 text-center">
              <ai.icon size={18} className={`mx-auto mb-1 ${ai.color}`} />
              <div className="w-2 h-2 rounded-full bg-success mx-auto mb-1 animate-pulse" />
              <div className="text-xs font-bold text-text-primary">{ai.name}</div>
              <div className="text-[10px] text-text-muted">{ai.model}</div>
              <div className="text-[10px] text-success mt-1">稼働中</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="デバイス一覧" icon={Wifi}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {devices.map((device) => (
            <div key={device.id} className="flex items-center gap-2 p-3 rounded-lg bg-bg-dark/50">
              {device.online ? <Wifi size={14} className="text-success" /> : <WifiOff size={14} className="text-danger" />}
              <div>
                <span className="text-xs text-text-secondary truncate block">{device.name}</span>
                <span className="text-[10px] text-text-muted">{device.mode}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
