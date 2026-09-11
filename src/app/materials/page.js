"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [demand, setDemand] = useState("All");
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    async function loadMaterials() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/materials", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to load materials."
          );
        }

        setMaterials(result.data || []);
      } catch (err) {
        console.error(err);
        setError(
          err.message || "Something went wrong while loading materials."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMaterials();
  }, []);

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(materials.map((item) => item.category).filter(Boolean)),
    ];
  }, [materials]);

  const locations = useMemo(() => {
    return [
      "All",
      ...new Set(materials.map((item) => item.location).filter(Boolean)),
    ];
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = materials.filter((material) => {
      const matchesSearch =
        !query ||
        material.name?.toLowerCase().includes(query) ||
        material.category?.toLowerCase().includes(query) ||
        material.supplier?.toLowerCase().includes(query) ||
        material.location?.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" || material.category === category;

      const matchesLocation =
        location === "All" || material.location === location;

      const matchesDemand =
        demand === "All" || material.demand === demand;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation &&
        matchesDemand
      );
    });

    return result.sort((a, b) => {
      if (sortBy === "price-high") {
        return Number(b.price) - Number(a.price);
      }

      if (sortBy === "price-low") {
        return Number(a.price) - Number(b.price);
      }

      if (sortBy === "change-high") {
        return Number(b.change || 0) - Number(a.change || 0);
      }

      if (sortBy === "change-low") {
        return Number(a.change || 0) - Number(b.change || 0);
      }

      if (sortBy === "name") {
        return (a.name || "").localeCompare(b.name || "");
      }

      return (
        new Date(b.lastUpdated || b.updatedAt || 0) -
        new Date(a.lastUpdated || a.updatedAt || 0)
      );
    });
  }, [
    materials,
    search,
    category,
    location,
    demand,
    sortBy,
  ]);

  const totalMaterials = materials.length;

  const risingMaterials = materials.filter(
    (item) => Number(item.change || 0) > 0
  ).length;

  const fallingMaterials = materials.filter(
    (item) => Number(item.change || 0) < 0
  ).length;

  const highDemandMaterials = materials.filter(
    (item) => item.demand === "High"
  ).length;

  const averageChange =
    materials.length > 0
      ? materials.reduce(
          (sum, item) => sum + Number(item.change || 0),
          0
        ) / materials.length
      : 0;

  function formatPrice(material) {
    const price = Number(material.price || 0);

    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
    }).format(price);
  }

  function formatDate(date) {
    if (!date) return "Recently";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "Recently";
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function getChangeStyle(change) {
    const value = Number(change || 0);

    if (value > 0) {
      return {
        box: "border-emerald-400/20 bg-emerald-500/10",
        text: "text-emerald-400",
        icon: "↗",
      };
    }

    if (value < 0) {
      return {
        box: "border-rose-400/20 bg-rose-500/10",
        text: "text-rose-400",
        icon: "↘",
      };
    }

    return {
      box: "border-slate-700 bg-slate-800/60",
      text: "text-slate-400",
      icon: "→",
    };
  }

  function getDemandStyle(demandValue) {
    if (demandValue === "High") {
      return "border-rose-400/20 bg-rose-500/10 text-rose-300";
    }

    if (demandValue === "Medium") {
      return "border-amber-400/20 bg-amber-500/10 text-amber-300";
    }

    return "border-slate-600 bg-slate-800 text-slate-300";
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              Construction Materials Intelligence
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Materials
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                {" "}Market
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">
              Monitor construction material prices, market movement,
              supplier information and demand signals from one
              centralized intelligence platform.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Materials Tracked
              </p>
              <p className="mt-3 text-3xl font-bold">
                {totalMaterials}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Across monitored markets
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-400/10 bg-slate-900/70 p-5 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Rising
              </p>
              <p className="mt-3 text-3xl font-bold text-emerald-400">
                {risingMaterials}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Showing positive movement
              </p>
            </div>

            <div className="rounded-2xl border border-rose-400/10 bg-slate-900/70 p-5 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Declining
              </p>
              <p className="mt-3 text-3xl font-bold text-rose-400">
                {fallingMaterials}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Showing negative movement
              </p>
            </div>

            <div className="rounded-2xl border border-blue-400/10 bg-slate-900/70 p-5 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Avg. Movement
              </p>
              <p
                className={`mt-3 text-3xl font-bold ${
                  averageChange > 0
                    ? "text-emerald-400"
                    : averageChange < 0
                    ? "text-rose-400"
                    : "text-slate-300"
                }`}
              >
                {averageChange > 0 ? "+" : ""}
                {averageChange.toFixed(2)}%
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Across tracked materials
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-black/10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="flex-1">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Search Materials
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  ⌕
                </span>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search material, supplier or location..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-11 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[620px]">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-slate-200 outline-none focus:border-blue-500"
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-slate-200 outline-none focus:border-blue-500"
              >
                {locations.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <select
                value={demand}
                onChange={(e) => setDemand(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-slate-200 outline-none focus:border-blue-500"
              >
                <option>All</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-slate-200 outline-none focus:border-blue-500"
              >
                <option value="latest">Latest Updated</option>
                <option value="price-high">Price: High → Low</option>
                <option value="price-low">Price: Low → High</option>
                <option value="change-high">Movement: High → Low</option>
                <option value="change-low">Movement: Low → High</option>
                <option value="name">Name A → Z</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
            <p className="text-sm text-slate-400">
              Showing{" "}
              <span className="font-semibold text-white">
                {filteredMaterials.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-white">
                {materials.length}
              </span>{" "}
              materials
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
                setLocation("All");
                setDemand("All");
                setSortBy("latest");
              }}
              className="text-xs font-semibold text-blue-400 transition hover:text-blue-300"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {loading && (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-2xl border border-slate-800 bg-slate-900"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-6">
            <p className="font-semibold text-rose-300">
              Unable to load materials
            </p>
            <p className="mt-2 text-sm text-rose-200/70">
              {error}
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          filteredMaterials.length === 0 && (
            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950 text-2xl">
                ⌕
              </div>

              <h2 className="mt-5 text-xl font-bold">
                No materials found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Try changing your search or removing one of the
                active filters.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          filteredMaterials.length > 0 && (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredMaterials.map((material) => {
                const changeStyle = getChangeStyle(
                  material.change
                );

                return (
                  <Link
                    key={material._id}
                    href={`/materials/${encodeURIComponent(
                      material.name
                        .toLowerCase()
                        .trim()
                        .replace(/\s+/g, "-")
                    )}`}
                    className="group"
                  >
                    <article className="h-full rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-slate-900 hover:shadow-2xl hover:shadow-blue-950/20">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="mb-3 flex flex-wrap gap-2">
                            <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-300">
                              {material.category}
                            </span>

                            <span
                              className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${getDemandStyle(
                                material.demand
                              )}`}
                            >
                              {material.demand || "Medium"} Demand
                            </span>
                          </div>

                          <h2 className="text-2xl font-bold transition group-hover:text-blue-300">
                            {material.name}
                          </h2>

                          <p className="mt-1 text-sm text-slate-500">
                            {material.supplier}
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-slate-500 transition group-hover:border-blue-500/30 group-hover:text-blue-400">
                          →
                        </div>
                      </div>

                      <div className="mt-7">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Current Market Price
                        </p>

                        <div className="mt-2 flex items-end justify-between gap-4">
                          <div>
                            <span className="text-3xl font-bold tracking-tight">
                              ₹{formatPrice(material)}
                            </span>

                            <span className="ml-2 text-xs text-slate-500">
                              / unit
                            </span>
                          </div>

                          <div
                            className={`rounded-xl border px-3 py-2 text-sm font-bold ${changeStyle.box} ${changeStyle.text}`}
                          >
                            {changeStyle.icon}{" "}
                            {Number(material.change || 0) > 0
                              ? "+"
                              : ""}
                            {Number(material.change || 0).toFixed(1)}%
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 border-t border-slate-800 pt-5">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                              Location
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-300">
                              {material.location}
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                              Updated
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-300">
                              {formatDate(
                                material.lastUpdated ||
                                  material.updatedAt
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between text-xs">
                        <span className="text-slate-600">
                          MongoDB market record
                        </span>

                        <span className="font-semibold text-blue-400 opacity-0 transition group-hover:opacity-100">
                          View intelligence →
                        </span>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}

        {!loading && !error && (
          <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-blue-400/10 bg-blue-500/5 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-200">
                Live database connection
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Material records are being loaded from your
                MongoDB-backed API.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Connected
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-[11px] text-slate-600">
          Market values shown by this development version are
          database-backed demo records and should not be treated as
          live commodity exchange prices.
        </p>
      </section>
    </main>
  );
}