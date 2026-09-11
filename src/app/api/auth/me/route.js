import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET
);

export async function GET(request) {
  try {
    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        {
          success: false,
          message: "JWT_SECRET is not configured.",
        },
        { status: 500 }
      );
    }

    const token = request.cookies.get(
      "buildprice_token"
    )?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
        },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(
      token,
      JWT_SECRET
    );

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: payload.userId,
        email: payload.email,
        role: payload.role,
      },
    });
  } catch (error) {
    console.error("Auth verification error:", error);

    return NextResponse.json(
      {
        success: false,
        authenticated: false,
      },
      { status: 401 }
    );
  }
}