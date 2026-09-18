// ============================================================
// Core Types - Plain JS exports
// ============================================================

// --- Device Types ---
export const DeviceType = {
  LIGHT: 'light',
  CURTAIN: 'curtain',
  HVAC: 'hvac',
  PROJECTOR: 'projector',
  SHUTTER: 'shutter',
  LOCK: 'lock',
  CAMERA: 'camera',
  SENSOR: 'sensor',
  UPS: 'ups',
  SPEAKER: 'speaker',
}

export const DeviceMode = {
  REAL: 'real',
  VIRTUAL: 'virtual',
}

// --- Device States (factory functions) ---
export function createDeviceState(overrides) {
  return {
    id: '',
    type: 'light',
    name: '',
    mode: 'virtual',
    online: true,
    lastSeen: '',
    attributes: {},
    ...overrides,
  }
}

export const DeviceState = createDeviceState
export const AnyDeviceState = createDeviceState
export const LightState = (o) => createDeviceState({ type: 'light', attributes: { on: false, brightness: 100, color: '#ffffff', ...((o && o.attributes) || {}) }, ...o })
export const CurtainState = (o) => createDeviceState({ type: 'curtain', attributes: { position: 0, moving: false, ...((o && o.attributes) || {}) }, ...o })
export const HvacState = (o) => createDeviceState({ type: 'hvac', attributes: { on: false, mode: 'auto', temperature: 22, currentTemp: 22, fanSpeed: 2, autoMode: true, ...((o && o.attributes) || {}) }, ...o })
export const ProjectorState = (o) => createDeviceState({ type: 'projector', attributes: { on: false, input: 'HDMI-1', brightness: 100, resolution: '1080p', ...((o && o.attributes) || {}) }, ...o })
export const ShutterState = (o) => createDeviceState({ type: 'shutter', attributes: { position: 0, moving: false, ...((o && o.attributes) || {}) }, ...o })
export const LockState = (o) => createDeviceState({ type: 'lock', attributes: { locked: false, ...((o && o.attributes) || {}) }, ...o })
export const CameraState = (o) => createDeviceState({ type: 'camera', attributes: { recording: false, streamUrl: '', resolution: '1080p', ...((o && o.attributes) || {}) }, ...o })
export const SensorState = (o) => createDeviceState({ type: 'sensor', attributes: { value: 0, unit: '', type: 'temperature', ...((o && o.attributes) || {}) }, ...o })
export const UpsState = (o) => createDeviceState({ type: 'ups', attributes: { percent: 100, load: 0, estimatedTime: '', charging: false, inputVoltage: 100, ...((o && o.attributes) || {}) }, ...o })
export const SpeakerState = (o) => createDeviceState({ type: 'speaker', attributes: { on: false, volume: 50, playing: false, source: '', ...((o && o.attributes) || {}) }, ...o })

// --- Device Command / Event ---
export function DeviceCommand(deviceId, command, params) {
  return { deviceId, command, params: params || {} }
}

export function DeviceEvent(deviceId, event, data) {
  return { deviceId, event, data, timestamp: new Date().toISOString() }
}

// --- API Response ---
export function ApiResponse(success, data, error) {
  return { success, data: data || null, error: error || null, timestamp: new Date().toISOString() }
}

// --- Frigate Types ---
export const ObjectType = {
  PERSON: 'person',
  ANIMAL: 'animal',
  VEHICLE: 'vehicle',
  PACKAGE: 'package',
  UNKNOWN: 'unknown',
}

export const ThreatLevel = {
  SAFE: 'safe',
  SUSPICIOUS: 'suspicious',
  DANGER: 'danger',
}

export function FrigateEvent(overrides) {
  return {
    id: '',
    type: 'unknown',
    zone: 'unknown',
    timestamp: '',
    confidence: 0,
    label: 'unknown',
    score: 0,
    ...overrides,
  }
}

export function Zone(id, name, type, coordinates) {
  return { id, name, type, coordinates: coordinates || null }
}

export function DangerScore(overrides) {
  return {
    objectId: '',
    objectType: 'unknown',
    overall: 0,
    appearance: 0,
    behavior: 0,
    history: 0,
    zone: 0,
    label: 'safe',
    detail: '',
    timestamp: '',
    ...overrides,
  }
}

export function MotionPath(overrides) {
  return {
    trackId: '',
    objectType: 'unknown',
    points: [],
    startTime: '',
    endTime: null,
    totalDistance: 0,
    avgSpeed: 0,
    ...overrides,
  }
}

// --- Voice Types ---
export function VoiceCommand(overrides) {
  return {
    id: '',
    text: '',
    intent: 'unknown',
    entities: {},
    confidence: 0,
    timestamp: '',
    source: 'virtual',
    ...overrides,
  }
}

export function VoiceResponse(overrides) {
  return {
    id: '',
    command: '',
    response: '',
    actions: [],
    timestamp: '',
    processingTime: 0,
    ...overrides,
  }
}

export function VoiceAction(target, action, params, result) {
  return { target, action, params: params || {}, result: result || null }
}

// --- Power Types ---
export const PowerSource = {
  GRID: 'grid',
  UPS: 'ups',
  BATTERY: 'battery',
  SOLAR: 'solar',
}

export function PowerStatus(overrides) {
  return {
    grid: { online: true, voltage: 100 },
    ups: { percent: 100, load: 0, estimatedTime: '', charging: false },
    battery: { percent: 100, status: 'charging', chargeRate: 0 },
    solar: { generating: false, todayKwh: 0, forecast: '' },
    currentWatt: 0,
    mode: 'normal',
    priorityLoads: [],
    ...overrides,
  }
}

export function PowerLog(timestamp, watt, source, event) {
  return { timestamp, watt, source, event: event || null }
}

// --- System Types ---
export const SystemMode = {
  NORMAL: 'normal',
  BLACKOUT: 'blackout',
  POWER_SAVE: 'powerSave',
  AWAY: 'away',
  SLEEP: 'sleep',
}

export function SystemStatus(overrides) {
  return {
    mode: 'normal',
    uptime: 0,
    aiStatus: 'running',
    lastUpdate: '',
    alerts: [],
    ...overrides,
  }
}

export function SystemAlert(id, type, severity, message) {
  return { id, type, severity, message, timestamp: new Date().toISOString(), resolved: false }
}

// --- Room Types ---
export function Room(overrides) {
  return {
    id: '',
    name: '',
    floor: 1,
    devices: [],
    sensors: [],
    temperature: null,
    humidity: null,
    lighting: null,
    hvac: null,
    ...overrides,
  }
}
