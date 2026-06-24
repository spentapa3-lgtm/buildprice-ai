import Link from "next/link";
import materials from "../../data/materials";

export default function MaterialsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-5xl font-bold text-cyan-400 mb-10">
        Materials Directory
      </h1>

      <div className="grid md:grid-cols-3 gap-8">

        {materials.map((item) => (
          <Link
            key={item.id}
            href={`/materials/${item.name.toLowerCase()}`}
          >
            <div className="bg-slate-900 p-8 rounded-2xl cursor-pointer hover:scale-105 transition">

              <h2 className="text-3xl font-bold mb-4">
                {item.name}
              </h2>

              <p className="mb-2">
                Price: ₹{item.price}
              </p>

              <p className="mb-2">
                Supplier: {item.supplier}
              </p>

              <p>
                Location: {item.location}
              </p>

            </div>
          </Link>
        ))}

      </div>

    </div>
  );
}