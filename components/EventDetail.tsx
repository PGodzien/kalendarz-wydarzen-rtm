import type { SanityEvent } from '@/types/event'

const TYPE_LABELS: Record<string, string> = {
  film: 'Film',
  serial: 'Serial',
  gra: 'Gra',
  wydarzenie: 'Wydarzenie',
}

const LAYER_DESC: Record<number, string> = {
  1: 'Anchor license — masowy retail',
  2: 'Fandom-driven premium play',
  3: 'High-upside / trigger-based',
}

const CERTAINTY_LABELS: Record<string, string> = {
  wysoka: 'Wysoka',
  srednia: 'Średnia',
  niska: 'Niska ⚠',
}

interface Props {
  event: SanityEvent
  onClose: () => void
}

export function EventDetail({ event, onClose }: Props) {
  return (
    <div className="border border-surface-border rounded-sm p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-2xs text-ink-faint mb-1">{TYPE_LABELS[event.type]}</p>
          <h2 className="text-base font-medium leading-tight">{event.title}</h2>
        </div>
        <button
          onClick={onClose}
          className="text-ink-faint hover:text-ink text-sm shrink-0 mt-0.5 transition-colors"
          aria-label="Zamknij"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <Stat label="Buzz" value={`${event.buzz}/10`} strong />
        <Stat label="Ryzyko" value={`${event.risk}/10`} />
        <Stat label="Warstwa" value={`W${event.layer}`} />
      </div>

      <div className="space-y-2.5 text-sm">
        <Row label="Termin" value={event.date} />
        {event.studio && <Row label="Studio" value={event.studio} />}
        {event.ip && <Row label="IP" value={event.ip} />}
        {event.target && <Row label="Grupa docelowa" value={event.target} />}
        {event.certainty && (
          <Row label="Pewność info" value={CERTAINTY_LABELS[event.certainty] ?? event.certainty} />
        )}
        <Row label="Warstwa licencyjna" value={LAYER_DESC[event.layer]} />
      </div>

      {event.notes && (
        <div className="mt-4 pt-4 border-t border-surface-border">
          <p className="text-2xs text-ink-faint uppercase tracking-wide mb-1.5">Notatki</p>
          <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-wrap">{event.notes}</p>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="bg-surface-raised rounded-sm p-2.5">
      <p className="text-2xs text-ink-faint mb-0.5">{label}</p>
      <p className={`text-sm ${strong ? 'font-medium text-ink' : 'text-ink-muted'}`}>{value}</p>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-ink-faint shrink-0 w-32">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  )
}
