import {
  AnyDeviceState, DeviceCommand, DeviceEvent, ApiResponse,
  LightState, CurtainState, HvacState, ProjectorState, ShutterState,
  LockState, CameraState, SensorState, UpsState, SpeakerState
} from '../core/types.js'

const VIRTUAL_DEVICES = [
  { id: 'light_entrance', type: 'light', name: '玄関照明', mode: 'virtual', online: true, lastSeen: new Date().toISOString(), attributes: { on: true, brightness: 80, color: '#ffffff' } },
  { id: 'light_living', type: 'light', name: 'リビング照明', mode: 'virtual', online: true, lastSeen: new Date().toISOString(), attributes: { on: true, brightness: 70, color: '#fff5e6' } },
  { id: 'light_theater', type: 'light', name: '劇場照明', mode: 'virtual', online: true, lastSeen: new Date().toISOString(), attributes: { on: true, brightness: 20, color: '#ffffff', scene: '上映モード' } },
  { id: 'light_hallway', type: 'light', name: '廊下照明', mode: 'virtual', online: true, lastSeen: new Date().toISOString(), attributes: { on: false, brightness: 0, color: '#ffffff' } },
  { id: 'light_emergency', type: 'light', name: '非常灯', mode: 'virtual', online: true, lastSeen: new Date().toISOString(), attributes: { on: false, brightness: 100, color: '#ff0000' } },
  { id: 'light_outer_1', type: 'light', name: '外周照明1', mode: 'virtual', online: true, lastSeen: new Date().toISOString(), attributes: { on: true, brightness: 60, color: '#ffffff' } },
  { id: 'light_outer_2', type: 'light', name: '外周照明2', mode: 'virtual', online: true, lastSeen: new Date().toISOString(), attributes: { on: true, brightness: 60, color: '#ffffff' } },
  { id: 'curtain_living', type: 'curtain', name: 'リビングカーテン', mode: 'virtual', online: true, lastSeen: new Date().toISOString(), attributes: { position: 80, moving: false } },
  { id: 'curtain_theater', type: 'curtain', name: '劇場カーテン', mode: 'virtual', online: true, lastSeen: new Date().toISOString(), attributes: { position: 0, moving: false } },
  { id: 'hvac_living', type: 'hvac', name: 'リビング空調', mode: 'virtual', online: true, lastSeen: new Date().toISOString(), attributes: { on: true, mode: 'auto', temperature: 23, currentTemp: 24.5, fanSpeed: 2, autoMode: true } },
  { id: 'hvac_theater', type: 'hvac', name: '劇場空調', mode: 'virtual', online: true, lastSeen: new Date().toISOString(), attributes: { on: true, mode: 'cool', temperature: 22, currentTemp: 23.5, fanSpeed: 2, autoMode: true } },
  { id: 'projector_theater', type: 'projector', name: '劇場プロジェクター', mode: 'virtual', online: true, lastSeen: new Date().toISOString(), attributes: { on: true, input: 'HDMI-1', brightness: 90, resolution: '4K' } },
  { id: 'shutter_1', type: 'shutter', name: 'シャッター1', mode: 'virtual', online: true, lastSeen: new Date().toISOString(), attributes: { position: 100, moving: false } },
  { id: 'shutter_2', type: 'shutter', name: 'シャッター2', mode: 'virtual', online: true, lastSeen: new Date().toISOString(), attributes: { position: 100, moving: false } },
  { id: 'lock_entrance', type: 'lock', name: '玄関ロック', mode: 'virtual', online: true, lastSeen: new Date().toISOString(), attributes: { locked: true } },
  { id: 'lock_underground', type: 'lock', name: '地下入口ロック', mode: 'virtual', online: true, lastSeen: new Date().toISOString(), attributes: { locked: true } },
  { id: 'lock_theater', type: 'lock', name: '劇場ドアロック', mode: 'virtual', online: true, lastSeen: new Date().toISOString(), attributes: { locked: true } },
  { id: 'camera_entrance', type: 'camera', name: '玄関カメラ', mode: 'virtual', online: true, lastSeen: new Date().toISOString(), attributes: { recording: true, streamUrl: '/virtual/camera/entrance', resolution: '1080p' } },
  { id: 'camera_hallway', type: 'camera', name: '廊下カメラ', mode: 'virtual', online: true, lastSeen: new Date().toISOString(), attributes: { recording: true, streamUrl: '/virtual/camera/hallway', resolution: '1080p' } },
  { id: 'camera_underground', type: 'camera', name: '地下入口カメラ', mode: 'virtual', online: true, lastSeen: new Date().toISOString(), attributes: { recording: true, streamUrl: '/virtual/camera/underground', resolution: '1080p' } },
  { id: 'camera_theater', type: 'camera', name: '劇場内部カメラ', mode: 'virtual', online: true, lastSeen: new Date().toISOString(), attributes: { recording: true, streamUrl: '/virtual/camera/theater', resolution: '1080p' } },
  { id: 'sensor_temp_entrance', type: 'sensor', name: '玄関温度センサー', mode: 'virtual', online: true, lastSeen: new Date().toISOString(), attributes: { value: 20.5, unit: '°C', type: 'temperature' } },
  { id: 'sensor_humidity_entrance', type: 'sensor', name: '玄関湿度センサー', mode: 'virtual', online: true, lastSeen: new Date().toISOString(), attributes: { value: 55, unit: '%', type: 'humidity' } },
  { id: 'sensor_co2_theater', type: 'sensor', name: '劇場CO2センサー', mode: 'virtual', online: true, lastSeen: new Date().toISOString(), attributes: { value: 420, unit: 'ppm', type: 'co2' } },
  { id: 'sensor_smoke', type: 'sensor', name: '煙センサー', mode: 'virtual', online: true, lastSeen: new Date().toISOString(), attributes: { value: 0, unit: '', type: 'smoke' } },
  { id: 'sensor_gas', type: 'sensor', name: 'ガスセンサー', mode: 'virtual', online: true, lastSeen: new Date().toISOString(), attributes: { value: 0, unit: '', type: 'gas' } },
  { id: 'sensor_motion_hallway', type: 'sensor', name: '廊下人感センサー', mode: 'virtual', online: true, lastSeen: new Date().toISOString(), attributes: { value: 0, unit: '', type: 'motion' } },
  { id: 'sensor_door_entrance', type: 'sensor', name: '玄関ドアセンサー', mode: 'virtual', online: true, lastSeen: new Date().toISOString(), attributes: { value: 1, unit: '', type: 'door' } },
  { id: 'ups_main', type: 'ups', name: 'メインUPS', mode: 'virtual', online: true, lastSeen: new Date().toISOString(), attributes: { percent: 87, load: 340, estimatedTime: '4h 30m', charging: false, inputVoltage: 100 } },
  { id: 'speaker_theater', type: 'speaker', name: '劇場スピーカー', mode: 'virtual', online: true, lastSeen: new Date().toISOString(), attributes: { on: true, volume: 65, playing: false, source: 'HDMI' } },
]

