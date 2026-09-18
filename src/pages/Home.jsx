import { useSystem } from '../App'
import { Link } from 'react-router-dom'

export default function Home() {
  const sys = useSystem()
  const { devices, powerStatus, events } = sys

  const locks = devices.filter(d => d.type === 'lock')
  const allLocked = locks.every(l => l.attributes.locked)

  const theaterLight = devices.find(d => d.id === 'light_theater')
  const projector = devices.find(d => d.id === 'projector_theater')
  const theaterHvac = devices.find(d => d.id === 'hvac_theater')

  const latestEvent = events[0]
  const dangerScore = latestEvent ? latestEvent.score : 0
  const dangerLabel = dangerScore >= 70 ? '危険' : dangerScore >= 40 ? '要注意' : '安全'
  const dangerColor = dangerScore >= 70 ? 'color-danger' : dangerScore >= 40 ? 'color-warning' : 'color-success'

  return (
    <div className="home-layout">
      <div className="grid">
        {/* 家の状態 */}
        <div className="card">
          <h2 className="card-title">家の状態</h2>
          <div className="card-body">
            <p><span className="label">モード</span><span className="value color-primary">通常</span></p>
            <p><span className="label">玄関ロック</span><span className={`value ${allLocked ? 'color-success' : 'color-danger'}`}>{allLocked ? '施錠' : '解錠'}</span></p>
            <p><span className="label">危険度</span><span className={`value ${dangerColor}`}>{dangerLabel} ({dangerScore})</span></p>
            <p><span className="label">AI稼働</span><span className="value color-success">5/5</span></p>
          </div>
        </div>

        {/* 電力 */}
        <div className="card">
          <h2 className="card-title">電力</h2>
          <div className="card-body">
            <p><span className="label">現在消費</span><span className="value color-primary">{powerStatus.currentWatt}W</span></p>
            <p><span className="label">UPS残量</span><span className={`value ${powerStatus.ups.percent > 50 ? 'color-success' : 'color-warning'}`}>{powerStatus.ups.percent.toFixed(0)}%</span></p>
            <p><span className="label">蓄電池</span><span className="value color-secondary">{powerStatus.battery.percent.toFixed(0)}%</span></p>
            <p><span className="label">発電</span><span className="value color-accent">{powerStatus.solar.todayKwh}kWh</span></p>
          </div>
        </div>

        {/* 防犯 */}
        <div className="card">
          <h2 className="card-title">防犯</h2>
          <div className="card-body">
            <p><span className="label">最新イベント</span><span className="value">{latestEvent?.label || 'なし'}</span></p>
            <p><span className="label">ゾーン</span><span className="value">{latestEvent?.zone || '-'}</span></p>
            <p><span className="label">来訪者分類</span><span className="value">{latestEvent?.type === 'person' ? '人物' : '動物'}</span></p>
            <p><span className="label">危険度</span><span className={`value ${dangerColor}`}>{dangerScore}</span></p>
          </div>
        </div>

        {/* AI状態 */}
        <div className="card">
          <h2 className="card-title">AI状態</h2>
          <div className="card-body">
            <p><span className="label">司令官</span><span className="value color-success">Llama 稼働</span></p>
            <p><span className="label">監視</span><span className="value color-success">YOLO 稼働</span></p>
            <p><span className="label">音声</span><span className="value color-success">Whisper 稼働</span></p>
            <p><span className="label">電力</span><span className="value color-success">Python 稼働</span></p>
          </div>
        </div>

        {/* 劇場 */}
        <div className="card">
          <h2 className="card-title">劇場モード</h2>
          <div className="card-body">
            <p><span className="label">照明</span><span className="value">{theaterLight?.attributes.on ? `${theaterLight.attributes.brightness}%` : 'OFF'}</span></p>
            <p><span className="label">プロジェクター</span><span className="value">{projector?.attributes.on ? '稼働' : '待機'}</span></p>
            <p><span className="label">空調</span><span className="value">{theaterHvac?.attributes.on ? `${theaterHvac.attributes.temperature}°C` : 'OFF'}</span></p>
            <p><span className="label">操作</span><Link to="/theater" className="value color-primary" style={{cursor:'pointer'}}>詳細へ →</Link></p>
          </div>
        </div>

        {/* センサー */}
        <div className="card">
          <h2 className="card-title">センサー</h2>
          <div className="card-body">
            {devices.filter(d => d.type === 'sensor').slice(0, 4).map((s) => (
              <p key={s.id}><span className="label">{s.name}</span><span className="value">{s.attributes.value}{s.attributes.unit}</span></p>
            ))}
          </div>
        </div>

        {/* デバイス一覧 */}
        <div className="section">
          <h2 className="section-title">デバイス一覧 ({devices.length}台)</h2>
          <div style={{maxHeight: '240px', overflowY: 'auto'}}>
            {devices.map((dev) => (
              <div key={dev.id} className="device-row">
                <div>
                  <div className="device-name">{dev.name}</div>
                  <div className="device-room">{dev.room || dev.type}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${dev.online ? 'bg-success' : 'bg-text-muted'}`} />
                  {dev.attributes.on !== undefined ? (
                    <button className={dev.attributes.on ? 'active' : ''}>{dev.attributes.on ? 'ON' : 'OFF'}</button>
                  ) : (
                    <span style={{fontSize: '10px', color: 'var(--color-text-muted)'}}>
                      {dev.attributes.locked !== undefined ? (dev.attributes.locked ? '施錠' : '解錠') : 
                       dev.attributes.percent !== undefined ? `${dev.attributes.percent}%` :
                       dev.attributes.value !== undefined ? `${dev.attributes.value}${dev.attributes.unit}` : '-'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
