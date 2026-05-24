import { NextResponse } from 'next/server'

const BACKEND_API =
  process.env.BACKEND_API_URL ?? 'http://localhost:5000/api'

const SESSION_COOKIE = 'session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7

export async function POST(request: Request) {
  let body: { email?: string; password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: 'Body tidak valid' }, { status: 400 })
  }

  const res = await fetch(`${BACKEND_API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = (await res.json().catch(() => ({}))) as {
    token?: string
    user?: { password?: string; role?: string; [k: string]: unknown }
    message?: string
  }

  if (!res.ok) {
    return NextResponse.json(
      { message: data.message ?? 'Login gagal' },
      { status: res.status }
    )
  }

  if (!data.token || !data.user) {
    return NextResponse.json({ message: 'Respons server tidak valid' }, { status: 502 })
  }

  if (data.user.role !== 'OWNER') {
    return NextResponse.json(
      { message: 'Hanya akun owner yang dapat masuk ke panel admin.' },
      { status: 403 }
    )
  }

  const { password: _p, ...safeUser } = data.user as {
    password?: string
    role: string
    [k: string]: unknown
  }

  const response = NextResponse.json({ user: safeUser })

  response.cookies.set(SESSION_COOKIE, data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })

  return response
}
