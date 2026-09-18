// ============================================================
// AI Orchestration Service
// 司令官: Llama 3.1 70B が全システムを統合制御
// ============================================================

import { dal } from '../core/dal.js'
import { fal } from '../core/fal.js'
import { whisper } from '../core/whisper.js'
import { power } from '../core/power.js'
import { dangerEngine } from '../core/danger.js'
import { VoiceResponse, FrigateEvent, SystemMode, AnyDeviceState, DangerScore } from '../core/types.js'

// Interface: AIDecision

class AIOrchestrationService {
  decisions = []
  currentMode = 'normal'
  listeners = []

  async init() {
    console.log('[AI司令官] Llama 3.1 70B - 初期化完了')
    fal.onEvent((event) => this.handleFrigateEvent(event))
  }

  // --- Llama 3.1 70B による統合判断 ---
  async processCommand(text) {
    const response = await whisper.processText(text)
    const decision = {
      id: `dec_${Date.now()}`,
      timestamp: new Date().toISOString(),
      input: text,
      reasoning: this.generateReasoning(response),
      actions: response.actions.map(a => ({ target: a.target, action: a.action, params: a.params })),
      result: response.response,
      confidence: 0.9,
    }
    this.decisions.unshift(decision)
    if (this.decisions.length > 100) this.decisions.pop()
    await this.executeActions(response)
    this.listeners.forEach(cb => cb(decision))
    return response
  }

  generateReasoning(response) {
    const reasons = {
      light_on: '照明ON要求を検知。指定部屋の照明を有効化します。',
      light_off: '照明OFF要求を検知。指定部屋の照明を無効化します。',
      hvac_on: '空調ON要求を検知。指定部屋の空調を起動します。',
      lock_all: '全施錠要求を検知。全ドアの施錠を実行します。',
      emergency: '緊急要求を検知。緊急モードを起動し、全施錠・非常灯ON・防犯強化を実行します。',
      theater_on: '劇場起動要求を検知。照明・空調・プロジェクターを起動します。',
      power: '電力状態確認要求。UPS・蓄電池状態を取得します。',
      status: 'ステータス確認要求。全システムの状態を収集します。',
    }
    return reasons[response.actions[0]?.action] || 'ユーザー要求を解析し、適切なアクションを実行します。'
  }

  async executeActions(response) {
    for (const action of response.actions) {
      switch (action.action) {
        case 'on': case 'off':
          await dal.setDevice(action.target, { attributes: { on: action.action === 'on' } })
          break
        case 'lock':
          await dal.lockAll()
          break
        case 'emergency':
          await dal.emergencyLockAll()
          await power.setMode('blackout')
          break
        default: break
      }
    }
  }

  // --- Frigate イベント自動処理 ---
  async handleFrigateEvent(event) {
    const allEvents = await fal.getAllEvents(50)
    const paths = await fal.getMotionPaths(20)
    const score = dangerEngine.evaluate(event)
    dangerEngine.updateEvents(allEvents)
    dangerEngine.updateMotionPaths(paths)

    const decision = {
      id: `dec_${Date.now()}`,
      timestamp: new Date().toISOString(),
      input: `[Frigate] ${event.type}: ${event.label} @ ${event.zone}`,
      reasoning: this.generateSurveillanceReasoning(event, score),
      actions: this.determineSurveillanceActions(event, score),
      result: `危険度スコア: ${score.overall}/100 - ${score.detail}`,
      confidence: score.overall / 100,
    }
    this.decisions.unshift(decision)
    this.listeners.forEach(cb => cb(decision))
  }

  generateSurveillanceReasoning(event, score) {
    if (score.overall >= 70) return `高危険度検知(${score.overall})。${event.zone}で${event.type}:${event.label}を検知。外見スコア:${score.appearance}, 行動スコア:${score.behavior}, ゾーンスコア:${score.zone}。即時対応が必要。`
    if (score.overall >= 40) return `要注意検知(${score.overall})。${event.zone}で${event.type}:${event.label}を検知。監視を継続します。`
    return `正常範囲内(${score.overall})。${event.zone}で${event.type}:${event.label}を検知。通常監視を継続。`
  }

  determineSurveillanceActions(event, score) {
    if (score.overall >= 70) return [
      { target: 'system', action: 'emergency_alert', params: { severity: 'critical', message: `${event.zone}で不審者検知` } },
      { target: 'light_outer', action: 'max', params: {} },
    ]
    if (score.overall >= 40) return [
      { target: 'system', action: 'alert', params: { severity: 'warning', message: `${event.zone}で要注意事象` } },
    ]
    return []
  }

  // --- モード管理 ---
  async setMode(mode) {
    this.currentMode = mode
    if (mode === 'blackout') await power.setMode('blackout')
    if (mode === 'normal') await power.setMode('normal')
    console.log(`[AI司令官] モード切替: ${mode}`)
  }

  getMode() { return this.currentMode }
  getDecisions(limit = 20) { return this.decisions.slice(0, limit) }
  onDecision(callback) { this.listeners.push(callback) }

  // --- ステータス取得 ---
  async getFullStatus() {
    return {
      devices: await dal.getAllDevices(),
      power: await power.getStatus(),
      mode: this.currentMode,
      recentDecisions: this.getDecisions(10),
    }
  }
}

export const aiService = new AIOrchestrationService()
