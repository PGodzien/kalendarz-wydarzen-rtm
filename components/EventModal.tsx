'use client'

import { useEffect } from 'react'
import type { SanityEvent } from '@/types/event'

const TYPE_LABELS: Record<string, string> = {
  film: 'Film', serial: 'Serial', gra: 'Gra', wydarzenie: 'Wydarzenie',
}

const TYPE_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  film:       { text: '#c4b5fd', bg: 'rgba(139,92,246,0.15)',  border: 'rgba(139,92,246,0.35)' },
  serial:     { text: '#93c5fd', bg: 'rgba(59,130,246,0.15)',  border: 'rgba(59,130,246,0.35)' },
  gra:        { text: '#fde68a', bg: 'rgba(234,179,8,0.12)',   border: 'rgba(234,179,8,0.35)' },
  wydarzenie: { text: '#fda4af', bg: 'rgba(244,63,94,0.15)',   border: 'rgba(244,63,94,0.35)' },
}

const POT_LABEL: Record<string, string> = {
  wysoka: 'Wysoki', srednia: 'Średni', 'srednia-niska': 'Niski',
}
const POT_COLOR: Record<string, string> = {
  wysoka: '#86efac', srednia: '#fde68a', 'srednia-niska': 'rgba(255,255,255,0.4)',
}

const LAYER_DESC: Record<number, string> = {
  1: 'Anchor license — masowy retail',
  2: 'Fandom-driven premium',
  3: 'High-upside / trigger-based',
}

interface Props { event: SanityEvent; onClose: () => void }

export function EventModal({ event, onClose }: Props) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const tc = TYPE_COLORS[event.type] ?? TYPE_COLORS.film
  const pot = event.recommendation

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(6px)',
      }}>
      <div style={{
        width: '100%', maxWidth: 560,
        background: '#13111f',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
        maxHeight: '90vh',
        display: 'flex', flexDirection: 'column',
      }}>

        {/* Header */}
        <div style={{
          padding: '24px 28px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Type badge */}
            <span style={{
              display: 'inline-block',
              fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: tc.text, background: tc.bg, border: `1px solid ${tc.border}`,
              padding: '3px 10px', borderRadius: 6, marginBottom: 12,
            }}>
              {TYPE_LABELS[event.type]} · W{event.layer}
            </span>
            <h2 style={{
              margin: 0, fontSize: 24, fontWeight: 900, color: '#fff',
              lineHeight: 1.2, letterSpacing: '-0.02em',
            }}>
              {event.title}
            </h2>
            {event.studio && (
              <p style={{ margin: '6px 0 0', fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.4)' }}>
                {event.studio}
              </p>
            )}
          </div>
          <button onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)',
              fontSize: 16, cursor: 'pointer', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>✕</button>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{ padding: '18px 28px', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
            <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)' }}>Buzz</p>
            <p style={{ margin: 0, fontSize: 36, fontWeight: 900, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{event.buzz}<span style={{ fontSize: 16, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>/10</span></p>
          </div>
          <div style={{ padding: '18px 28px' }}>
            <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)' }}>Potencjał licencyjny</p>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: POT_COLOR[pot] ?? '#fff' }}>
              {POT_LABEL[pot] ?? pot}
            </p>
          </div>
        </div>

        {/* Details */}
        <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto', flex: 1 }}>
          <Row label="Termin premiery" value={event.date} />
          {event.ip     && <Row label="IP / własność"      value={event.ip} />}
          {event.target && <Row label="Grupa docelowa"     value={event.target} />}
          <Row label="Warstwa licencyjna" value={LAYER_DESC[event.layer]} />

          {event.source && (
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.35)', width: 140, flexShrink: 0, paddingTop: 1, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Źródło</span>
              <a href={event.source} target="_blank" rel="noopener noreferrer"
                style={{
                  fontSize: 14, fontWeight: 600, color: '#a78bfa',
                  textDecoration: 'underline', textUnderlineOffset: 3,
                  wordBreak: 'break-all',
                }}>
                {event.source.replace(/^https?:\/\//, '').split('/')[0]}
              </a>
            </div>
          )}

          {event.notes && (
            <div style={{
              marginTop: 4, padding: '14px 16px', borderRadius: 10,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)' }}>Notatki</p>
              <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, fontWeight: 500 }}>{event.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.35)', width: 140, flexShrink: 0, paddingTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </span>
      <span style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>
        {value}
      </span>
    </div>
  )
}
