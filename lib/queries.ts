import { groq } from 'next-sanity'
import { client } from './sanity'
import type { SanityEvent } from '@/types/event'

export const eventsQuery = groq`
  *[_type == "event"] | order(quarter asc, buzz desc) {
    _id,
    title,
    type,
    quarter,
    date,
    studio,
    ip,
    buzz,
    risk,
    recommendation,
    layer,
    target,
    certainty,
    notes,
  }
`

export async function getEvents(): Promise<SanityEvent[]> {
  return client.fetch(eventsQuery)
}
