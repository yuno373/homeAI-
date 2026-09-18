// ============================================================
// Frigate Abstraction Layer (FAL)
// 仮想Frigateと実機Frigateを同じAPIで扱う抽象化レイヤー
// ============================================================

import { FrigateEvent, Zone, DangerScore, MotionPath, ObjectType, ApiResponse } from './types.js'

// Interface: IFrigateAdapter

export class FrigateAbstractionLayer {
  adapters = []
  eventListeners = []
  zones = [
    { id: 'front_1_5m', name: '玄関1.5mライン', type: 'entry' },
    { id: 'post_zone', name: 'ポストゾーン', type: 'perimeter' },
    { id: 'front_door', name: '玄関ドア前', type: 'entry' },
    { id: 'underground_entry', name: '地下入口', type: 'restricted' },
    { id: 'hallway', name: '廊下', type: 'interior' },
    { id: 'garden', name: '庭', type: 'perimeter' },
    { id: 'parking', name: '駐車場', type: 'perimeter' },
  ]

  registerAdapter(adapter) {
    this.adapters.push(adapter)
    adapter.onEvent((event) => {
      this.eventListeners.forEach(cb => cb(event))
    })
  }

  async init() {
    for (const adapter of this.adapters) await adapter.init()
  }

  getZones() { return this.zones }

  addZone(zone) { this.zones.push(zone) }

  async getAllEvents(limit = 50) {
    const all = []
    for (const adapter of this.adapters) all.push(...await adapter.getEvents(limit))
    return all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limit)
  }

  async getEventsByZone(zoneId, limit = 20) {
    const all = []
    for (const adapter of this.adapters) all.push(...await adapter.getEventsByZone(zoneId, limit))
    return all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  async getEventsByType(type, limit = 20) {
    const all = []
    for (const adapter of this.adapters) all.push(...await adapter.getEventsByType(type, limit))
    return all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  async getMotionPaths(limit = 10) {
    const all = []
    for (const adapter of this.adapters) all.push(...await adapter.getMotionPaths(limit))
    return all.sort((a, b) => new Date(a.startTime).getTime() - new Date(a.startTime).getTime()).slice(0, limit)
  }

  async getRecentThreats(limit = 10) {
    const events = await this.getAllEvents(limit * 2)
    return events.filter(e => e.score > 70).slice(0, limit)
  }

  isRestrictedZone(zoneId) {
    return this.zones.find(z => z.id === zoneId)?.type === 'restricted'
  }

  onEvent(callback) {
    this.eventListeners.push(callback)
  }

  destroy() {
    this.adapters.forEach(a => a.destroy())
    this.adapters = []
    this.eventListeners = []
  }
}

export const fal = new FrigateAbstractionLayer()
