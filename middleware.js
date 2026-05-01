import { NextResponse } from 'next/server'
import { HOME_TITLE_TEST, pickRandomVariant } from '@/lib/ab-tests'

export function middleware(request) {
  const response = NextResponse.next()

  const existing = request.cookies.get(HOME_TITLE_TEST.cookieName)?.value
  if (!existing || !HOME_TITLE_TEST.variants[existing]) {
    response.cookies.set(HOME_TITLE_TEST.cookieName, pickRandomVariant(HOME_TITLE_TEST), {
      maxAge: HOME_TITLE_TEST.cookieMaxAge,
      path: '/',
      sameSite: 'lax',
    })
  }

  return response
}

export const config = {
  matcher: '/',
}
