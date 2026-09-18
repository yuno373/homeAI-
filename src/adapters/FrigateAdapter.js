import { FrigateEvent, MotionPath, ObjectType } from '../core/types.js'

// Frigate NVR API Adapter - 実機接続時に使用
export class FrigateAdapter {
  baseUrl
  eventCallbacks = []
  pollInterval = null

  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  async init() {
    // Polling開始
    this.pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`${this.baseUrl}/api/events?limit=1&has_snapshot=1`)
        if (response.ok) {
          const events = await response.json()
          events.forEach((e) => this.eventCallbacks.forEach(cb => cb(this.mapEvent(e))))
        }
      } catch {}
    }, 5000)
    console.log(`[Frigate Adapter] Initialized: ${this.baseUrl}`)
  }

  async getEvents(limit = 50) {
    try {
      const response = await fetch(`${this.baseUrl}/api/events?limit=${limit}`)
      if (!response.ok) return []
      const events = await response.json()
      return events.map((e) => this.mapEvent(e))
    } catch { return [] }
  }

  async getEventById(id) {
    try {
      const response = await fetch(`${this.baseUrl}/api/events/${id}`)
      if (!response.ok) return null
      const event = await response.json()
      return this.mapEvent(event)
    } catch { return null }
  }

  async getEventsByZone(zoneId, limit = 20) {
    const all = await this.getEvents(limit * 3)
    return all.filter(e => e.zone === zoneId).slice(0, limit)
  }

  async getEventsByType(type, limit = 20) {
    const all = await this.getEvents(limit * 3)
    return all.filter(e => e.type === type).slice(0, limit)
  }

  async getMotionPaths(limit = 10) {
    // Frigate の track API から取得
    try {
      const response = await fetch(`${this.baseUrl}/api/tracks?limit=${limit}`)
      if (!response.ok) return []
      const tracks = await response.json()
      return tracks.map((t) => ({
        trackId: t.id || `track_${t.start_time}`,
        objectType: t.label || 'unknown',
        points: (t.track || []).map((p) => ({ x: p.box?.[0] || 0, y: p.box?.[1] || 0, timestamp: p.timestamp || '', zone: p.zone || '' })),
        startTime: t.start_time || '',
        endTime: t.end_time || undefined,
        totalDistance: 0,
        avgSpeed: 0,
      }))
    } catch { return [] }
  }

  onEvent(callback) { this.eventCallbacks.push(callback) }

  mapEvent(frigateEvent) {
    return {
      id: frigateEvent.id || `fg_${Date.now()}`,
      type: frigateEvent.label || 'unknown',
      zone: frigateEvent.data?.zone || frigateEvent.zones?.[0] || 'unknown',
      timestamp: frigateEvent.start_time ? new Date(frigateEvent.start_time * 1000).toISOString() : new Date().toISOString(),
      confidence: Math.round((frigateEvent.data?.top_score || 0) * 100),
      label: frigateEvent.data?.label || 'unknown',
      sublabel: frigateEvent.data?.sublabel || undefined,
      trackId: frigateEvent.track_id || undefined,
      endTime: frigateEvent.end_time ? new Date(frigateEvent.end_time * 1000).toISOString() : undefined,
      score: Math.round((frigateEvent.data?.top_score || 0) * 100),
    }
  }

  destroy() {
    if (this.pollInterval) clearInterval(this.pollInterval)
    this.eventCallbacks = []
  }
}
