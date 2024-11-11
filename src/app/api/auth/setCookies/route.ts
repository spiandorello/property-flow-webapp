'use server'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  const { accessToken, refreshToken } = await request.json()

  if (!accessToken || !refreshToken) {
    return NextResponse.json(
      { error: 'Token and refresh token required' },
      { status: 400 },
    )
  }

  const cookiesStore = await cookies()
  cookiesStore.set('PFW_AT', accessToken, {
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'lax',
  })
  cookiesStore.set('PFW_RT', refreshToken, {
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'lax',
  })

  return NextResponse.json({ success: true })
}
