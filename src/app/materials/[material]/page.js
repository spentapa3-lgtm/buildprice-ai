import materials from "../../../data/materials";

export default async function MaterialDetails({ params }) {
  const { material } = await params;

  const selectedMaterial = materials.find(
    (item) =>
      item.name.toLowerCase() === material.toLowerCase()
  );

  if (!selectedMaterial) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-10">
        Material Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-5xl font-bold text-cyan-400 mb-10">
        {selectedMaterial.name}
      </h1>

      <div className="bg-slate-900 p-8 rounded-2xl">

        <p className="mb-4 text-xl">
          Price: ₹{selectedMaterial.price}
        </p>

        <p className="mb-4 text-xl">
          Supplier: {selectedMaterial.supplier}
        </p>

        <p className="mb-4 text-xl">
          Location: {selectedMaterial.location}
        </p>

      </div>

    </div>
  );
}