import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">

      <h1 className="text-3xl font-bold text-cyan-400">
        BuildPrice AI
      </h1>

      <div className="flex gap-6 font-medium">

        <Link
          href="/"
          className="px-4 py-2 rounded-lg transition-all duration-300 hover:bg-cyan-500 hover:text-black hover:scale-105"
        >
          Home
        </Link>

        <Link
          href="/dashboard"
          className="px-4 py-2 rounded-lg transition-all duration-300 hover:bg-cyan-500 hover:text-black hover:scale-105"
        >
          Dashboard
        </Link>

        <Link
          href="/materials"
          className="px-4 py-2 rounded-lg transition-all duration-300 hover:bg-cyan-500 hover:text-black hover:scale-105"
        >
          Materials
        </Link>

        <Link
          href="/suppliers"
          className="px-4 py-2 rounded-lg transition-all duration-300 hover:bg-cyan-500 hover:text-black hover:scale-105"
        >
          Suppliers
        </Link>

        <Link
          href="/reports"
          className="px-4 py-2 rounded-lg transition-all duration-300 hover:bg-cyan-500 hover:text-black hover:scale-105"
        >
          Reports
        </Link>

        <Link
          href="/notifications"
          className="px-4 py-2 rounded-lg transition-all duration-300 hover:bg-cyan-500 hover:text-black hover:scale-105"
        >
          Notifications
        </Link>

        <Link
          href="/settings"
          className="px-4 py-2 rounded-lg transition-all duration-300 hover:bg-cyan-500 hover:text-black hover:scale-105"
        >
          Settings
        </Link>

        <Link
          href="/admin"
          className="px-4 py-2 rounded-lg transition-all duration-300 hover:bg-cyan-500 hover:text-black hover:scale-105"
        >
          Admin
        </Link>

        <Link
          href="/login"
          className="px-4 py-2 rounded-lg transition-all duration-300 hover:bg-cyan-500 hover:text-black hover:scale-105"
        >
          Login
        </Link>

      </div>

    </nav>
  );
}