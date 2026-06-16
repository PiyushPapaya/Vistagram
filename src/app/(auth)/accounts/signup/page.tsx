'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  full_name: z.string().min(1, 'Enter your full name'),
  username: z
    .string()
    .min(3, 'At least 3 characters')
    .max(30)
    .regex(/^[a-zA-Z0-9._]+$/, 'Letters, numbers, underscores, periods only'),
  password: z.string().min(6, 'At least 6 characters'),
})

type FormData = z.infer<typeof schema>

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    setLoading(false)
    router.push('/')
  }

  const fields = [
    { name: 'email' as const, placeholder: 'Mobile number or email', type: 'email', autocomplete: 'email' },
    { name: 'full_name' as const, placeholder: 'Full name', type: 'text', autocomplete: 'name' },
    { name: 'username' as const, placeholder: 'Username', type: 'text', autocomplete: 'username' },
    { name: 'password' as const, placeholder: 'Password', type: 'password', autocomplete: 'new-password' },
  ]

  return (
    <div className="flex w-full max-w-[350px] flex-col gap-4">
      <div className="flex flex-col items-center gap-4 border border-border bg-background px-10 py-10">
        <div className="mb-2 flex flex-col items-center gap-1">
          <span className="ig-wordmark text-[35px] text-foreground">Instagram</span>
        </div>

        <p className="text-center text-base font-semibold text-muted-foreground leading-5">
          Sign up to see photos and videos from your friends.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-2">
          {fields.map(({ name, placeholder, type, autocomplete }) => (
            <div key={name}>
              <input
                {...register(name)}
                type={type}
                placeholder={placeholder}
                autoComplete={autocomplete}
                className="w-full rounded border border-border bg-[#fafafa] dark:bg-[#121212] px-2 py-2.5 text-[12px] outline-none focus:border-[#8e8e8e] transition-colors placeholder:text-muted-foreground"
              />
              {errors[name] && <p className="mt-1 text-xs text-destructive">{errors[name]?.message}</p>}
            </div>
          ))}

          <p className="text-center text-xs text-muted-foreground mt-1">
            People who use our service may have uploaded your contact information to Vistagram.
          </p>

          <p className="text-center text-xs text-muted-foreground">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="font-semibold text-foreground">Terms</Link>,{' '}
            <Link href="/privacy" className="font-semibold text-foreground">Privacy Policy</Link> and{' '}
            <Link href="/cookies" className="font-semibold text-foreground">Cookies Policy</Link>.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded bg-[#0095f6] py-[7px] text-sm font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Sign up'}
          </button>
        </form>
      </div>

      <div className="flex items-center justify-center border border-border bg-background py-4 text-sm">
        Have an account?&nbsp;
        <Link href="/accounts/login" className="font-semibold text-[#0095f6]">Log in</Link>
      </div>
    </div>
  )
}
