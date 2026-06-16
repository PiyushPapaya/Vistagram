'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'
import { getCurrentUser } from '@/lib/mock-data'
import { SearchPanel } from '@/components/shared/search-panel'
import { CreateModal } from '@/components/create/create-modal'
import {
  IgHome, IgSearch, IgExplore, IgReels, IgMessages,
  IgNotifications, IgCreate, IgMore,
} from '@/components/shared/ig-icons'

// ─── Sidebar icons for "More" menu ────────────────────────────────────────────
function IconSettings({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>
    </svg>
  )
}

function IconActivity({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  )
}

function IconBookmark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="19 21 12 16 5 21 5 3 19 3 19 21"/>
    </svg>
  )
}

function IconSun({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}

function IconMoon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

function IconLogout({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  )
}

// ─── Sidebar camera / IG logo (narrow mode) ───────────────────────────────────
function IgCameraIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-foreground" aria-hidden>
      <path d="M12 3c-2.444.01-2.778.044-3.741.088-.964.045-1.62.196-2.196.418A4.43 4.43 0 0 0 4.465 4.46c-.39.39-.706.845-.955 1.597C3.29 6.633 3.138 7.29 3.094 8.253 3.05 9.215 3.015 9.551 3 12c.01 2.444.044 2.778.088 3.741.046.963.196 1.62.418 2.196.232.742.565 1.23.955 1.597.39.39.845.707 1.598.955.576.222 1.233.373 2.196.418.963.045 1.297.059 3.741.05 2.444-.01 2.778-.044 3.741-.088.963-.045 1.62-.196 2.196-.418a4.43 4.43 0 0 0 1.598-.955 4.43 4.43 0 0 0 .955-1.597c.222-.576.372-1.234.418-2.196.044-.963.059-1.297.05-3.741-.01-2.444-.044-2.778-.088-3.741-.046-.963-.196-1.62-.418-2.196a4.43 4.43 0 0 0-.955-1.597 4.43 4.43 0 0 0-1.598-.955c-.576-.222-1.233-.373-2.196-.418C14.778 3.05 14.444 3.015 12 3zm0 1.622c2.403 0 2.688.009 3.64.052.877.04 1.354.187 1.672.31.42.163.72.358 1.036.673.315.315.51.615.673 1.035.123.317.27.795.31 1.671.043.953.052 1.238.052 3.64 0 2.403-.009 2.688-.052 3.64-.04.877-.187 1.355-.31 1.672a2.788 2.788 0 0 1-.673 1.035 2.788 2.788 0 0 1-1.036.673c-.317.124-.795.27-1.671.31-.953.043-1.238.052-3.64.052-2.403 0-2.688-.009-3.64-.052-.877-.04-1.355-.186-1.672-.31a2.788 2.788 0 0 1-1.035-.673 2.788 2.788 0 0 1-.673-1.035c-.124-.317-.27-.795-.31-1.671-.043-.953-.052-1.238-.052-3.64 0-2.403.009-2.688.052-3.64.04-.877.186-1.355.31-1.672.163-.42.358-.72.673-1.035a2.788 2.788 0 0 1 1.035-.673c.317-.123.795-.27 1.672-.31.952-.043 1.237-.052 3.64-.052zM12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7zm0 8.243a3.243 3.243 0 1 1 0-6.486 3.243 3.243 0 0 1 0 6.486zm5.338-9.87a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z"/>
    </svg>
  )
}

