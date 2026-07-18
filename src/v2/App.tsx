import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './index.css'

// ─── Live agent data ──────────────────────────────────────────────────────────

type ApiFlag = { metric: string; change: string; direction: string; cause: string; source: string }
type ApiChannel = { id: string; name: string; status: string; metrics: { label: string; value: string }[] }
type ApiReport = { period?: string; generatedAt?: string; baseline_week?: string | null; channels?: ApiChannel[]; flags?: ApiFlag[] }

// The agent's real server-side order, narrated during the ~20s run.
// Adapted from ui-animation-library/preloader.js ("loading = brand story").
const RUN_STEPS = [
  'Pulling Google Ads',
  'Pulling Meta Ads',
  'Pulling Email',
  'Pulling CRM',
  'Comparing to last week',
  'Writing your report',
]

// Narrated steps for the AI Analyst (~25–40 s total).
// Paced at ~6 s each to match the web-search + generation time.
const ANALYST_STEPS = [
  { label: 'Searching the web for context', icon: '🔍' },
  { label: 'Reading industry signals', icon: '📡' },
  { label: 'Drawing your chart', icon: '📊' },
  { label: 'Writing the analysis', icon: '✍️' },
  { label: 'Wrapping up', icon: '⚡' },
]

// Next Monday 11:00 UTC — the Vercel cron schedule.
function nextAgentRun(): Date {
  const next = new Date()
  next.setUTCHours(11, 0, 0, 0)
  while (next.getUTCDay() !== 1 || next.getTime() <= Date.now()) {
    next.setUTCDate(next.getUTCDate() + 1)
  }
  return next
}

// Adapted from ui-animation-library/clock.js — "a system with a schedule".
function NextRunClock() {
  const [, tick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => tick(t => t + 1), 30000)
    return () => clearInterval(id)
  }, [])

  const target = nextAgentRun()
  const hours = Math.max(0, Math.floor((target.getTime() - Date.now()) / 3600000))
  const countdown = hours >= 24 ? `in ${Math.floor(hours / 24)}d ${hours % 24}h` : `in ${hours}h`
  const local = target.toLocaleString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit' })

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 10px', marginTop: 6 }}>
      <span className="clock-dot" />
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', color: '#2D3D5C', textTransform: 'uppercase' }}>
        Next run
      </span>
      <span style={{ fontSize: 11, color: '#4A5A7A', fontFamily: '"JetBrains Mono", monospace' }}>
        {local} · {countdown}
      </span>
    </div>
  )
}

function flagsForChannel(channel: ApiChannel, flags: ApiFlag[]): ApiFlag[] {
  const name = channel.name.toLowerCase()
  const id = channel.id.replace('_', ' ')
  return flags.filter(f =>
    (f.source || '').toLowerCase().includes(id) ||
    (f.source || '').toLowerCase().startsWith(name) ||
    (f.metric || '').toLowerCase().startsWith(name)
  )
}

// ─── Icon primitive ───────────────────────────────────────────────────────────

