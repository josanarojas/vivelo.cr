// app/admin/login/__tests__/page.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoginPage from '@/app/admin/login/page'

// LoginPage is an async Server Component. Next.js 16 (React 19) renders async
// components through the RSC pipeline; react-dom/client (used by jsdom + RTL
// in this test environment) refuses to render an async component via JSX
// ("Only Server Components can be async at the moment"). The standard
// workaround for unit-testing an async Server Component with Testing Library
// is to invoke it directly as a function, await the resulting element, and
// hand that plain element to `render`.
describe('LoginPage', () => {
  it('renders email and password fields with a submit button', async () => {
    render(await LoginPage({ searchParams: Promise.resolve({}) }))

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
  })

  it('shows the generic error message when redirected with an error', async () => {
    render(await LoginPage({ searchParams: Promise.resolve({ error: '1' }) }))

    expect(await screen.findByText('Email o contraseña incorrectos')).toBeInTheDocument()
  })
})
