import Link from "next/link";

const materials = [
  {
    name: "Steel",
    category: "Structural",
    price: "₹65,000",
    unit: "per tonne",
    change: "+6.8%",
    status: "Rising",
  },
  {
    name: "Cement",
    category: "Building",
    price: "₹420",
    unit: "per bag",
    change: "+2.4%",
    status: "Stable",
  },
  {
    name: "Copper",
    category: "Electrical",
    price: "₹780",
    unit: "per kg",
    change: "+5.1%",
    status: "Rising",
  },
  {
    name: "Aluminium",
    category: "Metal",
    price: "₹250",
    unit: "per kg",
    change: "-1.8%",
    status: "Falling",
  },
];

const features = [
  {
    icon: "📊",
    title: "Market Intelligence",
    description:
      "Monitor construction material prices and identify important market movements from one centralized dashboard.",
  },
  {
    icon: "🤖",
    title: "AI Price Forecasting",
    description:
      "Analyze historical price patterns and generate intelligent forecasts to support better purchasing decisions.",
  },
  {
    icon: "🏢",
    title: "Supplier Intelligence",
    description:
      "Compare suppliers, locations, pricing and availability to make more informed procurement decisions.",
  },
  {
    icon: "🔔",
    title: "Smart Price Alerts",
    description:
      "Stay informed when important materials cross your preferred price or percentage-change threshold.",
  },
];