function Icon({ d, size = 16 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

const I = {
  home: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  brain: 'M12 2c-1.5 0-2.9.6-3.9 1.5A5 5 0 002 8.5C2 11 3.4 13 5.5 14c.3 2.4 2.3 4 4.5 4h4c2.2 0 4.2-1.6 4.5-4 2.1-1 3.5-3 3.5-5.5a5 5 0 00-6.1-5A4 4 0 0012 2z',
  trending: 'M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6',
  pie: 'M21.21 15.89A10 10 0 118 2.83 M22 12A10 10 0 0012 2v10z',
  users: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75',
  file: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  bell: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0',
  plug: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z',
  arrow: 'M5 12h14 M12 5l7 7-7 7',
  arrowUp: 'M18 15l-6-6-6 6',
  arrowDown: 'M6 9l6 6 6-6',
  refresh: 'M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0114.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0020.49 15',
  sparkle: 'M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z',
  warning: 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01',
  check: 'M20 6L9 17l-5-5',
  competitors: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
}

// ─── Nav structure ────────────────────────────────────────────────────────────

// Each item renders a real view (see renderView). `demo` items are honest
// design concepts awaiting backend features; the separator sits before them.
const NAV = [
  { id: 'overview', label: 'Overview', icon: 'home' },
  { id: 'reports', label: 'Reports', icon: 'file' },
  { id: 'alerts', label: 'Alerts', icon: 'bell' },
  { id: 'integrations', label: 'Integrations', icon: 'plug' },
  { id: 'analyst', label: 'AI Analyst', icon: 'brain' },
  { id: 'opportunities', label: 'Opportunities', icon: 'zap', demo: true },
  { id: 'settings', label: 'Settings', icon: 'settings' },
]

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [active, setActive] = useState('overview')
  const [running, setRunning] = useState(false)
  const [report, setReport] = useState<ApiReport | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [runStep, setRunStep] = useState(0)

  const runAgent = async () => {
    setRunning(true)
    setRunStep(0)
    const pacer = setInterval(
      () => setRunStep(step => Math.min(step + 1, RUN_STEPS.length - 1)),
      1600
    )
    await fetchReport(true)
    clearInterval(pacer)
    setRunning(false)
  }

  const fetchReport = async (refresh = false) => {
    try {
      const resp = await fetch(`/api/report${refresh ? '?refresh=1' : ''}`)
      if (resp.ok) {
        const payload = await resp.json()
        setReport(payload.report ?? null)
      }
    } catch {
      setReport(null)
    }
    setLoaded(true)
  }

  useEffect(() => { fetchReport() }, [])

  const flags = report?.flags ?? []

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#080E1A', fontFamily: 'Inter, system-ui, sans-serif', color: '#E2E8F8', overflow: 'hidden' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 216,
        flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,0.055)',
        display: 'flex',
        flexDirection: 'column',
        padding: '28px 12px',
        gap: 0,
        background: '#080E1A',
      }}>

        {/* Logo */}
        <div style={{ padding: '0 8px 32px', display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: 'linear-gradient(135deg, #5B8CFF 0%, #7C5CFC 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon d={I.sparkle} size={13} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.025em', color: '#F0F4FF' }}>
            Market Pulse
          </span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {NAV.map((item) => {
            const isActive = active === item.id
            const badge = item.id === 'alerts' && flags.length > 0 ? flags.length : undefined
            return (
              <div key={item.id}>
                {item.demo && (
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.055)', margin: '10px 8px 10px' }} />
                )}
                <button
                  onClick={() => setActive(item.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 9,
                    padding: '7px 10px', borderRadius: 7, border: 'none', cursor: 'pointer',
                    background: isActive ? 'rgba(91,140,255,0.1)' : 'transparent',
                    color: isActive ? '#7AABFF' : '#4A5A7A',
                    textAlign: 'left', transition: 'all 0.12s',
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  <Icon d={I[item.icon as keyof typeof I]} size={14} />
                  <span style={{ fontSize: 13, fontWeight: isActive ? 500 : 400, flex: 1, letterSpacing: '-0.005em' }}>
                    {item.label}
                  </span>
                  {item.demo && (
                    <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.05em', color: '#3A4A6A', textTransform: 'uppercase' }}>
                      demo
                    </span>
                  )}
                  {badge !== undefined && (
                    <span style={{
                      fontSize: 10, fontWeight: 600,
                      background: isActive ? 'rgba(91,140,255,0.25)' : 'rgba(255,255,255,0.07)',
                      color: isActive ? '#7AABFF' : '#3A4A6A',
                      borderRadius: 5, padding: '1px 5px',
                      fontFamily: '"JetBrains Mono", monospace',
                    }}>
                      {badge}
                    </span>
                  )}
                </button>
              </div>
            )
          })}
        </nav>

        {/* Classic app */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.055)', margin: '10px 8px' }} />
        {[
          { to: '/app/report', icon: I.file, label: 'Weekly Report (classic)' },
          { to: '/docs', icon: I.home, label: 'Documentation' },
        ].map(link => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              display: 'flex', alignItems: 'center', gap: 9,
              padding: '7px 10px', borderRadius: 7, marginBottom: 2,
              color: '#4A5A7A', textDecoration: 'none', fontSize: 13,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <Icon d={link.icon} size={14} />
            <span>{link.label}</span>
          </Link>
        ))}

        {/* Agent schedule */}
        <NextRunClock />

        {/* User */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 9,
          padding: '10px', borderRadius: 8,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.055)',
          cursor: 'pointer',
          marginTop: 10,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7, flexShrink: 0,
            background: 'linear-gradient(135deg, #3B5BFF, #6B3FDC)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#fff',
          }}>SE</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#C8D4EE', letterSpacing: '-0.01em' }}>Sarah Ellison</div>
            <div style={{ fontSize: 11, color: '#2D3D5C' }}>CMO · Nexora</div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <header style={{
          padding: '24px 44px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.055)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#080E1A',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: '-0.03em', color: '#F0F4FF', lineHeight: 1 }}>
              Good morning
            </h1>
            <p style={{ margin: '5px 0 0', fontSize: 13, color: '#3A4A6A', fontWeight: 400 }}>
              {!loaded ? (
                'Connecting to the agent…'
              ) : report ? (
                <>
                  Your AI flagged{' '}
                  <span style={{ color: '#5B8CFF' }}>{flags.length} change{flags.length !== 1 ? 's' : ''}</span>
                  {' '}this week · report {report.period}
                  {report.baseline_week ? ` · vs ${report.baseline_week}` : ' · first run'}
                </>
              ) : (
                'Agent offline — showing design demo'
              )}
            </p>
          </div>
          <button
            onClick={runAgent}
            disabled={running}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 16px', borderRadius: 8, cursor: running ? 'default' : 'pointer',
              fontSize: 13, fontWeight: 500, letterSpacing: '-0.01em',
              background: 'rgba(91,140,255,0.12)',
              color: '#7AABFF',
              border: '1px solid rgba(91,140,255,0.2)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (!running) (e.currentTarget as HTMLElement).style.background = 'rgba(91,140,255,0.18)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(91,140,255,0.12)' }}
          >
            {running ? (
              <>
                <span className="eq" aria-hidden="true"><span /><span /><span /><span /></span>
                <span className="run-step" key={runStep} style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12 }}>
                  {String(runStep + 1).padStart(2, '0')}/{String(RUN_STEPS.length).padStart(2, '0')} · {RUN_STEPS[runStep]}
                </span>
              </>
            ) : (
              <>
                <Icon d={I.sparkle} size={13} />
                Run Analysis
              </>
            )}
          </button>
        </header>

        {/* Content — one view per sidebar item */}
        <div style={{ padding: '40px 44px', display: 'flex', flexDirection: 'column', gap: 36, maxWidth: 1100 }}>
          {active === 'overview' && <OverviewView report={report} loaded={loaded} flags={flags} />}
          {active === 'reports' && <ReportsView onOpen={() => setActive('overview')} />}
          {active === 'alerts' && <AlertsView flags={flags} loaded={loaded} />}
          {active === 'integrations' && <IntegrationsView report={report} loaded={loaded} />}
          {active === 'analyst' && <AnalystView />}
          {active === 'opportunities' && <OpportunitiesView />}
          {active === 'settings' && <SettingsView />}
        </div>
      </div>
    </div>
  )
}

// ─── Views (one per sidebar item) ─────────────────────────────────────────────

const panelStyle: React.CSSProperties = {
  background: '#0F1829',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 12,
  padding: '20px 22px',
}

