export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-5xl font-bold text-cyan-400 mb-10">
        Settings
      </h1>

      <div className="bg-slate-900 p-8 rounded-2xl max-w-3xl">

        <div className="mb-6">

          <label className="block mb-2">
            Email Notifications
          </label>

          <input
            type="checkbox"
            className="w-5 h-5"
            defaultChecked
          />

        </div>

        <div className="mb-6">

          <label className="block mb-2">
            Alert Threshold (%)
          </label>

          <input
            type="number"
            defaultValue="5"
            className="bg-slate-800 p-3 rounded-xl w-full"
          />

        </div>

        <div className="mb-6">

          <label className="block mb-2">
            Preferred City
          </label>

          <select className="bg-slate-800 p-3 rounded-xl w-full">

            <option>Hyderabad</option>
            <option>Mumbai</option>
            <option>Chennai</option>
            <option>Bangalore</option>

          </select>

        </div>

        <button className="bg-cyan-500 px-6 py-3 rounded-xl">
          Save Settings
        </button>

      </div>

    </div>
  );
}