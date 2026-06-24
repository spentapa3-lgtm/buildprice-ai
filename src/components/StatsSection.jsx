export default function StatsSection() {
  const stats = [
    {
      title: "Materials",
      value: "120+",
    },
    {
      title: "Suppliers",
      value: "50+",
    },
    {
      title: "Cities",
      value: "25+",
    },
    {
      title: "Price Updates",
      value: "10K+",
    },
  ];

  return (
    <section className="py-20 bg-slate-900">

      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">

        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-slate-800 p-8 rounded-2xl text-center"
          >

            <h2 className="text-5xl font-bold text-cyan-400">
              {item.value}
            </h2>

            <p className="mt-4 text-gray-300">
              {item.title}
            </p>

          </div>
        ))}

      </div>

    </section>
  );
}