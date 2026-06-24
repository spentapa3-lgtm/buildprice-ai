export default function MarketMovers() {
  const movers = [
    {
      material: "Steel",
      change: "+8%",
    },
    {
      material: "Copper",
      change: "+5%",
    },
    {
      material: "Aluminum",
      change: "-2%",
    },
  ];

  return (
    <div className="bg-slate-900 p-8 rounded-2xl mb-10">

      <h2 className="text-3xl font-bold text-cyan-400 mb-6">
        Market Movers
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        {movers.map((item, index) => (
          <div
            key={index}
            className="bg-slate-800 p-6 rounded-xl"
          >

            <h3 className="text-2xl font-bold">
              {item.material}
            </h3>

            <p className="text-green-400 text-xl mt-2">
              {item.change}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}