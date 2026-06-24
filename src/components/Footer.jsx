export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-20">

      <div className="max-w-7xl mx-auto px-10 py-12 grid md:grid-cols-3 gap-10">

        {/* About */}
        <div>
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">
            BuildPrice AI
          </h2>

          <p className="text-gray-400">
            AI Powered Construction Materials Price Tracker that helps
            users monitor material prices, supplier information,
            market trends, and AI-based forecasting.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">
            Quick Links
          </h2>

          <ul className="space-y-2 text-gray-400">
            <li>Home</li>
            <li>Dashboard</li>
            <li>Materials</li>
            <li>Suppliers</li>
            <li>Reports</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">
            Contact Us
          </h2>

          <p className="text-gray-400 mb-2">
            📧 buildpriceai@gmail.com
          </p>

          <p className="text-gray-400 mb-2">
            📞 +91 98765 43210
          </p>

          <p className="text-gray-400">
            📍 Hyderabad, India
          </p>
        </div>

      </div>

      <div className="border-t border-slate-800 py-4 text-center text-gray-500">
        © 2026 BuildPrice AI | All Rights Reserved
      </div>

    </footer>
  );
}