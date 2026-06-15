'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { SanityEvent, EventType, Recommendation } from '@/types/event'
import { EventModal } from './EventModal'

const MONTH_NAMES = [
  'Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec',
  'Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień',
]
const DAY_NAMES = ['Pon','Wt','Śr','Czw','Pt','Sob','Nd']

const TYPE_OPTS: { label: string; value: EventType | 'all' }[] = [
  { label: 'Wszystko',   value: 'all' },
  { label: 'Film',       value: 'film' },
  { label: 'Serial',     value: 'serial' },
  { label: 'Gra',        value: 'gra' },
  { label: 'Wydarzenie', value: 'wydarzenie' },
]

const POT_OPTS: { label: string; value: Recommendation | 'all' }[] = [
  { label: 'Wszystkie', value: 'all' },
  { label: 'Wysoki',    value: 'wysoka' },
  { label: 'Średni',    value: 'srednia' },
]

const TYPE_COLORS: Record<string, { pill: string; text: string; glow: string; border: string; dot: string }> = {
  film:       { pill: 'rgba(139,92,246,0.22)',  text: '#c4b5fd', glow: '#7c3aed', border: 'rgba(139,92,246,0.4)',  dot: '#a78bfa' },
  serial:     { pill: 'rgba(59,130,246,0.22)',  text: '#93c5fd', glow: '#2563eb', border: 'rgba(59,130,246,0.4)',  dot: '#60a5fa' },
  gra:        { pill: 'rgba(234,179,8,0.2)',    text: '#fde68a', glow: '#ca8a04', border: 'rgba(234,179,8,0.4)',   dot: '#facc15' },
  wydarzenie: { pill: 'rgba(244,63,94,0.2)',    text: '#fda4af', glow: '#e11d48', border: 'rgba(244,63,94,0.4)',   dot: '#fb7185' },
}

function parseDate(s: string): Date | null {
  const m = s.match(/(\d{1,2})\.(\d{2})\.(\d{4})/)
  if (m) return new Date(+m[3], +m[2] - 1, +m[1])
  const m2 = s.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (m2) return new Date(+m2[1], +m2[2] - 1, +m2[3])
  return null
}

function getEventPos(e: SanityEvent) {
  const d = parseDate(e.date)
  if (d) return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() }
  return { year: 2027, month: (e.quarter - 1) * 3, day: 1 }
}

