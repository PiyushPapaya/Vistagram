import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/providers/theme-provider'
import { QueryProvider } from '@/providers/query-provider'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Instagram',
  description: 'Instagram from Meta',
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Warm up the TLS/DNS handshake to the remote placeholder hosts so the
            few demo images that still use them paint sooner. Local media is
            served same-origin and needs no hint. */}
        <link rel="preconnect" href="https://picsum.photos" crossOrigin="" />
        <link rel="preconnect" href="https://i.pravatar.cc" crossOrigin="" />
        <link rel="dns-prefetch" href="https://picsum.photos" />
      </head>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster
              position="bottom-center"
              toastOptions={{
                classNames: {
                  toast: 'bg-ig-surface border-border text-foreground',
                },
              }}
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
