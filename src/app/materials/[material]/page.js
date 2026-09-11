import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Material from "@/lib/Material";

function normalizeSlug(value) {
  return decodeURIComponent(value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "Recently";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getChangeStatus(change) {
  const value = Number(change || 0);

  if (value > 0) {
    return {
      label: "Price Rising",
      text: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-400/20",
      icon: "↗",
    };
  }

  if (value < 0) {
    return {
      label: "Price Declining",
      text: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-400/20",
      icon: "↘",
    };
  }

  return {
    label: "Stable Market",
    text: "text-slate-300",
    bg: "bg-slate-800",
    border: "border-slate-700",
    icon: "→",
  };
}

function getDemandInsight(demand) {
  if (demand === "High") {
    return {
      title: "Strong Market Demand",
      description:
        "Demand is currently elevated. Procurement teams may benefit from monitoring supplier availability and locking in requirements early.",
    };
  }

  if (demand === "Low") {
    return {
      title: "Lower Market Demand",
      description:
        "Current demand is relatively soft. Buyers may have more flexibility when negotiating purchase timing and supplier terms.",
    };
  }

  return {
    title: "Balanced Market Demand",
    description:
      "Demand is currently moderate. Continue monitoring price movement before making large procurement decisions.",
  };
}

export default async function MaterialDetailPage({ params }) {
  const resolvedParams = await params;
  const slug = normalizeSlug(resolvedParams?.material);

  await connectDB();

  const materials = await Material.find({}).lean();

  const material = materials.find(
    (item) => normalizeSlug(item.name) === slug
  );

  if (!material) {
    notFound();
  }

  const change = Number(material.change || 0);
  const status = getChangeStatus(change);
  const demandInsight = getDemandInsight(material.demand);

  const history = Array.isArray(material.priceHistory)
    ? material.priceHistory
    : [];

  const sortedHistory = [...history].sort(
    (a, b) =>
      new Date(a.recordedAt) - new Date(b.recordedAt)
  );

  const prices = sortedHistory.map((item) =>
    Number(item.price || 0)
  );

  const highestPrice =
    prices.length > 0 ? Math.max(...prices) : Number(material.price);

  const lowestPrice =
    prices.length > 0 ? Math.min(...prices) : Number(material.price);

  const firstPrice =
    prices.length > 0 ? prices[0] : Number(material.price);

  const currentPrice = Number(material.price || 0);

  const historyChange =
    firstPrice > 0
      ? ((currentPrice - firstPrice) / firstPrice) * 100
      : 0;

  const relatedMaterials = materials
    .filter(
      (item) =>
        item._id.toString() !== material._id.toString() &&
        item.category === material.category
    )
    .slice(0, 3);

  const outlook =
    change >= 4
      ? "Upward pressure"
      : change > 0
      ? "Moderately positive"
      : change < -2
      ? "Downward pressure"
      : "Relatively stable";

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <a
              href="/materials"
              className="transition hover:text-blue-400"
            >
              Materials
            </a>

            <span>›</span>

            <span className="text-slate-300">
              {material.name}
            </span>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-300">
                  {material.category}
                </span>

                <span
                  className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${status.bg} ${status.border} ${status.text}`}
                >
                  {status.icon} {status.label}
                </span>

                <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {material.demand || "Medium"} Demand
                </span>
              </div>

              <h1 className="mt-5 text-5xl font-bold tracking-tight sm:text-6xl">
                {material.name}
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
                Detailed market intelligence for {material.name},
                including current pricing, historical movement,
                demand signals and supplier information.
              </p>

              <div className="mt-8 flex flex-wrap gap-3 text-sm">
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                  <span className="text-slate-500">
                    Supplier
                  </span>
                  <span className="ml-2 font-semibold text-white">
                    {material.supplier}
                  </span>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                  <span className="text-slate-500">
                    Market
                  </span>
                  <span className="ml-2 font-semibold text-white">
                    {material.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-7 shadow-2xl shadow-black/20">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Current Market Price
              </p>

              <div className="mt-3">
                <span className="text-5xl font-bold tracking-tight">
                  ₹{formatPrice(material.price)}
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-600">
                Indicative database value / unit
              </p>

              <div
                className={`mt-6 rounded-2xl border p-4 ${status.bg} ${status.border}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    Current movement
                  </span>

                  <span
                    className={`text-lg font-bold ${status.text}`}
                  >
                    {change > 0 ? "+" : ""}
                    {change.toFixed(2)}%
                  </span>
                </div>

                <p className={`mt-2 text-xs ${status.text}`}>
                  {status.label}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-5 text-xs">
                <span className="text-slate-500">
                  Last updated
                </span>

                <span className="font-semibold text-slate-300">
                  {formatDate(
                    material.lastUpdated ||
                      material.updatedAt
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid gap-5 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Market Outlook
            </p>

            <p className="mt-3 text-xl font-bold text-blue-300">
              {outlook}
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Based on the current price movement signal.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Demand Signal
            </p>

            <p className="mt-3 text-xl font-bold">
              {material.demand || "Medium"}
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {demandInsight.description}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Historical Change
            </p>

            <p
              className={`mt-3 text-xl font-bold ${
                historyChange > 0
                  ? "text-emerald-400"
                  : historyChange < 0
                  ? "text-rose-400"
                  : "text-slate-300"
              }`}
            >
              {historyChange > 0 ? "+" : ""}
              {historyChange.toFixed(2)}%
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Change from the first stored history record to now.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Market Location
            </p>

            <p className="mt-3 text-xl font-bold">
              {material.location}
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Current monitored market location.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-7">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Price History
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Historical market movement
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {sortedHistory.length} recorded price points
                </p>
              </div>

              <div className="flex gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Low
                  </p>
                  <p className="mt-1 font-bold">
                    ₹{formatPrice(lowestPrice)}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    High
                  </p>
                  <p className="mt-1 font-bold">
                    ₹{formatPrice(highestPrice)}
                  </p>
                </div>
              </div>
            </div>

            {sortedHistory.length > 0 ? (
              <>
                <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                  <div className="flex h-64 items-end gap-2">
                    {sortedHistory.map((point, index) => {
                      const price = Number(point.price || 0);

                      const range =
                        highestPrice - lowestPrice;

                      const height =
                        range > 0
                          ? 18 +
                            ((price - lowestPrice) / range) *
                              82
                          : 55;

                      const pointChange = Number(
                        point.change || 0
                      );

                      return (
                        <div
                          key={`${point.recordedAt}-${index}`}
                          className="group relative flex h-full flex-1 items-end"
                        >
                          <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs shadow-xl group-hover:block">
                            <p className="font-semibold text-white">
                              ₹{formatPrice(price)}
                            </p>

                            <p className="mt-1 text-slate-500">
                              {formatDate(point.recordedAt)}
                            </p>
                          </div>

                          <div
                            className="w-full rounded-t-lg bg-gradient-to-t from-blue-600/30 to-cyan-400/80 transition duration-300 group-hover:from-blue-500/50 group-hover:to-cyan-300"
                            style={{
                              height: `${height}%`,
                            }}
                          />

                          <span className="absolute -bottom-6 left-1/2 hidden -translate-x-1/2 whitespace-nowrap text-[9px] text-slate-600 md:block">
                            {new Date(
                              point.recordedAt
                            ).toLocaleDateString("en-IN", {
                              month: "short",
                            })}
                          </span>

                          <span
                            className={`absolute -top-5 left-1/2 hidden -translate-x-1/2 text-[8px] font-semibold md:block ${
                              pointChange > 0
                                ? "text-emerald-500"
                                : pointChange < 0
                                ? "text-rose-500"
                                : "text-slate-600"
                            }`}
                          >
                            {pointChange > 0 ? "+" : ""}
                            {pointChange.toFixed(1)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-12 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-[10px] uppercase tracking-wider text-slate-600">
                      First Recorded
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-300">
                      {formatDate(
                        sortedHistory[0]?.recordedAt
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-[10px] uppercase tracking-wider text-slate-600">
                      Latest Recorded
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-300">
                      {formatDate(
                        sortedHistory[
                          sortedHistory.length - 1
                        ]?.recordedAt
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-[10px] uppercase tracking-wider text-slate-600">
                      Trend
                    </p>
                    <p
                      className={`mt-2 text-sm font-semibold ${
                        historyChange > 0
                          ? "text-emerald-400"
                          : historyChange < 0
                          ? "text-rose-400"
                          : "text-slate-400"
                      }`}
                    >
                      {historyChange > 0
                        ? "Upward"
                        : historyChange < 0
                        ? "Downward"
                        : "Stable"}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-10 text-center">
                <p className="text-sm text-slate-500">
                  No historical price records are available yet.
                </p>
              </div>
            )}

            <p className="mt-6 text-xs leading-5 text-slate-600">
              Historical values are development/demo records
              generated for this application. They are not live
              commodity exchange prices.
            </p>
          </section>

          <section className="rounded-3xl border border-blue-400/10 bg-blue-500/5 p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-lg">
                ✦
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                  Market Intelligence
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Procurement Signal
                </h2>
              </div>
            </div>

            <p className="mt-6 text-sm leading-7 text-slate-300">
              {material.name} is currently showing{" "}
              <span className="font-semibold text-white">
                {change > 0
                  ? "upward"
                  : change < 0
                  ? "downward"
                  : "stable"}
              </span>{" "}
              price momentum with{" "}
              <span className="font-semibold text-white">
                {material.demand || "Medium"}
              </span>{" "}
              demand.
            </p>

            <div className="mt-6 rounded-2xl border border-blue-400/10 bg-slate-950/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Recommended action
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {change >= 4
                  ? "Consider reviewing procurement requirements early and comparing supplier quotations before prices move further."
                  : change > 0
                  ? "Continue monitoring the market and compare multiple suppliers before committing to large-volume purchases."
                  : change < -2
                  ? "A declining signal may provide a potential purchasing window, subject to supplier availability and project requirements."
                  : "Maintain normal monitoring and review supplier quotations before major procurement decisions."}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-slate-600">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              Rule-based intelligence • No external API required
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Supplier Intelligence
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Current supplier
              </h2>
            </div>

            <a
              href="/suppliers"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-blue-500/40 hover:text-blue-300"
            >
              Explore Suppliers →
            </a>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Supplier
              </p>

              <p className="mt-2 text-lg font-bold">
                {material.supplier}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Category
              </p>

              <p className="mt-2 text-lg font-bold">
                {material.category}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Location
              </p>

              <p className="mt-2 text-lg font-bold">
                {material.location}
              </p>
            </div>
          </div>
        </section>

        {relatedMaterials.length > 0 && (
          <section className="mt-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Related Materials
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                More in {material.category}
              </h2>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {relatedMaterials.map((item) => {
                const itemChange = Number(item.change || 0);

                return (
                  <a
                    key={item._id}
                    href={`/materials/${encodeURIComponent(
                      item.name
                        .toLowerCase()
                        .trim()
                        .replace(/\s+/g, "-")
                    )}`}
                    className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:-translate-y-1 hover:border-blue-500/40"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-bold">
                        {item.name}
                      </h3>

                      <span
                        className={
                          itemChange > 0
                            ? "text-emerald-400"
                            : itemChange < 0
                            ? "text-rose-400"
                            : "text-slate-400"
                        }
                      >
                        {itemChange > 0 ? "+" : ""}
                        {itemChange.toFixed(1)}%
                      </span>
                    </div>

                    <p className="mt-3 text-2xl font-bold">
                      ₹{formatPrice(item.price)}
                    </p>

                    <p className="mt-2 text-xs text-slate-600">
                      {item.supplier} • {item.location}
                    </p>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-5 text-center">
          <p className="text-xs leading-5 text-slate-600">
            BuildPrice AI uses database-backed development data.
            Market intelligence is rule-based and informational;
            it does not represent live commodity-market predictions.
          </p>
        </div>
      </section>
    </main>
  );
}