// frontend/src/middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
  const { pathname } = req.nextUrl;
  if (pathname === '/admin/login') {
    return NextResponse.next(); // Allow /admin/login without token
  }
  // Do not block admin routes in middleware; rely on backend auth
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};