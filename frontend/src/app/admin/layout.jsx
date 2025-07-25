"use client";
import '../globals.css';
import { SessionProvider } from 'next-auth/react';

export default function AdminLayout({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}