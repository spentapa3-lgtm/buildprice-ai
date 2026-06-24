"use client";

import { useState } from "react";
import materials from "../../data/materials";

import QuickStats from "../../components/QuickStats";
import SearchFilter from "../../components/SearchFilter";
import AIForecast from "../../components/AIForecast";
import MarketMovers from "../../components/MarketMovers";
import PriceChart from "../../components/PriceChart";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMaterials = materials.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-5xl font-bold text-cyan-400 mb-10">
        Dashboard Overview
      </h1>

      <QuickStats />

      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Material Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">

        {filteredMaterials.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 p-6 rounded-2xl"
          >

            <h3 className="text-gray-400">
              {item.name}
            </h3>

            <p className="text-3xl font-bold mt-2">
              ₹{item.price}
            </p>

            <p className="text-cyan-400 mt-2">
              {item.location}
            </p>

          </div>
        ))}

      </div>

      <MarketMovers />

      <AIForecast />

      <PriceChart />

      {/* AI Insight */}
      <div className="bg-slate-900 rounded-2xl p-8 mt-10">

        <h2 className="text-2xl font-bold text-cyan-400 mb-4">
          AI Market Insight
        </h2>

        <p className="text-gray-300">
          Steel remains the strongest performing material.
          Copper demand is increasing because of electrical
          infrastructure projects. AI models predict moderate
          growth in construction material prices over the next quarter.
        </p>

      </div>

      {/* Material Table */}
      <div className="bg-slate-900 rounded-2xl p-8 mt-10">

        <h2 className="text-2xl font-bold mb-6">
          Material Prices
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-700">

              <th className="text-left py-4">
                Material
              </th>

              <th className="text-left py-4">
                Supplier
              </th>

              <th className="text-left py-4">
                Location
              </th>

              <th className="text-left py-4">
                Price
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredMaterials.map((item) => (
              <tr key={item.id}>

                <td className="py-4">
                  {item.name}
                </td>

                <td>
                  {item.supplier}
                </td>

                <td>
                  {item.location}
                </td>

                <td>
                  ₹{item.price}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}