// import { NextResponse } from 'next/server';

// // Example middleware logic
// export function middleware(request) {
//   // You can add your authentication or logging logic here
//   return NextResponse.next();
// }

// // Optionally, specify which paths to match
// export const config = {
//   matcher: ['/api/:path*', '/admin/:path*'],
// };


import { NextResponse } from 'next/server';

export function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('admin_token')?.value;
    const authHeader = req.headers.get('authorization');

    console.log('Middleware - Pathname:', pathname);
    console.log('Middleware - Cookie Token:', token);
    console.log('Middleware - Auth Header:', authHeader);
    console.log('Middleware - Cookies:', req.cookies.getAll());
    console.log('Middleware - Headers:', Object.fromEntries(req.headers));

    if (!token && !authHeader) {
      console.log('Middleware - Redirecting to /admin/login');
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};