"use client";

import { useEffect, useMemo, useState } from "react";

const emptyForm = {
  name: "",
  category: "Structural",
  price: "",
  change: "0",
  supplier: "",
  location: "",
  demand: "Medium",
};

export default function AdminPage() {
  const [materials, setMaterials] = useState([]);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // Load logged-in admin
  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (response.ok) {
          const result = await response.json();

          if (result.authenticated) {
            setUser(result.user);
          }
        }
      } catch (err) {
        console.error("Admin authentication check failed:", err);
      } finally {
        setAuthLoading(false);
      }
    }

    loadUser();
  }, []);

  // Load materials
  async function loadMaterials() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/materials", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load materials");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message || "Failed to load materials"
        );
      }

      setMaterials(result.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load materials.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMaterials();
  }, []);

  const filteredMaterials = useMemo(() => {
    const value = search.toLowerCase().trim();

    return materials.filter(
      (material) =>
        material.name.toLowerCase().includes(value) ||
        material.supplier.toLowerCase().includes(value) ||
        material.location.toLowerCase().includes(value)
    );
  }, [materials, search]);

  const highDemand = materials.filter(
    (material) => material.demand === "High"
  ).length;

  const positiveMovement = materials.filter(
    (material) => Number(material.change) > 0
  ).length;

  const negativeMovement = materials.filter(
    (material) => Number(material.change) < 0
  ).length;

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(price);

  const updateForm = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
    setShowForm(true);
  };

  const openEditForm = (material) => {
    setEditingId(material._id);

    setForm({
      name: material.name,
      category: material.category,
      price: material.price,
      change: material.change,
      supplier: material.supplier,
      location: material.location,
      demand: material.demand,
    });

    setMessage("");
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const saveMaterial = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const payload = {
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        change: Number(form.change || 0),
        supplier: form.supplier.trim(),
        location: form.location.trim(),
        demand: form.demand,
      };

      if (
        !payload.name ||
        !payload.supplier ||
        !payload.location ||
        payload.price <= 0
      ) {
        setError(
          "Please fill in a valid name, price, supplier and location."
        );
        setSaving(false);
        return;
      }

      const response = await fetch("/api/materials", {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(
          editingId
            ? { id: editingId, ...payload }
            : payload
        ),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to save material"
        );
      }

      setMessage(
        editingId
          ? "Material updated successfully."
          : "Material added successfully."
      );

      closeForm();
      await loadMaterials();
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to save material.");
    } finally {
      setSaving(false);
    }
  };

  const deleteMaterial = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const response = await fetch("/api/materials", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to delete material"
        );
      }

      setMessage(`${name} deleted successfully.`);

      await loadMaterials();
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to delete material.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-300">
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                Administration
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                Platform
                <span className="text-blue-400">
                  {" "}Management
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-lg text-slate-300">
                Manage construction materials directly from the
                BuildPrice AI database.
              </p>

              {/* Admin identity */}
              {!authLoading && user && (
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-slate-400">
                    Signed in as
                  </span>

                  <span className="font-semibold text-blue-400">
                    {user.email}
                  </span>

                  <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-300">
                    Admin
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={openAddForm}
              className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-blue-500"
            >
              + Add Material
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Messages */}
        {message && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
            ✓ {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            ⚠ {error}
          </div>
        )}

        {/* KPI */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Materials
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {materials.length}
            </p>

            <p className="mt-1 text-xs text-emerald-600">
              Database records
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              High Demand
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {highDemand}
            </p>

            <p className="mt-1 text-xs text-amber-600">
              Require attention
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Market Movement
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {positiveMovement}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Positive • {negativeMovement} declining
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              System Status
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-600">
              Online
            </p>

            <p className="mt-1 text-xs text-slate-500">
              MongoDB connected
            </p>
          </div>
        </div>

        {/* Management panel */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Material Management
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add, edit and remove database records.
                </p>
              </div>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search materials..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 md:w-80"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-14 text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="mt-4 text-sm text-slate-500">
                Loading database records...
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
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
                      Demand
                    </th>
                    <th className="px-6 py-4">
                      Actions
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
                          <p className="font-bold text-slate-900">
                            {material.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {material.location}
                          </p>
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

                        <td className="px-6 py-5">
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                openEditForm(material)
                              }
                              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                deleteMaterial(
                                  material._id,
                                  material.name
                                )
                              }
                              className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredMaterials.length === 0 && (
                <div className="p-12 text-center text-sm text-slate-500">
                  No materials found.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Database status */}
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
              ✓
            </div>

            <div>
              <h3 className="font-bold text-emerald-900">
                Database Management Active
              </h3>

              <p className="mt-1 text-sm text-emerald-700">
                Changes made here are sent to the MongoDB
                database through the Next.js API.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Add/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-slate-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Material Database
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    {editingId
                      ? "Edit Material"
                      : "Add New Material"}
                  </h2>
                </div>

                <button
                  onClick={closeForm}
                  className="rounded-lg px-3 py-2 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  ×
                </button>
              </div>
            </div>

            <form
              onSubmit={saveMaterial}
              className="p-6"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Material Name
                  </label>

                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      updateForm("name", e.target.value)
                    }
                    placeholder="e.g. Steel"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Category
                  </label>

                  <select
                    value={form.category}
                    onChange={(e) =>
                      updateForm(
                        "category",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option>Structural</option>
                    <option>Building</option>
                    <option>Electrical</option>
                    <option>Metal</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Price
                  </label>

                  <input
                    required
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) =>
                      updateForm(
                        "price",
                        e.target.value
                      )
                    }
                    placeholder="65000"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Price Change %
                  </label>

                  <input
                    type="number"
                    step="0.1"
                    value={form.change}
                    onChange={(e) =>
                      updateForm(
                        "change",
                        e.target.value
                      )
                    }
                    placeholder="4.8"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Supplier
                  </label>

                  <input
                    required
                    value={form.supplier}
                    onChange={(e) =>
                      updateForm(
                        "supplier",
                        e.target.value
                      )
                    }
                    placeholder="Supplier name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Location
                  </label>

                  <input
                    required
                    value={form.location}
                    onChange={(e) =>
                      updateForm(
                        "location",
                        e.target.value
                      )
                    }
                    placeholder="Mumbai"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Demand Level
                  </label>

                  <select
                    value={form.demand}
                    onChange={(e) =>
                      updateForm(
                        "demand",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Material"
                    : "Add Material"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}