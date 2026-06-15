import { getEvents } from '@/lib/queries'
import { CalendarView } from '@/components/CalendarView'

export const revalidate = 60

export default async function HomePage() {
  const events = await getEvents()
  return <CalendarView events={events} />
}