export class VirtualDAL {
  mode = 'virtual'
  devices = new Map()
  eventCallbacks = []
  intervals = []

  async init() {
    VIRTUAL_DEVICES.forEach(d => this.devices.set(d.id, { ...d }))
    this.startSimulation()
  }

  startSimulation() {
    this.intervals.push(setInterval(() => {
      const tempDevices = Array.from(this.devices.values()).filter(d => d.type === 'sensor' && d.attributes.type === 'temperature')
      tempDevices.forEach(d => {
        const attrs = d.attributes
        attrs.value = Math.round((attrs.value + (Math.random() - 0.5) * 0.3) * 10) / 10
        d.lastSeen = new Date().toISOString()
      })
      const co2Devices = Array.from(this.devices.values()).filter(d => d.type === 'sensor' && d.attributes.type === 'co2')
      co2Devices.forEach(d => {
        const attrs = d.attributes
        attrs.value = Math.floor(attrs.value + (Math.random() - 0.5) * 10)
        d.lastSeen = new Date().toISOString()
      })
    }, 5000))

    this.intervals.push(setInterval(() => {
      const upsDevice = this.devices.get('ups_main')
      if (upsDevice) {
        const attrs = upsDevice.attributes
        attrs.percent = Math.min(100, Math.max(0, attrs.percent + (attrs.charging ? 0.1 : -0.05)))
        attrs.load = Math.floor(280 + Math.random() * 120)
        upsDevice.lastSeen = new Date().toISOString()
      }
    }, 3000))
  }

  async getDevice(id) {
    return this.devices.get(id) || null
  }

  async getAllDevices() {
    return Array.from(this.devices.values())
  }

  async setDeviceState(id, state) {
    const device = this.devices.get(id)
    if (!device) return { success: false, error: 'Device not found', timestamp: new Date().toISOString() }
    const updated = { ...device, ...state, lastSeen: new Date().toISOString() }
    if (state.attributes) updated.attributes = { ...device.attributes, ...state.attributes }
    this.devices.set(id, updated)
    this.emitEvent({ deviceId: id, event: 'state_changed', data: updated.attributes, timestamp: new Date().toISOString() })
    return { success: true, data: updated, timestamp: new Date().toISOString() }
  }

  async sendCommand(command) {
    const device = this.devices.get(command.deviceId)
    if (!device) return { success: false, error: 'Device not found', timestamp: new Date().toISOString() }
    switch (device.type) {
      case 'lock':
        if (command.command === 'lock') return this.setDeviceState(command.deviceId, { attributes: { locked: true } })
        if (command.command === 'unlock') return this.setDeviceState(command.deviceId, { attributes: { locked: false } })
        break
      case 'light':
        if (command.command === 'on') return this.setDeviceState(command.deviceId, { attributes: { on: true } })
        if (command.command === 'off') return this.setDeviceState(command.deviceId, { attributes: { on: false } })
        if (command.command === 'brightness') return this.setDeviceState(command.deviceId, { attributes: { brightness: command.params?.brightness || 50 } })
        break
      case 'hvac':
        if (command.command === 'on') return this.setDeviceState(command.deviceId, { attributes: { on: true } })
        if (command.command === 'off') return this.setDeviceState(command.deviceId, { attributes: { on: false } })
        if (command.command === 'temperature') return this.setDeviceState(command.deviceId, { attributes: { temperature: command.params?.temperature || 22 } })
        break
      case 'curtain':
        if (command.command === 'open') return this.setDeviceState(command.deviceId, { attributes: { position: 100 } })
        if (command.command === 'close') return this.setDeviceState(command.deviceId, { attributes: { position: 0 } })
        break
      case 'shutter':
        if (command.command === 'close') return this.setDeviceState(command.deviceId, { attributes: { position: 0 } })
        if (command.command === 'open') return this.setDeviceState(command.deviceId, { attributes: { position: 100 } })
        break
      default: break
    }
    return { success: true, data: null, timestamp: new Date().toISOString() }
  }

  onEvent(callback) { this.eventCallbacks.push(callback) }

  emitEvent(event) { this.eventCallbacks.forEach(cb => cb(event)) }

  destroy() {
    this.intervals.forEach(i => clearInterval(i))
    this.intervals = []
    this.devices.clear()
    this.eventCallbacks = []
  }
}
