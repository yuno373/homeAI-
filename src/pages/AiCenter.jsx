import { useState } from 'react'
import { useSystem } from '../App'
import { Brain, Eye, Mic, Zap, Home, Clock, CheckCircle, Radio, MapPin, User, Activity } from 'lucide-react'
import { SectionCard } from '../components/SectionCard'
import { TabSwitcher } from '../components/TabSwitcher'

const systems = [
  { id: 'llama', name: '司令官', model: 'Llama 3.1 70B', icon: Brain, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30', desc: '家全体の統合判断を担当。', caps: ['全館制御', '判断・意思決定', '異常検知統合', 'ユーザー対話'] },
  { id: 'yolo', name: '監視AI', model: 'YOLOv8', icon: Eye, color: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/30', desc: 'カメラ映像から人物・動物を検知。', caps: ['人物検知', '動物検知', '不審者識別', '異常行動検知'] },
  { id: 'whisper', name: '音声AI', model: 'Whisper', icon: Mic, color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/30', desc: '音声コマンドを認識・処理。', caps: ['音声認識', '自然言語処理', 'コマンド実行', '応答生成'] },
  { id: 'power-ai', name: '電力AI', model: 'Python ML', icon: Zap, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30', desc: '電力使用量を予測・最適化。', caps: ['電力予測', '消費最適化', '停電対応', 'ソーラー管理'] },
  { id: 'ha', name: '設備AI', model: 'Home Assistant', icon: Home, color: 'text-success', bg: 'bg-success/10', border: 'border-success/30', desc: '全デバイスの接続・制御を管理。', caps: ['デバイス管理', 'オートメーション', 'スケジュール', '相互接続'] },
]

const whisperLogs = [
  { time: '18:32', text: '劇場の照明を20%にして', confidence: 0.96, noise: 12 },
  { time: '18:15', text: '玄関のロックをかけて', confidence: 0.98, noise: 8 },
  { time: '17:58', text: 'UPSの残量は？', confidence: 0.99, noise: 5 },
  { time: '17:30', text: '外周照明を自動にして', confidence: 0.94, noise: 15 },
  { time: '17:12', text: '空調を25度に', confidence: 0.97, noise: 10 },
]

const frigateLogs = [
  { time: '18:30', zone: '玄関前', type: 'person', label: '来訪者', confidence: 0.95, tracked: true },
  { time: '18:22', zone: '外周', type: 'animal', label: '猫', confidence: 0.88, tracked: false },
  { time: '17:45', zone: '廊下', type: 'person', label: '住人', confidence: 0.99, tracked: true },
  { time: '17:20', zone: '地下入口', type: 'person', label: '住人', confidence: 0.97, tracked: true },
]

export default function AiCenter() {
  const sys = useSystem()
  const { voiceHistory, aiDecisions, handleVoice, events } = sys
  const [viewMode, setViewMode] = useState('overview')
  const [voiceInput, setVoiceInput] = useState('')

  const handleVoiceSubmit = () => {
    if (!voiceInput.trim()) return
    handleVoice(voiceInput)
    setVoiceInput('')
  }

  const latestEvent = events[0]
  const dangerScore = latestEvent ? (latestEvent.score >= 70 ? latestEvent.score : latestEvent.score >= 40 ? latestEvent.score : 0) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div><h1 className="text-2xl font-bold">AI司令室</h1><p className="text-text-muted text-sm">5つのAIシステムが唯希邸を統合管理</p></div>
        <TabSwitcher tabs={[
          { value: 'overview', label: '一覧' },
          { value: 'llama', label: 'Llama' },
          { value: 'whisper', label: 'Whisper' },
          { value: 'frigate', label: 'Frigate' },
          { value: 'log', label: 'ログ' },
        ]} active={viewMode} onChange={setViewMode} />
      </div>

      {/* AI一覧 */}
      <div className="grid grid-cols-5 gap-2">
        {systems.map((s) => (
          <button key={s.id} onClick={() => setViewMode(s.id === 'llama' ? 'llama' : s.id === 'whisper' ? 'whisper' : 'overview')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${s.bg} ${s.border}`}>
            <div className="flex items-center gap-2 mb-2"><s.icon size={16} className={s.color} /><div className="w-2 h-2 rounded-full bg-success animate-pulse" /></div>
            <div className="text-xs font-bold text-text-primary">{s.name}</div>
            <div className="text-[10px] text-text-muted">{s.model}</div>
          </button>
        ))}
      </div>

      {/* 司令官ビュー */}
      {viewMode === 'llama' && (
        <div className="space-y-4">
          <SectionCard title="司令官の現在の判断" icon={Brain}>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-bg-dark/50">
                  <div className="text-[10px] text-text-muted mb-1">家の状態</div>
                  <div className="text-sm font-bold text-primary">通常モード</div>
                </div>
                <div className="p-3 rounded-lg bg-bg-dark/50">
                  <div className="text-[10px] text-text-muted mb-1">唯希の位置推定</div>
                  <div className="text-sm font-bold text-secondary">リビング</div>
                </div>
                <div className="p-3 rounded-lg bg-bg-dark/50">
                  <div className="text-[10px] text-text-muted mb-1">来訪者分類</div>
                  <div className="text-sm font-bold text-success">なし</div>
                </div>
                <div className="p-3 rounded-lg bg-bg-dark/50">
                  <div className="text-[10px] text-text-muted mb-1">危険度スコア</div>
                  <div className="text-sm font-bold text-warning">35 - 要注意</div>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="text-[10px] text-text-muted mb-1">判断理由</div>
                <div className="text-xs text-text-primary leading-relaxed">
                  外周カメラで人影を検出。玄関付近の移動を確認。住人の帰宅パターンと一致するため「安全」と判断。必要に応じて玄関照明を自動点灯。
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {/* Whisperビュー */}
      {viewMode === 'whisper' && (
        <div className="space-y-4">
          <SectionCard title="音声認識ログ（Whisper）" icon={Mic}>
            <div className="space-y-2">
              {whisperLogs.map((log, i) => (
                <div key={i} className="p-3 rounded-lg bg-bg-dark/50 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-text-muted">{log.time}</div>
                    <div className="text-sm text-primary">「{log.text}」</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-success">{(log.confidence * 100).toFixed(0)}%</div>
                    <div className="text-[10px] text-text-muted">ノイズ: {log.noise}dB</div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {/* Frigateビュー */}
      {viewMode === 'frigate' && (
        <div className="space-y-4">
          <SectionCard title="監視ログ（Frigate / YOLOv8）" icon={Eye}>
            <div className="space-y-2">
              {frigateLogs.map((log, i) => (
                <div key={i} className="p-3 rounded-lg bg-bg-dark/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{log.type === 'person' ? '👤' : '🐾'}</span>
                    <div>
                      <div className="text-sm font-medium text-text-primary">{log.label}</div>
                      <div className="text-[10px] text-text-muted">{log.zone} | {log.time}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-success">{(log.confidence * 100).toFixed(0)}%</div>
                    <div className={`text-[10px] ${log.tracked ? 'text-danger' : 'text-text-muted'}`}>
                      {log.tracked ? '追跡中' : '通過'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {/* 概要 */}
      {viewMode === 'overview' && (
        <SectionCard title="全体の接続図" icon={Radio}>
          <div className="flex items-center justify-center gap-4 py-6 flex-wrap">
            <div className="text-center p-4 rounded-xl bg-primary/10 border border-primary/30">
              <Brain size={32} className="mx-auto mb-2 text-primary" />
              <div className="text-sm font-bold">司令官</div>
              <div className="text-[10px] text-text-muted">Llama 3.1 70B</div>
            </div>
            <div className="text-2xl text-text-muted">→</div>
            <div className="grid grid-cols-2 gap-2">
              {systems.filter(s => s.id !== 'llama').map((s) => (
                <div key={s.id} className={`p-3 rounded-lg ${s.bg} border ${s.border}`}>
                  <s.icon size={16} className={`${s.color} mx-auto`} />
                  <div className="text-[10px] text-center mt-1">{s.name}</div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      )}

      {/* 音声入力 */}
      {viewMode !== 'log' && (
        <SectionCard title="音声コマンド（Whisper → Llama → DAL）" icon={Mic}>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input type="text" value={voiceInput} onChange={(e) => setVoiceInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleVoiceSubmit()}
                placeholder='「劇場つけて」「UPS残量教えて」'
                className="flex-1 px-4 py-3 rounded-lg bg-bg-card border border-border text-text-primary placeholder-text-muted focus:outline-none focus:border-primary text-sm" />
              <button onClick={handleVoiceSubmit} className="px-4 py-3 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-dark transition">送信</button>
            </div>
            {voiceHistory.length > 0 && (
              <div className="space-y-2">{voiceHistory.map((h, i) => (
                <div key={i} className="p-3 rounded-lg bg-bg-dark/50">
                  <div className="text-xs text-text-muted">{h.time}</div>
                  <div className="text-sm text-primary">「{h.text}」</div>
                  <div className="text-sm text-text-primary mt-1">{h.response}</div>
                </div>
              ))}</div>
            )}
          </div>
        </SectionCard>
      )}

      {/* 判断ログ */}
      {viewMode === 'log' && (
        <SectionCard title="AI判断ログ" icon={Clock}>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {aiDecisions.map((d) => (
              <div key={d.id} className="p-3 rounded-lg bg-bg-dark/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-text-muted">{new Date(d.timestamp).toLocaleTimeString('ja-JP')}</span>
                  <span className="text-xs text-primary">{Math.round(d.confidence * 100)}%</span>
                </div>
                <div className="text-sm text-text-primary">{d.input}</div>
                <div className="text-xs text-text-muted mt-1">{d.reasoning}</div>
                <div className="text-xs text-success mt-1">{d.result}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  )
}
