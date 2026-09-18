// ============================================================
// Device Abstraction Layer (DAL)
// 仮想デバイスと実機デバイスを同じAPIで扱える抽象化レイヤー
// ============================================================

import {
  DeviceState, DeviceType, DeviceMode, DeviceCommand, DeviceEvent,
  ApiResponse, AnyDeviceState
} from './types.js'

// --- DAL Interface ---
// Interface: IDeviceAdapter

// --- Device Abstraction Layer ---
export class DeviceAbstractionLayer {
  adapters = new Map()
  eventListeners = []
  deviceCache = new Map()

  registerAdapter(mode, adapter) {
    this.adapters.set(mode, adapter)
    adapter.onEvent((event) => {
      this.deviceCache.delete(event.deviceId)
      this.eventListeners.forEach(cb => cb(event))
    })
  }

  async init() {
    for (const adapter of this.adapters.values()) {
      await adapter.init()
    }
    await this.refreshCache()
  }

  async refreshCache() {
    for (const adapter of this.adapters.values()) {
      const devices = await adapter.getAllDevices()
      devices.forEach(d => this.deviceCache.set(d.id, d))
    }
  }

  async getDevice(id) {
    if (this.deviceCache.has(id)) return this.deviceCache.get(id)
    for (const adapter of this.adapters.values()) {
      const device = await adapter.getDevice(id)
      if (device) {
        this.deviceCache.set(id, device)
        return device
      }
    }
    return null
  }

  async getAllDevices() {
    await this.refreshCache()
    return Array.from(this.deviceCache.values())
  }

  async getDevicesByType(type) {
    const all = await this.getAllDevices()
    return all.filter(d => d.type === type)
  }

  async getDevicesByMode(mode) {
    const all = await this.getAllDevices()
    return all.filter(d => d.mode === mode)
  }

  async setDevice(id, state) {
    const device = await this.getDevice(id)
    if (!device) return { success: false, error: 'Device not found', timestamp: new Date().toISOString() }
    const adapter = this.adapters.get(device.mode)
    if (!adapter) return { success: false, error: 'Adapter not found', timestamp: new Date().toISOString() }
    const result = await adapter.setDeviceState(id, state)
    if (result.success && result.data) this.deviceCache.set(id, result.data)
    return result
  }

  async command(cmd) {
    const device = await this.getDevice(cmd.deviceId)
    if (!device) return { success: false, error: 'Device not found', timestamp: new Date().toISOString() }
    const adapter = this.adapters.get(device.mode)
    if (!adapter) return { success: false, error: 'Adapter not found', timestamp: new Date().toISOString() }
    return adapter.sendCommand(cmd)
  }

  async lightOn(id) {
    return this.setDevice(id, { attributes: { on: true } })
  }

  async lightOff(id) {
    return this.setDevice(id, { attributes: { on: false } })
  }

  async lightBrightness(id, brightness) {
    return this.setDevice(id, { attributes: { brightness } })
  }

  async curtainOpen(id) {
    return this.setDevice(id, { attributes: { position: 100 } })
  }

  async curtainClose(id) {
    return this.setDevice(id, { attributes: { position: 0 } })
  }

  async lockDoor(id) {
    return this.setDevice(id, { attributes: { locked: true } })
  }

  async unlockDoor(id) {
    return this.setDevice(id, { attributes: { locked: false } })
  }

  async lockAll() {
    const locks = await this.getDevicesByType('lock')
    return Promise.all(locks.map(l => this.lockDoor(l.id)))
  }

  async emergencyLockAll() {
    const results = []
    const locks = await this.getDevicesByType('lock')
    for (const l of locks) results.push(await this.lockDoor(l.id))
    const shutters = await this.getDevicesByType('shutter')
    for (const s of shutters) results.push(await this.setDevice(s.id, { attributes: { position: 0 } }))
    const lights = await this.getDevicesByType('light')
    for (const li of lights) results.push(await this.setDevice(li.id, { attributes: { brightness: 100 } }))
    return results
  }

  onEvent(callback) {
    this.eventListeners.push(callback)
  }

  destroy() {
    this.adapters.forEach(a => a.destroy())
    this.adapters.clear()
    this.eventListeners = []
    this.deviceCache.clear()
  }
}

export const dal = new DeviceAbstractionLayer()
