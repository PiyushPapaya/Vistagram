'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { MobileNav } from '@/components/layout/mobile-nav'
import { MobileHeader } from '@/components/layout/mobile-header'
import { cn } from '@/lib/utils'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const narrow = pathname.startsWith('/reels') || pathname.startsWith('/direct')

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <MobileHeader />

      <main className={cn(
        'flex-1 min-w-0 overflow-x-hidden pb-[49px] md:pb-0 pt-[44px] md:pt-0 min-h-screen transition-[margin] duration-200',
        narrow ? 'md:ml-[72px]' : 'md:ml-[72px] xl:ml-[244px]'
      )}>
        {children}
      </main>

      <MobileNav />
    </div>
  )
}
