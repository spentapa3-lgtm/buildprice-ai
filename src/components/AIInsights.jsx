export default function AIInsights() {
  return (
    <section className="py-20 bg-slate-950 text-white">

      <div className="max-w-6xl mx-auto">

        <h2 className="text-5xl font-bold text-cyan-400 text-center mb-12">
          AI Insights
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-slate-900 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4">
              Steel Forecast
            </h3>

            <p>
              AI predicts a 6% increase due to rising infrastructure demand.
            </p>
          </div>

          <div className="bg-slate-900 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4">
              Copper Demand
            </h3>

            <p>
              Electrical projects are increasing copper demand across India.
            </p>
          </div>

          <div className="bg-slate-900 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4">
              Market Alert
            </h3>

            <p>
              Material prices are expected to remain volatile this quarter.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}