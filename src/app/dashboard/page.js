"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [materials, setMaterials] = useState([]);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load logged-in user
  useEffect(() => {
    async function loadUser() {
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
      } catch (err) {
        console.error("User authentication check failed:", err);
      } finally {
        setAuthLoading(false);
      }
    }

    loadUser();
  }, []);

  // Load materials from MongoDB
  useEffect(() => {
    async function loadMaterials() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/materials");

        if (!response.ok) {
          throw new Error("Failed to fetch materials");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(
            result.message || "Failed to fetch materials"
          );
        }

        setMaterials(result.data || []);
      } catch (err) {
        console.error("Dashboard materials error:", err);
        setError("Unable to load market data.");
      } finally {
        setLoading(false);
      }
    }

    loadMaterials();
  }, []);

  const categories = useMemo(() => {
    return ["All", ...new Set(materials.map((item) => item.category))];
  }, [materials]);

  const locations = useMemo(() => {
    return ["All", ...new Set(materials.map((item) => item.location))];
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        material.name.toLowerCase().includes(searchText) ||
        material.supplier.toLowerCase().includes(searchText);

      const matchesCategory =
        category === "All" || material.category === category;

      const matchesLocation =
        location === "All" || material.location === location;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation
      );
    });
  }, [materials, search, category, location]);

  const totalMaterials = materials.length;

  const averageChange =
    materials.length > 0
      ? materials.reduce(
          (sum, item) => sum + Number(item.change || 0),
          0
        ) / materials.length
      : 0;

  const highDemand = materials.filter(
    (item) => item.demand === "High"
  ).length;

  const gainers = [...materials]
    .filter((item) => Number(item.change) > 0)
    .sort(
      (a, b) => Number(b.change) - Number(a.change)
    )
    .slice(0, 3);

  const losers = [...materials]
    .filter((item) => Number(item.change) < 0)
    .sort(
      (a, b) => Number(a.change) - Number(b.change)
    )
    .slice(0, 3);

  const highestPrice = materials.length
    ? Math.max(
        ...materials.map((item) => Number(item.price))
      )
    : 0;

  const lowestPrice = materials.length
    ? Math.min(
        ...materials.map((item) => Number(item.price))
      )
    : 0;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-300">
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                Live Database Intelligence
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                Market
                <span className="text-blue-400">
                  {" "}Dashboard
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-lg text-slate-300">
                Monitor construction material prices, market
                movements, demand signals, and supplier
                intelligence from one dashboard.
              </p>

              {/* Logged-in user */}
              {!authLoading && user && (
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-slate-400">
                    Welcome back,
                  </span>

                  <span className="font-semibold text-blue-400">
                    {user.email}
                  </span>

                  {user.role === "admin" && (
                    <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-300">
                      Admin
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Data Source
              </p>

              <p className="mt-1 font-bold text-white">
                MongoDB Atlas
              </p>

              <p className="mt-1 text-xs text-emerald-400">
                ● Connected
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              Loading market intelligence...
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Fetching material records from MongoDB.
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
            <div className="text-4xl">⚠️</div>

            <h2 className="mt-4 text-xl font-bold text-red-900">
              Market data unavailable
            </h2>

            <p className="mt-2 text-sm text-red-700">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* KPI Cards */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Materials Tracked
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalMaterials}
                </p>

                <p className="mt-2 text-sm text-emerald-600">
                  Database records
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Average Market Change
                </p>

                <p
                  className={`mt-2 text-3xl font-bold ${
                    averageChange >= 0
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {averageChange >= 0 ? "+" : ""}
                  {averageChange.toFixed(1)}%
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Across tracked materials
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  High Demand
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {highDemand}
                </p>

                <p className="mt-2 text-sm text-amber-600">
                  Materials requiring attention
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Price Range
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  ₹{formatPrice(lowestPrice)}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  to ₹{formatPrice(highestPrice)}
                </p>
              </div>
            </div>

            {/* AI Insight */}
            <div className="mt-8 overflow-hidden rounded-2xl bg-slate-900 shadow-lg">
              <div className="relative p-7">
                <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

                <div className="relative">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-xl">
                      ✦
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
                        AI Market Intelligence
                      </p>

                      <h2 className="mt-1 text-xl font-bold text-white">
                        Procurement Outlook
                      </h2>
                    </div>
                  </div>

                  <p className="mt-5 max-w-4xl leading-7 text-slate-300">
                    The current dataset shows an average material
                    movement of{" "}
                    <span className="font-bold text-white">
                      {averageChange.toFixed(1)}%
                    </span>
                    .{" "}
                    {gainers.length > 0
                      ? `${gainers[0].name} currently shows the strongest positive movement at +${gainers[0].change}%.`
                      : "No significant positive movement is currently recorded."}{" "}
                    Procurement teams should closely monitor
                    high-demand materials and compare supplier
                    prices before placing large orders.
                  </p>

                  <p className="mt-4 text-xs text-slate-500">
                    AI insight is currently generated from the
                    project's database metrics. A dedicated
                    predictive AI model can be integrated in the
                    next stage.
                  </p>
                </div>
              </div>
            </div>

            {/* Search and filters */}
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid gap-4 lg:grid-cols-4">
                <div className="lg:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Search Materials
                  </label>

                  <input
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search material or supplier..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Category
                  </label>

                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {categories.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Location
                  </label>

                  <select
                    value={location}
                    onChange={(e) =>
                      setLocation(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  >
                    {locations.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Market movement */}
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Market Movement
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Price change by material
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    Current
                  </span>
                </div>

                <div className="mt-7 space-y-5">
                  {filteredMaterials.map((material) => {
                    const change = Number(
                      material.change || 0
                    );

                    const width = Math.min(
                      Math.abs(change) * 12,
                      100
                    );

                    return (
                      <div key={material._id}>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-700">
                            {material.name}
                          </span>

                          <span
                            className={`text-sm font-bold ${
                              change >= 0
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            {change >= 0 ? "+" : ""}
                            {change}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${
                              change >= 0
                                ? "bg-emerald-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${width}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}

                  {filteredMaterials.length === 0 && (
                    <p className="py-8 text-center text-sm text-slate-500">
                      No materials match your filters.
                    </p>
                  )}
                </div>
              </div>

              {/* Top movers */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">
                  Top Market Movers
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Materials showing the strongest movements
                </p>

                <div className="mt-6">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Top Gainers
                  </p>

                  <div className="space-y-3">
                    {gainers.map((material) => (
                      <Link
                        key={material._id}
                        href={`/materials/${getSlug(
                          material.name
                        )}`}
                        className="flex items-center justify-between rounded-xl bg-emerald-50 p-4 transition hover:bg-emerald-100"
                      >
                        <div>
                          <p className="font-bold text-slate-900">
                            {material.name}
                          </p>

                          <p className="text-xs text-slate-500">
                            {material.supplier}
                          </p>
                        </div>

                        <span className="font-bold text-emerald-600">
                          +{material.change}%
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mt-7">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-red-600">
                    Top Decliners
                  </p>

                  <div className="space-y-3">
                    {losers.length > 0 ? (
                      losers.map((material) => (
                        <Link
                          key={material._id}
                          href={`/materials/${getSlug(
                            material.name
                          )}`}
                          className="flex items-center justify-between rounded-xl bg-red-50 p-4 transition hover:bg-red-100"
                        >
                          <div>
                            <p className="font-bold text-slate-900">
                              {material.name}
                            </p>

                            <p className="text-xs text-slate-500">
                              {material.supplier}
                            </p>
                          </div>

                          <span className="font-bold text-red-600">
                            {material.change}%
                          </span>
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">
                        No declining materials currently
                        recorded.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Material table */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-6">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Material Price Intelligence
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Database-backed material pricing
                      information
                    </p>
                  </div>

                  <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600">
                    {filteredMaterials.length} records
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px]">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      <th className="px-6 py-4">
                        Material
                      </th>
                      <th className="px-6 py-4">
                        Category
                      </th>
                      <th className="px-6 py-4">
                        Price
                      </th>
                      <th className="px-6 py-4">
                        Change
                      </th>
                      <th className="px-6 py-4">
                        Supplier
                      </th>
                      <th className="px-6 py-4">
                        Location
                      </th>
                      <th className="px-6 py-4">
                        Demand
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredMaterials.map((material) => {
                      const change = Number(
                        material.change || 0
                      );

                      return (
                        <tr
                          key={material._id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-6 py-5">
                            <Link
                              href={`/materials/${getSlug(
                                material.name
                              )}`}
                              className="font-bold text-slate-900 hover:text-blue-600"
                            >
                              {material.name}
                            </Link>
                          </td>

                          <td className="px-6 py-5">
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                              {material.category}
                            </span>
                          </td>

                          <td className="px-6 py-5 font-bold text-slate-900">
                            ₹{formatPrice(material.price)}
                          </td>

                          <td
                            className={`px-6 py-5 font-bold ${
                              change >= 0
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            {change >= 0 ? "+" : ""}
                            {change}%
                          </td>

                          <td className="px-6 py-5 text-sm text-slate-600">
                            {material.supplier}
                          </td>

                          <td className="px-6 py-5 text-sm text-slate-600">
                            {material.location}
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${
                                material.demand === "High"
                                  ? "bg-red-50 text-red-600"
                                  : material.demand === "Medium"
                                  ? "bg-amber-50 text-amber-600"
                                  : "bg-emerald-50 text-emerald-600"
                              }`}
                            >
                              {material.demand}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredMaterials.length === 0 && (
                <div className="p-10 text-center text-sm text-slate-500">
                  No database records match the selected
                  filters.
                </div>
              )}
            </div>

            {/* Database status */}
            <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  ✓
                </div>

                <div>
                  <h3 className="font-bold text-emerald-900">
                    MongoDB Connected
                  </h3>

                  <p className="mt-1 text-sm text-emerald-700">
                    Dashboard metrics and material records are
                    being retrieved from the project's MongoDB
                    database.
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="mt-6 text-center text-xs text-slate-400">
              Current prices and market movements are
              development/demo data stored in MongoDB. Live
              market feeds and predictive AI will be integrated
              in later stages.
            </p>
          </>
        )}
      </section>
    </main>
  );
}