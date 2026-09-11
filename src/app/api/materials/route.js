import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Material from "@/lib/Material";
import { requireAdmin } from "@/lib/auth";

// GET — public
export async function GET() {
  try {
    await connectDB();

    const materials = await Material.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: materials.length,
      data: materials,
    });
  } catch (error) {
    console.error("GET materials error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch materials",
      },
      { status: 500 }
    );
  }
}

// POST — admin only
export async function POST(request) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required.",
        },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();

    const {
      name,
      category,
      price,
      change,
      supplier,
      location,
      demand,
    } = body;

    if (
      !name ||
      !category ||
      price === undefined ||
      !supplier ||
      !location
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name, category, price, supplier and location are required.",
        },
        { status: 400 }
      );
    }

    const material = await Material.create({
      name,
      category,
      price: Number(price),
      change: Number(change || 0),
      supplier,
      location,
      demand: demand || "Medium",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Material created successfully",
        data: material,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST materials error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create material",
      },
      { status: 500 }
    );
  }
}

// PUT — admin only
export async function PUT(request) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required.",
        },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();

    const {
      id,
      name,
      category,
      price,
      change,
      supplier,
      location,
      demand,
    } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Material ID is required.",
        },
        { status: 400 }
      );
    }

    const material = await Material.findByIdAndUpdate(
      id,
      {
        ...(name !== undefined && { name }),
        ...(category !== undefined && { category }),
        ...(price !== undefined && { price: Number(price) }),
        ...(change !== undefined && { change: Number(change) }),
        ...(supplier !== undefined && { supplier }),
        ...(location !== undefined && { location }),
        ...(demand !== undefined && { demand }),
        lastUpdated: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!material) {
      return NextResponse.json(
        {
          success: false,
          message: "Material not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Material updated successfully",
      data: material,
    });
  } catch (error) {
    console.error("PUT materials error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update material",
      },
      { status: 500 }
    );
  }
}

// DELETE — admin only
export async function DELETE(request) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required.",
        },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Material ID is required.",
        },
        { status: 400 }
      );
    }

    const material = await Material.findByIdAndDelete(id);

    if (!material) {
      return NextResponse.json(
        {
          success: false,
          message: "Material not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Material deleted successfully",
      data: material,
    });
  } catch (error) {
    console.error("DELETE materials error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete material",
      },
      { status: 500 }
    );
  }
}