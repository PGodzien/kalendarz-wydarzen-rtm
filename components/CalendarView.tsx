'use client'

import { useState, useMemo, useCallback } from 'react'
import type { SanityEvent, EventType, Recommendation } from '@/types/event'
import { EventModal } from './EventModal'

const QUARTERS = [
  { q: 1, label: 'Q1', months: [1, 2, 3] },
  { q: 2, label: 'Q2', months: [4, 5, 6] },
  { q: 3, label: 'Q3', months: [7, 8, 9] },
  { q: 4, label: 'Q4', months: [10, 11, 12] },
]

const MONTH_NAMES: Record<number, string> = {
  1: 'Styczeń', 2: 'Luty', 3: 'Marzec', 4: 'Kwiecień',
  5: 'Maj', 6: 'Czerwiec', 7: 'Lipiec', 8: 'Sierpień',
  9: 'Wrzesień', 10: 'Październik', 11: 'Listopad', 12: 'Grudzień',
}

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

const VISIBLE_LIMIT = 4

function extractMonth(date: string, quarter: number): number {
  const m = date.match(/\d{1,2}\.(\d{2})\.2027/)
  if (m) return parseInt(m[1])
  if (date.toLowerCase().includes('early')) return 1
  return (quarter - 1) * 3 + 1
}

const POT_BORDER: Record<string, string> = {
  wysoka:          '#111110',
  srednia:         '#aaa',
  'srednia-niska': '#ddd',
}

interface Props { events: SanityEvent[] }

