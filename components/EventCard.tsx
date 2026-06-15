'use client'

import type { SanityEvent } from '@/types/event'

const TYPE_LABELS: Record<string, string> = {
  film: 'Film',
  serial: 'Serial',
  gra: 'Gra',
  wydarzenie: 'Wydarzenie',
}

const REC_LABELS: Record<string, string> = {
  wysoka: 'Wysoka',
  srednia: 'Średnia/wysoka',
  'srednia-niska': 'Średnia',
}

const LAYER_LABELS: Record<number, string> = {
  1: 'W1',
  2: 'W2',
  3: 'W3',
}

interface Props {
  event: SanityEvent
  selected: boolean
  onClick: () => void
}

export function EventCard({ event, selected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 border transition-colors duration-100 rounded-sm ${
        selected
          ? 'border-ink bg-ink text-white'
          : 'border-surface-border bg-white hover:border-ink-muted'
      }`}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <span
          className={`text-2xs font-medium px-1.5 py-0.5 rounded-sm ${
            selected ? 'bg-white/20 text-white' : 'bg-surface-raised text-ink-muted'
          }`}
        >
          {TYPE_LABELS[event.type] ?? event.type}
        </span>
        <span
          className={`ml-auto text-2xs font-medium ${
            selected ? 'text-white/60' : 'text-ink-faint'
          }`}
        >
          {LAYER_LABELS[event.layer]}
        </span>
      </div>

      <p className={`text-sm font-medium leading-tight mb-1 ${selected ? 'text-white' : 'text-ink'}`}>
        {event.title}
      </p>

      <p className={`text-2xs mb-2.5 ${selected ? 'text-white/60' : 'text-ink-faint'}`}>
        {event.date}
      </p>

      <div className="flex items-center gap-2 mb-1">
        <span className={`text-2xs w-6 ${selected ? 'text-white/60' : 'text-ink-faint'}`}>
          Buzz
        </span>
        <div className={`flex-1 h-[3px] rounded-full ${selected ? 'bg-white/20' : 'bg-surface-border'}`}>
          <div
            className={`h-full rounded-full ${selected ? 'bg-white' : 'bg-ink'}`}
            style={{ width: `${event.buzz * 10}%` }}
          />
        </div>
        <span className={`text-2xs w-4 text-right font-medium ${selected ? 'text-white' : 'text-ink'}`}>
          {event.buzz}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className={`text-2xs w-6 ${selected ? 'text-white/60' : 'text-ink-faint'}`}>
          Risk
        </span>
        <div className={`flex-1 h-[3px] rounded-full ${selected ? 'bg-white/20' : 'bg-surface-border'}`}>
          <div
            className={`h-full rounded-full ${
              selected
                ? 'bg-white/70'
                : event.risk >= 7
                ? 'bg-ink-muted'
                : 'bg-surface-border'
            }`}
            style={{ width: `${event.risk * 10}%` }}
          />
        </div>
        <span className={`text-2xs w-4 text-right font-medium ${selected ? 'text-white/70' : 'text-ink-muted'}`}>
          {event.risk}
        </span>
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        <span
          className={`text-2xs font-medium ${
            selected
              ? 'text-white/70'
              : event.recommendation === 'wysoka'
              ? 'text-ink'
              : 'text-ink-muted'
          }`}
        >
          {REC_LABELS[event.recommendation] ?? event.recommendation}
        </span>
        {event.certainty === 'niska' && (
          <span className={`text-2xs ${selected ? 'text-white/50' : 'text-ink-faint'}`}>
            ⚠ niepewna data
          </span>
        )}
      </div>
    </button>
  )
}
