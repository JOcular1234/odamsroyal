"use client";
import { usePathname } from "next/navigation";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
import Header from "./Header";
import Footer from "./Footer";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {isAdmin ? (
        <>
          <AdminHeader />
          {children}
          <AdminFooter />
        </>
      ) : (
        <>
          <Header />
          {children}
          <Footer />
        </>
      )}
    </>
  );
}
