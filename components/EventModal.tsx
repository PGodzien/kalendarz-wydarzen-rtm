'use client'

import { useEffect } from 'react'
import type { SanityEvent } from '@/types/event'

const TYPE_LABELS: Record<string, string> = {
  film: 'Film', serial: 'Serial', gra: 'Gra', wydarzenie: 'Wydarzenie',
}

const POT_LABEL: Record<string, string> = {
  wysoka: 'Wysoki', srednia: 'Średni', 'srednia-niska': 'Niski',
}

const LAYER_DESC: Record<number, string> = {
  1: 'Anchor license — masowy retail',
  2: 'Fandom-driven premium',
  3: 'High-upside / trigger-based',
}

const POT_COLOR: Record<string, string> = {
  wysoka:        '#111110',
  srednia:       '#888',
  'srednia-niska': '#bbb',
}

interface Props { event: SanityEvent; onClose: () => void }

export function EventModal({ event, onClose }: Props) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const pot = event.recommendation

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(250,250,248,0.85)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-2xl bg-white border border-rule shadow-sm flex flex-col"
        style={{ maxHeight: '90vh' }}>

        {/* Header */}
        <div className="border-b border-rule px-7 py-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-ink-3 mb-2 font-light">
              {TYPE_LABELS[event.type]} · W{event.layer}
            </p>
            <h2 className="text-xl font-medium text-ink leading-snug tracking-tight">
              {event.title}
            </h2>
          </div>
          <button onClick={onClose}
            className="text-ink-3 hover:text-ink transition-colors text-sm leading-none mt-0.5 shrink-0"
            aria-label="Zamknij">✕
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 border-b border-rule">
          <div className="px-7 py-5 border-r border-rule">
            <p className="text-xs text-ink-3 mb-1.5 font-light">Buzz</p>
            <p className="font-mono text-3xl text-ink">{event.buzz}</p>
          </div>
          <div className="px-7 py-5">
            <p className="text-xs text-ink-3 mb-1.5 font-light">Potencjał licencyjny</p>
            <p className="text-base font-medium tracking-tight"
              style={{ color: POT_COLOR[pot] ?? '#bbb' }}>
              {POT_LABEL[pot] ?? pot}
            </p>
          </div>
        </div>

        {/* Buzz bar */}
        <div className="px-7 py-3 border-b border-rule flex items-center gap-4">
          <span className="text-xs text-ink-3 w-28 font-light shrink-0">Potencjał buzz</span>
          <div className="flex-1 h-px bg-rule">
            <div className="h-px bg-ink" style={{ width: `${event.buzz * 10}%` }} />
          </div>
          <span className="font-mono text-xs text-ink-2 w-6 text-right">{event.buzz}/10</span>
        </div>

        {/* Details */}
        <div className="px-7 py-5 overflow-y-auto space-y-3 flex-1">
          <Row label="Termin"          value={event.date} />
          {event.studio  && <Row label="Studio"          value={event.studio} />}
          {event.ip      && <Row label="IP"              value={event.ip} />}
          {event.target  && <Row label="Grupa docelowa"  value={event.target} />}
          <Row label="Warstwa licencyjna" value={LAYER_DESC[event.layer]} />
        </div>

        {event.notes && (
          <div className="border-t border-rule px-7 py-4">
            <p className="text-2xs text-ink-3 mb-1.5 font-light">Notatki</p>
            <p className="text-xs text-ink-2 leading-relaxed whitespace-pre-wrap font-light">
              {event.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <span className="text-xs text-ink-3 font-light shrink-0 w-36 pt-px">{label}</span>
      <span className="text-sm text-ink font-light leading-snug">{value}</span>
    </div>
  )
}
