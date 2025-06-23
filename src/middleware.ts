import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // Permitir acesso à página de login sem token
  if (!token && request.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  console.log(token);
  if (token) {
    try {
      // CORREÇÃO: Usar a URL completa do backend para verificação
      const backendUrl = "https://backend-feelflow-core.onrender.com/"; // ou a porta do seu backend local

      const verifyResponse = await fetch(`${backendUrl}/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar token no header
        },
        body: JSON.stringify({ token }),
      });

      if (!verifyResponse.ok) {
        console.error(
          "Auth verification failed:",
          verifyResponse.status,
          verifyResponse.statusText
        );
        throw new Error(
          `HTTP ${verifyResponse.status}: ${verifyResponse.statusText}`
        );
      }

      const data = await verifyResponse.json();
      const userId = data.user._id;

      console.log("Auth successful - User ID:", userId);

      const { pathname } = request.nextUrl;
      const segments = pathname.split("/");

      // Redirecionar de /login para /admin/userId se já autenticado
      if (pathname === "/login") {
        return NextResponse.redirect(new URL(`/admin/${userId}`, request.url));
      }

      // Validações de rota para /admin
      if (segments[1] === "admin") {
        const urlId1 = segments[2];

        if (!urlId1) {
          return NextResponse.redirect(
            new URL(`/admin/${userId}`, request.url)
          );
        }

        const isObjectId = /^[a-f\d]{24}$/i.test(urlId1);

        // Permitir rotas específicas como dashboard e employees
        if (!["dashboard", "employees"].includes(segments[2])) {
          if (!isObjectId && urlId1 !== userId) {
            return NextResponse.redirect(
              new URL(`/admin/${userId}`, request.url)
            );
          }
        }
      }

      // Validações para /admin/employees
      if (segments[2] === "employees") {
        const urlVerified = segments[3];
        const urlId = segments[4];
        const isObjectId = /^[a-f\d]{24}$/i.test(urlId);

        if (!["overview", "directory", "new"].includes(urlVerified)) {
          return NextResponse.redirect(
            new URL(`/admin/${userId}`, request.url)
          );
        }

        if (urlId && !isObjectId && urlId !== userId) {
          const redirectBase = `/admin/employees/${urlVerified}/${userId}`;
          return NextResponse.redirect(new URL(redirectBase, request.url));
        }
      }

      // Validações para /admin/dashboard
      if (segments[2] === "dashboard") {
        if (segments[3] && !["users", "financial"].includes(segments[3])) {
          return NextResponse.redirect(
            new URL(`/admin/${userId}`, request.url)
          );
        }
      }

      // Validações para /admin/dashboard/users
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

      // IMPORTANTE: Preservar o token na resposta
      const nextResponse = NextResponse.next();

      // Renovar o cookie do token para evitar expiração
      nextResponse.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60, // 24 horas
        path: "/",
      });

      return nextResponse;
    } catch (err) {
      console.error("Middleware auth error:", err);

      // Remove cookie inválido antes de redirecionar
      const redirectResponse = NextResponse.redirect(
        new URL("/login", request.url)
      );
      redirectResponse.cookies.delete("token");

      return redirectResponse;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
