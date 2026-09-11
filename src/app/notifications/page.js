"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");

  async function loadNotifications() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/notifications", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load notifications."
        );
      }

      setNotifications(result.data || []);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Unable to load notifications."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length;

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((item) => !item.read);
    }

    if (filter === "price") {
      return notifications.filter(
        (item) =>
          item.type === "price-rise" ||
          item.type === "price-drop"
      );
    }

    if (filter === "demand") {
      return notifications.filter(
        (item) => item.type === "high-demand"
      );
    }

    return notifications;
  }, [notifications, filter]);

  function getTypeDetails(type) {
    switch (type) {
      case "price-rise":
        return {
          icon: "↗",
          label: "Price Rise",
          iconBox:
            "border-emerald-400/20 bg-emerald-500/10",
          iconText: "text-emerald-400",
          badge:
            "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
        };

      case "price-drop":
        return {
          icon: "↘",
          label: "Price Drop",
          iconBox: "border-rose-400/20 bg-rose-500/10",
          iconText: "text-rose-400",
          badge:
            "border-rose-400/20 bg-rose-500/10 text-rose-300",
        };

      case "high-demand":
        return {
          icon: "🔥",
          label: "High Demand",
          iconBox: "border-amber-400/20 bg-amber-500/10",
          iconText: "text-amber-400",
          badge:
            "border-amber-400/20 bg-amber-500/10 text-amber-300",
        };

      case "system":
        return {
          icon: "⚙",
          label: "System",
          iconBox: "border-slate-700 bg-slate-800",
          iconText: "text-slate-300",
          badge:
            "border-slate-700 bg-slate-800 text-slate-300",
        };

      default:
        return {
          icon: "●",
          label: "Market Update",
          iconBox: "border-blue-400/20 bg-blue-500/10",
          iconText: "text-blue-400",
          badge:
            "border-blue-400/20 bg-blue-500/10 text-blue-300",
        };
    }
  }

  function formatDate(value) {
    if (!value) return "Recently";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Recently";
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function markAsRead(id) {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to update notification."
        );
      }

      setNotifications((current) =>
        current.map((item) =>
          item._id === id
            ? { ...item, read: true }
            : item
        )
      );
    } catch (err) {
      console.error(err);
      setMessage(
        err.message || "Unable to update notification."
      );
    }
  }

  async function markAllRead() {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ markAllRead: true }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to mark notifications as read."
        );
      }

      setNotifications((current) =>
        current.map((item) => ({
          ...item,
          read: true,
        }))
      );

      setMessage("All notifications marked as read.");

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (err) {
      console.error(err);
      setMessage(
        err.message ||
          "Unable to mark notifications as read."
      );
    }
  }

  async function deleteNotification(id) {
    try {
      const response = await fetch("/api/notifications", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to delete notification."
        );
      }

      setNotifications((current) =>
        current.filter((item) => item._id !== id)
      );
    } catch (err) {
      console.error(err);
      setMessage(
        err.message || "Unable to delete notification."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -right-40 top-10 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            Market Alert Center
          </div>

          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Notifications
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                Stay informed about important construction
                material price movements, demand signals and
                market updates.
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-3 text-sm font-semibold text-blue-300 transition hover:border-blue-400/40 hover:bg-blue-500/15"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Alerts
              </p>

              <p className="mt-3 text-3xl font-bold">
                {notifications.length}
              </p>
            </div>

            <div className="rounded-2xl border border-blue-400/10 bg-slate-900/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Unread
              </p>

              <p className="mt-3 text-3xl font-bold text-blue-400">
                {unreadCount}
              </p>
            </div>

            <div className="rounded-2xl border border-amber-400/10 bg-slate-900/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                High Demand
              </p>

              <p className="mt-3 text-3xl font-bold text-amber-400">
                {
                  notifications.filter(
                    (item) => item.type === "high-demand"
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
        {message && (
          <div className="mb-5 rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-300">
            {message}
          </div>
        )}

        <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-2">
          {[
            ["all", "All Alerts"],
            ["unread", "Unread"],
            ["price", "Price Movement"],
            ["demand", "Demand"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                filter === value
                  ? "bg-blue-500/15 text-blue-300"
                  : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="mt-6 space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-2xl border border-slate-800 bg-slate-900"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-6">
            <p className="font-semibold text-rose-300">
              Unable to load notifications
            </p>

            <p className="mt-2 text-sm text-rose-200/70">
              {error}
            </p>

            <button
              onClick={loadNotifications}
              className="mt-4 rounded-lg border border-rose-400/20 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/10"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          filteredNotifications.length === 0 && (
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950 text-2xl">
                🔔
              </div>

              <h2 className="mt-5 text-xl font-bold">
                No notifications
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                There are no alerts matching the selected filter.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          filteredNotifications.length > 0 && (
            <div className="mt-6 space-y-4">
              {filteredNotifications.map((notification) => {
                const details = getTypeDetails(
                  notification.type
                );

                return (
                  <article
                    key={notification._id}
                    className={`rounded-2xl border p-5 transition ${
                      notification.read
                        ? "border-slate-800 bg-slate-900/60"
                        : "border-blue-400/20 bg-slate-900"
                    }`}
                  >
                    <div className="flex gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-lg ${details.iconBox} ${details.iconText}`}
                      >
                        {details.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="font-bold">
                                {notification.title}
                              </h2>

                              {!notification.read && (
                                <span className="h-2 w-2 rounded-full bg-blue-400" />
                              )}
                            </div>

                            <span
                              className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${details.badge}`}
                            >
                              {details.label}
                            </span>
                          </div>

                          <span className="shrink-0 text-[11px] text-slate-600">
                            {formatDate(
                              notification.createdAt
                            )}
                          </span>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-slate-400">
                          {notification.message}
                        </p>

                        {notification.materialName && (
                          <div className="mt-4">
                            <Link
                              href={`/materials/${encodeURIComponent(
                                notification.materialName
                                  .toLowerCase()
                                  .trim()
                                  .replace(/\s+/g, "-")
                              )}`}
                              className="inline-flex rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-blue-300 transition hover:border-blue-400/30"
                            >
                              View{" "}
                              {notification.materialName} →
                            </Link>
                          </div>
                        )}

                        <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-800 pt-4">
                          {!notification.read && (
                            <button
                              onClick={() =>
                                markAsRead(notification._id)
                              }
                              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-400 transition hover:border-blue-400/30 hover:text-blue-300"
                            >
                              Mark as read
                            </button>
                          )}

                          <button
                            onClick={() =>
                              deleteNotification(
                                notification._id
                              )
                            }
                            className="rounded-lg border border-slate-800 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-rose-400/20 hover:text-rose-400"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-5 text-center">
          <p className="text-xs leading-5 text-slate-600">
            Notifications are stored in MongoDB and represent
            application-level market alerts. They are not external
            commodity-market notifications.
          </p>
        </div>
      </section>
    </main>
  );
}