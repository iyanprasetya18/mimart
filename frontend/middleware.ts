import { jwtVerify } from 'jose'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SESSION_COOKIE = 'session'

function getSecret() {
  const s = process.env.JWT_SECRET
  if (!s) return null
  return new TextEncoder().encode(s)
}

async function isValidOwnerSession(token: string): Promise<boolean> {
  const secret = getSecret()
  if (!secret) return false
  const { payload } = await jwtVerify(token, secret)
  return payload.role === 'OWNER'
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const isLogin = pathname === '/admin/login'
  const token = request.cookies.get(SESSION_COOKIE)?.value

  if (isLogin) {
    if (token) {
      try {
        if (await isValidOwnerSession(token)) {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        }
      } catch {
        const res = NextResponse.next()
        res.cookies.set(SESSION_COOKIE, '', {
          httpOnly: true,
          path: '/',
          maxAge: 0,
        })
        return res
      }
    }
    return NextResponse.next()
  }

  if (!getSecret()) {
    console.error('middleware: JWT_SECRET is not set')
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  try {
    if (!(await isValidOwnerSession(token))) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  } catch {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
