export default function ReportsPage() {
  const reports = [
    {
      title: "Monthly Price Report",
      description: "Material price analysis for this month.",
    },
    {
      title: "Supplier Performance Report",
      description: "Supplier ratings and performance analysis.",
    },
    {
      title: "AI Forecast Report",
      description: "Future price prediction report.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-5xl font-bold text-cyan-400 mb-10">
        Reports Center
      </h1>

      <div className="grid md:grid-cols-3 gap-8">

        {reports.map((report, index) => (
          <div
            key={index}
            className="bg-slate-900 p-8 rounded-2xl"
          >

            <h2 className="text-2xl font-bold mb-4">
              {report.title}
            </h2>

            <p className="text-gray-400 mb-6">
              {report.description}
            </p>

            <button className="bg-cyan-500 px-5 py-2 rounded-lg">
              Download Report
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}