import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Material from "@/lib/Material";

const seedMaterials = [
  {
    name: "Steel",
    category: "Structural",
    price: 65000,
    change: 4.8,
    supplier: "TATA Steel",
    location: "Mumbai",
    demand: "High",
  },
  {
    name: "Cement",
    category: "Building",
    price: 420,
    change: 1.9,
    supplier: "UltraTech",
    location: "Hyderabad",
    demand: "Medium",
  },
  {
    name: "Copper",
    category: "Electrical",
    price: 780,
    change: -2.1,
    supplier: "Hindalco",
    location: "Chennai",
    demand: "High",
  },
  {
    name: "Aluminium",
    category: "Metal",
    price: 245,
    change: 3.2,
    supplier: "Hindalco",
    location: "Pune",
    demand: "Medium",
  },
  {
    name: "TMT Bars",
    category: "Structural",
    price: 68000,
    change: 5.6,
    supplier: "JSW Steel",
    location: "Bengaluru",
    demand: "High",
  },
  {
    name: "Brass",
    category: "Metal",
    price: 620,
    change: 1.4,
    supplier: "Mishra Metals",
    location: "Delhi",
    demand: "Medium",
  },
];

function createHistory(currentPrice, currentChange) {
  const priceFactors = [
    0.91,
    0.93,
    0.95,
    0.94,
    0.97,
    0.96,
    0.99,
    0.98,
    1.01,
    1.00,
    1.02,
    1.00,
  ];

  const now = new Date();

  return priceFactors.map((factor, index) => {
    const recordedAt = new Date(now);

    recordedAt.setDate(
      recordedAt.getDate() - (priceFactors.length - 1 - index) * 7
    );

    const trendAdjustment =
      (currentChange / 100) * (index / (priceFactors.length - 1));

    const price =
      currentPrice *
      factor *
      (1 - currentChange / 100 + trendAdjustment);

    return {
      price: Math.round(price * 100) / 100,
      change:
        index === priceFactors.length - 1
          ? currentChange
          : Math.round(
              ((Math.random() * 4 - 2) * 100)
            ) / 100,
      recordedAt,
    };
  });
}

export async function POST() {
  try {
    await connectDB();

    await Material.deleteMany({});

    const materials = seedMaterials.map((material) => ({
      ...material,
      priceHistory: createHistory(
        material.price,
        material.change
      ),
    }));

    const insertedMaterials =
      await Material.insertMany(materials);

    return NextResponse.json({
      success: true,
      message:
        "Demo materials with price history inserted successfully.",
      count: insertedMaterials.length,
      data: insertedMaterials,
    });
  } catch (error) {
    console.error("Seed error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to seed materials.",
      },
      { status: 500 }
    );
  }
}