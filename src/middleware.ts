import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token && request.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    try {
      const response = await fetch(
        "https://backend-feelflow-core.onrender.com/auth/verify",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        }
      );

      if (!response.ok) throw new Error(await response.text());

      const { pathname } = request.nextUrl;
      const segments = pathname.split("/");

      if (pathname === "/login") {
        return NextResponse.redirect(new URL(`/admin/`, request.url));
      }
    } catch (err) {
      console.log("Middleware auth error:", err);
      if (request.nextUrl.pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  }
  try {
    const response1 = await fetch(
      "https://backend-feelflow-core.onrender.com/employees/all",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      }
    );
    const data1 = await response1.json();
    const ids = data1.employees.map((e) => e._id);
    const { pathname } = request.nextUrl;
    const segments = pathname.split("/");

    if (segments[4] == "profile") {
      console.log(segments[5]);
      console.log(ids);
      const targetId = segments[5];
      if (!ids.includes(targetId)) {
        console.log("não está incluso");
        return NextResponse.redirect(
          new URL("/admin/employees/directory", request.url)
        );
      }
    }
  } catch (e) {
    console.log(e);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
