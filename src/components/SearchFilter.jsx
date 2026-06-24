"use client";

export default function SearchFilter({
  searchTerm,
  setSearchTerm,
}) {
  return (
    <div className="bg-slate-900 p-6 rounded-2xl mb-10">
      <input
        type="text"
        placeholder="Search Materials..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
        className="w-full p-4 rounded-xl bg-slate-800"
      />
    </div>
  );
}