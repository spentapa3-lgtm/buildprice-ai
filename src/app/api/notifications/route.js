import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Notification from "@/lib/Notification";

export async function GET() {
  try {
    await connectDB();

    const notifications = await Notification.find({})
      .sort({ createdAt: -1 })
      .lean();

    const unreadCount = notifications.filter(
      (notification) => !notification.read
    ).length;

    return NextResponse.json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: notifications,
    });
  } catch (error) {
    console.error("GET notifications error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch notifications.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      title,
      message,
      type,
      materialName,
      materialId,
    } = body;

    if (!title || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Title and message are required.",
        },
        { status: 400 }
      );
    }

    const notification = await Notification.create({
      title,
      message,
      type: type || "market-update",
      materialName: materialName || "",
      materialId: materialId || null,
      read: false,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Notification created successfully.",
        data: notification,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST notifications error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create notification.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    await connectDB();

    const body = await request.json();

    const { id, markAllRead } = body;

    if (markAllRead) {
      await Notification.updateMany(
        { read: false },
        { $set: { read: true } }
      );

      return NextResponse.json({
        success: true,
        message: "All notifications marked as read.",
      });
    }

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Notification ID is required.",
        },
        { status: 400 }
      );
    }

    const notification =
      await Notification.findByIdAndUpdate(
        id,
        { read: true },
        {
          new: true,
        }
      );

    if (!notification) {
      return NextResponse.json(
        {
          success: false,
          message: "Notification not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notification marked as read.",
      data: notification,
    });
  } catch (error) {
    console.error("PATCH notifications error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update notification.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Notification ID is required.",
        },
        { status: 400 }
      );
    }

    const notification =
      await Notification.findByIdAndDelete(id);

    if (!notification) {
      return NextResponse.json(
        {
          success: false,
          message: "Notification not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notification deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE notifications error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete notification.",
      },
      { status: 500 }
    );
  }
}