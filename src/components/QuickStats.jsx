export default function QuickStats() {
  const stats = [
    { title: "Materials", value: "120" },
    { title: "Suppliers", value: "50" },
    { title: "Cities", value: "25" },
    { title: "Updates", value: "1000+" },
  ];

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-10">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-slate-900 p-6 rounded-2xl"
        >
          <p className="text-gray-400">{item.title}</p>
          <h2 className="text-3xl font-bold text-cyan-400 mt-2">
            {item.value}
          </h2>
        </div>
      ))}
    </div>
  );
}