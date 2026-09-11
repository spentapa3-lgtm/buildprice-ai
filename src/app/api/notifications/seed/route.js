import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Material from "@/lib/Material";
import Notification from "@/lib/Notification";

export async function POST() {
  try {
    await connectDB();

    // Remove existing demo notifications to avoid duplicates
    await Notification.deleteMany({});

    const materials = await Material.find({}).lean();

    if (!materials.length) {
      return NextResponse.json(
        {
          success: false,
          message: "No materials found. Please seed materials first.",
        },
        { status: 404 }
      );
    }

    const notifications = [];

    for (const material of materials) {
      // Price increase alert
      if (material.change >= 4) {
        notifications.push({
          title: "Price Rise Alert",
          message: `${material.name} price increased by ${material.change}%. Consider reviewing upcoming purchases.`,
          type: "price-rise",
          materialName: material.name,
          materialId: material._id,
          read: false,
        });
      }

      // Price drop alert
      if (material.change <= -2) {
        notifications.push({
          title: "Price Drop Alert",
          message: `${material.name} price decreased by ${Math.abs(
            material.change
          )}%. This may be a good opportunity to review procurement.`,
          type: "price-drop",
          materialName: material.name,
          materialId: material._id,
          read: false,
        });
      }

      // High demand alert
      if (material.demand === "High") {
        notifications.push({
          title: "High Demand Alert",
          message: `${material.name} is currently showing high market demand in ${material.location}.`,
          type: "high-demand",
          materialName: material.name,
          materialId: material._id,
          read: false,
        });
      }

      // General market update
      if (material.change > 0 && material.change < 4) {
        notifications.push({
          title: "Market Update",
          message: `${material.name} is currently trading at ₹${material.price.toLocaleString(
            "en-IN"
          )} with a ${material.change}% upward movement.`,
          type: "market-update",
          materialName: material.name,
          materialId: material._id,
          read: false,
        });
      }
    }

    // Add one system notification
    notifications.push({
      title: "BuildPrice AI Update",
      message:
        "Market monitoring is active. Your material database is ready for price and demand alerts.",
      type: "system",
      materialName: "",
      materialId: null,
      read: false,
    });

    const insertedNotifications =
      await Notification.insertMany(notifications);

    return NextResponse.json({
      success: true,
      message: "Demo notifications created successfully.",
      count: insertedNotifications.length,
      data: insertedNotifications,
    });
  } catch (error) {
    console.error("Notification seed error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to seed notifications.",
      },
      { status: 500 }
    );
  }
}