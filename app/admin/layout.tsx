"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    try {
      // Always enforce fresh admin login per tab/session
      const session = localStorage.getItem("admin_session");
      if (session) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
        // Avoid redirect loop if already on login page
        if (pathname !== "/admin/login") {
          router.push("/admin/login");
        }
      }
    } catch (err) {
      setAuthorized(false);
      if (pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    }
  }, [router, pathname]);

  // Render children only when authorized; prevent flicker on guard
  if (!authorized && pathname !== "/admin/login") {
    return <div className="min-h-screen bg-gray-50" />;
  }

  return <>{children}</>;
}
