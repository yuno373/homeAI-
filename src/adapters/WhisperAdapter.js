import { VoiceCommand } from '../core/types.js'

// Whisper API Adapter - 実機接続時に使用
// ローカルWhisperサーバーまたはOpenAI Whisper APIに接続
export class WhisperAdapter {
  apiUrl
  apiKey
  listening = false
  callbacks = []
  mediaStream = null
  audioContext = null

  constructor(apiUrl, apiKey) {
    this.apiUrl = apiUrl
    this.apiKey = apiKey
  }

  async init() {
    console.log(`[Whisper Adapter] Initialized: ${this.apiUrl}`)
  }

  async listen() {
    this.listening = true
    try {
      // マイクから音声を取得
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.audioContext = new AudioContext()
      const source = this.audioContext.createMediaStreamSource(this.mediaStream)
      const analyser = this.audioContext.createAnalyser()
      source.connect(analyser)

      // 音声が止まるまで録音（簡易版）
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Whisper APIに送信
      const text = await this.transcribeAudio()
      const cmd = {
        id: `vc_${Date.now()}`, text, intent: 'unknown', entities: {},
        confidence: 0.9, timestamp: new Date().toISOString(), source: 'real',
      }
      this.listening = false
      this.stopListening()
      this.callbacks.forEach(cb => cb(cmd))
      return cmd
    } catch (e) {
      this.listening = false
      return { id: `vc_${Date.now()}`, text: '', intent: 'error', entities: {}, confidence: 0, timestamp: new Date().toISOString(), source: 'real' }
    }
  }

  async transcribeAudio() {
    // 実際にはここにWhisper API呼び出し
    // const formData = new FormData()
    // formData.append('file', audioBlob, 'audio.webm')
    // const response = await fetch(`${this.apiUrl}/v1/audio/transcriptions`, {
    //   method: 'POST', headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
    //   body: formData,
    // })
    // const result = await response.json()
    // return result.text
    return '' // stub
  }

  isListening() { return this.listening }

  stopListening() {
    this.listening = false
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop())
      this.mediaStream = null
    }
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
  }

  onCommand(callback) { this.callbacks.push(callback) }

  destroy() { this.stopListening(); this.callbacks = [] }
}
