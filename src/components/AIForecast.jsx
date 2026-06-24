export default function AIForecast() {
  const forecasts = [
    {
      material: "Steel",
      forecast: "+6%",
      reason: "Infrastructure demand increasing",
    },
    {
      material: "Copper",
      forecast: "+4%",
      reason: "Electrical projects expanding",
    },
    {
      material: "Aluminum",
      forecast: "-1%",
      reason: "Temporary oversupply",
    },
  ];

  return (
    <div className="bg-slate-900 p-8 rounded-2xl mb-10">
      <h2 className="text-3xl font-bold text-cyan-400 mb-6">
        AI Price Forecast
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {forecasts.map((item, index) => (
          <div
            key={index}
            className="bg-slate-800 p-6 rounded-xl"
          >
            <h3 className="text-2xl font-bold">
              {item.material}
            </h3>

            <p className="text-green-400 text-xl font-bold mt-2">
              {item.forecast}
            </p>

            <p className="text-gray-400 mt-2">
              {item.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}