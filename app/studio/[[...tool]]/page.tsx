import nextDynamic from 'next/dynamic'

export { metadata, viewport } from 'next-sanity/studio'

export const dynamic = 'force-dynamic'

const StudioClient = nextDynamic(
  () => import('@/components/SanityStudio'),
  { ssr: false },
)

export default function StudioPage() {
  return <StudioClient />
}
