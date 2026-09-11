"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (response.ok) {
          const data = await response.json();

          if (data.authenticated) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [pathname]);

  async function handleLogout() {
    try {
      setLoggingOut(true);

      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setUser(null);

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      setLoggingOut(false);
    }
  }

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Materials", href: "/materials" },
    { name: "Suppliers", href: "/suppliers" },
    { name: "Reports", href: "/reports" },
    { name: "Notifications", href: "/notifications" },
    { name: "Settings", href: "/settings" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 text-white backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">

        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-black shadow-lg shadow-blue-600/20">
            BP
          </div>

          <div className="hidden sm:block">
            <p className="font-bold leading-none">
              BuildPrice AI
            </p>
            <p className="mt-1 text-[10px] text-slate-500">
              Construction Intelligence
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-blue-600/15 text-blue-400"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            );
          })}

          {/* Admin link only for admins */}
          {user?.role === "admin" && (
            <Link
              href="/admin"
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
                pathname.startsWith("/admin")
                  ? "bg-blue-600/15 text-blue-400"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              Admin
            </Link>
          )}
        </div>

        {/* Account area */}
        <div className="flex shrink-0 items-center gap-3">

          {!loading && user ? (
            <>
              {/* User information */}
              <div className="hidden items-center gap-2 md:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600/20 text-sm font-bold text-blue-400">
                  {user.email?.charAt(0).toUpperCase()}
                </div>

                <div className="max-w-[150px]">
                  <p className="truncate text-xs font-semibold text-white">
                    {user.email}
                  </p>

                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    {user.role}
                  </p>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            !loading && (
              <Link
                href="/login"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Login
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}