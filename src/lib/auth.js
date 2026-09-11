import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function getAuthenticatedUser() {
  try {
    if (!process.env.JWT_SECRET) {
      return null;
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("buildprice_token")?.value;

    if (!token) {
      return null;
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET
    );

    const { payload } = await jwtVerify(token, secret);

    return {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

export async function requireAdmin() {
  const user = await getAuthenticatedUser();

  if (!user || user.role !== "admin") {
    return null;
  }

  return user;
}