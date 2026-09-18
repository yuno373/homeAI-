import { useState } from 'react'
import { useSystem } from '../App'
import { Brain, Eye, Mic, Zap, Home, Clock, Radio } from 'lucide-react'
import { SectionCard } from '../components/SectionCard'
import { TabSwitcher } from '../components/TabSwitcher'

const systems = [
  { id: 'llama', name: '司令官', model: 'Llama', icon: Brain, color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/20' },
  { id: 'yolo', name: '監視', model: 'YOLO', icon: Eye, color: 'text-danger', bg: 'bg-danger/5', border: 'border-danger/20' },
  { id: 'whisper', name: '音声', model: 'Whisper', icon: Mic, color: 'text-secondary', bg: 'bg-secondary/5', border: 'border-secondary/20' },
  { id: 'power-ai', name: '電力', model: 'Python', icon: Zap, color: 'text-warning', bg: 'bg-warning/5', border: 'border-warning/20' },
  { id: 'ha', name: '設備', model: 'HA', icon: Home, color: 'text-success', bg: 'bg-success/5', border: 'border-success/20' },
]

const whisperLogs = [
  { time: '18:32', text: '劇場の照明を20%にして', confidence: 0.96, noise: 12 },
  { time: '18:15', text: '玄関のロックをかけて', confidence: 0.98, noise: 8 },
  { time: '17:58', text: 'UPSの残量は？', confidence: 0.99, noise: 5 },
  { time: '17:30', text: '外周照明を自動にして', confidence: 0.94, noise: 15 },
]

const frigateLogs = [
  { time: '18:30', zone: '玄関前', type: 'person', label: '来訪者', confidence: 0.95, tracked: true },
  { time: '18:22', zone: '外周', type: 'animal', label: '猫', confidence: 0.88, tracked: false },
  { time: '17:45', zone: '廊下', type: 'person', label: '住人', confidence: 0.99, tracked: true },
]

export default function AiCenter() {
  const sys = useSystem()
  const { voiceHistory, aiDecisions, handleVoice } = sys
  const [viewMode, setViewMode] = useState('overview')
  const [voiceInput, setVoiceInput] = useState('')

  const handleVoiceSubmit = () => {
    if (!voiceInput.trim()) return
    handleVoice(voiceInput)
    setVoiceInput('')
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-lg font-bold">AI司令室</h1>
        <TabSwitcher tabs={[
          { value: 'overview', label: '一覧' },
          { value: 'llama', label: 'Llama' },
          { value: 'whisper', label: 'Whisper' },
          { value: 'frigate', label: 'Frigate' },
          { value: 'log', label: 'ログ' },
        ]} active={viewMode} onChange={setViewMode} />
      </div>

      {/* AI一覧 */}
      <div className="grid grid-cols-5 gap-1.5">
        {systems.map((s) => (
          <button key={s.id} onClick={() => setViewMode(s.id === 'llama' ? 'llama' : s.id === 'whisper' ? 'whisper' : 'overview')}
            className={`p-2 rounded-md border cursor-pointer transition-all ${s.bg} ${s.border}`}>
            <div className="flex items-center gap-1 mb-1"><s.icon size={12} className={s.color} /><div className="w-1.5 h-1.5 rounded-full bg-success" /></div>
            <div className="text-[10px] font-bold text-text-primary">{s.name}</div>
            <div className="text-[8px] text-text-muted">{s.model}</div>
          </button>
        ))}
      </div>

      {/* 司令官 */}
      {viewMode === 'llama' && (
        <SectionCard title="司令官の判断" icon={Brain}>
          <div className="grid grid-cols-2 gap-1.5 mb-2">
            {[
              { label: '家の状態', value: '通常モード', color: 'text-primary' },
              { label: '唯希の位置', value: 'リビング', color: 'text-secondary' },
              { label: '来訪者', value: 'なし', color: 'text-success' },
              { label: '危険度', value: '35 要注意', color: 'text-warning' },
            ].map((item) => (
              <div key={item.label} className="p-2 rounded bg-bg-dark/30">
                <div className="text-[9px] text-text-muted">{item.label}</div>
                <div className={`text-[11px] font-bold ${item.color}`}>{item.value}</div>
              </div>
            ))}
          </div>
          <div className="p-2 rounded bg-primary/5 border border-primary/15">
            <div className="text-[9px] text-text-muted mb-0.5">判断理由</div>
            <div className="text-[10px] text-text-secondary leading-snug">外周カメラで人影検出。住人の帰宅パターンと一致するため「安全」と判断。</div>
          </div>
        </SectionCard>
      )}

      {/* Whisper */}
      {viewMode === 'whisper' && (
        <SectionCard title="音声ログ（Whisper）" icon={Mic}>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {whisperLogs.map((log, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded bg-bg-dark/30">
                <div className="min-w-0">
                  <div className="text-[10px] text-primary truncate">「{log.text}」</div>
                  <div className="text-[9px] text-text-muted">{log.time}</div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <div className="text-[10px] font-bold text-success">{(log.confidence * 100).toFixed(0)}%</div>
                  <div className="text-[8px] text-text-muted">{log.noise}dB</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Frigate */}
      {viewMode === 'frigate' && (
        <SectionCard title="監視ログ（Frigate）" icon={Eye}>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {frigateLogs.map((log, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded bg-bg-dark/30">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-sm">{log.type === 'person' ? '👤' : '🐾'}</span>
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium text-text-primary truncate">{log.label}</div>
                    <div className="text-[9px] text-text-muted">{log.zone} / {log.time}</div>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <div className="text-[10px] font-bold text-success">{(log.confidence * 100).toFixed(0)}%</div>
                  <div className={`text-[8px] ${log.tracked ? 'text-danger' : 'text-text-muted'}`}>{log.tracked ? '追跡' : '通過'}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* 概要 */}
      {viewMode === 'overview' && (
        <SectionCard title="接続図" icon={Radio}>
          <div className="flex items-center justify-center gap-3 py-3">
            <div className="text-center p-2 rounded bg-primary/5 border border-primary/20">
              <Brain size={20} className="mx-auto mb-1 text-primary" />
              <div className="text-[10px] font-bold">司令官</div>
            </div>
            <div className="text-xs text-text-muted">→</div>
            <div className="grid grid-cols-2 gap-1">
              {systems.filter(s => s.id !== 'llama').map((s) => (
                <div key={s.id} className={`p-1.5 rounded ${s.bg} border ${s.border}`}>
                  <s.icon size={12} className={`${s.color} mx-auto`} />
                  <div className="text-[8px] text-center mt-0.5">{s.name}</div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      )}

      {/* 音声入力 */}
      <SectionCard title="音声コマンド" icon={Mic}>
        <div className="flex gap-1.5">
          <input type="text" value={voiceInput} onChange={(e) => setVoiceInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleVoiceSubmit()}
            placeholder='「劇場つけて」「UPS残量教えて」'
            className="flex-1 px-3 py-2 rounded-md bg-bg-dark/50 border border-border text-text-primary placeholder-text-muted focus:outline-none focus:border-primary text-xs" />
          <button onClick={handleVoiceSubmit} className="px-3 py-2 rounded-md bg-primary text-white text-xs font-bold hover:bg-primary-dark transition">送信</button>
        </div>
        {voiceHistory.length > 0 && (
          <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
            {voiceHistory.map((h, i) => (
              <div key={i} className="p-1.5 rounded bg-bg-dark/30 text-[10px]">
                <span className="text-primary">「{h.text}」</span>
                <span className="text-text-muted ml-1">→</span>
                <span className="text-text-secondary ml-1">{h.response}</span>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* ログ */}
      {viewMode === 'log' && (
        <SectionCard title="判断ログ" icon={Clock}>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {aiDecisions.map((d) => (
              <div key={d.id} className="p-2 rounded bg-bg-dark/30">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-text-muted">{new Date(d.timestamp).toLocaleTimeString('ja-JP')}</span>
                  <span className="text-[10px] text-primary">{Math.round(d.confidence * 100)}%</span>
                </div>
                <div className="text-[11px] text-text-primary">{d.input}</div>
                <div className="text-[9px] text-text-muted">{d.reasoning} → <span className="text-success">{d.result}</span></div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  )
}
