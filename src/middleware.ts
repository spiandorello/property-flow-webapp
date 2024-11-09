import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {}

export function middleware(request: NextRequest) {
  console.log('maoi', request)
  return NextResponse.next()
}