function WeeklyIntelligence({ report, loaded, flags }: { report: ApiReport | null; loaded: boolean; flags: ApiFlag[] }) {
  return (
    <section>
      <SectionLabel>Weekly Intelligence{report ? ' · Live' : ''}</SectionLabel>
      {/* Staggered entrance adapted from ui-animation-library/split-lines.js
          (reading-order reveal) — re-keyed per report so re-runs replay it. */}
      <div key={report?.generatedAt ?? 'loading'} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {report?.channels?.length ? (
          report.channels.map((channel, index) => {
            const stagger = `animate-float-up-delay-${Math.min(index + 1, 4)}`
            if (channel.status === 'unavailable') {
              return <div key={channel.id} className={stagger}><MetricCard source={channel.name} metric="Data unavailable" unavailable /></div>
            }
            const channelFlags = flagsForChannel(channel, flags)
            if (channelFlags.length === 0) {
              return <div key={channel.id} className={stagger}><MetricCard source={channel.name} metric="No significant change" value="Stable" neutral /></div>
            }
            const flag = channelFlags[0]
            return (
              <div key={channel.id} className={stagger}>
                <MetricCard
                  source={channel.name}
                  metric={flag.metric.replace(new RegExp(`^${channel.name}\\s*`, 'i'), '')}
                  value={flag.change.split(' / ')[0]}
                  positive={flag.direction === 'up'}
                />
              </div>
            )
          })
        ) : (
          ['Google Ads', 'Meta Ads', 'Email', 'CRM'].map(name => (
            <MetricCard key={name} source={name} metric={loaded ? 'Agent offline' : 'Loading…'} unavailable />
          ))
        )}
      </div>
    </section>
  )
}

