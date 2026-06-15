export type EventType = 'film' | 'serial' | 'gra' | 'wydarzenie'
export type Recommendation = 'wysoka' | 'srednia' | 'srednia-niska'
export type Certainty = 'wysoka' | 'srednia' | 'niska'
export type Layer = 1 | 2 | 3

export interface SanityEvent {
  _id: string
  _type: 'event'
  title: string
  type: EventType
  quarter: 1 | 2 | 3 | 4
  date: string
  studio?: string
  ip?: string
  buzz: number
  risk: number
  recommendation: Recommendation
  layer: Layer
  target?: string
  certainty?: Certainty
  notes?: string
  source?: string
}
