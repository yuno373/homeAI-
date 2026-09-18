import { PowerStatus, PowerLog, PowerSource } from '../core/types.js'

export class VirtualPower {
  status = {
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
  logs = []
  intervals = []

  async init() {
    for (let i = 24; i > 0; i--) {
      this.logs.push({
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        watt: Math.floor(Math.random() * 200 + 250),
        source: 'grid',
      })
    }
    this.intervals.push(setInterval(() => {
      this.status.currentWatt = Math.floor(280 + Math.random() * 120)
      this.status.ups.load = this.status.currentWatt
      if (this.status.ups.charging) this.status.ups.percent = Math.min(100, this.status.ups.percent + 0.1)
      else this.status.ups.percent = Math.max(0, this.status.ups.percent - 0.02)
      this.status.battery.percent = Math.min(100, this.status.battery.percent + 0.05)
      if (this.status.solar.generating) this.status.solar.todayKwh = Math.round((this.status.solar.todayKwh + 0.01) * 10) / 10
      this.logs.push({ timestamp: new Date().toISOString(), watt: this.status.currentWatt, source: 'grid' })
      if (this.logs.length > 168) this.logs.shift()
    }, 3000))
  }

  async getStatus() { return { ...this.status } }
  async switchUPS(_source) { return { success: true, timestamp: new Date().toISOString() } }
  async setMode(mode) {
    this.status.mode = mode
    return { success: true, timestamp: new Date().toISOString() }
  }
  async getHistory(hours = 24) { return this.logs.slice(-hours) }
  async getForecast() {
    return Array.from({ length: 12 }, (_, i) => {
      const h = new Date(); h.setHours(h.getHours() + i)
      return { hour: `${h.getHours()}:00`, predicted: Math.floor(Math.random() * 300 + 250) }
    })
  }
  destroy() { this.intervals.forEach(i => clearInterval(i)); this.intervals = [] }
}
