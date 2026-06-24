export default function NotificationsPage() {
  const notifications = [
    {
      title: "Steel Price Increased",
      message: "Steel prices increased by 8% this month.",
      type: "Price Alert",
    },
    {
      title: "Copper Demand Rising",
      message: "Copper demand increased in Chennai.",
      type: "Market Update",
    },
    {
      title: "AI Forecast Updated",
      message: "Steel expected to rise by 6% next month.",
      type: "AI Insight",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-5xl font-bold text-cyan-400 mb-10">
        Notifications Center
      </h1>

      <div className="space-y-6">

        {notifications.map((item, index) => (
          <div
            key={index}
            className="bg-slate-900 p-6 rounded-2xl"
          >

            <h2 className="text-2xl font-bold mb-2">
              {item.title}
            </h2>

            <p className="text-gray-400 mb-3">
              {item.message}
            </p>

            <span className="text-cyan-400">
              {item.type}
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}