import { useState } from 'react'
import { useSystem } from '../App'
import { Battery, Zap, Sun, BarChart3, Settings } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { StatusCard } from '../components/StatusCard'
import { CircularGauge } from '../components/CircularGauge'
import { SectionCard } from '../components/SectionCard'
import { TabSwitcher } from '../components/TabSwitcher'

const generateData = (range) => {
  if (range === '6h') return Array.from({ length: 24 }, (_, i) => ({ hour: `${Math.floor(i / 4)}:${(i % 4) * 15}`, usage: Math.floor(Math.random() * 200 + 250) }))
  if (range === '24h') return Array.from({ length: 24 }, (_, i) => ({ hour: `${i}:00`, usage: Math.floor(Math.random() * 200 + 250) }))
  return Array.from({ length: 30 }, (_, i) => ({ hour: `${i + 1}日`, usage: Math.floor(Math.random() * 200 + 250) }))
}

export default function Power() {
  const sys = useSystem()
  const { powerStatus } = sys
  const [graphRange, setGraphRange] = useState('6h')
  const historyData = generateData(graphRange)

  return (
    <div className="space-y-3">
      <h1 className="text-lg font-bold">電力管理</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <StatusCard title="UPS残量" value={`${powerStatus.ups.percent.toFixed(1)}%`} icon={Battery} color={powerStatus.ups.percent > 50 ? 'success' : 'warning'} subtitle={`推定 ${powerStatus.ups.estimatedTime}`} />
        <StatusCard title="消費電力" value={`${powerStatus.currentWatt}W`} icon={Zap} color="accent" />
        <StatusCard title="蓄電池" value={`${powerStatus.battery.percent.toFixed(1)}%`} icon={Battery} color="secondary" subtitle={powerStatus.battery.status} />
        <StatusCard title="発電量" value={`${powerStatus.solar.todayKwh}kWh`} icon={Sun} color="warning" subtitle={powerStatus.solar.forecast} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        <SectionCard title="UPS" icon={Battery}>
          <div className="flex justify-center"><CircularGauge percent={powerStatus.ups.percent} size={90} strokeWidth={8} color="#22c55e" /></div>
          <div className="text-[11px] text-center mt-2 text-text-muted">負荷: {powerStatus.ups.load}W</div>
        </SectionCard>
        <SectionCard title="蓄電池" icon={Battery}>
          <div className="flex justify-center"><CircularGauge percent={powerStatus.battery.percent} size={90} strokeWidth={8} color="#8b5cf6" /></div>
          <div className="text-[11px] text-center mt-2 text-text-muted">{powerStatus.battery.status}</div>
        </SectionCard>
        <SectionCard title="停電モード" icon={Settings}>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between"><span className="text-text-muted">モード</span><span className="text-primary">{powerStatus.mode}</span></div>
            {powerStatus.priorityLoads.map((l, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-text-primary">{l.name}</span>
                <span className={l.active ? 'text-success' : 'text-text-muted'}>{l.active ? '有効' : '無効'}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="電力グラフ" icon={BarChart3}>
        <div className="flex justify-between items-center mb-2">
          <TabSwitcher tabs={[{ value: '6h', label: '6時間' }, { value: '24h', label: '24時間' }, { value: '30d', label: '30日' }]} active={graphRange} onChange={setGraphRange} />
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            {graphRange === '30d' ? (
              <BarChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', fontSize: 11 }} />
                <Bar dataKey="usage" fill="#0ea5e9" radius={[3, 3, 0, 0]} />
              </BarChart>
            ) : (
              <AreaChart data={historyData}>
                <defs><linearGradient id="cp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} /><stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', fontSize: 11 }} />
                <Area type="monotone" dataKey="usage" stroke="#0ea5e9" fillOpacity={1} fill="url(#cp)" strokeWidth={2} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </div>
  )
}
