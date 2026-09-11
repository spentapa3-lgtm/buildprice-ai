"use client";

import { useEffect, useMemo, useState } from "react";

export default function ReportsPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("Current");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    async function loadMaterials() {
      try {
        setLoading(true);

        const response = await fetch("/api/materials", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to load report data."
          );
        }

        setMaterials(result.data || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load report data.");
      } finally {
        setLoading(false);
      }
    }

    loadMaterials();
  }, []);

  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(materials.map((material) => material.category))
      ),
    ];
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    if (category === "All") {
      return materials;
    }

    return materials.filter(
      (material) => material.category === category
    );
  }, [materials, category]);

  const statistics = useMemo(() => {
    if (!filteredMaterials.length) {
      return {
        averagePrice: 0,
        averageChange: 0,
        rising: 0,
        falling: 0,
        highDemand: 0,
        highest: null,
        lowest: null,
      };
    }

    const averagePrice =
      filteredMaterials.reduce(
        (sum, material) => sum + Number(material.price || 0),
        0
      ) / filteredMaterials.length;

    const averageChange =
      filteredMaterials.reduce(
        (sum, material) => sum + Number(material.change || 0),
        0
      ) / filteredMaterials.length;

    const rising = filteredMaterials.filter(
      (material) => Number(material.change || 0) > 0
    ).length;

    const falling = filteredMaterials.filter(
      (material) => Number(material.change || 0) < 0
    ).length;

    const highDemand = filteredMaterials.filter(
      (material) => material.demand === "High"
    ).length;

    const sorted = [...filteredMaterials].sort(
      (a, b) => Number(b.change || 0) - Number(a.change || 0)
    );

    const highest = sorted[0];

    const lowest = [...filteredMaterials].sort(
      (a, b) => Number(a.change || 0) - Number(b.change || 0)
    )[0];

    return {
      averagePrice,
      averageChange,
      rising,
      falling,
      highDemand,
      highest,
      lowest,
    };
  }, [filteredMaterials]);

  const marketStatus =
    statistics.averageChange > 2
      ? "Bullish"
      : statistics.averageChange < -1
      ? "Cooling"
      : "Stable";

  const marketStatusClass =
    marketStatus === "Bullish"
      ? "status-positive"
      : marketStatus === "Cooling"
      ? "status-negative"
      : "status-neutral";

  function formatPrice(price) {
    return `₹${Number(price || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  }

  function formatChange(change) {
    const value = Number(change || 0);

    if (value > 0) {
      return `+${value.toFixed(1)}%`;
    }

    return `${value.toFixed(1)}%`;
  }

  function printReport() {
    window.print();
  }

  return (
    <main className="reports-page">
      <style jsx>{`
        .reports-page {
          min-height: calc(100vh - 72px);
          background:
            radial-gradient(
              circle at 10% 0%,
              rgba(59, 130, 246, 0.12),
              transparent 30%
            ),
            radial-gradient(
              circle at 90% 10%,
              rgba(16, 185, 129, 0.1),
              transparent 28%
            ),
            #f6f8fc;
          color: #111827;
          padding: 42px 28px 70px;
        }

        .container {
          max-width: 1250px;
          margin: 0 auto;
        }

        .hero {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          margin-bottom: 28px;
        }

        .eyebrow {
          color: #2563eb;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        h1 {
          margin: 0;
          font-size: clamp(32px, 5vw, 52px);
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .subtitle {
          margin: 13px 0 0;
          color: #667085;
          max-width: 700px;
          font-size: 15px;
          line-height: 1.7;
        }

        .actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        button,
        select {
          font: inherit;
        }

        .print-btn {
          border: 0;
          background: #111827;
          color: white;
          padding: 12px 18px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(17, 24, 39, 0.15);
        }

        .print-btn:hover {
          transform: translateY(-1px);
          background: #1f2937;
        }

        .filters {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          background: rgba(255, 255, 255, 0.86);
          border: 1px solid #e6eaf0;
          border-radius: 18px;
          padding: 15px;
          margin-bottom: 20px;
          box-shadow: 0 10px 35px rgba(15, 23, 42, 0.05);
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .filter-label {
          color: #667085;
          font-size: 13px;
          font-weight: 700;
        }

        .filter-btn {
          border: 1px solid #e3e7ed;
          background: white;
          color: #475467;
          padding: 9px 14px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 700;
        }

        .filter-btn.active {
          background: #2563eb;
          color: white;
          border-color: #2563eb;
        }

        .category-select {
          border: 1px solid #e3e7ed;
          background: white;
          color: #344054;
          padding: 10px 35px 10px 12px;
          border-radius: 10px;
          outline: none;
          cursor: pointer;
        }

        .status-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 18px 20px;
          border-radius: 18px;
          background: linear-gradient(
            135deg,
            #101828,
            #1d2939
          );
          color: white;
          margin-bottom: 22px;
          box-shadow: 0 15px 40px rgba(15, 23, 42, 0.14);
        }

        .status-title {
          font-size: 13px;
          color: #98a2b3;
          margin-bottom: 4px;
        }

        .status-text {
          font-size: 20px;
          font-weight: 800;
        }

        .status-description {
          color: #cbd5e1;
          font-size: 13px;
          margin-top: 4px;
        }

        .status-pill {
          padding: 9px 14px;
          border-radius: 999px;
          font-weight: 800;
          font-size: 13px;
          background: rgba(255, 255, 255, 0.1);
        }

        .status-positive {
          color: #6ee7b7;
        }

        .status-negative {
          color: #fca5a5;
        }

        .status-neutral {
          color: #fde68a;
        }

        .kpis {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 22px;
        }

        .kpi {
          background: white;
          border: 1px solid #e7eaf0;
          border-radius: 18px;
          padding: 20px;
          box-shadow: 0 8px 28px rgba(15, 23, 42, 0.05);
        }

        .kpi-label {
          color: #667085;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .kpi-value {
          margin-top: 9px;
          font-size: 28px;
          font-weight: 850;
          letter-spacing: -0.03em;
        }

        .kpi-note {
          margin-top: 7px;
          color: #98a2b3;
          font-size: 12px;
        }

        .main-grid {
          display: grid;
          grid-template-columns: 1.35fr 0.65fr;
          gap: 20px;
          margin-bottom: 22px;
        }

        .panel {
          background: white;
          border: 1px solid #e7eaf0;
          border-radius: 20px;
          padding: 22px;
          box-shadow: 0 8px 28px rgba(15, 23, 42, 0.05);
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .panel-title {
          margin: 0;
          font-size: 17px;
          font-weight: 850;
        }

        .panel-subtitle {
          margin: 5px 0 0;
          color: #98a2b3;
          font-size: 12px;
        }

        .chart {
          height: 270px;
          display: flex;
          align-items: flex-end;
          gap: 13px;
          padding: 20px 8px 8px;
          border-bottom: 1px solid #eaecf0;
        }

        .bar-wrap {
          flex: 1;
          height: 100%;
          min-width: 24px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          gap: 8px;
        }

        .bar {
          width: min(42px, 80%);
          min-height: 8px;
          border-radius: 8px 8px 3px 3px;
          background: linear-gradient(
            180deg,
            #60a5fa,
            #2563eb
          );
          transition: height 0.4s ease;
        }

        .bar.negative {
          background: linear-gradient(
            180deg,
            #fca5a5,
            #ef4444
          );
        }

        .bar-label {
          color: #98a2b3;
          font-size: 10px;
          text-align: center;
          white-space: nowrap;
        }

        .insight-box {
          border-radius: 15px;
          padding: 17px;
          background: #f8fafc;
          border: 1px solid #e8edf3;
          margin-bottom: 13px;
        }

        .insight-heading {
          display: flex;
          align-items: center;
          gap: 9px;
          font-weight: 800;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .insight-box p {
          margin: 0;
          color: #667085;
          font-size: 13px;
          line-height: 1.65;
        }

        .table-panel {
          margin-bottom: 22px;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 720px;
        }

        th {
          text-align: left;
          color: #98a2b3;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 12px;
          border-bottom: 1px solid #eaecf0;
        }

        td {
          padding: 15px 12px;
          border-bottom: 1px solid #f0f2f5;
          font-size: 13px;
        }

        .material-name {
          font-weight: 800;
          color: #101828;
        }

        .muted {
          color: #667085;
        }

        .change-positive {
          color: #039855;
          font-weight: 800;
        }

        .change-negative {
          color: #d92d20;
          font-weight: 800;
        }

        .demand {
          display: inline-flex;
          padding: 5px 9px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
        }

        .demand-high {
          background: #fef3f2;
          color: #d92d20;
        }

        .demand-medium {
          background: #fffaeb;
          color: #b54708;
        }

        .demand-low {
          background: #ecfdf3;
          color: #027a48;
        }

        .footer-note {
          color: #98a2b3;
          text-align: center;
          font-size: 12px;
          margin-top: 22px;
        }

        .loading,
        .error {
          max-width: 1250px;
          margin: 80px auto;
          text-align: center;
          padding: 30px;
          background: white;
          border-radius: 18px;
          border: 1px solid #e7eaf0;
        }

        .error {
          color: #b42318;
        }

        @media (max-width: 950px) {
          .kpis {
            grid-template-columns: repeat(2, 1fr);
          }

          .main-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 650px) {
          .reports-page {
            padding: 28px 15px 50px;
          }

          .hero {
            align-items: flex-start;
            flex-direction: column;
          }

          .actions {
            width: 100%;
          }

          .print-btn {
            width: 100%;
          }

          .kpis {
            grid-template-columns: 1fr;
          }

          .status-banner {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media print {
          .reports-page {
            background: white;
            padding: 0;
          }

          .filters,
          .actions,
          .footer-note {
            display: none !important;
          }

          .panel,
          .kpi,
          .status-banner {
            box-shadow: none;
          }
        }
      `}</style>

      {loading ? (
        <div className="loading">
          <h2>Generating market report...</h2>
          <p className="muted">
            Loading the latest material data from MongoDB.
          </p>
        </div>
      ) : error ? (
        <div className="error">
          <h2>Unable to generate report</h2>
          <p>{error}</p>
        </div>
      ) : (
        <div className="container">
          <section className="hero">
            <div>
              <div className="eyebrow">
                BuildPrice AI · Intelligence Report
              </div>

              <h1>Market Reports</h1>

              <p className="subtitle">
                A consolidated view of material pricing, market
                movement and procurement signals for construction
                planning.
              </p>
            </div>

            <div className="actions">
              <button
                className="print-btn"
                onClick={printReport}
              >
                Print / Export PDF
              </button>
            </div>
          </section>

          <section className="filters">
            <div className="filter-group">
              <span className="filter-label">Period</span>

              {["Current", "30 Days", "90 Days"].map((item) => (
                <button
                  key={item}
                  className={`filter-btn ${
                    period === item ? "active" : ""
                  }`}
                  onClick={() => setPeriod(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="filter-group">
              <span className="filter-label">Category</span>

              <select
                className="category-select"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className="status-banner">
            <div>
              <div className="status-title">
                Current Market Position
              </div>

              <div className={`status-text ${marketStatusClass}`}>
                {marketStatus} Market
              </div>

              <div className="status-description">
                Average tracked movement is{" "}
                {formatChange(statistics.averageChange)} across{" "}
                {filteredMaterials.length} materials.
              </div>
            </div>

            <div className={`status-pill ${marketStatusClass}`}>
              {statistics.averageChange >= 0 ? "↗" : "↘"}{" "}
              {formatChange(statistics.averageChange)}
            </div>
          </section>

          <section className="kpis">
            <div className="kpi">
              <div className="kpi-label">Average Price</div>
              <div className="kpi-value">
                {formatPrice(statistics.averagePrice)}
              </div>
              <div className="kpi-note">
                Across selected materials
              </div>
            </div>

            <div className="kpi">
              <div className="kpi-label">Price Movement</div>
              <div
                className={`kpi-value ${
                  statistics.averageChange >= 0
                    ? "change-positive"
                    : "change-negative"
                }`}
              >
                {formatChange(statistics.averageChange)}
              </div>
              <div className="kpi-note">
                Average market movement
              </div>
            </div>

            <div className="kpi">
              <div className="kpi-label">Rising Materials</div>
              <div className="kpi-value">
                {statistics.rising}
              </div>
              <div className="kpi-note">
                Showing positive movement
              </div>
            </div>

            <div className="kpi">
              <div className="kpi-label">High Demand</div>
              <div className="kpi-value">
                {statistics.highDemand}
              </div>
              <div className="kpi-note">
                Materials requiring attention
              </div>
            </div>
          </section>

          <section className="main-grid">
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">
                    Material Movement
                  </h2>
                  <p className="panel-subtitle">
                    Current percentage movement by material
                  </p>
                </div>
              </div>

              {filteredMaterials.length ? (
                <div className="chart">
                  {filteredMaterials.map((material) => {
                    const change = Number(material.change || 0);
                    const maxChange = Math.max(
                      ...filteredMaterials.map((item) =>
                        Math.abs(Number(item.change || 0))
                      ),
                      1
                    );

                    const height =
                      18 +
                      (Math.abs(change) / maxChange) * 72;

                    return (
                      <div
                        className="bar-wrap"
                        key={material._id || material.name}
                        title={`${material.name}: ${formatChange(
                          change
                        )}`}
                      >
                        <div
                          className={`bar ${
                            change < 0 ? "negative" : ""
                          }`}
                          style={{ height: `${height}%` }}
                        />

                        <div className="bar-label">
                          {material.name.length > 9
                            ? `${material.name.slice(0, 8)}…`
                            : material.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="muted">
                  No materials available for this category.
                </p>
              )}
            </div>

            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">
                    Executive Intelligence
                  </h2>
                  <p className="panel-subtitle">
                    Rule-based procurement observations
                  </p>
                </div>
              </div>

              {statistics.highest && (
                <div className="insight-box">
                  <div className="insight-heading">
                    🚀 Biggest Upward Move
                  </div>

                  <p>
                    {statistics.highest.name} is showing the
                    strongest positive movement at{" "}
                    <strong>
                      {formatChange(statistics.highest.change)}
                    </strong>
                    .
                  </p>
                </div>
              )}

              {statistics.lowest && (
                <div className="insight-box">
                  <div className="insight-heading">
                    📉 Biggest Downward Move
                  </div>

                  <p>
                    {statistics.lowest.name} has the weakest
                    movement at{" "}
                    <strong>
                      {formatChange(statistics.lowest.change)}
                    </strong>
                    .
                  </p>
                </div>
              )}

              <div className="insight-box">
                <div className="insight-heading">
                  🏗️ Procurement Signal
                </div>

                <p>
                  {statistics.highDemand > 0
                    ? `${statistics.highDemand} high-demand material${
                        statistics.highDemand > 1 ? "s are" : " is"
                      } currently being tracked. Procurement teams should review upcoming requirements early.`
                    : "No high-demand materials are currently flagged in the selected category."}
                </p>
              </div>
            </div>
          </section>

          <section className="panel table-panel">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">
                  Detailed Market Report
                </h2>
                <p className="panel-subtitle">
                  Material-level pricing and supplier information
                </p>
              </div>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Category</th>
                    <th>Current Price</th>
                    <th>Movement</th>
                    <th>Demand</th>
                    <th>Supplier</th>
                    <th>Location</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMaterials.map((material) => {
                    const change = Number(material.change || 0);

                    return (
                      <tr
                        key={material._id || material.name}
                      >
                        <td className="material-name">
                          {material.name}
                        </td>

                        <td className="muted">
                          {material.category}
                        </td>

                        <td>
                          {formatPrice(material.price)}
                        </td>

                        <td
                          className={
                            change >= 0
                              ? "change-positive"
                              : "change-negative"
                          }
                        >
                          {formatChange(change)}
                        </td>

                        <td>
                          <span
                            className={`demand ${
                              material.demand === "High"
                                ? "demand-high"
                                : material.demand === "Low"
                                ? "demand-low"
                                : "demand-medium"
                            }`}
                          >
                            {material.demand}
                          </span>
                        </td>

                        <td className="muted">
                          {material.supplier}
                        </td>

                        <td className="muted">
                          {material.location}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <div className="footer-note">
            BuildPrice AI · Report generated from your MongoDB
            material dataset · Current values are development/demo
            data and are not live commodity-market prices.
          </div>
        </div>
      )}
    </main>
  );
}