export default function PriceChart() {
  return (
    <div className="bg-slate-900 p-8 rounded-2xl mt-10">

      <h2 className="text-3xl font-bold text-cyan-400 mb-6">
        Price Trend Analysis
      </h2>

      <div className="h-64 flex items-end gap-6">

        <div className="bg-cyan-500 w-16 h-32 rounded-t-lg"></div>

        <div className="bg-cyan-500 w-16 h-44 rounded-t-lg"></div>

        <div className="bg-cyan-500 w-16 h-52 rounded-t-lg"></div>

        <div className="bg-cyan-500 w-16 h-40 rounded-t-lg"></div>

        <div className="bg-cyan-500 w-16 h-60 rounded-t-lg"></div>

      </div>

      <p className="text-gray-400 mt-6">
        Simulated material price movement over time.
      </p>

    </div>
  );
}