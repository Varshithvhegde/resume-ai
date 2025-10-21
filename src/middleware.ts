import { NextRequest, NextResponse } from "next/server"
import { auth0 } from "./lib/auth0"

export async function middleware(request: NextRequest) {
  const authRes = await auth0.middleware(request)

  // Authentication routes — let the Auth0 middleware handle it.
  if (request.nextUrl.pathname.startsWith("/auth")) {
    return authRes
  }

  // Allow debug API routes without requiring an app session
  if (request.nextUrl.pathname.startsWith("/api/debug")) {
    return NextResponse.next()
  }

  const { origin } = new URL(request.url)
  const session = await auth0.getSession(request)

  // User does not have a session — redirect to login.
  if (!session) {
    return NextResponse.redirect(`${origin}/auth/login`)
  }
  return authRes
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:png|jpg|jpeg|gif|webp)|$).*)',
  ],
}

