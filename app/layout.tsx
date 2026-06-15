import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RTM Events Calendar 2027',
  description: 'Zestawienie licencyjne z największym potencjałem buzz na 2027',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  )
}
