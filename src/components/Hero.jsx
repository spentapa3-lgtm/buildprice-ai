export default function Hero() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white">

      <div className="text-center max-w-4xl">

        <h1 className="text-7xl font-bold text-cyan-400 mb-6">
          BuildPrice AI
        </h1>

        <h2 className="text-3xl font-semibold mb-6">
          AI Powered Construction Materials Price Tracker
        </h2>

        <p className="text-xl text-gray-300 mb-8">
          Track material prices, analyze trends, monitor suppliers,
          and receive AI-powered forecasting insights.
        </p>

        <div className="space-x-4">

          <button className="bg-cyan-500 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-cyan-600">
            Explore Dashboard
          </button>

          <button className="border border-cyan-400 px-8 py-4 rounded-xl text-lg hover:bg-cyan-400 hover:text-black">
            Learn More
          </button>

        </div>

      </div>

    </section>
  );
}