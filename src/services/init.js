// ============================================================
// System Init - 仮想デバイス環境を初期化
// ============================================================

import { dal } from '../core/dal.js'
import { fal } from '../core/fal.js'
import { whisper } from '../core/whisper.js'
import { power } from '../core/power.js'
import { VirtualDAL } from '../virtual/VirtualDAL.js'
import { VirtualFAL } from '../virtual/VirtualFAL.js'
import { VirtualPower } from '../virtual/VirtualPower.js'
import { VirtualWhisper } from '../virtual/VirtualWhisper.js'
import { aiService } from '../services/AIService.js'

export async function initVirtualEnvironment() {
  console.log('[System] 唯希邸 AI 管理システム v5.0 - 仮想環境初期化開始')

  // DAL登録
  dal.registerAdapter(new VirtualDAL())
  await dal.init()
  console.log(`[System] DAL初期化完了 - ${await dal.getAllDevices().then(d => d.length)}デバイス登録`)

  // FAL登録
  fal.registerAdapter(new VirtualFAL())
  await fal.init()
  console.log('[System] FAL初期化完了 - 仮想Frigate接続')

  // Whisper登録
  whisper.registerAdapter(new VirtualWhisper())
  await whisper.init()
  console.log('[System] Whisper初期化完了 - 仮想音声入力')

  // Power登録
  power.registerAdapter(new VirtualPower())
  await power.init()
  console.log('[System] Power初期化完了 - 仮想電力管理')

  // AI司令官初期化
  await aiService.init()
  console.log('[System] AI司令官 Llama 3.1 70B 初期化完了')

  console.log('[System] ====== 全システム稼働中 ======')
}

// 実機に切り替える場合の関数
export async function switchToRealDevices(config) {
  if (config.haUrl && config.haToken) {
    const { HomeAssistantAdapter } = await import('../adapters/HomeAssistantAdapter.js')
    dal.registerAdapter(new HomeAssistantAdapter(config.haUrl, config.haToken))
    console.log('[System] Home Assistant アダプター登録')
  }
  if (config.frigateUrl) {
    const { FrigateAdapter } = await import('../adapters/FrigateAdapter.js')
    fal.registerAdapter(new FrigateAdapter(config.frigateUrl))
    console.log('[System] Frigate アダプター登録')
  }
  if (config.whisperUrl) {
    const { WhisperAdapter } = await import('../adapters/WhisperAdapter.js')
    whisper.registerAdapter(new WhisperAdapter(config.whisperUrl, config.whisperApiKey))
    console.log('[System] Whisper アダプター登録')
  }
}
