import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const config = {}

const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login', '/signup', '/']

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  const cookie = await cookies()
  const accessToken = cookie.get('PFW_AT')

  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }

  if (
    isPublicRoute &&
    accessToken &&
    !req.nextUrl.pathname.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}
