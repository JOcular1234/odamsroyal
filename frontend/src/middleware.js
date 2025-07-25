// // frontend/src/middleware.js
// import { NextResponse } from 'next/server';

// export function middleware(req) {
//   const { pathname } = req.nextUrl;
//   if (pathname.startsWith('/admin')) {
//     const token = req.cookies.get('admin_token')?.value;
//     if (!token) {
//       return NextResponse.redirect(new URL('/admin/login', req.url));
//     }
//   }
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/admin/:path*'],
// };
import { NextResponse } from 'next/server';

export function middleware(req) {
  const { pathname } = req.nextUrl;
  if (pathname === '/admin/login') {
    return NextResponse.next(); // Allow /admin/login without token
  }
  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('admin_token')?.value;
    console.log('Middleware - Token:', token);
    if (!token) {
      console.log('Middleware - Redirecting to /admin/login');
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};