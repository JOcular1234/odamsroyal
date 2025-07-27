// // frontend/src/middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
  const { pathname } = req.nextUrl;
  if (pathname === '/admin/login') {
    return NextResponse.next(); // Allow /admin/login without token
  }
  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('admin_token')?.value;
    console.log('Middleware - Pathname:', pathname, 'Token:', token);
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


// // backend/routes/admin.js
// router.post('/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     if (!username || !password) {
//       return res.status(400).json({ message: 'Username and password are required' });
//     }
//     const admin = await findAdminByUsername(username);
//     if (!admin) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
//     const isPasswordValid = await bcrypt.compare(password, admin.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ username: admin.username, role: 'admin' }, JWT_SECRET, {
//       expiresIn: JWT_EXPIRES_IN,
//     });

//     res.setHeader(
//       'Set-Cookie',
//       cookie.serialize('admin_token', token, {
//         httpOnly: true,
//         secure: true, // Always true for HTTPS in production
//         sameSite: 'none', // Required for cross-origin requests
//         path: '/',
//         maxAge: 60 * 60 * 2, // 2 hours
//       })
//     );

//     res.status(200).json({ message: 'Login successful' });
//   } catch (error) {
//     console.error('Login error:', error.message);
//     res.status(500).json({ message: 'Server error during login', details: error.message });
//   }
// });


// // // frontend/src/middleware.js
// import { NextResponse } from 'next/server';

// export function middleware(req) {
//   const { pathname } = req.nextUrl;
//   if (pathname === '/admin/login') {
//     return NextResponse.next();
//   }
//   if (pathname.startsWith('/admin')) {
//     const token = req.cookies.get('admin_token')?.value;
//     console.log('Middleware - Pathname:', pathname, 'Token:', token);
//     if (!token) {
//       console.log('Middleware - No token, but allowing for debug');
//       // return NextResponse.redirect(new URL('/admin/login', req.url));
//     }
//   }
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/admin/:path*'],
// };