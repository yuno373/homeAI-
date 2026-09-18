import { FrigateEvent, MotionPath, ObjectType } from '../core/types.js'

const ZONES = ['front_1_5m', 'post_zone', 'front_door', 'underground_entry', 'hallway', 'garden', 'parking']
const PERSON_LABELS = ['不明の男性', '不明の女性', '郵便配達員', '宅配便', '近隣住人', '通行人']
const ANIMAL_LABELS = ['猫', '犬', '小鳥', 'リス']
const VEHICLE_LABELS = ['車', 'バイク', '自転車']

function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function randomBetween(min, max) { return Math.floor(Math.random() * (max - min + 1) + min) }

function generateEvent() {
  const types = ['person', 'person', 'person', 'animal', 'vehicle']
  const type = randomItem(types)
  const zone = randomItem(ZONES)
  const labels = { person: PERSON_LABELS, animal: ANIMAL_LABELS, vehicle: VEHICLE_LABELS, package: ['荷物'], unknown: ['不明'] }
  const score = type === 'person' && zone.includes('front') ? randomBetween(40, 98) : randomBetween(10, 85)

  return {
    id: `fg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    type, zone,
    timestamp: new Date().toISOString(),
    confidence: randomBetween(60, 99),
    label: randomItem(labels[type]),
    score,
    trackId: `track_${Date.now()}`,
  }
}

function generateMotionPath() {
  const type = randomItem(['person', 'person', 'animal'])
  const startZone = randomItem(ZONES)
  const numPoints = randomBetween(3, 8)
  const points = []
  let currentZone = startZone
  const startTime = new Date(Date.now() - randomBetween(60000, 300000))

  for (let i = 0; i < numPoints; i++) {
    points.push({
      x: randomBetween(0, 1920), y: randomBetween(0, 1080),
      timestamp: new Date(startTime.getTime() + i * randomBetween(2000, 10000)).toISOString(),
      zone: currentZone,
    })
    currentZone = randomItem(ZONES)
  }

  const totalDistance = numPoints * randomBetween(50, 200)
  const duration = (new Date(points[points.length - 1].timestamp).getTime() - startTime.getTime()) / 1000
  return {
    trackId: `track_${Date.now()}`,
    objectType: type,
    points, startTime: startTime.toISOString(),
    endTime: points[points.length - 1].timestamp,
    totalDistance,
    avgSpeed: Math.round(totalDistance / duration * 100) / 100,
  }
}

export class VirtualFAL {
  events = []
  motionPaths = []
  eventCallbacks = []
  intervals = []

  async init() {
    for (let i = 0; i < 15; i++) this.events.push(generateEvent())
    for (let i = 0; i < 5; i++) this.motionPaths.push(generateMotionPath())
    this.events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    this.intervals.push(setInterval(() => {
      if (Math.random() > 0.6) {
        const event = generateEvent()
        this.events.unshift(event)
        if (this.events.length > 100) this.events.pop()
        this.eventCallbacks.forEach(cb => cb(event))
      }
    }, 8000))
  }

  async getEvents(limit = 50) { return this.events.slice(0, limit) }
  async getEventById(id) { return this.events.find(e => e.id === id) || null }
  async getEventsByZone(zoneId, limit = 20) { return this.events.filter(e => e.zone === zoneId).slice(0, limit) }
  async getEventsByType(type, limit = 20) { return this.events.filter(e => e.type === type).slice(0, limit) }
  async getMotionPaths(limit = 10) { return this.motionPaths.slice(0, limit) }
  onEvent(callback) { this.eventCallbacks.push(callback) }
  destroy() { this.intervals.forEach(i => clearInterval(i)); this.intervals = []; this.events = []; this.motionPaths = [] }
}
