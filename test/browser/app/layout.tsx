import type { Metadata } from 'next'
import './globals.css'

export const metadata = {
  title: 'Browser',
} satisfies Metadata

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
