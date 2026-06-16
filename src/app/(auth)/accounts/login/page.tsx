'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useStore } from '@/lib/store'

const schema = z.object({
  email: z.string().min(1, 'Enter your username or email'),
  password: z.string().min(1, 'Enter your password'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit() {
    setError('')
    setLoading(true)
    // Mock auth — any credentials work
    await new Promise(r => setTimeout(r, 600))
    setLoading(false)
    router.push('/')
  }

  return (
    <div className="flex w-full max-w-[350px] flex-col gap-4">
      <div className="flex flex-col items-center gap-4 border border-border bg-background px-10 py-10">
        <div className="mb-2 flex flex-col items-center gap-1">
          <span className="ig-wordmark text-[35px] text-foreground">Instagram</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-2">
          <div>
            <input
              {...register('email')}
              type="text"
              placeholder="Phone number, username, or email"
              autoComplete="email"
              className="w-full rounded border border-border bg-[#fafafa] dark:bg-[#121212] px-2 py-2.5 text-[12px] outline-none focus:border-[#8e8e8e] transition-colors placeholder:text-muted-foreground"
            />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div>
            <input
              {...register('password')}
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              className="w-full rounded border border-border bg-[#fafafa] dark:bg-[#121212] px-2 py-2.5 text-[12px] outline-none focus:border-[#8e8e8e] transition-colors placeholder:text-muted-foreground"
            />
            {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
          </div>

          {error && <p className="text-xs text-destructive text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded bg-[#0095f6] py-[7px] text-sm font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <div className="flex w-full items-center gap-2">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[13px] font-semibold text-muted-foreground">OR</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Log in with Facebook */}
        <button className="flex items-center justify-center gap-2 text-[14px] font-semibold text-[#385185] hover:text-[#385185]/80 transition-opacity">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#385185" aria-hidden>
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Log in with Facebook
        </button>

        <Link href="/forgot-password" className="text-sm font-normal text-muted-foreground hover:underline">
          Forgot password?
        </Link>
      </div>

      <div className="flex items-center justify-center border border-border bg-background py-4 text-sm">
        Don&apos;t have an account?&nbsp;
        <Link href="/accounts/signup" className="font-semibold text-[#0095f6]">Sign up</Link>
      </div>

      <div className="flex flex-col items-center gap-3 mt-2">
        <p className="text-sm">Get the app.</p>
        <div className="flex gap-2">
          <a href="#" className="flex items-center gap-1.5 rounded-lg border border-[#262626] bg-black px-3 py-1.5 hover:bg-[#1a1a1a] transition-colors">
            <svg width="14" height="14" viewBox="0 0 814 1000" fill="white" aria-hidden>
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-155.5-127.4C46 790.1 0 663 0 541.8c0-207.5 133.4-317.5 264.4-317.5 63.1 0 116.5 42.4 156.7 42.4 38.7 0 101.7-44.9 171.3-44.9 27.8 0 108.2 2.6 150.6 98.2zm-252-204.7c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
            </svg>
            <div className="text-left">
              <p className="text-[9px] text-white/70 leading-none">Download on the</p>
              <p className="text-[12px] font-semibold text-white leading-tight">App Store</p>
            </div>
          </a>
          <a href="#" className="flex items-center gap-1.5 rounded-lg border border-[#262626] bg-black px-3 py-1.5 hover:bg-[#1a1a1a] transition-colors">
            <svg width="14" height="14" viewBox="0 0 512 512" fill="white" aria-hidden>
              <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l2.7 1.5 246.9-246.9v-5.6L47 0zm301.5 380.9l-82.1-82.1 60.1-60.1 82.1 82.1c11.2 11.2 11.2 29.3 0 40.4-11.2 11.2-29.3 11.2-40.4 0zm-357.7 107c2.6 1.5 5.3 2.1 8.1 2.1 8.2 0 16.1-4.1 20.9-11.2L355.4 256 20.1 24.1C15.3 17 7.4 12.9-.8 12.9c-2.8 0-5.5.6-8.1 2.1L0 487.9z"/>
            </svg>
            <div className="text-left">
              <p className="text-[9px] text-white/70 leading-none">Get it on</p>
              <p className="text-[12px] font-semibold text-white leading-tight">Google Play</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
