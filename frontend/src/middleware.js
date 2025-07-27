// // // frontend/src/middleware.js
// import { NextResponse } from 'next/server';

// export function middleware(req) {
//   const { pathname } = req.nextUrl;
//   if (pathname === '/admin/login') {
//     return NextResponse.next(); // Allow /admin/login without token
//   }
//   if (pathname.startsWith('/admin')) {
//     const token = req.cookies.get('admin_token')?.value;
//     console.log('Middleware - Pathname:', pathname, 'Token:', token);
//     if (!token) {
//       console.log('Middleware - Redirecting to /admin/login');
//       return NextResponse.redirect(new URL('/admin/login', req.url));
//     }
//   }
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/admin/:path*'],
// };


// In your frontend/src/middleware.js - Replace with this version that checks Authorization header too

// frontend/src/middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
  const { pathname } = req.nextUrl;
  
  if (pathname === '/admin/login') {
    return NextResponse.next(); // Allow /admin/login without token
  }
  
  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('admin_token')?.value;
    const authHeader = req.headers.get('authorization');
    
    console.log('Middleware - Pathname:', pathname);
    console.log('Middleware - Cookie Token:', token);
    console.log('Middleware - Auth Header:', authHeader);
    
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