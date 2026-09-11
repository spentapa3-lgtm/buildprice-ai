"use client";

import { useEffect, useMemo, useState } from "react";

export default function SuppliersPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All");
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
            result.message || "Failed to load supplier data."
          );
        }

        setMaterials(result.data || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load supplier data.");
      } finally {
        setLoading(false);
      }
    }

    loadMaterials();
  }, []);

  const cities = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(materials.map((material) => material.location))
      ),
    ];
  }, [materials]);

  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(materials.map((material) => material.category))
      ),
    ];
  }, [materials]);

  const suppliers = useMemo(() => {
    const supplierMap = new Map();

    materials.forEach((material) => {
      const supplierName = material.supplier;

      if (!supplierMap.has(supplierName)) {
        supplierMap.set(supplierName, {
          name: supplierName,
          locations: [],
          materials: [],
          categories: [],
          prices: [],
          changes: [],
          highDemand: 0,
        });
      }

      const supplier = supplierMap.get(supplierName);

      if (!supplier.locations.includes(material.location)) {
        supplier.locations.push(material.location);
      }

      if (!supplier.materials.includes(material.name)) {
        supplier.materials.push(material.name);
      }

      if (!supplier.categories.includes(material.category)) {
        supplier.categories.push(material.category);
      }

      supplier.prices.push(Number(material.price || 0));
      supplier.changes.push(Number(material.change || 0));

      if (material.demand === "High") {
        supplier.highDemand += 1;
      }
    });

    return Array.from(supplierMap.values()).map((supplier) => ({
      ...supplier,
      averagePrice:
        supplier.prices.reduce((sum, price) => sum + price, 0) /
        supplier.prices.length,
      averageChange:
        supplier.changes.reduce((sum, change) => sum + change, 0) /
        supplier.changes.length,
    }));
  }, [materials]);

  const filteredSuppliers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return suppliers.filter((supplier) => {
      const matchesSearch =
        !query ||
        supplier.name.toLowerCase().includes(query) ||
        supplier.materials.some((material) =>
          material.toLowerCase().includes(query)
        );

      const matchesCity =
        city === "All" || supplier.locations.includes(city);

      const matchesCategory =
        category === "All" ||
        supplier.categories.includes(category);

      return matchesSearch && matchesCity && matchesCategory;
    });
  }, [suppliers, search, city, category]);

  const supplierStats = useMemo(() => {
    const total = filteredSuppliers.length;

    const highDemandSuppliers = filteredSuppliers.filter(
      (supplier) => supplier.highDemand > 0
    ).length;

    const risingSuppliers = filteredSuppliers.filter(
      (supplier) => supplier.averageChange > 0
    ).length;

    const locations = new Set();

    filteredSuppliers.forEach((supplier) => {
      supplier.locations.forEach((location) =>
        locations.add(location)
      );
    });

    return {
      total,
      highDemandSuppliers,
      risingSuppliers,
      locations: locations.size,
    };
  }, [filteredSuppliers]);

  function formatPrice(price) {
    return `₹${Number(price || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;
  }

  function formatChange(change) {
    const value = Number(change || 0);

    return value > 0
      ? `+${value.toFixed(1)}%`
      : `${value.toFixed(1)}%`;
  }

  function getSupplierStatus(change, highDemand) {
    if (highDemand > 0 && change > 0) {
      return {
        label: "High Attention",
        className: "attention",
      };
    }

    if (change > 0) {
      return {
        label: "Price Rising",
        className: "rising",
      };
    }

    if (change < 0) {
      return {
        label: "Favorable",
        className: "favorable",
      };
    }

    return {
      label: "Stable",
      className: "stable",
    };
  }

  function contactSupplier(supplier) {
    alert(
      `Supplier contact workflow for ${supplier.name} can be connected to email, phone, or procurement messaging in the next backend phase.`
    );
  }

  return (
    <main className="suppliers-page">
      <style jsx>{`
        .suppliers-page {
          min-height: calc(100vh - 72px);
          background:
            radial-gradient(
              circle at 8% 0%,
              rgba(37, 99, 235, 0.1),
              transparent 28%
            ),
            radial-gradient(
              circle at 92% 5%,
              rgba(16, 185, 129, 0.1),
              transparent 26%
            ),
            #f6f8fc;
          padding: 42px 28px 70px;
          color: #101828;
        }

        .container {
          max-width: 1250px;
          margin: 0 auto;
        }

        .hero {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 30px;
          margin-bottom: 28px;
        }

        .eyebrow {
          color: #2563eb;
          font-size: 12px;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 9px;
        }

        h1 {
          margin: 0;
          font-size: clamp(34px, 5vw, 52px);
          letter-spacing: -0.045em;
          line-height: 1;
        }

        .subtitle {
          max-width: 720px;
          margin: 13px 0 0;
          color: #667085;
          font-size: 15px;
          line-height: 1.7;
        }

        .live-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: 1px solid #e4e7ec;
          border-radius: 999px;
          padding: 10px 14px;
          color: #475467;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #12b76a;
          box-shadow: 0 0 0 4px rgba(18, 183, 106, 0.1);
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        }

        .stat {
          background: white;
          border: 1px solid #e7eaf0;
          border-radius: 18px;
          padding: 19px;
          box-shadow: 0 8px 28px rgba(15, 23, 42, 0.05);
        }

        .stat-label {
          color: #667085;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        .stat-value {
          margin-top: 8px;
          font-size: 29px;
          font-weight: 850;
          letter-spacing: -0.03em;
        }

        .stat-note {
          margin-top: 5px;
          color: #98a2b3;
          font-size: 12px;
        }

        .filters {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 12px;
          background: white;
          border: 1px solid #e7eaf0;
          border-radius: 18px;
          padding: 15px;
          margin-bottom: 22px;
          box-shadow: 0 8px 28px rgba(15, 23, 42, 0.05);
        }

        .input,
        .select {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #dfe3e8;
          background: #fbfcfe;
          border-radius: 11px;
          padding: 12px 13px;
          outline: none;
          color: #344054;
          font-size: 13px;
        }

        .input:focus,
        .select:focus {
          border-color: #84adff;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 14px;
        }

        .section-title {
          margin: 0;
          font-size: 18px;
          font-weight: 850;
        }

        .section-note {
          color: #98a2b3;
          font-size: 12px;
        }

        .supplier-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .supplier-card {
          position: relative;
          overflow: hidden;
          background: white;
          border: 1px solid #e6eaf0;
          border-radius: 20px;
          padding: 21px;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.055);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }

        .supplier-card:hover {
          transform: translateY(-4px);
          border-color: #cbd5e1;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.09);
        }

        .supplier-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .supplier-icon {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: linear-gradient(
            135deg,
            #eff6ff,
            #dbeafe
          );
          font-size: 21px;
        }

        .supplier-name {
          margin: 13px 0 4px;
          font-size: 18px;
          font-weight: 850;
        }

        .location {
          color: #667085;
          font-size: 12px;
        }

        .status {
          border-radius: 999px;
          padding: 6px 9px;
          font-size: 10px;
          font-weight: 850;
          white-space: nowrap;
        }

        .status.attention {
          background: #fff1f3;
          color: #c01048;
        }

        .status.rising {
          background: #fff7ed;
          color: #c2410c;
        }

        .status.favorable {
          background: #ecfdf3;
          color: #027a48;
        }

        .status.stable {
          background: #f2f4f7;
          color: #475467;
        }

        .divider {
          height: 1px;
          background: #f0f2f5;
          margin: 17px 0;
        }

        .metric-row {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 10px;
        }

        .metric-label {
          color: #98a2b3;
          font-size: 11px;
        }

        .metric-value {
          color: #344054;
          font-size: 12px;
          font-weight: 800;
          text-align: right;
        }

        .positive {
          color: #039855;
        }

        .negative {
          color: #d92d20;
        }

        .material-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 13px;
        }

        .material-tag {
          background: #f8fafc;
          border: 1px solid #eaecf0;
          color: #475467;
          border-radius: 7px;
          padding: 5px 8px;
          font-size: 10px;
          font-weight: 700;
        }

        .contact-btn {
          width: 100%;
          border: 0;
          margin-top: 17px;
          padding: 11px 14px;
          border-radius: 11px;
          background: #111827;
          color: white;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .contact-btn:hover {
          background: #2563eb;
        }

        .empty {
          grid-column: 1 / -1;
          background: white;
          border: 1px dashed #d0d5dd;
          border-radius: 20px;
          text-align: center;
          padding: 55px 20px;
        }

        .empty-icon {
          font-size: 38px;
          margin-bottom: 10px;
        }

        .empty h3 {
          margin: 0;
          font-size: 18px;
        }

        .empty p {
          margin: 8px 0 0;
          color: #667085;
          font-size: 13px;
        }

        .footer-note {
          text-align: center;
          color: #98a2b3;
          font-size: 12px;
          margin-top: 28px;
        }

        .loading,
        .error {
          max-width: 1250px;
          margin: 80px auto;
          background: white;
          border-radius: 18px;
          padding: 30px;
          text-align: center;
          border: 1px solid #e7eaf0;
        }

        .error {
          color: #b42318;
        }

        @media (max-width: 1000px) {
          .supplier-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .filters {
            grid-template-columns: 1fr 1fr;
          }

          .filters .input {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 650px) {
          .suppliers-page {
            padding: 28px 15px 50px;
          }

          .hero {
            flex-direction: column;
            align-items: flex-start;
          }

          .stats {
            grid-template-columns: 1fr;
          }

          .filters {
            grid-template-columns: 1fr;
          }

          .filters .input {
            grid-column: auto;
          }

          .supplier-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {loading ? (
        <div className="loading">
          <h2>Loading supplier intelligence...</h2>
          <p>
            Reading supplier relationships from your MongoDB
            material dataset.
          </p>
        </div>
      ) : error ? (
        <div className="error">
          <h2>Unable to load suppliers</h2>
          <p>{error}</p>
        </div>
      ) : (
        <div className="container">
          <section className="hero">
            <div>
              <div className="eyebrow">
                BuildPrice AI · Procurement Network
              </div>

              <h1>Supplier Intelligence</h1>

              <p className="subtitle">
                Analyze supplier coverage, material relationships,
                demand exposure and current price movement to
                support smarter procurement decisions.
              </p>
            </div>

            <div className="live-badge">
              <span className="live-dot" />
              MongoDB Connected
            </div>
          </section>

          <section className="stats">
            <div className="stat">
              <div className="stat-label">
                Suppliers Tracked
              </div>

              <div className="stat-value">
                {supplierStats.total}
              </div>

              <div className="stat-note">
                Based on current material records
              </div>
            </div>

            <div className="stat">
              <div className="stat-label">
                Locations Covered
              </div>

              <div className="stat-value">
                {supplierStats.locations}
              </div>

              <div className="stat-note">
                Supplier market locations
              </div>
            </div>

            <div className="stat">
              <div className="stat-label">
                High Attention
              </div>

              <div className="stat-value">
                {supplierStats.highDemandSuppliers}
              </div>

              <div className="stat-note">
                Suppliers linked to high-demand materials
              </div>
            </div>

            <div className="stat">
              <div className="stat-label">
                Rising Exposure
              </div>

              <div className="stat-value">
                {supplierStats.risingSuppliers}
              </div>

              <div className="stat-note">
                Suppliers with upward price movement
              </div>
            </div>
          </section>

          <section className="filters">
            <input
              className="input"
              type="text"
              placeholder="Search suppliers or materials..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            <select
              className="select"
              value={city}
              onChange={(event) => setCity(event.target.value)}
            >
              {cities.map((item) => (
                <option key={item} value={item}>
                  {item === "All"
                    ? "All locations"
                    : item}
                </option>
              ))}
            </select>

            <select
              className="select"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === "All"
                    ? "All categories"
                    : item}
                </option>
              ))}
            </select>
          </section>

          <section>
            <div className="section-header">
              <div>
                <h2 className="section-title">
                  Supplier Network
                </h2>

                <div className="section-note">
                  {filteredSuppliers.length} supplier
                  {filteredSuppliers.length === 1 ? "" : "s"}{" "}
                  matching your filters
                </div>
              </div>
            </div>

            <div className="supplier-grid">
              {filteredSuppliers.length ? (
                filteredSuppliers.map((supplier) => {
                  const status = getSupplierStatus(
                    supplier.averageChange,
                    supplier.highDemand
                  );

                  return (
                    <article
                      className="supplier-card"
                      key={supplier.name}
                    >
                      <div className="supplier-top">
                        <div className="supplier-icon">
                          🏢
                        </div>

                        <span
                          className={`status ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      <h3 className="supplier-name">
                        {supplier.name}
                      </h3>

                      <div className="location">
                        📍 {supplier.locations.join(" · ")}
                      </div>

                      <div className="divider" />

                      <div className="metric-row">
                        <span className="metric-label">
                          Materials
                        </span>

                        <span className="metric-value">
                          {supplier.materials.length}
                        </span>
                      </div>

                      <div className="metric-row">
                        <span className="metric-label">
                          Categories
                        </span>

                        <span className="metric-value">
                          {supplier.categories.length}
                        </span>
                      </div>

                      <div className="metric-row">
                        <span className="metric-label">
                          Avg. tracked price
                        </span>

                        <span className="metric-value">
                          {formatPrice(
                            supplier.averagePrice
                          )}
                        </span>
                      </div>

                      <div className="metric-row">
                        <span className="metric-label">
                          Avg. movement
                        </span>

                        <span
                          className={`metric-value ${
                            supplier.averageChange >= 0
                              ? "positive"
                              : "negative"
                          }`}
                        >
                          {formatChange(
                            supplier.averageChange
                          )}
                        </span>
                      </div>

                      <div className="metric-row">
                        <span className="metric-label">
                          High-demand materials
                        </span>

                        <span className="metric-value">
                          {supplier.highDemand}
                        </span>
                      </div>

                      <div className="material-list">
                        {supplier.materials.map((material) => (
                          <span
                            className="material-tag"
                            key={material}
                          >
                            {material}
                          </span>
                        ))}
                      </div>

                      <button
                        className="contact-btn"
                        onClick={() =>
                          contactSupplier(supplier)
                        }
                      >
                        Contact Supplier →
                      </button>
                    </article>
                  );
                })
              ) : (
                <div className="empty">
                  <div className="empty-icon">🔎</div>

                  <h3>No suppliers found</h3>

                  <p>
                    Try changing your search, location or
                    category filters.
                  </p>
                </div>
              )}
            </div>
          </section>

          <div className="footer-note">
            Supplier intelligence is generated from the suppliers
            currently associated with your MongoDB material
            records. Contact Supplier is a UI placeholder and
            does not send a real message yet.
          </div>
        </div>
      )}
    </main>
  );
}