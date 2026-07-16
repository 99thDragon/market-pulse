import { useState } from 'react'

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
  home:        'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z',
  zap:         'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  brain:       'M12 2c-1.5 0-2.9.6-3.9 1.5A5 5 0 002 8.5C2 11 3.4 13 5.5 14c.3 2.4 2.3 4 4.5 4h4c2.2 0 4.2-1.6 4.5-4 2.1-1 3.5-3 3.5-5.5a5 5 0 00-6.1-5A4 4 0 0012 2z',
  trending:    'M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6',
  pie:         'M21.21 15.89A10 10 0 118 2.83 M22 12A10 10 0 0012 2v10z',
  users:       'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75',
  file:        'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  bell:        'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0',
  plug:        'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  settings:    'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z',
  arrow:       'M5 12h14 M12 5l7 7-7 7',
  arrowUp:     'M18 15l-6-6-6 6',
  arrowDown:   'M6 9l6 6 6-6',
  refresh:     'M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0114.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0020.49 15',
  sparkle:     'M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z',
  warning:     'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01',
  check:       'M20 6L9 17l-5-5',
  competitors: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
}

// ─── Nav structure ────────────────────────────────────────────────────────────

const NAV = [
  { id: 'overview',      label: 'Overview',             icon: 'home' },
  { id: 'opportunities', label: 'Opportunities',         icon: 'zap',         badge: 4 },
  { id: 'analyst',       label: 'AI Analyst',            icon: 'brain' },
  { id: 'signals',       label: 'Market Signals',        icon: 'trending' },
  { id: 'campaign',      label: 'Campaign Intel',        icon: 'pie' },
  { id: 'competitors',   label: 'Competitors',           icon: 'competitors' },
  { id: 'reports',       label: 'Reports',               icon: 'file' },
  { id: 'alerts',        label: 'Alerts',                icon: 'bell',        badge: 2 },
  { id: 'integrations',  label: 'Integrations',          icon: 'plug' },
  { id: 'settings',      label: 'Settings',              icon: 'settings' },
]

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [active, setActive] = useState('overview')
  const [running, setRunning] = useState(false)

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
          {NAV.map((item, idx) => {
            const isActive = active === item.id
            const isSeparated = idx === 7
            return (
              <div key={item.id}>
                {isSeparated && (
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
                  {item.badge !== undefined && (
                    <span style={{
                      fontSize: 10, fontWeight: 600,
                      background: isActive ? 'rgba(91,140,255,0.25)' : 'rgba(255,255,255,0.07)',
                      color: isActive ? '#7AABFF' : '#3A4A6A',
                      borderRadius: 5, padding: '1px 5px',
                      fontFamily: '"JetBrains Mono", monospace',
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              </div>
            )
          })}
        </nav>

        {/* User */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 9,
          padding: '10px', borderRadius: 8,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.055)',
          cursor: 'pointer',
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
              Good morning, Sarah
            </h1>
            <p style={{ margin: '5px 0 0', fontSize: 13, color: '#3A4A6A', fontWeight: 400 }}>
              Your AI found{' '}
              <span style={{ color: '#5B8CFF' }}>4 opportunities</span>
              {' '}today · last run 12 min ago
            </p>
          </div>
          <button
            onClick={() => { setRunning(true); setTimeout(() => setRunning(false), 2000) }}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 500, letterSpacing: '-0.01em',
              background: 'rgba(91,140,255,0.12)',
              color: '#7AABFF',
              border: '1px solid rgba(91,140,255,0.2)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(91,140,255,0.18)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(91,140,255,0.12)' }}
          >
            <Icon d={running ? I.refresh : I.sparkle} size={13} />
            {running ? 'Analyzing…' : 'Run Analysis'}
          </button>
        </header>

        {/* Content */}
        <div style={{ padding: '40px 44px', display: 'flex', flexDirection: 'column', gap: 36, maxWidth: 1100 }}>

          {/* ── Hero Opportunity Card ─────────────────────────────────────── */}
          <HeroCard />

          {/* ── Weekly Intelligence ───────────────────────────────────────── */}
          <section>
            <SectionLabel>Weekly Intelligence</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <MetricCard source="Google Ads" metric="Click-Through Rate" value="+14%" positive />
              <MetricCard source="Meta Ads" metric="Conversions" value="-22%" positive={false} />
              <MetricCard source="Email" metric="Open Rate" value="-13%" positive={false} />
              <MetricCard source="CRM" metric="Pipeline Data" unavailable />
            </div>
          </section>

          {/* ── Opportunities ─────────────────────────────────────────────── */}
          <section style={{ paddingBottom: 48 }}>
            <SectionLabel>Active Opportunities</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {OPPS.map((o, i) => <OppRow key={o.id} opp={o} rank={i + 1} />)}
            </div>
          </section>

        </div>
      </div>
    </div>
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
              AI Discovery · New today
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

function MetricCard({ source, metric, value, positive, unavailable }: {
  source: string; metric: string; value?: string; positive?: boolean; unavailable?: boolean
}) {
  const valColor = unavailable ? '#2D3D5C' : positive ? '#22C55E' : '#EF4444'

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
        {!unavailable && (
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
  { id: 1, title: 'Healthcare AI Market Growth',      category: 'Market Expansion', value: '$250,000', confidence: 94, tag: 'Hot',    tagColor: '#5B8CFF' },
  { id: 2, title: 'B2B SaaS Keyword Gap — EMEA',      category: 'SEO',              value: '$120,000', confidence: 81, tag: null,      tagColor: '' },
  { id: 3, title: 'Retargeting Audience Expansion',   category: 'Paid Media',       value: '$78,000',  confidence: 76, tag: null,      tagColor: '' },
  { id: 4, title: 'Email Re-engagement Sequence',     category: 'Lifecycle',        value: '$42,000',  confidence: 68, tag: 'Quick',  tagColor: '#22C55E' },
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
