// frontend/src/app/admin/layout.jsx
"use client";
import '../globals.css';
import { SessionProvider } from 'next-auth/react';

import { AuthProvider } from '../../context/AuthContext';
export default function AdminLayout({ children }) {
  return (
    // <SessionProvider>
    //   {children}
    // </SessionProvider>
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}