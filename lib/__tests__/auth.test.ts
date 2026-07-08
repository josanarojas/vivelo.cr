// lib/__tests__/auth.test.ts
import { describe, it, expect, vi } from 'vitest'
import { signInWithPassword, signOut } from '@/lib/auth'

describe('signInWithPassword', () => {
  it('returns no error on valid credentials', async () => {
    const supabase = {
      auth: {
        signInWithPassword: vi.fn(() => Promise.resolve({ data: {}, error: null })),
      },
    }

    const result = await signInWithPassword(supabase as any, 'admin@vivelo.cr', 'correct-password')

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'admin@vivelo.cr',
      password: 'correct-password',
    })
    expect(result).toEqual({ error: null })
  })

  it('returns a generic error on invalid credentials', async () => {
    const supabase = {
      auth: {
        signInWithPassword: vi.fn(() =>
          Promise.resolve({ data: {}, error: { message: 'Invalid login credentials' } })
        ),
      },
    }

    const result = await signInWithPassword(supabase as any, 'admin@vivelo.cr', 'wrong-password')

    expect(result).toEqual({ error: 'Email o contraseña incorrectos' })
  })
})

describe('signOut', () => {
  it('signs the user out', async () => {
    const supabase = { auth: { signOut: vi.fn(() => Promise.resolve({ error: null })) } }

    const result = await signOut(supabase as any)

    expect(supabase.auth.signOut).toHaveBeenCalled()
    expect(result).toEqual({ error: null })
  })
})
