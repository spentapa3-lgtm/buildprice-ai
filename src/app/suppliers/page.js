export default function SuppliersPage() {
  const suppliers = [
    {
      id: 1,
      name: "TATA Steel",
      location: "Mumbai",
      materials: "Steel, TMT Bars",
      rating: "⭐⭐⭐⭐⭐",
    },
    {
      id: 2,
      name: "UltraTech Cement",
      location: "Hyderabad",
      materials: "Cement",
      rating: "⭐⭐⭐⭐",
    },
    {
      id: 3,
      name: "Hindalco",
      location: "Chennai",
      materials: "Copper, Aluminum",
      rating: "⭐⭐⭐⭐⭐",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-5xl font-bold text-cyan-400 mb-10">
        Suppliers Directory
      </h1>

      <div className="grid md:grid-cols-3 gap-8">

        {suppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="bg-slate-900 p-8 rounded-2xl"
          >

            <h2 className="text-2xl font-bold mb-4">
              {supplier.name}
            </h2>

            <p className="mb-2">
              Location: {supplier.location}
            </p>

            <p className="mb-2">
              Materials: {supplier.materials}
            </p>

            <p>
              Rating: {supplier.rating}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}