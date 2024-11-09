import { NextResponse } from 'next/server'
// import { cookies } from 'next/headers'

export const config = {}

export function middleware() {
  // console.log('middleware', cookies)

  return NextResponse.next()
}
