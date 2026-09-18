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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">地下劇場</h1>
          <p className="text-text-muted text-sm">劇場設備を制御（DAL経由）</p>
        </div>
        <button onClick={emergencyStop} className="px-4 py-2 rounded-lg bg-danger/20 text-danger border border-danger/30 hover:bg-danger/30 font-bold text-sm transition">緊急停止</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-3 rounded-lg border text-center ${theaterLight?.attributes.on ? 'bg-primary/10 border-primary/30' : 'bg-bg-card border-border'}`}>
          <Lightbulb size={20} className={`mx-auto mb-1 ${theaterLight?.attributes.on ? 'text-primary' : 'text-text-muted'}`} />
          <div className="text-xs text-text-secondary">照明</div>
          <div className={`text-sm font-bold ${theaterLight?.attributes.on ? 'text-primary' : 'text-text-muted'}`}>{theaterLight?.attributes.on ? `${theaterLight?.attributes.brightness}%` : 'OFF'}</div>
        </div>
        <div className={`p-3 rounded-lg border text-center ${theaterHvac?.attributes.on ? 'bg-success/10 border-success/30' : 'bg-bg-card border-border'}`}>
          <Wind size={20} className={`mx-auto mb-1 ${theaterHvac?.attributes.on ? 'text-success' : 'text-text-muted'}`} />
          <div className="text-xs text-text-secondary">空調</div>
          <div className={`text-sm font-bold ${theaterHvac?.attributes.on ? 'text-success' : 'text-text-muted'}`}>{theaterHvac?.attributes.on ? `${theaterHvac?.attributes.temperature}°C` : 'OFF'}</div>
        </div>
        <div className="p-3 rounded-lg border bg-bg-card border-border text-center">
          <Volume2 size={20} className="mx-auto mb-1 text-secondary" />
          <div className="text-xs text-text-secondary">音響</div>
          <div className="text-sm font-bold text-secondary">{speaker?.attributes.volume}%</div>
        </div>
        <div className={`p-3 rounded-lg border text-center ${projector?.attributes.on ? 'bg-accent/10 border-accent/30' : 'bg-bg-card border-border'}`}>
          <Monitor size={20} className={`mx-auto mb-1 ${projector?.attributes.on ? 'text-accent' : 'text-text-muted'}`} />
          <div className="text-xs text-text-secondary">プロジェクター</div>
          <div className={`text-sm font-bold ${projector?.attributes.on ? 'text-accent' : 'text-text-muted'}`}>{projector?.attributes.on ? 'ON' : 'OFF'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="照明操作" icon={Lightbulb}>
          <div className="space-y-4">
            <Toggle checked={theaterLight?.attributes.on} onChange={() => updateDevice('light_theater', { on: !theaterLight?.attributes.on })} label="照明電源" />
            <Slider label="明るさ" value={theaterLight?.attributes.brightness || 0} onChange={(v) => updateDevice('light_theater', { brightness: v })} color="#0ea5e9" />
          </div>
        </SectionCard>
        <SectionCard title="空調操作" icon={Wind}>
          <div className="space-y-4">
            <Toggle checked={theaterHvac?.attributes.on} onChange={() => updateDevice('hvac_theater', { on: !theaterHvac?.attributes.on })} label="空調電源" />
            <Slider label="温度設定" value={theaterHvac?.attributes.temperature || 22} onChange={(v) => updateDevice('hvac_theater', { temperature: v })} min={16} max={30} unit="°C" color="#22c55e" />
          </div>
        </SectionCard>
        <SectionCard title="音響操作" icon={Volume2}>
          <Slider label="音量" value={speaker?.attributes.volume || 0} onChange={(v) => updateDevice('speaker_theater', { volume: v })} color="#8b5cf6" />
        </SectionCard>
        <SectionCard title="プロジェクター" icon={Monitor}>
          <Toggle checked={projector?.attributes.on} onChange={() => updateDevice('projector_theater', { on: !projector?.attributes.on })} label="電源" />
          <div className="grid grid-cols-2 gap-3 text-sm mt-3">
            <div><span className="text-text-muted">入力: </span><span className="text-text-primary">{projector?.attributes.input}</span></div>
            <div><span className="text-text-muted">解像度: </span><span className="text-text-primary">{projector?.attributes.resolution}</span></div>
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SectionCard title="非常灯" icon={AlertCircle}>
          <Toggle checked={emergencyLight?.attributes.on} onChange={() => updateDevice('light_emergency', { on: !emergencyLight?.attributes.on })} label="非常灯" />
        </SectionCard>
        <SectionCard title="UPS状態" icon={Power}>
          <div className="flex justify-center">
            <CircularGauge percent={ups?.attributes.percent || 0} size={100} color={ups?.attributes.percent > 50 ? '#22c55e' : '#ef4444'} />
          </div>
          <div className="text-center text-xs text-text-muted mt-2">推定: {ups?.attributes.estimatedTime} / 負荷: {ups?.attributes.load}W</div>
        </SectionCard>
        <SectionCard title="センサー" icon={AlertCircle}>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-text-muted">CO2</span><span className="text-text-primary">{co2?.attributes.value}ppm</span></div>
            <div className="flex justify-between"><span className="text-text-muted">煙検知</span><span className="text-success">✓ 正常</span></div>
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
