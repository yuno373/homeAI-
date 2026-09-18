import { VoiceCommand, VoiceResponse, VoiceAction, ApiResponse } from './types.js'

// Interface: IWhisperAdapter

const INTENT_MAP = {
  light_on: ['照明つけ', 'ライトつけ', '明かりつけ', 'lights on'],
  light_off: ['照明けす', 'ライトけす', '明かりけす', 'lights off'],
  light_brightness: ['明るさ', '暗く', '明るく'],
  curtain_open: ['カーテン開け', 'カーテン開いて'],
  curtain_close: ['カーテン閉め', 'カーテン閉じて'],
  hvac_on: ['エアコンつけ', '空調つけ', '暖房つけ', '冷房つけ'],
  hvac_off: ['エアコンけす', '空調けす'],
  hvac_temp: ['温度', '度'],
  lock: ['施錠', 'ロック', '施錠して', 'ロックして'],
  unlock: ['解錠', '開けて', 'ロック外して'],
  lock_all: ['全部施錠', '全施錠', '全部ロック'],
  emergency: ['緊急', 'やばい', '助けて', 'emergency'],
  theater_on: ['劇場つけて', '劇場ON', '劇場起動'],
  theater_off: ['劇場けす', '劇場OFF'],
  status: ['状態', 'ステータス', 'どうなってる'],
  power: ['電力', 'UPS', 'バッテリー', '停電'],
}

function recognizeIntent(text) {
  const lower = text.toLowerCase()
  const entities = {}
  for (const [intent, keywords] of Object.entries(INTENT_MAP)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        const tempMatch = lower.match(/(\d+)\s*(度|℃)/)
        if (tempMatch) entities.temperature = tempMatch[1]
        const brightMatch = lower.match(/(\d+)\s*(%|percent)/)
        if (brightMatch) entities.brightness = brightMatch[1]
        const roomKeywords = {
          '劇場': 'theater', 'リビング': 'living', '玄関': 'entrance',
          '廊下': 'hallway', '地下': 'underground'
        }
        for (const [jp, en] of Object.entries(roomKeywords)) {
          if (lower.includes(jp)) entities.room = en
        }
        return { intent, entities }
      }
    }
  }
  return { intent: 'unknown', entities }
}

function generateResponse(intent, entities) {
  const room = entities.room || 'theater'
  const responses = {
    light_on: `${room}の照明をONにしました`,
    light_off: `${room}の照明をOFFにしました`,
    light_brightness: `${room}の明るさを${entities.brightness || 50}%に設定しました`,
    curtain_open: `${room}のカーテンを開けました`,
    curtain_close: `${room}のカーテンを閉めました`,
    hvac_on: `${room}の空調をONにしました`,
    hvac_off: `${room}の空調をOFFにしました`,
    hvac_temp: `温度を${entities.temperature || 22}度に設定しました`,
    lock: '全ドアを施錠しました',
    unlock: '玄関のロックを解除しました',
    lock_all: '全施錠しました',
    emergency: '緊急モードを起動しました。全施錠・非常灯ON・防犯強化します',
    theater_on: '地下劇場を起動しました',
    theater_off: '地下劇場を終了しました',
    status: '現在のステータスをお知らせします',
    power: '電力情報を取得します',
    unknown: '申し訳ありません。もう一度お試しください',
  }
  const actions = []
  if (intent.startsWith('light')) actions.push({ target: room, action: intent.replace('light_', ''), params: entities })
  if (intent.startsWith('hvac')) actions.push({ target: room, action: intent.replace('hvac_', ''), params: entities })
  if (intent.startsWith('lock')) actions.push({ target: 'all_locks', action: intent, params: {} })
  if (intent === 'emergency') actions.push({ target: 'system', action: 'emergency', params: {} })

  return {
    id: `vr_${Date.now()}`,
    command: '',
    response: responses[intent] || responses.unknown,
    actions,
    timestamp: new Date().toISOString(),
    processingTime: 0,
  }
}

export class WhisperAbstractionLayer {
  adapters = []
  commandListeners = []
  listening = false

  registerAdapter(adapter) { this.adapters.push(adapter) }

  async init() {
    for (const adapter of this.adapters) await adapter.init()
  }

  async processText(text) {
    const { intent, entities } = recognizeIntent(text)
    const cmd = {
      id: `vc_${Date.now()}`,
      text, intent, entities,
      confidence: intent === 'unknown' ? 0.3 : 0.9,
      timestamp: new Date().toISOString(),
      source: 'virtual',
    }
    this.commandListeners.forEach(cb => cb(cmd))
    const response = generateResponse(cmd.intent, cmd.entities)
    response.command = cmd.id
    return response
  }

  async listenFromAdapter(adapterIndex = 0) {
    const adapter = this.adapters[adapterIndex]
    if (!adapter) throw new Error('No adapter available')
    this.listening = true
    const cmd = await adapter.listen()
    this.listening = false
    return this.processText(cmd.text)
  }

  isListening() { return this.listening }
  stopListening() { this.listening = false }

  onCommand(callback) { this.commandListeners.push(callback) }

  destroy() {
    this.adapters.forEach(a => a.destroy())
    this.adapters = []
    this.commandListeners = []
  }
}

export const whisper = new WhisperAbstractionLayer()
