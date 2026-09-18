import { AnyDeviceState, DeviceCommand, DeviceEvent, ApiResponse } from '../core/types.js'

// Home Assistant API Adapter - 実機接続時に使用
// HA REST API または WebSocket API に接続
export class HomeAssistantAdapter {
  mode = 'real'
  baseUrl
  token
  ws = null
  eventCallbacks = []
  deviceMap = new Map() // dal_id -> ha_entity_id

  constructor(baseUrl, token) {
    this.baseUrl = baseUrl
    this.token = token
  }

  async init() {
    // HA WebSocket接続
    // await this.connectWebSocket()
    console.log(`[HA Adapter] Initialized: ${this.baseUrl}`)
  }

  async getDevice(id) {
    const entityId = this.deviceMap.get(id)
    if (!entityId) return null
    try {
      const response = await fetch(`${this.baseUrl}/api/states/${entityId}`, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
      if (!response.ok) return null
      const haState = await response.json()
      return this.mapHAToDevice(id, haState)
    } catch { return null }
  }

  async getAllDevices() {
    try {
      const response = await fetch(`${this.baseUrl}/api/states`, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
      if (!response.ok) return []
      const states = await response.json()
      return states
        .filter((s) => s.entity_id.startsWith('light.') || s.entity_id.startsWith('switch.') ||
          s.entity_id.startsWith('climate.') || s.entity_id.startsWith('cover.') ||
          s.entity_id.startsWith('lock.') || s.entity_id.startsWith('camera.') ||
          s.entity_id.startsWith('sensor.') || s.entity_id.startsWith('binary_sensor.'))
        .map((s) => this.mapHAToDevice(s.entity_id, s))
        .filter(Boolean)
    } catch { return [] }
  }

  async setDeviceState(id, state) {
    const entityId = this.deviceMap.get(id) || id
    const domain = entityId.split('.')[0]
    const service = this.mapCommand(domain, state)
    try {
      const response = await fetch(`${this.baseUrl}/api/services/${domain}/${service}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity_id: entityId, ...state.attributes }),
      })
      if (!response.ok) return { success: false, error: 'HA API error', timestamp: new Date().toISOString() }
      const device = await this.getDevice(id)
      return { success: true, data: device, timestamp: new Date().toISOString() }
    } catch (e) {
      return { success: false, error: e.message, timestamp: new Date().toISOString() }
    }
  }

  async sendCommand(command) {
    const entityId = this.deviceMap.get(command.deviceId) || command.deviceId
    const domain = entityId.split('.')[0]
    try {
      const response = await fetch(`${this.baseUrl}/api/services/${domain}/${command.command}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity_id: entityId, ...command.params }),
      })
      return { success: response.ok, timestamp: new Date().toISOString() }
    } catch (e) {
      return { success: false, error: e.message, timestamp: new Date().toISOString() }
    }
  }

  onEvent(callback) { this.eventCallbacks.push(callback) }

  mapCommand(domain, state) {
    if (domain === 'light') return state.attributes?.on ? 'turn_on' : 'turn_off'
    if (domain === 'switch') return state.attributes?.on ? 'turn_on' : 'turn_off'
    if (domain === 'climate') return 'set_temperature'
    if (domain === 'cover') return state.attributes?.position === 100 ? 'open_cover' : 'close_cover'
    if (domain === 'lock') return state.attributes?.locked ? 'lock' : 'unlock'
    return 'turn_on'
  }

  mapHAToDevice(dalId, haState) {
    const domain = haState.entity_id.split('.')[0]
    const base = {
      id: dalId, mode: 'real', online: haState.state !== 'unavailable',
      lastSeen: haState.last_changed || new Date().toISOString(),
    }
    switch (domain) {
      case 'light': return { ...base, type: 'light', name: haState.attributes.friendly_name || dalId, attributes: { on: haState.state === 'on', brightness: Math.round((haState.attributes.brightness || 255) / 255 * 100), color: haState.attributes.rgb_color ? `rgb(${haState.attributes.rgb_color.join(',')})` : '#ffffff' } }
      case 'climate': return { ...base, type: 'hvac', name: haState.attributes.friendly_name || dalId, attributes: { on: haState.state !== 'off', mode: haState.state === 'cool' ? 'cool' : haState.state === 'heat' ? 'heat' : 'auto', temperature: haState.attributes.temperature || 22, currentTemp: haState.attributes.current_temperature || 22, fanSpeed: 2, autoMode: true } }
      case 'cover': return { ...base, type: 'curtain', name: haState.attributes.friendly_name || dalId, attributes: { position: haState.attributes.current_position || 0, moving: haState.state === 'opening' || haState.state === 'closing' } }
      case 'lock': return { ...base, type: 'lock', name: haState.attributes.friendly_name || dalId, attributes: { locked: haState.state === 'locked' } }
      default: return null
    }
  }

  destroy() { if (this.ws) this.ws.close(); this.eventCallbacks = [] }
}
