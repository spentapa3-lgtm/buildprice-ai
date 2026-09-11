import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("buildprice_token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured.");
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET
    );

    const { payload } = await jwtVerify(token, secret);

    if (payload.role !== "admin") {
      redirect("/dashboard");
    }

    return <AdminClient />;
  } catch (error) {
    redirect("/login");
  }
}