function buildGrid(year: number, month: number) {
  const first = new Date(year, month, 1).getDay()
  const days  = new Date(year, month + 1, 0).getDate()
  const offset = first === 0 ? 6 : first - 1
  const cells: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ]
  while (cells.length % 7) cells.push(null)
  const weeks: (number | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

// Popover rendered via portal so it escapes overflow:hidden
function DayPopover({
  events, anchorRect, onSelect, onClose,
}: {
  events: SanityEvent[]
  anchorRect: DOMRect
  onSelect: (e: SanityEvent) => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [onClose])

  const top = anchorRect.bottom + 4
  const left = anchorRect.left

  return createPortal(
    <div ref={ref} style={{
      position: 'fixed', top, left, zIndex: 300,
      background: '#1a1530', border: '1px solid rgba(167,139,250,0.35)',
      borderRadius: 10, padding: 6,
      display: 'flex', flexDirection: 'column', gap: 3,
      boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
      minWidth: 180, maxWidth: 240,
    }}>
      {events.map(ev => {
        const c = TYPE_COLORS[ev.type] ?? TYPE_COLORS.film
        return (
          <button key={ev._id} onClick={() => { onSelect(ev); onClose() }}
            style={{
              width: '100%', textAlign: 'left',
              borderRadius: 6, padding: '5px 8px',
              background: c.pill, border: `1px solid ${c.border}`,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
            <span style={{
              fontSize: 11, fontWeight: 800, color: c.text,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{ev.title}</span>
          </button>
        )
      })}
    </div>,
    document.body
  )
}

interface Props { events: SanityEvent[] }

export function CalendarView({ events }: Props) {
  const [month,      setMonth]  = useState(0)
  const [typeFilter, setType]   = useState<EventType | 'all'>('all')
  const [potFilter,  setPot]    = useState<Recommendation | 'all'>('all')
  const [search,     setSearch] = useState('')
  const [selected,   setSel]    = useState<SanityEvent | null>(null)
  const [popover, setPopover]   = useState<{ key: string; rect: DOMRect; events: SanityEvent[] } | null>(null)

  const filtered = useMemo(() => events.filter(e => {
    if (typeFilter !== 'all' && e.type !== typeFilter)          return false
    if (potFilter  !== 'all' && e.recommendation !== potFilter) return false
    if (e.buzz < 7)                                             return false
    if (search) {
      const q = search.toLowerCase()
      return e.title.toLowerCase().includes(q) || (e.studio ?? '').toLowerCase().includes(q)
    }
    return true
  }), [events, typeFilter, potFilter, search])

  const byDay = useMemo(() => {
    const map = new Map<string, SanityEvent[]>()
    for (const e of filtered) {
      const p = getEventPos(e)
      const k = `${p.year}-${p.month}-${p.day}`
      if (!map.has(k)) map.set(k, [])
      map.get(k)!.push(e)
    }
    return map
  }, [filtered])

  const grid = useMemo(() => buildGrid(2027, month), [month])
  const close = useCallback(() => setSel(null), [])

  const numWeeks = grid.length

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0a0a0f' }}>

      {/* ── LEFT SIDEBAR ──────────────────────────────────── */}
      <aside style={{
        width: 220, flexShrink: 0, display: 'flex', flexDirection: 'column',
        background: 'rgba(255,255,255,0.03)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        padding: '24px 18px',
        gap: 28, overflowY: 'auto',
      }}>
        {/* Logo */}
        <div>
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>
            Kalendarz Licencyjny
          </p>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: '#fff', lineHeight: 1.15, margin: 0 }}>
            RTM Events<br /><span style={{ color: '#a78bfa' }}>2027</span>
          </h1>
        </div>

        {/* Month navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => setMonth(m => Math.max(0, m - 1))} disabled={month === 0}
            style={{
              width: 28, height: 28, borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: 15, fontWeight: 900,
              cursor: month === 0 ? 'not-allowed' : 'pointer', opacity: month === 0 ? 0.3 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>‹</button>
          <span style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>{MONTH_NAMES[month]}</span>
          <button onClick={() => setMonth(m => Math.min(11, m + 1))} disabled={month === 11}
            style={{
              width: 28, height: 28, borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: 15, fontWeight: 900,
              cursor: month === 11 ? 'not-allowed' : 'pointer', opacity: month === 11 ? 0.3 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>›</button>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 10, padding: '10px 14px' }}>
            <p style={{ margin: '0 0 3px', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pozycji</p>
            <p style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#fff' }}>{filtered.length}</p>
          </div>
          <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 10, padding: '10px 14px' }}>
            <p style={{ margin: '0 0 3px', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Wysoki potencjał</p>
            <p style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#86efac' }}>{filtered.filter(e => e.recommendation === 'wysoka').length}</p>
          </div>
        </div>

        {/* Search */}
        <input type="text" placeholder="Szukaj…" value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '8px 11px', borderRadius: 9, boxSizing: 'border-box',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff', fontSize: 13, fontWeight: 600, outline: 'none',
          }} />

        {/* Type filter */}
        <div>
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>Typ</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {TYPE_OPTS.map(o => (
              <SideBtn key={o.value} label={o.label}
                active={typeFilter === o.value}
                dot={o.value !== 'all' ? TYPE_COLORS[o.value]?.dot : undefined}
                onClick={() => setType(o.value as EventType | 'all')} />
            ))}
          </div>
        </div>

        {/* Potential filter */}
        <div>
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>Potencjał</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {POT_OPTS.map(o => (
              <SideBtn key={o.value} label={o.label}
                active={potFilter === o.value}
                onClick={() => setPot(o.value as Recommendation | 'all')} />
            ))}
          </div>
        </div>
      </aside>

      {/* ── CALENDAR ──────────────────────────────────────── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '16px' }}>

        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5, marginBottom: 5 }}>
          {DAY_NAMES.map((d, i) => (
            <div key={d} style={{
              textAlign: 'center', padding: '4px 0',
              fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase',
              color: i >= 5 ? 'rgba(167,139,250,0.6)' : 'rgba(255,255,255,0.22)',
            }}>{d}</div>
          ))}
        </div>

        {/* Calendar grid — equal rows via gridTemplateRows */}
        <div style={{
          flex: 1, minHeight: 0,
          display: 'grid',
          gridTemplateRows: `repeat(${numWeeks}, 1fr)`,
          gap: 5,
        }}>
          {grid.map((week, wi) => (
            <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5, minHeight: 0 }}>
              {week.map((day, di) => {
                const dayKey = `2027-${month}-${day}`
                const dayEvs = day ? (byDay.get(dayKey) ?? []) : []
                const isWeekend = di >= 5
                const MAX_VISIBLE = 2
                const visible = dayEvs.slice(0, MAX_VISIBLE)
                const overflow = dayEvs.length - MAX_VISIBLE
                const isOpen = popover?.key === dayKey

                return (
                  <div key={di} className={day ? 'day-tile' : ''} style={day ? {
                    borderRadius: 10,
                    background: dayEvs.length > 0
                      ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.02)',
                    border: dayEvs.length > 0
                      ? '1px solid rgba(255,255,255,0.09)' : '1px solid rgba(255,255,255,0.04)',
                    padding: '7px 7px 5px',
                    display: 'flex', flexDirection: 'column', gap: 3,
                    overflow: 'hidden', minHeight: 0,
                  } : {
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid rgba(255,255,255,0.02)',
                    minHeight: 0,
                  }}>
                    {day && (
                      <>
                        <span style={{
                          fontSize: 11, fontWeight: 900, lineHeight: 1,
                          color: isWeekend ? 'rgba(167,139,250,0.65)' : 'rgba(255,255,255,0.38)',
                          marginBottom: 2, flexShrink: 0,
                        }}>{day}</span>

                        {visible.map(ev => {
                          const c = TYPE_COLORS[ev.type] ?? TYPE_COLORS.film
                          return (
                            <button key={ev._id} onClick={() => setSel(ev)}
                              style={{
                                flexShrink: 0,
                                width: '100%', textAlign: 'left',
                                borderRadius: 6, padding: '3px 6px',
                                background: c.pill, border: `1px solid ${c.border}`,
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: 4,
                                overflow: 'hidden',
                              }}>
                              <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
                              <span style={{
                                fontSize: 10, fontWeight: 800, color: c.text,
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                display: 'block', flex: 1,
                              }}>{ev.title}</span>
                            </button>
                          )
                        })}

                        {overflow > 0 && (
                          <button
                            onClick={e => {
                              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                              if (isOpen) {
                                setPopover(null)
                              } else {
                                setPopover({ key: dayKey, rect, events: dayEvs.slice(MAX_VISIBLE) })
                              }
                            }}
                            style={{
                              flexShrink: 0,
                              width: '100%', textAlign: 'center',
                              borderRadius: 6, padding: '2px 4px',
                              background: isOpen ? 'rgba(167,139,250,0.25)' : 'rgba(167,139,250,0.1)',
                              border: '1px solid rgba(167,139,250,0.3)',
                              cursor: 'pointer', fontSize: 10, fontWeight: 800,
                              color: '#c4b5fd',
                            }}>
                            +{overflow} więcej
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </main>

      {/* Popover portal */}
      {popover && (
        <DayPopover
          events={popover.events}
          anchorRect={popover.rect}
          onSelect={e => setSel(e)}
          onClose={() => setPopover(null)}
        />
      )}

      {selected && <EventModal event={selected} onClose={close} />}
    </div>
  )
}

function SideBtn({ label, active, onClick, dot }: { label: string; active: boolean; onClick: () => void; dot?: string }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left', padding: '7px 10px', borderRadius: 7,
      border: active ? '1px solid rgba(167,139,250,0.4)' : '1px solid transparent',
      background: active ? 'rgba(167,139,250,0.15)' : 'transparent',
      color: active ? '#e9d5ff' : 'rgba(255,255,255,0.45)',
      fontSize: 13, fontWeight: 700, cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flexShrink: 0 }} />}
      {label}
    </button>
  )
}
