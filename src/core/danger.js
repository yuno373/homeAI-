import { DangerScore, FrigateEvent, ObjectType, ThreatLevel } from './types.js'

// 危険度スコア計算エンジン
// 行動パターン・外見特徴・過去履歴から0-100のスコアを算出

// Interface: ScoreWeights

const DEFAULT_WEIGHTS = {
  appearance: 0.25,
  behavior: 0.30,
  history: 0.15,
  zone: 0.20,
  time: 0.10,
}

const ZONE_DANGER = {
  garden: 30,
  parking: 25,
  hallway: 20,
  post_zone: 40,
  front_door: 50,
  front_1_5m: 60,
  underground_entry: 80,
}

const TIME_DANGER = {
  night: 70,
  late_night: 90,
  early_morning: 60,
  morning: 20,
  afternoon: 10,
  evening: 30,
}

function getTimePeriod(hour) {
  if (hour >= 0 && hour < 4) return 'late_night'
  if (hour >= 4 && hour < 7) return 'early_morning'
  if (hour >= 7 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 21) return 'evening'
  return 'night'
}

function calcAppearanceScore(event) {
  let score = 30
  if (event.type === 'person') {
    score = 40
    if (event.confidence > 90) score += 10
    if (event.confidence < 50) score += 20
    if (event.label.includes('unknown') || event.label.includes('不審')) score += 30
    if (event.sublabel === 'delivery') score -= 20
  } else if (event.type === 'animal') {
    score = 15
  } else if (event.type === 'vehicle') {
    score = 35
    if (!event.label.includes('known')) score += 25
  } else {
    score = 50
  }
  return Math.min(100, Math.max(0, score))
}

function calcBehaviorScore(event, motionPaths) {
  let score = 20
  const path = motionPaths.find(p => p.trackId === event.trackId)
  if (path) {
    const uniqueZones = new Set(path.points.map(p => p.zone))
    if (uniqueZones.size >= 3) score += 25
    if (uniqueZones.size >= 5) score += 15
    const restrictedZones = ['underground_entry', 'front_1_5m']
    const restrictedHits = path.points.filter(p => restrictedZones.includes(p.zone)).length
    if (restrictedHits >= 2) score += 30
    const timestamps = path.points.map(p => new Date(p.timestamp).getTime())
    if (timestamps.length >= 2) {
      const durations = []
      for (let i = 1; i < timestamps.length; i++) durations.push(timestamps[i] - timestamps[i - 1])
      const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length
      if (avgDuration < 5000) score += 20
    }
  }
  return Math.min(100, Math.max(0, score))
}

function calcHistoryScore(event, pastEvents) {
  let score = 10
  const sameZoneEvents = pastEvents.filter(e => e.zone === event.zone && e.type === event.type)
  if (sameZoneEvents.length >= 3) score += 20
  if (sameZoneEvents.length >= 5) score += 15
  const suspiciousEvents = sameZoneEvents.filter(e => e.score > 70)
  if (suspiciousEvents.length >= 2) score += 30
  const recentEvents = pastEvents.filter(e => {
    const diff = new Date(event.timestamp).getTime() - new Date(e.timestamp).getTime()
    return diff < 7 * 24 * 60 * 60 * 1000
  })
  if (recentEvents.length >= 10) score += 15
  return Math.min(100, Math.max(0, score))
}

function calcZoneScore(event) {
  return ZONE_DANGER[event.zone] || 30
}

function calcTimeScore(event) {
  const hour = new Date(event.timestamp).getHours()
  const period = getTimePeriod(hour)
  return TIME_DANGER[period] || 30
}

export function calculateDangerScore(
  event,
  pastEvents,
  motionPaths,
  weights = DEFAULT_WEIGHTS
) {
  const appearance = calcAppearanceScore(event)
  const behavior = calcBehaviorScore(event, motionPaths)
  const history = calcHistoryScore(event, pastEvents)
  const zone = calcZoneScore(event)
  const time = calcTimeScore(event)

  const overall = Math.round(
    appearance * weights.appearance +
    behavior * weights.behavior +
    history * weights.history +
    zone * weights.zone +
    time * weights.time
  )

  let label = 'safe'
  let detail = '正常範囲内です'
  if (overall >= 70) {
    label = 'danger'
    detail = '高危険度 - 即時対応が必要です'
  } else if (overall >= 40) {
    label = 'suspicious'
    detail = '要注意 - 継続監視を推奨します'
  }

  return {
    objectId: event.trackId || event.id,
    objectType: event.type,
    overall: Math.min(100, Math.max(0, overall)),
    appearance, behavior, history, zone, time,
    label, detail,
    timestamp: event.timestamp,
  }
}

export class DangerScoreEngine {
  pastEvents = []
  motionPaths = []

  updateEvents(events) { this.pastEvents = events }
  updateMotionPaths(paths) { this.motionPaths = paths }

  evaluate(event) {
    return calculateDangerScore(event, this.pastEvents, this.motionPaths)
  }

  evaluateBatch(events) {
    return events.map(e => this.evaluate(e))
  }

  getOverallThreatLevel() {
    const scores = this.evaluateBatch(this.pastEvents.slice(0, 10))
    const maxScore = Math.max(...scores.map(s => s.overall), 0)
    if (maxScore >= 70) return 'danger'
    if (maxScore >= 40) return 'suspicious'
    return 'safe'
  }
}

export const dangerEngine = new DangerScoreEngine()
