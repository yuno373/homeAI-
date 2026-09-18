import { PowerStatus, PowerLog, PowerSource, ApiResponse } from './types.js'

// Interface: IPowerAdapter

export class PowerAbstractionLayer {
  adapters = []
  statusCache = null
  listeners = []

  registerAdapter(adapter) { this.adapters.push(adapter) }

  async init() {
    for (const adapter of this.adapters) await adapter.init()
  }

  async getStatus() {
    for (const adapter of this.adapters) {
      try {
        this.statusCache = await adapter.getStatus()
        return this.statusCache
      } catch (e) { continue }
    }
    return this.getFallbackStatus()
  }

  async switchUPS(source) {
    for (const adapter of this.adapters) {
      const result = await adapter.switchUPS(source)
      if (result.success) return result
    }
    return { success: false, error: 'No adapter available', timestamp: new Date().toISOString() }
  }

  async setMode(mode) {
    for (const adapter of this.adapters) {
      const result = await adapter.setMode(mode)
      if (result.success) return result
    }
    return { success: false, error: 'No adapter available', timestamp: new Date().toISOString() }
  }

  async getHistory(hours = 24) {
    for (const adapter of this.adapters) {
      try { return await adapter.getHistory(hours) } catch (e) { continue }
    }
    return this.generateFallbackHistory(hours)
  }

  async getForecast() {
    for (const adapter of this.adapters) {
      try { return await adapter.getForecast() } catch (e) { continue }
    }
    return this.generateFallbackForecast()
  }

  getFallbackStatus() {
    return {
      grid: { online: true, voltage: 100 },
      ups: { percent: 87, load: 340, estimatedTime: '4h 30m', charging: false },
      battery: { percent: 92, status: 'charging', chargeRate: 120 },
      solar: { generating: true, todayKwh: 12.4, forecast: '晴れ - 発電効率高' },
      currentWatt: 340,
      mode: 'normal',
      priorityLoads: [
        { name: '防犯システム', priority: 1, active: true },
        { name: '冷蔵庫', priority: 2, active: true },
        { name: '地下劇場', priority: 3, active: true },
        { name: '一般照明', priority: 4, active: false },
      ],
    }
  }

  generateFallbackHistory(hours) {
    return Array.from({ length: hours }, (_, i) => ({
      timestamp: new Date(Date.now() - (hours - i) * 3600000).toISOString(),
      watt: Math.floor(Math.random() * 200 + 250),
      source: 'grid',
    }))
  }

  generateFallbackForecast() {
    return Array.from({ length: 12 }, (_, i) => {
      const hour = new Date()
      hour.setHours(hour.getHours() + i)
      return { hour: `${hour.getHours()}:00`, predicted: Math.floor(Math.random() * 300 + 250) }
    })
  }

  onStatusChange(callback) { this.listeners.push(callback) }

  destroy() {
    this.adapters.forEach(a => a.destroy())
    this.adapters = []
    this.listeners = []
  }
}

export const power = new PowerAbstractionLayer()