const benefits = [
  "Reduce procurement uncertainty",
  "Track multiple materials in one place",
  "Compare supplier pricing",
  "Identify market trends early",
  "Make data-driven purchasing decisions",
  "Monitor construction costs continuously",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-slate-800">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute left-[-10%] top-[-20%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute right-[-10%] top-[10%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-[-30%] left-[35%] h-[400px] w-[400px] rounded-full bg-cyan-400/5 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2 lg:px-10 lg:py-32">

          {/* Hero content */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              AI-Powered Construction Intelligence
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Smarter decisions for
              <span className="block text-cyan-400">
                construction materials.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl">
              BuildPrice AI helps construction professionals track material
              prices, compare suppliers, understand market movements and use
              AI-powered insights to make smarter procurement decisions.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="rounded-xl bg-cyan-500 px-7 py-4 text-center font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition duration-300 hover:-translate-y-1 hover:bg-cyan-400"
              >
                Explore Dashboard →
              </Link>

              <Link
                href="/materials"
                className="rounded-xl border border-slate-700 bg-slate-900/70 px-7 py-4 text-center font-bold text-white transition duration-300 hover:-translate-y-1 hover:border-cyan-500/50 hover:bg-slate-800"
              >
                Explore Materials
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-500">
              <span>✓ Price tracking</span>
              <span>✓ Supplier comparison</span>
              <span>✓ AI insights</span>
            </div>
          </div>

          {/* Hero dashboard preview */}
          <div className="relative">
            <div className="absolute -inset-5 rounded-3xl bg-cyan-500/10 blur-2xl" />

            <div className="relative rounded-3xl border border-slate-700 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-xl">

              {/* Preview header */}
              <div className="mb-5 flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Market Overview
                  </p>
                  <h2 className="mt-1 text-xl font-bold">
                    Construction Index
                  </h2>
                </div>

                <div className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-400">
                  +4.6%
                </div>
              </div>

              {/* Preview chart */}
              <div className="relative h-48 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-5">

                <div className="absolute inset-x-5 top-10 border-t border-slate-800" />
                <div className="absolute inset-x-5 top-24 border-t border-slate-800" />
                <div className="absolute inset-x-5 top-38 border-t border-slate-800" />

                <div className="absolute inset-x-6 bottom-8 flex h-28 items-end justify-between gap-2">
                  {[38, 55, 44, 70, 62, 86, 75, 100, 88, 112].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="w-full rounded-t-md bg-cyan-500/70 transition duration-300 hover:bg-cyan-400"
                        style={{ height: `${height}px` }}
                      />
                    )
                  )}
                </div>

                <div className="absolute left-5 top-4 text-xs text-slate-500">
                  Price Trend
                </div>
              </div>

              {/* Mini metrics */}
              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs text-slate-500">Materials</p>
                  <p className="mt-1 text-xl font-bold">120+</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs text-slate-500">Suppliers</p>
                  <p className="mt-1 text-xl font-bold">50+</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs text-slate-500">Cities</p>
                  <p className="mt-1 text-xl font-bold">25+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM STATS */}
      <section className="border-b border-slate-800 bg-slate-900/50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-slate-800 md:grid-cols-4">

          <div className="bg-slate-950 px-6 py-8 text-center">
            <p className="text-3xl font-black text-cyan-400">120+</p>
            <p className="mt-2 text-sm text-slate-500">Materials Tracked</p>
          </div>

          <div className="bg-slate-950 px-6 py-8 text-center">
            <p className="text-3xl font-black text-cyan-400">50+</p>
            <p className="mt-2 text-sm text-slate-500">Suppliers</p>
          </div>

          <div className="bg-slate-950 px-6 py-8 text-center">
            <p className="text-3xl font-black text-cyan-400">25+</p>
            <p className="mt-2 text-sm text-slate-500">Cities</p>
          </div>

          <div className="bg-slate-950 px-6 py-8 text-center">
            <p className="text-3xl font-black text-cyan-400">10K+</p>
            <p className="mt-2 text-sm text-slate-500">Price Updates</p>
          </div>

        </div>
      </section>

      {/* MARKET SNAPSHOT */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">

        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Market Snapshot
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Today's material intelligence
            </h2>

            <p className="mt-4 max-w-2xl text-slate-400">
              Get a quick view of important construction material prices and
              their recent market movement.
            </p>
          </div>

          <Link
            href="/materials"
            className="text-sm font-semibold text-cyan-400 hover:text-cyan-300"
          >
            View all materials →
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {materials.map((material) => (
            <div
              key={material.name}
              className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:bg-slate-800"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    {material.category}
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    {material.name}
                  </h3>
                </div>

                <div className="rounded-lg bg-slate-800 px-2 py-1 text-xs text-slate-400">
                  {material.status}
                </div>
              </div>

              <div className="mt-8">
                <p className="text-3xl font-black">{material.price}</p>
                <p className="mt-1 text-sm text-slate-500">{material.unit}</p>
              </div>

              <div
                className={`mt-5 inline-flex rounded-lg px-3 py-1.5 text-sm font-semibold ${
                  material.change.startsWith("+")
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-rose-500/10 text-rose-400"
                }`}
              >
                {material.change} this period
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI SECTION */}
      <section className="border-y border-slate-800 bg-slate-900/50">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-2 lg:px-10">

          <div>
            <div className="mb-5 inline-flex rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
              🤖 AI Intelligence
            </div>

            <h2 className="text-4xl font-black leading-tight sm:text-5xl">
              Turn market data into
              <span className="block text-cyan-400">
                actionable insights.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
              BuildPrice AI is designed to help users understand where
              material prices are moving, why they may be changing, and how
              those changes can affect construction procurement.
            </p>

            <Link
              href="/dashboard"
              className="mt-8 inline-flex rounded-xl bg-cyan-500 px-6 py-3.5 font-bold text-slate-950 transition hover:bg-cyan-400"
            >
              Open AI Dashboard →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-6 transition duration-300 hover:border-cyan-500/30"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-2xl">
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold">{feature.title}</h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* WHY BUILDPRICE AI */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">

        <div className="grid items-center gap-14 lg:grid-cols-2">

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Why BuildPrice AI?
            </p>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              A smarter way to manage material costs.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              Construction projects depend heavily on material costs. BuildPrice
              AI brings price intelligence, supplier information and forecasting
              into a single platform.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 text-sm text-slate-300"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
                    ✓
                  </span>

                  {benefit}
                </div>
              ))}
            </div>
          </div>

          {/* Insight card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-7 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  AI Market Insight
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  Current Market Signal
                </h3>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-2xl">
                ✦
              </div>
            </div>

            <div className="mt-7 rounded-2xl border border-slate-800 bg-slate-950 p-6">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-emerald-400" />

                <span className="text-sm font-semibold text-emerald-400">
                  Moderate Growth
                </span>
              </div>

              <p className="mt-5 leading-7 text-slate-400">
                Construction material prices are showing moderate upward
                movement. Steel and copper are currently showing stronger
                momentum compared with other tracked materials.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-900 p-4">
                  <p className="text-xs text-slate-500">Market Trend</p>
                  <p className="mt-2 font-bold text-emerald-400">
                    Positive
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900 p-4">
                  <p className="text-xs text-slate-500">Volatility</p>
                  <p className="mt-2 font-bold text-yellow-400">
                    Moderate
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">

          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500 text-2xl font-black text-slate-950 shadow-lg shadow-cyan-500/20">
            BP
          </div>

          <h2 className="text-4xl font-black sm:text-5xl">
            Ready to make smarter
            <span className="text-cyan-400"> construction decisions?</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            Explore material prices, suppliers and AI-powered market insights
            from your BuildPrice AI dashboard.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="rounded-xl bg-cyan-500 px-7 py-4 font-bold text-slate-950 transition hover:bg-cyan-400"
            >
              Go to Dashboard
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-slate-700 bg-slate-900 px-7 py-4 font-bold transition hover:border-cyan-500/40 hover:bg-slate-800"
            >
              Get Started
            </Link>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950">

        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3 lg:px-10">

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 font-black text-slate-950">
                BP
              </div>

              <div>
                <h3 className="font-bold">
                  BuildPrice <span className="text-cyan-400">AI</span>
                </h3>

                <p className="text-xs text-slate-600">
                  Construction Intelligence
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-500">
              An AI-powered construction materials price intelligence platform
              designed to support smarter procurement and cost decisions.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white">Platform</h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-slate-500">
              <Link href="/dashboard" className="hover:text-cyan-400">
                Dashboard
              </Link>

              <Link href="/materials" className="hover:text-cyan-400">
                Materials
              </Link>

              <Link href="/suppliers" className="hover:text-cyan-400">
                Suppliers
              </Link>

              <Link href="/reports" className="hover:text-cyan-400">
                Reports
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white">Contact</h3>

            <div className="mt-5 space-y-3 text-sm text-slate-500">
              <p>📧 buildpriceai@gmail.com</p>
              <p>📞 +91 98765 43210</p>
              <p>📍 India</p>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-900 py-5 text-center text-xs text-slate-600">
          © 2026 BuildPrice AI. All rights reserved.
        </div>

      </footer>

    </main>
  );
}