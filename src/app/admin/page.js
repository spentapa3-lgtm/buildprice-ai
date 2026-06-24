export default function AdminPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-5xl font-bold text-cyan-400 mb-10">
        Admin Panel
      </h1>

      <div className="bg-slate-900 p-8 rounded-2xl max-w-3xl">

        <h2 className="text-2xl font-bold mb-6">
          Add New Material
        </h2>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Material Name"
            className="w-full p-3 rounded-lg bg-slate-800"
          />

          <input
            type="text"
            placeholder="Supplier Name"
            className="w-full p-3 rounded-lg bg-slate-800"
          />

          <input
            type="number"
            placeholder="Price"
            className="w-full p-3 rounded-lg bg-slate-800"
          />

          <input
            type="text"
            placeholder="Location"
            className="w-full p-3 rounded-lg bg-slate-800"
          />

          <button className="bg-cyan-500 px-6 py-3 rounded-lg">
            Add Material
          </button>

        </div>

      </div>

      <div className="bg-slate-900 p-8 rounded-2xl mt-10">

        <h2 className="text-2xl font-bold mb-6">
          Material Management
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
                Price
              </th>

              <th className="text-left py-4">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            <tr>
              <td className="py-4">Steel</td>
              <td>TATA Steel</td>
              <td>₹65000</td>
              <td>
                <button className="bg-cyan-500 px-4 py-2 rounded">
                  Edit
                </button>
              </td>
            </tr>

            <tr>
              <td className="py-4">Cement</td>
              <td>UltraTech</td>
              <td>₹420</td>
              <td>
                <button className="bg-cyan-500 px-4 py-2 rounded">
                  Edit
                </button>
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}