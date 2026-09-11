"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event) {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      // Successful login
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">

        {/* Left branding section */}
        <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden border-r border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-slate-950 to-cyan-500/10" />

          <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-xl font-black shadow-lg shadow-blue-600/30">
                BP
              </div>

              <div>
                <h1 className="text-xl font-bold">
                  BuildPrice AI
                </h1>
                <p className="text-xs text-slate-400">
                  Construction Intelligence
                </p>
              </div>
            </div>

            <h2 className="max-w-xl text-5xl font-black leading-tight">
              Smarter decisions for
              <span className="text-blue-400"> construction markets.</span>
            </h2>

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
              Monitor construction material prices, understand market
              movement and make data-driven procurement decisions from one
              intelligent platform.
            </p>

            <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-bold">24/7</p>
                <p className="mt-1 text-xs text-slate-400">
                  Market monitoring
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-bold">AI</p>
                <p className="mt-1 text-xs text-slate-400">
                  Market intelligence
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-bold">INR</p>
                <p className="mt-1 text-xs text-slate-400">
                  Indian market
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Login section */}
        <section className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 font-black">
                BP
              </div>

              <div>
                <h1 className="font-bold">BuildPrice AI</h1>
                <p className="text-xs text-slate-400">
                  Construction Intelligence
                </p>
              </div>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-400">
                Welcome back
              </p>

              <h2 className="text-3xl font-bold">
                Sign in to your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Access your construction market intelligence dashboard.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-300"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs font-medium text-blue-400 hover:text-blue-300"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                />
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-800"
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setError("Password reset will be available soon.")
                  }
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Forgot password?
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* Login button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            {/* Demo/admin information */}
            <div className="mt-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
              <p className="text-xs font-semibold text-blue-300">
                Admin access
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Use the administrator credentials created in MongoDB to
                access the platform.
              </p>
            </div>

            <p className="mt-8 text-center text-xs text-slate-600">
              BuildPrice AI • Construction Market Intelligence
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}