// ─── Main Sidebar ──────────────────────────────────────────────────────────────
export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [moreOpen, setMoreOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)
  const { setSearchOpen, searchOpen, setCreateOpen, createOpen, unreadNotificationsCount } = useStore()
  const user = getCurrentUser()

  useEffect(() => { setMounted(true) }, [])

  // Close More menu on outside click
  useEffect(() => {
    if (!moreOpen) return
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [moreOpen])

  const narrow = pathname.startsWith('/reels') || pathname.startsWith('/direct')
  const unreadCount = mounted ? unreadNotificationsCount() : 0

  const iconSize = 24

  // ── Nav item component ──────────────────────────────────────────────────────
  function NavItem({
    href, label, renderIcon, onClick, badge, active, danger,
  }: {
    href?: string
    label: string
    renderIcon: (active: boolean) => React.ReactNode
    onClick?: () => void
    badge?: number
    active?: boolean
    danger?: boolean
  }) {
    const isActive = active ?? (href
      ? (href === '/' ? pathname === '/' : pathname.startsWith(href))
      : false)

    const inner = (
      <span className={cn(
        // 48px tall item, smooth hover. Icons-only below xl (tablet); full at xl+.
        'flex items-center gap-4 rounded-xl h-12 text-[16px] leading-5 w-full',
        'transition-colors duration-100 hover:bg-foreground/[0.07] cursor-pointer select-none',
        danger && 'text-destructive',
        narrow
          ? 'justify-center px-0'
          : 'justify-center px-0 xl:justify-start xl:px-3',
        isActive && 'xl:font-bold',
      )}>
        <span className="relative shrink-0 flex items-center justify-center">
          {renderIcon(isActive)}
          {!!badge && badge > 0 && (
            <span className="absolute -top-[5px] -right-[7px] flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#ed4956] px-[3px] text-[10px] font-extrabold text-white leading-none tabular-nums">
              {badge > 99 ? '99+' : badge}
            </span>
          )}
        </span>
        {!narrow && (
          <span className={cn('hidden xl:inline truncate', isActive ? 'font-bold' : 'font-normal')}>
            {label}
          </span>
        )}
      </span>
    )

    if (href) return <Link href={href} className="block">{inner}</Link>
    return (
      <button onClick={onClick} className="block w-full text-left" aria-label={label}>
        {inner}
      </button>
    )
  }

  return (
    <>
      <nav
        className={cn(
          'fixed left-0 top-0 z-40 flex h-full flex-col border-r border-border/60 bg-background',
          'transition-[width,padding] duration-200 ease-in-out',
          narrow
            ? 'w-[73px] px-[11px] py-3'
            : 'w-[73px] px-[11px] py-3 xl:w-[245px] xl:px-3',
        )}
        aria-label="Primary navigation"
      >
        {/* ── Logo / Wordmark ── */}
        <Link
          href="/"
          aria-label="Instagram"
          className={cn(
            'flex items-center mb-5 rounded-xl hover:bg-foreground/[0.07] transition-colors duration-100',
            narrow
              ? 'h-12 w-12 justify-center mx-auto'
              : 'h-12 w-12 justify-center mx-auto xl:h-14 xl:w-auto xl:justify-start xl:px-3'
          )}
        >
          {narrow ? (
            <IgCameraIcon />
          ) : (
            <>
              <span className="xl:hidden"><IgCameraIcon /></span>
              <span className="hidden xl:inline ig-wordmark text-[28px] text-foreground select-none">Instagram</span>
            </>
          )}
        </Link>

        {/* ── Nav items ── */}
        <div className="flex flex-col flex-1">
          <NavItem
            href="/"
            label="Home"
            renderIcon={active => <IgHome filled={active} size={iconSize} />}
          />
          <NavItem
            label="Search"
            renderIcon={active => <IgSearch filled={active || searchOpen} size={iconSize} />}
            onClick={() => setSearchOpen(!searchOpen)}
            active={searchOpen}
          />
          <NavItem
            href="/explore"
            label="Explore"
            renderIcon={active => <IgExplore filled={active} size={iconSize} />}
          />
          <NavItem
            href="/reels"
            label="Reels"
            renderIcon={active => <IgReels filled={active} size={iconSize} />}
          />
          <NavItem
            href="/direct/inbox"
            label="Messages"
            renderIcon={active => <IgMessages filled={active} size={iconSize} />}
          />
          <NavItem
            href="/notifications"
            label="Notifications"
            renderIcon={active => <IgNotifications filled={active} size={iconSize} />}
            badge={unreadCount > 0 ? unreadCount : undefined}
          />
          <NavItem
            label="Create"
            renderIcon={() => <IgCreate size={iconSize} />}
            onClick={() => setCreateOpen(true)}
          />
          <NavItem
            href={`/${user.username}`}
            label="Profile"
            renderIcon={active => (
              <span className={cn(
                'flex h-[24px] w-[24px] overflow-hidden rounded-full shrink-0 flex-none',
                active
                  ? 'ring-[2px] ring-foreground ring-offset-[2px] ring-offset-background'
                  : 'border border-foreground/20',
              )}>
                <img src={user.avatar_url} alt={user.username} className="h-full w-full object-cover" />
              </span>
            )}
          />
        </div>

        {/* ── More (bottom) ── */}
        <div className="relative" ref={moreRef}>
          <NavItem
            label="More"
            renderIcon={() => <IgMore size={iconSize} />}
            onClick={() => setMoreOpen(o => !o)}
            active={moreOpen}
          />

          {/* More popover */}
          {moreOpen && (
            <div className="absolute bottom-[calc(100%+8px)] left-0 w-[270px] rounded-2xl border border-border bg-popover shadow-[0_4px_60px_rgba(0,0,0,0.12)] overflow-hidden z-50">
              {/* Settings */}
              <MoreLink href="/accounts/settings" icon={<IconSettings />} label="Settings" />
              <MoreLink href="/activity" icon={<IconActivity />} label="Your activity" />
              <MoreLink href="/saved" icon={<IconBookmark />} label="Saved" />

              {/* Appearance toggle */}
              <button
                onClick={() => {
                  setTheme(theme === 'dark' ? 'light' : 'dark')
                  setMoreOpen(false)
                }}
                className="flex w-full items-center gap-3 px-4 py-[13px] hover:bg-foreground/[0.06] text-[14px] transition-colors"
              >
                {(mounted && theme === 'dark') ? <IconSun /> : <IconMoon />}
                <span>Switch appearance</span>
                <div className={cn(
                  'ml-auto w-10 h-5 rounded-full relative transition-colors duration-200 flex-shrink-0',
                  (mounted && theme === 'dark') ? 'bg-foreground' : 'bg-foreground/25',
                )}>
                  <div className={cn(
                    'absolute top-0.5 h-4 w-4 rounded-full bg-background shadow transition-transform duration-200',
                    (mounted && theme === 'dark') ? 'translate-x-5' : 'translate-x-0.5',
                  )} />
                </div>
              </button>

              <div className="h-px bg-border mx-0 my-1" />

              {/* Threads */}
              <div className="flex items-center gap-3 px-4 py-[13px] hover:bg-foreground/[0.06] transition-colors cursor-pointer">
                <svg viewBox="0 0 192 192" className="h-[18px] w-[18px] shrink-0 fill-foreground">
                  <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0135 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"/>
                </svg>
                <span className="text-[14px]">Threads</span>
              </div>

              <div className="h-px bg-border mx-0 my-1" />

              {/* Log out */}
              <button
                onClick={() => { setMoreOpen(false); router.push('/accounts/login') }}
                className="flex w-full items-center gap-3 px-4 py-[13px] hover:bg-foreground/[0.06] text-[14px] transition-colors text-left"
              >
                <IconLogout />
                <span>Log out</span>
              </button>

              {/* Current account indicator */}
              <div className="h-px bg-border mx-0 my-1" />
              <div className="flex items-center gap-3 px-4 py-[13px]">
                <img src={user.avatar_url} alt={user.username} className="h-7 w-7 rounded-full object-cover shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[13px] font-semibold truncate">{user.username}</span>
                  <span className="text-[12px] text-muted-foreground truncate">{user.username}</span>
                </div>
                <svg className="ml-auto h-4 w-4 text-[#0095f6] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                </svg>
              </div>
            </div>
          )}
        </div>
      </nav>

      <SearchPanel />
      {createOpen && <CreateModal />}
    </>
  )
}

// ── More menu link item ────────────────────────────────────────────────────────
function MoreLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-[13px] hover:bg-foreground/[0.06] text-[14px] transition-colors"
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}
