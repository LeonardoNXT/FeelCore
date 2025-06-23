import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token && request.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    try {
      // CORREÇÃO: Configuração adequada para cross-origin
      const response = await fetch(
        "https://backend-feelflow-core.onrender.com/auth/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // IMPORTANTE: Não usar credentials no middleware, passar o token no body
          },
          body: JSON.stringify({ token }),
        }
      );

      if (!response.ok) {
        console.error(
          "Auth verification failed:",
          response.status,
          response.statusText
        );
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const userId = data.user._id;

      console.log("Auth successful - User ID:", userId);

      const { pathname } = request.nextUrl;
      const segments = pathname.split("/");

      if (pathname === "/login") {
        return NextResponse.redirect(new URL(`/admin/${userId}`, request.url));
      }

      if (segments[1] === "admin") {
        const urlId1 = segments[2];
        console.log("URL ID1:", urlId1);

        if (!urlId1) {
          return NextResponse.redirect(
            new URL(`/admin/${userId}`, request.url)
          );
        }

        const isObjectId = /^[a-f\d]{24}$/i.test(urlId1);

        if (!["dashboard", "employees"].includes(segments[2])) {
          if (!isObjectId && urlId1 !== userId) {
            return NextResponse.redirect(
              new URL(`/admin/${userId}`, request.url)
            );
          }
        }
      }

      if (segments[2] === "employees") {
        const urlVerified = segments[3]; // (ex: overview, directory, new)
        const urlId = segments[4]; // (ex: ObjectId ou userId)
        const isObjectId = /^[a-f\d]{24}$/i.test(urlId);

        // Verifica se a subrota é válida (overview, directory, new)
        if (!["overview", "directory", "new"].includes(urlVerified)) {
          return NextResponse.redirect(
            new URL(`/admin/${userId}`, request.url)
          );
        }

        // Se o ID não for válido e não for o próprio userId
        if (!isObjectId && urlId !== userId) {
          const redirectBase = `/admin/employees/${urlVerified}/${userId}`;
          return NextResponse.redirect(new URL(redirectBase, request.url));
        }
      }

      if (segments[2] === "dashboard") {
        if (segments[3] !== "users" && segments[3] !== "financial") {
          return NextResponse.redirect(
            new URL(`/admin/${userId}`, request.url)
          );
        }
      }

      // funcionando corretamente
      if (segments[3] === "users") {
        const urlId = segments[4];
        if (!urlId) {
          return NextResponse.redirect(
            new URL(`/admin/dashboard/users/${userId}`, request.url)
          );
        }

        const isObjectId = /^[a-f\d]{24}$/i.test(urlId);

        if (!isObjectId && urlId !== userId) {
          return NextResponse.redirect(
            new URL(`/admin/dashboard/users/${userId}`, request.url)
          );
        }
      }
    } catch (err) {
      console.error("Middleware auth error:", err);

      // Remove cookie inválido antes de redirecionar
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");

      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
