import { useSystem } from '../App'
import { Lightbulb, Wind, Volume2, Monitor, AlertCircle, Power } from 'lucide-react'
import { Toggle } from '../components/Toggle'
import { Slider } from '../components/Slider'
import { CircularGauge } from '../components/CircularGauge'
import { SectionCard } from '../components/SectionCard'

export default function Theater() {
  const sys = useSystem()
  const { devices, updateDevice, emergencyStop } = sys

  const theaterLight = devices.find(d => d.id === 'light_theater')
  const theaterHvac = devices.find(d => d.id === 'hvac_theater')
  const projector = devices.find(d => d.id === 'projector_theater')
  const speaker = devices.find(d => d.id === 'speaker_theater')
  const emergencyLight = devices.find(d => d.id === 'light_emergency')
  const ups = devices.find(d => d.id === 'ups_main')
  const co2 = devices.find(d => d.id === 'sensor_co2')

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">地下劇場</h1>
        <button onClick={emergencyStop} className="px-3 py-1.5 rounded-md bg-danger/20 text-danger border border-danger/30 hover:bg-danger/30 text-xs font-bold transition">緊急停止</button>
      </div>

      {/* ステータス4つ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <div className={`flex items-center gap-2 p-2.5 rounded-md border min-h-[48px] ${theaterLight?.attributes.on ? 'bg-primary/5 border-primary/20' : 'bg-bg-card border-border'}`}>
          <Lightbulb size={14} className={theaterLight?.attributes.on ? 'text-primary' : 'text-text-muted'} />
          <div><div className="text-[9px] text-text-muted">照明</div><div className={`text-xs font-bold ${theaterLight?.attributes.on ? 'text-primary' : 'text-text-muted'}`}>{theaterLight?.attributes.on ? `${theaterLight?.attributes.brightness}%` : 'OFF'}</div></div>
        </div>
        <div className={`flex items-center gap-2 p-2.5 rounded-md border min-h-[48px] ${theaterHvac?.attributes.on ? 'bg-success/5 border-success/20' : 'bg-bg-card border-border'}`}>
          <Wind size={14} className={theaterHvac?.attributes.on ? 'text-success' : 'text-text-muted'} />
          <div><div className="text-[9px] text-text-muted">空調</div><div className={`text-xs font-bold ${theaterHvac?.attributes.on ? 'text-success' : 'text-text-muted'}`}>{theaterHvac?.attributes.on ? `${theaterHvac?.attributes.temperature}°C` : 'OFF'}</div></div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-md bg-bg-card border border-border min-h-[48px]">
          <Volume2 size={14} className="text-secondary" />
          <div><div className="text-[9px] text-text-muted">音響</div><div className="text-xs font-bold text-secondary">{speaker?.attributes.volume}%</div></div>
        </div>
        <div className={`flex items-center gap-2 p-2.5 rounded-md border min-h-[48px] ${projector?.attributes.on ? 'bg-accent/5 border-accent/20' : 'bg-bg-card border-border'}`}>
          <Monitor size={14} className={projector?.attributes.on ? 'text-accent' : 'text-text-muted'} />
          <div><div className="text-[9px] text-text-muted">プロジェクター</div><div className={`text-xs font-bold ${projector?.attributes.on ? 'text-accent' : 'text-text-muted'}`}>{projector?.attributes.on ? 'ON' : 'OFF'}</div></div>
        </div>
      </div>

      {/* 操作 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <SectionCard title="照明" icon={Lightbulb}>
          <div className="space-y-2">
            <Toggle checked={theaterLight?.attributes.on} onChange={() => updateDevice('light_theater', { on: !theaterLight?.attributes.on })} label="電源" />
            <Slider label="明るさ" value={theaterLight?.attributes.brightness || 0} onChange={(v) => updateDevice('light_theater', { brightness: v })} color="#0ea5e9" />
          </div>
        </SectionCard>
        <SectionCard title="空調" icon={Wind}>
          <div className="space-y-2">
            <Toggle checked={theaterHvac?.attributes.on} onChange={() => updateDevice('hvac_theater', { on: !theaterHvac?.attributes.on })} label="電源" />
            <Slider label="温度" value={theaterHvac?.attributes.temperature || 22} onChange={(v) => updateDevice('hvac_theater', { temperature: v })} min={16} max={30} unit="°C" color="#22c55e" />
          </div>
        </SectionCard>
        <SectionCard title="音響" icon={Volume2}>
          <Slider label="音量" value={speaker?.attributes.volume || 0} onChange={(v) => updateDevice('speaker_theater', { volume: v })} color="#8b5cf6" />
        </SectionCard>
        <SectionCard title="プロジェクター" icon={Monitor}>
          <Toggle checked={projector?.attributes.on} onChange={() => updateDevice('projector_theater', { on: !projector?.attributes.on })} label="電源" />
          <div className="flex gap-4 text-[11px] mt-2">
            <span className="text-text-muted">入力: <span className="text-text-primary">{projector?.attributes.input}</span></span>
            <span className="text-text-muted">解像度: <span className="text-text-primary">{projector?.attributes.resolution}</span></span>
          </div>
        </SectionCard>
      </div>

      {/* 下段3列 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <SectionCard title="非常灯" icon={AlertCircle}>
          <Toggle checked={emergencyLight?.attributes.on} onChange={() => updateDevice('light_emergency', { on: !emergencyLight?.attributes.on })} label="非常灯" />
        </SectionCard>
        <SectionCard title="UPS" icon={Power}>
          <div className="flex items-center gap-3">
            <CircularGauge percent={ups?.attributes.percent || 0} size={60} strokeWidth={6} color={ups?.attributes.percent > 50 ? '#22c55e' : '#ef4444'} />
            <div className="text-[10px] text-text-muted">{ups?.attributes.estimatedTime} / {ups?.attributes.load}W</div>
          </div>
        </SectionCard>
        <SectionCard title="センサー" icon={AlertCircle}>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between"><span className="text-text-muted">CO2</span><span>{co2?.attributes.value}ppm</span></div>
            <div className="flex justify-between"><span className="text-text-muted">煙</span><span className="text-success">正常</span></div>
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
