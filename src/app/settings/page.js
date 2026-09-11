"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    fullName: "BuildPrice User",
    email: "user@buildprice.ai",
    company: "Construction Enterprise",
    role: "Procurement Manager",

    emailAlerts: true,
    priceAlerts: true,
    aiAlerts: true,
    procurementAlerts: true,

    significantMovement: true,
    dailySummary: true,
    weeklyReport: false,

    aiForecasts: true,
    aiRecommendations: true,

    compactMode: false,
  });

  function updateSetting(key, value) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    setSaved(false);
  }

  function saveChanges() {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  }

  function resetSettings() {
    setSettings({
      fullName: "BuildPrice User",
      email: "user@buildprice.ai",
      company: "Construction Enterprise",
      role: "Procurement Manager",

      emailAlerts: true,
      priceAlerts: true,
      aiAlerts: true,
      procurementAlerts: true,

      significantMovement: true,
      dailySummary: true,
      weeklyReport: false,

      aiForecasts: true,
      aiRecommendations: true,

      compactMode: false,
    });

    setSaved(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            ⚙️ Workspace Configuration
          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Settings
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Manage your BuildPrice AI profile, alerts, AI intelligence and
            workspace preferences.
          </p>
        </div>

        {/* Profile */}
        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/70">

          <div className="border-b border-slate-800 px-6 py-5">
            <h2 className="text-xl font-semibold">
              Profile Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Configure the information associated with your workspace.
            </p>
          </div>

          <div className="grid gap-6 p-6 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Full Name
              </label>

              <input
                value={settings.fullName}
                onChange={(e) =>
                  updateSetting("fullName", e.target.value)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email Address
              </label>

              <input
                value={settings.email}
                onChange={(e) =>
                  updateSetting("email", e.target.value)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Company
              </label>

              <input
                value={settings.company}
                onChange={(e) =>
                  updateSetting("company", e.target.value)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Role
              </label>

              <select
                value={settings.role}
                onChange={(e) =>
                  updateSetting("role", e.target.value)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
              >
                <option>Procurement Manager</option>
                <option>Project Manager</option>
                <option>Construction Manager</option>
                <option>Business Analyst</option>
                <option>Administrator</option>
              </select>
            </div>

          </div>
        </section>

        {/* Notification Preferences */}
        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/70">

          <div className="border-b border-slate-800 px-6 py-5">
            <h2 className="text-xl font-semibold">
              Notification Preferences
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose which market events should generate notifications.
            </p>
          </div>

          <div className="divide-y divide-slate-800">

            <ToggleRow
              title="Email Notifications"
              description="Receive important BuildPrice AI updates through email."
              enabled={settings.emailAlerts}
              onChange={(value) =>
                updateSetting("emailAlerts", value)
              }
            />

            <ToggleRow
              title="Price Alerts"
              description="Get notified when material prices move significantly."
              enabled={settings.priceAlerts}
              onChange={(value) =>
                updateSetting("priceAlerts", value)
              }
            />

            <ToggleRow
              title="AI Market Alerts"
              description="Receive AI-generated forecasts and market signals."
              enabled={settings.aiAlerts}
              onChange={(value) =>
                updateSetting("aiAlerts", value)
              }
            />

            <ToggleRow
              title="Procurement Alerts"
              description="Receive warnings about demand and procurement risks."
              enabled={settings.procurementAlerts}
              onChange={(value) =>
                updateSetting("procurementAlerts", value)
              }
            />

          </div>
        </section>

        {/* Market Alerts */}
        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/70">

          <div className="border-b border-slate-800 px-6 py-5">
            <h2 className="text-xl font-semibold">
              Market Monitoring
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Customize how BuildPrice AI monitors material markets.
            </p>
          </div>

          <div className="divide-y divide-slate-800">

            <ToggleRow
              title="Significant Price Movement"
              description="Alert me when a material changes beyond a significant threshold."
              enabled={settings.significantMovement}
              onChange={(value) =>
                updateSetting("significantMovement", value)
              }
            />

            <ToggleRow
              title="Daily Market Summary"
              description="Receive a daily summary of important market movements."
              enabled={settings.dailySummary}
              onChange={(value) =>
                updateSetting("dailySummary", value)
              }
            />

            <ToggleRow
              title="Weekly Market Report"
              description="Receive a weekly overview of material performance."
              enabled={settings.weeklyReport}
              onChange={(value) =>
                updateSetting("weeklyReport", value)
              }
            />

          </div>
        </section>

        {/* AI Intelligence */}
        <section className="mb-6 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-slate-900 to-slate-900">

          <div className="border-b border-blue-500/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                🤖
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  AI Intelligence
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Configure AI-powered market intelligence.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-blue-500/10">

            <ToggleRow
              title="AI Price Forecasts"
              description="Show predicted material price trends on your dashboard."
              enabled={settings.aiForecasts}
              onChange={(value) =>
                updateSetting("aiForecasts", value)
              }
            />

            <ToggleRow
              title="AI Procurement Recommendations"
              description="Allow AI insights to identify potential buying opportunities."
              enabled={settings.aiRecommendations}
              onChange={(value) =>
                updateSetting("aiRecommendations", value)
              }
            />

          </div>
        </section>

        {/* Display */}
        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/70">

          <div className="border-b border-slate-800 px-6 py-5">
            <h2 className="text-xl font-semibold">
              Display Preferences
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Adjust how information is presented throughout the dashboard.
            </p>
          </div>

          <div className="divide-y divide-slate-800">

            <ToggleRow
              title="Compact Mode"
              description="Use a denser layout to display more market information."
              enabled={settings.compactMode}
              onChange={(value) =>
                updateSetting("compactMode", value)
              }
            />

          </div>
        </section>

        {/* Security */}
        <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/70">

          <div className="border-b border-slate-800 px-6 py-5">
            <h2 className="text-xl font-semibold">
              Security
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage account security and authentication settings.
            </p>
          </div>

          <div className="p-6">

            <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-5 md:flex-row md:items-center md:justify-between">

              <div>
                <h3 className="font-semibold">
                  Password
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Change your account password and authentication credentials.
                </p>
              </div>

              <button
                onClick={() =>
                  alert(
                    "Password management will be connected to authentication in the backend phase."
                  )
                }
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-blue-500 hover:text-blue-300"
              >
                Change Password
              </button>

            </div>

            <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <span className="text-xl">🛡️</span>

              <div>
                <p className="text-sm font-semibold text-emerald-300">
                  Account Protection
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Security controls will be connected to the authentication
                  system during backend integration.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Bottom Actions */}
        <div className="sticky bottom-4 z-10 rounded-2xl border border-slate-800 bg-slate-900/95 p-4 shadow-2xl backdrop-blur">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>
              {saved ? (
                <p className="text-sm font-medium text-emerald-400">
                  ✓ Settings saved successfully
                </p>
              ) : (
                <p className="text-sm text-slate-500">
                  Changes are currently stored for this session.
                </p>
              )}
            </div>

            <div className="flex gap-3">

              <button
                onClick={resetSettings}
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
              >
                Reset
              </button>

              <button
                onClick={saveChanges}
                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
              >
                Save Changes
              </button>

            </div>

          </div>
        </div>

        {/* Demo Notice */}
        <p className="mt-8 text-center text-xs text-slate-600">
          Settings are currently stored in the browser session. Persistent
          user preferences will be connected to the backend database during
          production integration.
        </p>

      </div>
    </main>
  );
}

function ToggleRow({
  title,
  description,
  enabled,
  onChange,
}) {
  return (
    <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">

      <div className="max-w-2xl">
        <h3 className="font-semibold text-slate-200">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

      <button
        onClick={() => onChange(!enabled)}
        aria-label={`Toggle ${title}`}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          enabled
            ? "bg-blue-600"
            : "bg-slate-700"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>

    </div>
  );
}