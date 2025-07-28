import { NextResponse } from 'next/server';

// Example middleware logic
export function middleware(request) {
  // You can add your authentication or logging logic here
  return NextResponse.next();
}

// Optionally, specify which paths to match
export const config = {
  matcher: ['/api/:path*', '/admin/:path*'],
};
