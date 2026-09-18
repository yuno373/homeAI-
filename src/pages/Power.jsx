import { useState } from 'react'
import { useSystem } from '../App'
import { Battery, Zap, Sun, BarChart3, Settings } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { StatusCard } from '../components/StatusCard'
import { CircularGauge } from '../components/CircularGauge'
import { SectionCard } from '../components/SectionCard'
import { TabSwitcher } from '../components/TabSwitcher'

export default function Power() {
  const sys = useSystem()
  const { powerStatus } = sys
  const [graphRange, setGraphRange] = useState('24h')
  const historyData = Array.from({ length: graphRange === '24h' ? 24 : 30 }, (_, i) => ({ hour: graphRange === '24h' ? `${i}:00` : `${i + 1}日`, usage: Math.floor(Math.random() * 200 + 250) }))

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">電力管理</h1><p className="text-text-muted text-sm">UPS・蓄電池・電力使用状況</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard title="UPS残量" value={`${powerStatus.ups.percent.toFixed(1)}%`} icon={Battery} color={powerStatus.ups.percent > 50 ? 'success' : 'warning'} subtitle={`推定 ${powerStatus.ups.estimatedTime}`} />
        <StatusCard title="現在消費電力" value={`${powerStatus.currentWatt}W`} icon={Zap} color="accent" />
        <StatusCard title="蓄電池" value={`${powerStatus.battery.percent.toFixed(1)}%`} icon={Battery} color="secondary" subtitle={powerStatus.battery.status} />
        <StatusCard title="発電量" value={`${powerStatus.solar.todayKwh}kWh`} icon={Sun} color="warning" subtitle={powerStatus.solar.forecast} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SectionCard title="UPS管理" icon={Battery}>
          <div className="flex justify-center"><CircularGauge percent={powerStatus.ups.percent} size={120} strokeWidth={10} color="#22c55e" /></div>
          <div className="space-y-2 text-sm mt-4">
            <div className="flex justify-between"><span className="text-text-muted">負荷量</span><span className="text-text-primary">{powerStatus.ups.load}W</span></div>
          </div>
        </SectionCard>
        <SectionCard title="蓄電池管理" icon={Battery}>
          <div className="flex justify-center"><CircularGauge percent={powerStatus.battery.percent} size={120} strokeWidth={10} color="#8b5cf6" /></div>
          <div className="space-y-2 text-sm mt-4">
            <div className="flex justify-between"><span className="text-text-muted">状態</span><span className="text-secondary">{powerStatus.battery.status}</span></div>
          </div>
        </SectionCard>
        <SectionCard title="停電モード" icon={Settings}>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-text-muted">モード</span><span className="text-primary">{powerStatus.mode}</span></div>
            {powerStatus.priorityLoads.map((l, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-text-primary">{l.name}</span>
                <span className={`text-xs ${l.active ? 'text-success' : 'text-text-muted'}`}>{l.active ? '有効' : '無効'}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
      <SectionCard title="電力グラフ" icon={BarChart3}>
        <div className="flex justify-between items-center mb-4">
          <TabSwitcher tabs={[{ value: '24h', label: '24時間' }, { value: '30d', label: '30日' }]} active={graphRange} onChange={setGraphRange} />
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {graphRange === '24h' ? (
              <AreaChart data={historyData}>
                <defs><linearGradient id="cp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} /><stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="hour" stroke="#64748b" fontSize={11} /><YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="usage" stroke="#0ea5e9" fillOpacity={1} fill="url(#cp)" strokeWidth={2} />
              </AreaChart>
            ) : (
              <BarChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="hour" stroke="#64748b" fontSize={11} /><YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                <Bar dataKey="usage" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </div>
  )
}