export function CalendarView({ events }: Props) {
  const [search,     setSearch]   = useState('')
  const [typeFilter, setType]     = useState<EventType | 'all'>('all')
  const [potFilter,  setPot]      = useState<Recommendation | 'all'>('all')
  const [selected,   setSel]      = useState<SanityEvent | null>(null)
  const [expanded,   setExpanded] = useState<Set<number>>(new Set())

  const filtered = useMemo(() => events.filter(e => {
    if (typeFilter !== 'all' && e.type !== typeFilter)          return false
    if (potFilter  !== 'all' && e.recommendation !== potFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return e.title.toLowerCase().includes(q) || (e.studio ?? '').toLowerCase().includes(q)
    }
    return true
  }), [events, typeFilter, potFilter, search])

  const byMonth = useMemo(() => {
    const map = new Map<number, SanityEvent[]>()
    for (const e of filtered) {
      const m = extractMonth(e.date, e.quarter)
      if (!map.has(m)) map.set(m, [])
      map.get(m)!.push(e)
    }
    return map
  }, [filtered])

  const maxCount = useMemo(() =>
    Math.max(...Array.from(byMonth.values()).map(a => a.length), 1),
  [byMonth])

  const toggleExpand = useCallback((m: number) => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(m) ? next.delete(m) : next.add(m)
      return next
    })
  }, [])

  const close = useCallback(() => setSel(null), [])

  return (
    <div className="min-h-screen bg-paper flex flex-col">

      {/* Header */}
      <header className="border-b border-rule bg-white px-8 py-4 flex items-center justify-between gap-6">
        <div className="flex items-baseline gap-3">
          <span className="text-base font-medium text-ink tracking-tight">RTM Events Calendar</span>
          <span className="text-sm text-ink-3 font-light">2027</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-mono text-ink-2">
          <span>{filtered.length} pozycji</span>
          <span className="text-ink-3">·</span>
          <span>{filtered.filter(e => e.recommendation === 'wysoka').length} wysoki potencjał</span>
        </div>
      </header>

      {/* Filters */}
      <div className="border-b border-rule bg-white px-8 py-2.5 flex flex-wrap items-center gap-5">
        <input
          type="text"
          placeholder="Szukaj…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="text-xs text-ink placeholder:text-ink-3 border-b border-rule bg-transparent py-1 w-40 focus:outline-none focus:border-ink-2 font-sans"
        />
        <div className="flex items-center gap-0.5">
          {TYPE_OPTS.map(o => (
            <FilterBtn key={o.value} label={o.label}
              active={typeFilter === o.value}
              onClick={() => setType(o.value as EventType | 'all')} />
          ))}
        </div>
        <div className="w-px h-4 bg-rule" />
        <div className="flex items-center gap-0.5">
          <span className="text-sm text-ink-3 mr-1.5">Potencjał</span>
          {POT_OPTS.map(o => (
            <FilterBtn key={o.value} label={o.label}
              active={potFilter === o.value}
              onClick={() => setPot(o.value as Recommendation | 'all')} />
          ))}
        </div>
        <div className="ml-auto flex items-center gap-4 text-2xs text-ink-3">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-px bg-ink" />Wysoki
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-px bg-ink-3" />Średni
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-px bg-rule" />Niski
          </span>
        </div>
      </div>

      {/* Calendar — quarterly layout */}
      <main className="flex-1 p-6 space-y-px">
        {QUARTERS.map(({ q, label, months }) => (
          <div key={q} className="flex">

            {/* Q strip label */}
            <div className="w-9 shrink-0 flex items-stretch border border-r-0 border-rule bg-white">
              <div className="flex-1 flex items-center justify-center">
                <span
                  className="font-mono text-xs text-ink-3 tracking-widest select-none"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  {label}
                </span>
              </div>
            </div>

            {/* 3 month columns */}
            <div className="flex-1 grid grid-cols-3 border border-rule">
              {months.map((m, i) => {
                const items   = byMonth.get(m) ?? []
                const isExp   = expanded.has(m)
                const visible = isExp ? items : items.slice(0, VISIBLE_LIMIT)
                const hidden  = items.length - VISIBLE_LIMIT
                const density = items.length / maxCount

                return (
                  <div
                    key={m}
                    className="bg-white flex flex-col relative"
                    style={{ borderLeft: i > 0 ? '1px solid #e4e4e0' : undefined }}
                  >
                    {/* Density bar */}
                    <div className="h-0.5 bg-rule-2">
                      <div
                        className="h-0.5 bg-ink transition-all duration-300"
                        style={{ width: `${Math.round(density * 100)}%`, opacity: 0.25 + density * 0.6 }}
                      />
                    </div>

                    {/* Month header */}
                    <div className="px-4 pt-2.5 pb-2 flex items-baseline justify-between border-b border-rule-2">
                      <span className="text-sm font-medium text-ink tracking-tight">{MONTH_NAMES[m]}</span>
                      {items.length > 0 && (
                        <span className="font-mono text-xs text-ink-3">{items.length}</span>
                      )}
                    </div>

                    {/* Stack shadow hint — shows depth when there are hidden items */}
                    {items.length > VISIBLE_LIMIT && !isExp && (
                      <div className="absolute inset-x-2 pointer-events-none" style={{ top: 38 }}>
                        <div className="h-px bg-rule opacity-50 rounded-full" />
                        <div className="h-px bg-rule opacity-30 rounded-full mt-0.5 mx-1" />
                      </div>
                    )}

                    {/* Events */}
                    <div className="flex-1 py-1">
                      {items.length === 0 && (
                        <p className="px-4 py-3 text-sm text-ink-3 font-light">—</p>
                      )}
                      {visible.map(ev => (
                        <button
                          key={ev._id}
                          onClick={() => setSel(ev)}
                          className="w-full text-left flex items-center hover:bg-hover transition-colors group"
                        >
                          <span
                            className="shrink-0 w-0.5 self-stretch"
                            style={{ background: POT_BORDER[ev.recommendation] ?? '#ddd' }}
                          />
                          <span className="flex-1 flex items-center justify-between gap-2 px-3 py-2">
                            <span className="text-sm text-ink font-light leading-snug truncate">
                              {ev.title}
                            </span>
                            <span className="font-mono text-xs text-ink-2 shrink-0 tabular-nums">
                              {ev.buzz}
                            </span>
                          </span>
                        </button>
                      ))}

                      {items.length > VISIBLE_LIMIT && (
                        <button
                          onClick={() => toggleExpand(m)}
                          className="w-full text-left px-4 py-1.5 font-mono text-xs text-ink-3 hover:text-ink transition-colors"
                        >
                          {isExp ? '↑ zwiń' : `+ ${hidden} więcej`}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </main>

      {selected && <EventModal event={selected} onClose={close} />}
    </div>
  )
}

function FilterBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-sm px-3 py-1 rounded-sm transition-colors"
      style={active
        ? { background: '#111110', color: '#fff', fontWeight: 500 }
        : { color: '#888887' }
      }
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = '#111110' }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = '#888887' }}
    >
      {label}
    </button>
  )
}