function FlagList({ flags }: { flags: ApiFlag[] }) {
  if (flags.length === 0) {
    return <div style={{ ...panelStyle, color: '#4A5A7A', fontSize: 13 }}>No changes flagged this week — every channel held steady against last week's baseline.</div>
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {flags.map((flag, i) => {
        const color = flag.direction === 'up' ? '#22C55E' : flag.direction === 'conflict' ? '#F59E0B' : '#EF4444'
        return (
          <div key={i} className={`animate-float-up-delay-${Math.min(i + 1, 4)}`} style={{ ...panelStyle, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ minWidth: 76 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color, fontFamily: '"JetBrains Mono", monospace', letterSpacing: '-0.02em' }}>{flag.change}</div>
              <div style={{ fontSize: 10, color: '#2D3D5C', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>{flag.direction}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#E2E8F8', marginBottom: 4 }}>{flag.metric}</div>
              <div style={{ fontSize: 13, color: '#8B9CC8', lineHeight: 1.55 }}>{flag.cause}</div>
              <div style={{ fontSize: 11, color: '#2D3D5C', marginTop: 6 }}>{flag.source}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

type HeatCell = { week: string; change: number | null }
type HeatRow = { id: string; name: string; cells: HeatCell[] }

function cellColor(c: number | null): string {
  if (c === null) return 'rgba(255,255,255,0.03)'
  const mag = Math.min(Math.abs(c) / 45, 1)
  const a = 0.12 + 0.8 * mag
  return c >= 0 ? `rgba(34,197,94,${a})` : `rgba(239,68,68,${a})`
}

// Channel × week movement heatmap — technique from the IIB Awards 2024 Social
// Media Dashboard [6879] (weekday×hour engagement grid), transferred to
// channel×week volatility over ~6 months. Colour = size + direction of the
// week's biggest move per channel.
function MovementHeatmap() {
  const [data, setData] = useState<{ weeks: string[]; channels: HeatRow[] } | null>(null)
  useEffect(() => {
    fetch('/api/heatmap').then(r => r.ok ? r.json() : null).then(setData).catch(() => setData(null))
  }, [])

  if (!data || data.weeks.length === 0) {
    return <div style={{ ...panelStyle, color: '#4A5A7A', fontSize: 13 }}>No history yet.</div>
  }
  const monthLabel = (wk: string) => {
    const [y, w] = wk.split('-W')
    const d = new Date(Date.UTC(+y, 0, 1 + (+w - 1) * 7))
    return d.toLocaleString(undefined, { month: 'short' })
  }

  return (
    <div style={{ ...panelStyle, overflowX: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `86px repeat(${data.weeks.length}, 1fr)`, gap: 3, minWidth: 620 }}>
        {data.channels.map(row => (
          <div key={row.id} style={{ display: 'contents' }}>
            <div style={{ fontSize: 12, color: '#8B9CC8', display: 'flex', alignItems: 'center' }}>{row.name}</div>
            {row.cells.map((cell, i) => (
              <div
                key={i}
                title={`${row.name} · ${cell.week}${cell.change === null ? ' · baseline' : ` · ${cell.change > 0 ? '+' : ''}${cell.change}%`}`}
                style={{ aspectRatio: '1', borderRadius: 3, background: cellColor(cell.change), minWidth: 12 }}
              />
            ))}
          </div>
        ))}
        {/* month axis */}
        <div />
        {data.weeks.map((wk, i) => {
          const show = i === 0 || monthLabel(wk) !== monthLabel(data.weeks[i - 1])
          return <div key={wk} style={{ fontSize: 9, color: '#3A4A6A', textAlign: 'center', marginTop: 4 }}>{show ? monthLabel(wk) : ''}</div>
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 16, fontSize: 11, color: '#4A5A7A' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 11, height: 11, borderRadius: 3, background: 'rgba(239,68,68,0.7)' }} /> dropped</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 11, height: 11, borderRadius: 3, background: 'rgba(255,255,255,0.06)' }} /> steady</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 11, height: 11, borderRadius: 3, background: 'rgba(34,197,94,0.7)' }} /> rose</span>
        <span style={{ marginLeft: 'auto' }}>each cell = the week's biggest move for that channel</span>
      </div>
    </div>
  )
}

function OverviewView({ report, loaded, flags }: { report: ApiReport | null; loaded: boolean; flags: ApiFlag[] }) {
  return (
    <>
      <WeeklyIntelligence report={report} loaded={loaded} flags={flags} />
      <section>
        <SectionLabel>What Changed This Week</SectionLabel>
        <FlagList flags={flags} />
      </section>
      <section style={{ paddingBottom: 48 }}>
        <SectionLabel>6-Month Channel Movement</SectionLabel>
        <MovementHeatmap />
      </section>
    </>
  )
}

function AlertsView({ flags, loaded }: { flags: ApiFlag[]; loaded: boolean }) {
  return (
    <section style={{ paddingBottom: 48 }}>
      <SectionLabel>Alerts{loaded ? ` · ${flags.length}` : ''}</SectionLabel>
      <FlagList flags={flags} />
    </section>
  )
}

function ReportsView({ onOpen }: { onOpen: () => void }) {
  const [reports, setReports] = useState<{ id: string; period: string; generatedAt: string; flagCount: number }[] | null>(null)
  useEffect(() => {
    fetch('/api/report/archive')
      .then(r => r.ok ? r.json() : { reports: [] })
      .then(p => setReports(p.reports ?? []))
      .catch(() => setReports([]))
  }, [])

  return (
    <section style={{ paddingBottom: 48 }}>
      <SectionLabel>Report Archive</SectionLabel>
      {reports === null && <div style={{ ...panelStyle, color: '#4A5A7A', fontSize: 13 }}>Loading…</div>}
      {reports?.length === 0 && <div style={{ ...panelStyle, color: '#4A5A7A', fontSize: 13 }}>No reports stored yet — they archive automatically after each Monday run.</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(reports ?? []).map((r, i) => (
          <button
            key={r.id}
            onClick={onOpen}
            className={`animate-float-up-delay-${Math.min(i + 1, 4)}`}
            style={{ ...panelStyle, cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'inherit' }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#E2E8F8' }}>{r.period}</div>
              <div style={{ fontSize: 12, color: '#4A5A7A', marginTop: 3 }}>
                Generated {r.generatedAt ? new Date(r.generatedAt).toLocaleDateString() : '—'} · {r.flagCount} flag{r.flagCount !== 1 ? 's' : ''}
              </div>
            </div>
            <Icon d={I.arrow} size={15} />
          </button>
        ))}
      </div>
    </section>
  )
}

function IntegrationsView({ report, loaded }: { report: ApiReport | null; loaded: boolean }) {
  const label = (src?: string, status?: string) => {
    if (status === 'unavailable') return { text: 'Unavailable', color: '#EF4444' }
    if (src === 'mock' || src === 'simulated') return { text: 'Simulated', color: '#F59E0B' }
    return { text: 'Live', color: '#22C55E' }
  }
  return (
    <section style={{ paddingBottom: 48 }}>
      <SectionLabel>Integrations</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {report?.channels?.length ? (
          report.channels.map(channel => {
            const s = label((channel as ApiChannel & { source?: string }).source, channel.status)
            return (
              <div key={channel.id} style={{ ...panelStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Icon d={I.plug} size={16} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#E2E8F8' }}>{channel.name}</span>
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 600, color: s.color }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.color }} />
                  {s.text}
                </span>
              </div>
            )
          })
        ) : (
          <div style={{ ...panelStyle, color: '#4A5A7A', fontSize: 13 }}>{loaded ? 'Agent offline — run a report to see integration status.' : 'Loading…'}</div>
        )}
      </div>
    </section>
  )
}

type AnalystBar = { label: string; value: number; display: string; direction: string; highlight?: boolean; note?: string }
type AnalystPair = { label: string; lastDisplay: string; thisDisplay: string; direction: string }
type AnalystChart = {
  type?: 'slope' | 'callout' | 'comparison'
  title?: string; bars?: AnalystBar[]                          // slope
  metric?: string; value?: string; direction?: string; context?: string  // callout
  pairs?: AnalystPair[]                                        // comparison
}
type WebContext = { note: string; source?: string }
type Analysis = {
  headline?: string; chart?: AnalystChart; svg?: string | null;
  web_context?: WebContext[]; real_date?: string; seasonal?: string;
  takeaway?: string; error?: string; generated_at?: string
}

function CalloutChart({ chart }: { chart: AnalystChart }) {
  const c = chart.direction === 'up' ? '#22C55E' : chart.direction === 'down' ? '#EF4444' : '#8B9CC8'
  return (
    <div style={{ padding: '20px 0 12px', textAlign: 'center' }}>
      <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: '-0.05em', color: c, fontFamily: '"JetBrains Mono", monospace', lineHeight: 1 }}>
        {chart.value}
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#F0F4FF', marginTop: 14 }}>{chart.metric}</div>
      {chart.context && <div style={{ fontSize: 12, color: '#4A5A7A', marginTop: 4 }}>{chart.context}</div>}
    </div>
  )
}

function ComparisonChart({ chart }: { chart: AnalystChart }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {(chart.pairs ?? []).map((p, i) => {
        const c = p.direction === 'up' ? '#22C55E' : '#EF4444'
        return (
          <div key={i} className={`animate-float-up-delay-${Math.min(i + 1, 4)}`} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#E2E8F8' }}>{p.label}</div>
            <div style={{ fontSize: 15, color: '#4A5A7A', fontFamily: '"JetBrains Mono", monospace' }}>{p.lastDisplay}</div>
            <Icon d={I.arrow} size={16} />
            <div style={{ fontSize: 17, fontWeight: 700, color: c, fontFamily: '"JetBrains Mono", monospace', minWidth: 70, textAlign: 'right' }}>{p.thisDisplay}</div>
          </div>
        )
      })}
      <div style={{ fontSize: 11, color: '#3A4A6A', marginTop: 2 }}>last week → this week</div>
    </div>
  )
}

function AnalystChartRender({ chart }: { chart?: AnalystChart }) {
  if (!chart) return null
  if (chart.type === 'callout') return <CalloutChart chart={chart} />
  if (chart.type === 'comparison') return <ComparisonChart chart={chart} />
  return <SlopeChart bars={chart.bars ?? []} />  // slope (default)
}

const barColor = (d: string) => (d === 'up' ? '#22C55E' : d === 'conflict' ? '#F59E0B' : '#EF4444')

/* Indexed slope chart. Technique transferred from the IIB Awards 2024 library:
   the "vs prior" rebasing of the Social Media Dashboard [6879] + the
   highlight-one / mute-the-rest storytelling of Pathways for Girls [7058].
   Every metric starts at a shared baseline (100 = last week) on the left and
   fans to the right by its % change, so the steepest line is the biggest
   mover and the highlighted line stays colored while the rest recede.
   Perfect for exactly two time points (this week vs baseline week). */
function SlopeChart({ bars, baselineWeek, currentWeek }: { bars: AnalystBar[]; baselineWeek?: string; currentWeek?: string }) {
  if (bars.length === 0) {
    return <div style={{ color: '#4A5A7A', fontSize: 13, padding: '8px 0' }}>Nothing moved beyond normal variation — a calm week.</div>
  }

  const W = 720, H = 300, padT = 28, padB = 40, xL = 66, xR = 470
  const idx = bars.map(b => 100 + b.value)               // this-week index (last week = 100)
  const lo = Math.min(100, ...idx), hi = Math.max(100, ...idx)
  const pad = (hi - lo) * 0.12 || 10
  const yMin = lo - pad, yMax = hi + pad
  const y = (v: number) => padT + (yMax - v) / (yMax - yMin) * (H - padT - padB)
  const yBase = y(100)

  // De-overlap the right-side labels: sort by y, keep ≥ 20px apart.
  const order = bars.map((b, i) => ({ b, i, yv: y(idx[i]) })).sort((a, z) => a.yv - z.yv)
  let last = -Infinity
  for (const o of order) { o.yv = Math.max(o.yv, last + 20); last = o.yv }
  const labelY = new Map(order.map(o => [o.i, o.yv]))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', overflow: 'visible' }} role="img" aria-label="Week-over-week change, indexed to last week = 100">
      {/* baseline reference */}
      <line x1={xL} y1={yBase} x2={xR} y2={yBase} stroke="rgba(255,255,255,0.14)" strokeDasharray="3 4" />
      <text x={xL} y={yBase - 8} fill="#3A4A6A" fontSize="11" fontFamily="'JetBrains Mono', monospace">100 · baseline</text>
      {/* axis endpoints */}
      <text x={xL} y={H - 16} fill="#4A5A7A" fontSize="12" textAnchor="middle">{baselineWeek || 'Last week'}</text>
      <text x={xR} y={H - 16} fill="#8B9CC8" fontSize="12" textAnchor="middle" fontWeight="600">{currentWeek || 'This week'}</text>
      <circle cx={xL} cy={yBase} r="3.5" fill="#4A5A7A" />

      {bars.map((b, i) => {
        const c = barColor(b.direction)
        const yv = y(idx[i]), ly = labelY.get(i)!
        return (
          <g key={i} opacity={b.highlight ? 1 : 0.45}>
            <line x1={xL} y1={yBase} x2={xR} y2={yv} stroke={c} strokeWidth={b.highlight ? 3 : 1.6} strokeLinecap="round" />
            <circle cx={xR} cy={yv} r={b.highlight ? 5 : 3.5} fill={c} />
            {/* connector from endpoint to label if de-overlap moved it */}
            {Math.abs(ly - yv) > 1 && <line x1={xR + 5} y1={yv} x2={xR + 14} y2={ly} stroke={c} strokeWidth="1" opacity="0.5" />}
            <text x={xR + 18} y={ly - 3} fill={b.highlight ? '#F0F4FF' : '#8B9CC8'} fontSize="12.5" fontWeight={b.highlight ? 700 : 500}>
              {b.label}
              {b.highlight && <tspan fill="#7AABFF" fontSize="9" fontWeight="700" dx="6">◂ LOOK HERE</tspan>}
            </text>
            <text x={xR + 18} y={ly + 12} fill={c} fontSize="11.5" fontWeight="700" fontFamily="'JetBrains Mono', monospace">
              {b.display}{b.note ? <tspan fill="#4A5A7A" fontWeight="400" fontFamily="Inter, sans-serif" dx="8">{b.note}</tspan> : null}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function AnalystView() {
  const [weeks, setWeeks] = useState<string[]>([])
  const [week, setWeek] = useState<string>('')
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [analystStep, setAnalystStep] = useState(0)

  // Load the list of available weeks from the archive (newest first).
  useEffect(() => {
    fetch('/api/report/archive')
      .then(r => r.ok ? r.json() : { reports: [] })
      .then(p => {
        const ws = (p.reports ?? []).map((r: { id: string }) => r.id)
        setWeeks(ws)
        if (ws.length) setWeek(ws[0])
        else setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const load = async (wk: string, refresh = false) => {
    if (!refresh) {
      setLoading(true)
      try {
        const resp = await fetch(`/api/analyst?week=${wk}`)
        const payload = resp.ok ? await resp.json() : {}
        setAnalysis(payload.analysis ?? null)
      } catch {
        setAnalysis(null)
      }
      setLoading(false)
      return
    }

    // Fresh generation: stream progress, then fall back to polling the cache
    // if the connection is cut but the work completed server-side.
    setGenerating(true)
    setAnalystStep(0)
    const prevStamp = analysis?.generated_at
    let got = false
    try {
      const resp = await fetch(`/api/analyst/stream?week=${wk}&refresh=1`)
      if (resp.body) {
        const reader = resp.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        const consume = (line: string) => {
          const trimmed = line.trim()
          if (!trimmed) return
          try {
            const data = JSON.parse(trimmed)
            if (data.step !== undefined) setAnalystStep(Math.min(data.step, ANALYST_STEPS.length - 1))
            if (data.result !== undefined) { setAnalysis(data.result.analysis ?? null); got = true }
          } catch { /* partial line — will complete on the next read */ }
        }
        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          let nl: number
          while ((nl = buffer.indexOf('\n')) >= 0) {
            consume(buffer.slice(0, nl))
            buffer = buffer.slice(nl + 1)
          }
        }
        consume(buffer) // flush any trailing complete line
      }
    } catch {
      /* stream failed — fall through to the poll below */
    }

    // If we never received a result (timeout / dropped connection), the
    // generation may still have finished and cached server-side. Poll for it.
    if (!got) {
      for (let i = 0; i < 12 && !got; i++) {
        await new Promise(r => setTimeout(r, 3000))
        try {
          const r = await fetch(`/api/analyst?week=${wk}`)
          if (r.ok) {
            const a = (await r.json()).analysis
            if (a && !a.error && a.generated_at && a.generated_at !== prevStamp) {
              setAnalysis(a); got = true
            }
          }
        } catch { /* keep polling */ }
      }
      if (!got) setAnalysis({ error: 'That took too long — please try Analyze again.' })
    }
    setGenerating(false)
  }

  useEffect(() => { if (week) load(week) }, [week])

  const isSlope = !analysis?.chart?.type || analysis.chart.type === 'slope'

  return (
    <section style={{ paddingBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 12, flexWrap: 'wrap' }}>
        <SectionLabel>AI Analyst</SectionLabel>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <select
            value={week}
            onChange={e => setWeek(e.target.value)}
            style={{
              padding: '6px 10px', borderRadius: 7, fontSize: 12,
              background: '#0B1220', color: '#C8D4EE', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
            }}
          >
            {weeks.map(w => <option key={w} value={w}>{w}{w === weeks[0] ? ' (this week)' : ''}</option>)}
          </select>
          <button
            onClick={() => load(week, true)}
            disabled={generating || !week}
            style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 8,
              border: '1px solid rgba(91,140,255,0.2)', background: 'rgba(91,140,255,0.12)', color: '#7AABFF',
              fontSize: 12, fontWeight: 500, cursor: generating ? 'default' : 'pointer',
            }}
          >
            {generating
              ? <><span className="eq" aria-hidden="true"><span /><span /><span /><span /></span> Analyzing…</>
              : <><Icon d={I.brain} size={13} /> {analysis ? 'Re-analyze' : 'Analyze'}</>}
          </button>
        </div>
      </div>

      {loading && <div style={{ ...panelStyle, color: '#4A5A7A', fontSize: 13 }}>Loading…</div>}

      {/* ── Progress bar during generation ── */}
      {generating && (
        <div style={{ ...panelStyle, padding: '22px 24px' }}>
          {/* Step label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 18 }}>{ANALYST_STEPS[analystStep].icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#C8D4EE', letterSpacing: '-0.01em' }}>
                {ANALYST_STEPS[analystStep].label}…
              </div>
              <div style={{ fontSize: 11, color: '#3A4A6A', marginTop: 2 }}>
                Step {analystStep + 1} of {ANALYST_STEPS.length} · This takes about 30 seconds
              </div>
            </div>
          </div>
          {/* Track */}
          <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                borderRadius: 99,
                background: 'linear-gradient(90deg, #5B8CFF, #7C5CFC)',
                width: `${((analystStep + 1) / ANALYST_STEPS.length) * 100}%`,
                transition: 'width 0.6s ease',
              }}
            />
          </div>
          {/* Step dots */}
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            {ANALYST_STEPS.map((step, i) => (
              <div
                key={i}
                title={step.label}
                style={{
                  flex: 1, height: 3, borderRadius: 99,
                  background: i <= analystStep ? '#5B8CFF' : 'rgba(255,255,255,0.07)',
                  transition: 'background 0.4s ease',
                }}
              />
            ))}
          </div>
        </div>
      )}

      {!loading && !analysis && (
        <div style={{ ...panelStyle, color: '#4A5A7A', fontSize: 13 }}>
          No analysis for {week} yet. Click “Analyze” to turn the report into a visual story.
        </div>
      )}

      {analysis?.error && (
        <div style={{ ...panelStyle, borderColor: 'rgba(239,68,68,0.3)', color: '#EF4444', fontSize: 13 }}>
          Analysis failed: {analysis.error}
        </div>
      )}

      {analysis && !analysis.error && (
        <div key={analysis.generated_at} className="animate-float-up" style={{ ...panelStyle, padding: '28px 30px' }}>
          {analysis.headline && (
            <h2 style={{ margin: '0 0 22px', fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', color: '#F0F4FF', lineHeight: 1.2 }}>
              {analysis.headline}
            </h2>
          )}
          {analysis.chart?.title && (
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#2D3D5C', marginBottom: 4 }}>
              {analysis.chart.title}
            </div>
          )}
          {!analysis.svg && isSlope && (analysis.chart?.bars?.length ?? 0) > 0 && (
            <div style={{ fontSize: 11, color: '#3A4A6A', marginBottom: 18 }}>
              Each line runs last week → this week, rebased so last week = 100. Steeper = bigger move.
            </div>
          )}
          {/* The agent draws a bespoke chart per week (sanitized server-side);
              falls back to a structured renderer if the SVG is unusable. */}
          {analysis.svg ? (
            <div style={{ width: '100%', maxWidth: 640, margin: '4px auto' }}
              dangerouslySetInnerHTML={{ __html: analysis.svg }} />
          ) : (
            <AnalystChartRender chart={analysis.chart} />
          )}
          {analysis.web_context && analysis.web_context.length > 0 && (
            <div style={{ marginTop: 22 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#7C5CFC', marginBottom: 8 }}>
                What was happening then{analysis.real_date ? ` · ${new Date(analysis.real_date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}` : ''}
              </div>
              {analysis.web_context.map((c, i) => (
                <p key={i} style={{ margin: '0 0 8px', fontSize: 13, color: '#8B9CC8', lineHeight: 1.5 }}>
                  {c.note}
                  {c.source && <span style={{ color: '#4A5A7A', fontSize: 11 }}> — {c.source}</span>}
                </p>
              ))}
            </div>
          )}
          {analysis.seasonal && (
            <div style={{ marginTop: 22, display: 'flex', gap: 9, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#7C5CFC', whiteSpace: 'nowrap', marginTop: 2 }}>Seasonal read</span>
              <p style={{ margin: 0, fontSize: 13, color: '#8B9CC8', lineHeight: 1.55 }}>{analysis.seasonal}</p>
            </div>
          )}
          {analysis.takeaway && (
            <div style={{ marginTop: 20, padding: '16px 18px', borderRadius: 10, background: 'rgba(91,140,255,0.07)', border: '1px solid rgba(91,140,255,0.14)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#7AABFF', marginBottom: 6 }}>What to do</div>
              <p style={{ margin: 0, fontSize: 14, color: '#C8D4EE', lineHeight: 1.6 }}>{analysis.takeaway}</p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

function OpportunitiesView() {
  return (
    <>
      <HeroCard />
      <section style={{ paddingBottom: 48 }}>
        <SectionLabel>Active Opportunities · Demo</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {OPPS.map((o, i) => <OppRow key={o.id} opp={o} rank={i + 1} />)}
        </div>
      </section>
    </>
  )
}

function SettingsView() {
  return (
    <section style={{ paddingBottom: 48 }}>
      <SectionLabel>Settings</SectionLabel>
      <div style={{ ...panelStyle, color: '#4A5A7A', fontSize: 13, lineHeight: 1.6 }}>
        Account and workspace settings will live here. The report runs automatically every Monday morning — see the schedule in the sidebar.
      </div>
    </section>
  )
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase',
      color: '#2D3D5C', marginBottom: 14,
    }}>
      {children}
    </div>
  )
}

// ─── Hero Opportunity Card ────────────────────────────────────────────────────

function HeroCard() {
  return (
    <div style={{
      borderRadius: 16,
      background: '#0F1829',
      border: '1px solid rgba(91,140,255,0.14)',
      padding: '40px 44px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle ambient gradient */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 80% at 85% 50%, rgba(91,140,255,0.04) 0%, transparent 100%)',
      }} />
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, pointerEvents: 'none',
        width: '40%',
        background: 'linear-gradient(90deg, transparent, rgba(124,92,252,0.03))',
      }} />

      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr auto', gap: 56, alignItems: 'center' }}>

        {/* Left: Content */}
        <div>
          {/* Label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <span style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase',
              color: '#7C5CFC',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#7C5CFC' }} />
              AI Discovery · Demo concept
            </span>
          </div>

          {/* Headline */}
          <h2 style={{
            margin: '0 0 14px',
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: '-0.045em',
            lineHeight: 1.1,
            color: '#F0F4FF',
          }}>
            Healthcare AI demand is surging.<br />
            <span style={{ color: '#3A4A6A' }}>Competitors haven't noticed yet.</span>
          </h2>

          {/* Body */}
          <p style={{
            margin: '0 0 32px',
            fontSize: 14,
            color: '#4A5A7A',
            lineHeight: 1.65,
            maxWidth: 480,
            fontWeight: 400,
          }}>
            Search volume for "healthcare AI software" is up 37% over 30 days while
            competitor paid activity dropped 18%. The cost-per-click window is narrow —
            approximately 6 weeks before the market corrects.
          </p>

          {/* Evidence row */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 32, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { label: 'Search demand', val: '+37%', good: true },
              { label: 'Competitor spend', val: '−18%', good: true },
              { label: 'Cost per click', val: '−12%', good: true },
            ].map((e, i) => (
              <div key={e.label} style={{
                flex: 1,
                padding: '14px 18px',
                background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)',
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                <div style={{ fontSize: 11, color: '#2D3D5C', marginBottom: 5, fontWeight: 500 }}>{e.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#22C55E', fontFamily: '"JetBrains Mono", monospace', letterSpacing: '-0.02em' }}>
                  {e.val}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 500, letterSpacing: '-0.01em',
              background: '#5B8CFF', color: '#fff',
              boxShadow: '0 1px 2px rgba(0,0,0,0.3), 0 0 0 1px rgba(91,140,255,0.5)',
              transition: 'opacity 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.88'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
            >
              Explore Opportunity
              <Icon d={I.arrow} size={13} />
            </button>
            <button style={{
              padding: '10px 16px', borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'transparent', color: '#3A4A6A', cursor: 'pointer',
              fontSize: 13, fontWeight: 400,
              transition: 'color 0.15s, border-color 0.15s',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.color = '#8B9CC8'
                el.style.borderColor = 'rgba(255,255,255,0.14)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.color = '#3A4A6A'
                el.style.borderColor = 'rgba(255,255,255,0.08)'
              }}
            >
              Save for later
            </button>
          </div>
        </div>

        {/* Right: Value + Confidence */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 28 }}>
          {/* Estimated value */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#2D3D5C', marginBottom: 8 }}>
              Estimated Value
            </div>
            <div style={{
              fontSize: 52,
              fontWeight: 800,
              letterSpacing: '-0.05em',
              color: '#F0F4FF',
              lineHeight: 1,
              fontFamily: '"JetBrains Mono", monospace',
            }}>
              $250K
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.06)' }} />

          {/* Confidence */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#2D3D5C', marginBottom: 8 }}>
              AI Confidence
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, justifyContent: 'flex-end' }}>
              <span style={{
                fontSize: 44,
                fontWeight: 800,
                letterSpacing: '-0.05em',
                color: '#5B8CFF',
                lineHeight: 1,
                fontFamily: '"JetBrains Mono", monospace',
              }}>94</span>
              <span style={{ fontSize: 20, fontWeight: 500, color: '#3A4A6A', fontFamily: '"JetBrains Mono", monospace' }}>%</span>
            </div>
            {/* Confidence bar */}
            <div style={{ marginTop: 10, width: 120, height: 3, background: 'rgba(91,140,255,0.12)', borderRadius: 2, marginLeft: 'auto' }}>
              <div style={{ width: '94%', height: '100%', background: 'linear-gradient(90deg, #5B8CFF, #7C5CFC)', borderRadius: 2 }} />
            </div>
          </div>

          {/* Time to act */}
          <div style={{
            padding: '10px 16px', borderRadius: 8,
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.15)',
            textAlign: 'right',
          }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#92400E', marginBottom: 3 }}>
              Window closes in
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#F59E0B', fontFamily: '"JetBrains Mono", monospace', letterSpacing: '-0.03em' }}>
              ~6 weeks
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Metric Card ──────────────────────────────────────────────────────────────

function MetricCard({ source, metric, value, positive, unavailable, neutral }: {
  source: string; metric: string; value?: string; positive?: boolean; unavailable?: boolean; neutral?: boolean
}) {
  const valColor = unavailable ? '#2D3D5C' : neutral ? '#4A5A7A' : positive ? '#22C55E' : '#EF4444'

  return (
    <div
      style={{
        background: '#0F1829',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12,
        padding: '20px 20px',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'}
    >
      {/* Source */}
      <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#2D3D5C', marginBottom: 12 }}>
        {source}
      </div>

      {/* Value */}
      <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.04em', color: valColor, fontFamily: '"JetBrains Mono", monospace', lineHeight: 1, marginBottom: 8 }}>
        {unavailable ? '—' : value}
      </div>

      {/* Metric label + trend icon */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: '#2D3D5C', fontWeight: 400 }}>{metric}</span>
        {!unavailable && !neutral && (
          <span style={{ color: valColor, opacity: 0.7 }}>
            <Icon d={positive ? I.arrowUp : I.arrowDown} size={13} />
          </span>
        )}
        {unavailable && (
          <span style={{ fontSize: 10, fontWeight: 500, color: '#2D3D5C', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, padding: '2px 7px' }}>
            Offline
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Opportunity rows ─────────────────────────────────────────────────────────

const OPPS = [
  { id: 1, title: 'Healthcare AI Market Growth', category: 'Market Expansion', value: '$250,000', confidence: 94, tag: 'Hot', tagColor: '#5B8CFF' },
  { id: 2, title: 'B2B SaaS Keyword Gap — EMEA', category: 'SEO', value: '$120,000', confidence: 81, tag: null, tagColor: '' },
  { id: 3, title: 'Retargeting Audience Expansion', category: 'Paid Media', value: '$78,000', confidence: 76, tag: null, tagColor: '' },
  { id: 4, title: 'Email Re-engagement Sequence', category: 'Lifecycle', value: '$42,000', confidence: 68, tag: 'Quick', tagColor: '#22C55E' },
]

function OppRow({ opp, rank }: { opp: typeof OPPS[0]; rank: number }) {
  const [hovered, setHovered] = useState(false)
  const confColor = opp.confidence >= 90 ? '#22C55E' : opp.confidence >= 75 ? '#5B8CFF' : '#F59E0B'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '28px 1fr auto auto auto',
        alignItems: 'center',
        gap: 20,
        padding: '15px 20px',
        borderRadius: 10,
        cursor: 'pointer',
        background: hovered ? 'rgba(255,255,255,0.025)' : 'transparent',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.07)' : 'transparent'}`,
        transition: 'all 0.12s',
      }}
    >
      {/* Rank */}
      <span style={{ fontSize: 12, fontWeight: 500, color: '#2D3D5C', fontFamily: '"JetBrains Mono", monospace', textAlign: 'center' }}>
        {rank}
      </span>

      {/* Title + category */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#C8D4EE', letterSpacing: '-0.01em' }}>
            {opp.title}
          </span>
          {opp.tag && (
            <span style={{ fontSize: 10, fontWeight: 600, color: opp.tagColor, background: `${opp.tagColor}14`, border: `1px solid ${opp.tagColor}28`, borderRadius: 4, padding: '1px 6px', letterSpacing: '0.04em' }}>
              {opp.tag}
            </span>
          )}
        </div>
        <span style={{ fontSize: 12, color: '#2D3D5C' }}>{opp.category}</span>
      </div>

      {/* Confidence */}
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 11, color: '#2D3D5C', marginBottom: 2 }}>Confidence</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: confColor, fontFamily: '"JetBrains Mono", monospace' }}>
          {opp.confidence}%
        </div>
      </div>

      {/* Value */}
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 11, color: '#2D3D5C', marginBottom: 2 }}>Est. Value</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#E2E8F8', fontFamily: '"JetBrains Mono", monospace', letterSpacing: '-0.02em' }}>
          {opp.value}
        </div>
      </div>

      {/* Arrow */}
      <div style={{ color: hovered ? '#5B8CFF' : '#1A2540', transition: 'color 0.12s' }}>
        <Icon d={I.arrow} size={15} />
      </div>
    </div>
  )
}
