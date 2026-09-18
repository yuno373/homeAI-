import { VoiceCommand } from '../core/types.js'

export class VirtualWhisper {
  listening = false
  callbacks = []
  commands = [
    '地下劇場つけて', 'UPS残量教えて', '停電モードにして', '照明を50%にして',
    'エアコン温度22度にして', '全部施錠して', 'カーテン開けて', '劇場をけして',
    'リビングの明るさを80%', '緊急モード起動して', 'セキュリティチェックして',
    'エアコンONにして', '外周照明をMAXにして', '劇場の音量を上げて',
  ]

  async init() {}
  async listen() {
    this.listening = true
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 2000))
    const text = this.commands[Math.floor(Math.random() * this.commands.length)]
    const cmd = {
      id: `vc_${Date.now()}`, text, intent: 'unknown', entities: {},
      confidence: 0.85 + Math.random() * 0.15,
      timestamp: new Date().toISOString(), source: 'virtual',
    }
    this.listening = false
    this.callbacks.forEach(cb => cb(cmd))
    return cmd
  }
  isListening() { return this.listening }
  stopListening() { this.listening = false }
  onCommand(callback) { this.callbacks.push(callback) }
  destroy() { this.callbacks = [] }
}
